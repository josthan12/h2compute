import { test, expect, type Page } from "@playwright/test";

type StorageProbe = {
  get: Storage["getItem"];
  set: Storage["setItem"];
  remove: Storage["removeItem"];
  blocked: { read?: boolean; write?: boolean; remove?: boolean };
  writes: number;
};
type ProbeWindow = Window & typeof globalThis & { progressProbe: StorageProbe };
const key = "h2compute.progress";
const first = "sequence-and-selection";
const second = "counted-and-conditional-loops";

async function blockStorage(page: Page, blocked: StorageProbe["blocked"]) {
  await page.evaluate((blocked) => {
    const target = window as ProbeWindow;
    const probe: StorageProbe = {
      get: Storage.prototype.getItem,
      set: Storage.prototype.setItem,
      remove: Storage.prototype.removeItem,
      blocked,
      writes: 0,
    };
    target.progressProbe = probe;
    Storage.prototype.getItem = function (name) {
      if (name === "h2compute.progress" && probe.blocked.read) throw new Error("Read denied");
      return probe.get.call(this, name);
    };
    Storage.prototype.setItem = function (name, value) {
      if (name === "h2compute.progress") {
        probe.writes++;
        if (probe.blocked.write) throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return probe.set.call(this, name, value);
    };
    Storage.prototype.removeItem = function (name) {
      if (name === "h2compute.progress" && probe.blocked.remove) throw new Error("Removal denied");
      return probe.remove.call(this, name);
    };
    window.dispatchEvent(new Event("h2compute-progress"));
  }, blocked);
}
async function restoreStorage(page: Page) {
  await page.evaluate(() => {
    (window as ProbeWindow).progressProbe.blocked = {};
    window.dispatchEvent(new Event("h2compute-progress"));
  });
}
async function reviewCheckpoint(page: Page, answers = [1, 2]) {
  for (const [index, answer] of answers.entries()) {
    await page.getByRole("group").nth(index).getByRole("radio").nth(answer).check();
  }
  await page.getByRole("button", { name: "Check answers", exact: true }).click();
  await expect(page.getByText("Checkpoint: reviewed", { exact: true })).toBeVisible();
}
async function confirmReset(page: Page) {
  await page.getByRole("button", { name: "Reset local progress", exact: true }).click();
  await page.getByRole("button", { name: "Confirm reset", exact: true }).click();
}
async function readLessons(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("h2compute.progress")!).lessons);
}
async function seedComplete(page: Page) {
  await page.evaluate(() => localStorage.setItem("h2compute.progress", JSON.stringify({
    version: 2,
    lessons: { "sequence-and-selection": { quizReviewed: true, practiceReviewed: true, completed: true } },
  })));
  await page.reload();
}

test("failed-save retry preserves a different lesson saved in another tab", async ({ page, context }) => {
  await page.goto(`/lessons/${first}`);
  const peer = await context.newPage();
  await peer.goto(`/lessons/${second}`);
  await blockStorage(page, { write: true });
  await reviewCheckpoint(page);
  await reviewCheckpoint(peer, [0, 1]);
  await restoreStorage(page);
  await reviewCheckpoint(page);
  await expect(page.getByText("Progress saved on this browser.", { exact: true })).toBeVisible();
  const lessons = await readLessons(peer);
  expect(lessons[first].quizReviewed).toBe(true);
  expect(lessons[second].quizReviewed).toBe(true);
});

test("failed-save retry preserves an independent flag of the same lesson", async ({ page, context }) => {
  await page.goto(`/lessons/${first}`);
  const peer = await context.newPage();
  await peer.goto("/exercises/classify-a-score");
  await blockStorage(page, { write: true });
  await reviewCheckpoint(page);
  await peer.getByText("Show model explanation", { exact: true }).click();
  await peer.getByRole("button", { name: "I reviewed the model explanation", exact: true }).click();
  await expect(page.getByText("Offline model: reviewed", { exact: true })).toBeVisible();
  await restoreStorage(page);
  await reviewCheckpoint(page);
  const lessons = await readLessons(page);
  expect(lessons[first]).toEqual({ quizReviewed: true, practiceReviewed: true, completed: false });
});

test("unreadable storage does not overwrite saved flags even when writes work", async ({ page }) => {
  await page.goto(`/lessons/${second}`);
  await seedComplete(page);
  await blockStorage(page, { read: true });
  await reviewCheckpoint(page, [0, 1]);
  expect(await page.evaluate(() => (window as ProbeWindow).progressProbe.writes)).toBe(0);
  expect(await page.evaluate(() => {
    const probe = (window as ProbeWindow).progressProbe;
    return JSON.parse(probe.get.call(localStorage, "h2compute.progress")!).lessons["sequence-and-selection"].completed;
  })).toBe(true);
  await restoreStorage(page);
  await expect(page.getByText("Checkpoint: reviewed", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as ProbeWindow).progressProbe.writes)).toBe(0);
  await reviewCheckpoint(page, [0, 1]);
  const lessons = await readLessons(page);
  expect(lessons[first].completed).toBe(true);
  expect(lessons[second].quizReviewed).toBe(true);
});

test("failed reset keeps an empty base when storage recovers", async ({ page }) => {
  await page.goto(`/lessons/${second}`);
  await seedComplete(page);
  await blockStorage(page, { write: true, remove: true });
  await confirmReset(page);
  await expect(page.getByText("0 of 8 published journeys complete.", { exact: false })).toBeVisible();
  await reviewCheckpoint(page, [0, 1]);
  await restoreStorage(page);
  await reviewCheckpoint(page, [0, 1]);
  const lessons = await readLessons(page);
  expect(lessons[first]).toEqual({ quizReviewed: false, practiceReviewed: false, completed: false });
  expect(lessons[second].quizReviewed).toBe(true);
});

for (const channel of ["available", "missing", "constructor throws"] as const) {
  test(`absent-key peer reset clears failed-save memory with channel ${channel}`, async ({ page, context }) => {
    if (channel !== "available") await context.addInitScript((mode) => {
      Object.defineProperty(window, "BroadcastChannel", { configurable: true, value: mode === "missing" ? undefined : class {
        constructor() { throw new Error("Channel blocked"); }
      } });
    }, channel);
    await page.goto(`/lessons/${first}`);
    const peer = await context.newPage();
    await peer.goto("/topics/python-control-flow");
    await blockStorage(page, { write: true });
    await reviewCheckpoint(page);
    expect(await peer.evaluate((name) => localStorage.getItem(name), key)).toBeNull();
    await confirmReset(peer);
    await expect(page.getByText("Checkpoint: awaiting review", { exact: true })).toBeVisible();
    await expect(page.getByText("Local progress reset in another tab.", { exact: true })).toBeVisible();
    await restoreStorage(page);
    await reviewCheckpoint(page);
    expect((await readLessons(page))[first]).toEqual({ quizReviewed: true, practiceReviewed: false, completed: false });
  });
}

test("failed transient reset write does not prevent removal or send duplicate channel reset", async ({ page, context }) => {
  await page.goto(`/lessons/${first}`);
  await seedComplete(page);
  const peer = await context.newPage();
  await peer.goto(`/lessons/${second}`);
  await blockStorage(peer, { write: true });
  await reviewCheckpoint(peer, [0, 1]);
  await page.evaluate(() => {
    const target = window as typeof window & { resetPosts: number };
    target.resetPosts = 0;
    const original = BroadcastChannel.prototype.postMessage;
    BroadcastChannel.prototype.postMessage = function (value) {
      target.resetPosts++;
      original.call(this, value);
    };
  });
  await blockStorage(page, { read: true, write: true });
  await confirmReset(page);
  await expect(page.getByText("Other open tabs may need their own reset.", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => (window as typeof window & { resetPosts: number }).resetPosts)).toBe(0);
  await expect(peer.getByText("Checkpoint: awaiting review", { exact: true })).toBeVisible();
  expect(await peer.evaluate((name) => localStorage.getItem(name), key)).toBeNull();
  await reviewCheckpoint(peer, [0, 1]);
  await expect(peer.getByText("Checkpoint: reviewed", { exact: true })).toBeVisible();
});

test("channel reset works when storage cannot notify and ignores malformed messages", async ({ page, context }) => {
  await page.goto(`/lessons/${first}`);
  const peer = await context.newPage();
  await peer.goto("/topics/python-control-flow");
  await blockStorage(page, { write: true });
  await reviewCheckpoint(page);
  await page.evaluate(() => {
    const target = window as typeof window & { malformedMessagesSeen: number };
    target.malformedMessagesSeen = 0;
    const observer = new BroadcastChannel("h2compute.progress.reset");
    observer.onmessage = () => {
      target.malformedMessagesSeen++;
      if (target.malformedMessagesSeen === 5) observer.close();
    };
  });
  await peer.evaluate(() => {
    const channel = new BroadcastChannel("h2compute.progress.reset");
    for (const value of [null, "reset", { type: "reset" }, { type: "reset", cleared: "yes" }, { type: "reset", cleared: true, extra: true }]) channel.postMessage(value);
    channel.close();
  });
  await page.waitForFunction(() => (window as typeof window & { malformedMessagesSeen: number }).malformedMessagesSeen === 5);
  await expect(page.getByText("Checkpoint: reviewed", { exact: true })).toBeVisible();
  await blockStorage(peer, { write: true });
  await confirmReset(peer);
  await expect(page.getByText("Checkpoint: awaiting review", { exact: true })).toBeVisible();
});

test("unavailable read and transient write disclose an uncertain absent-key peer reset", async ({ page, context }) => {
  await page.goto(`/lessons/${first}`);
  const peer = await context.newPage();
  await peer.goto("/topics/python-control-flow");
  await blockStorage(page, { write: true });
  await reviewCheckpoint(page);
  await blockStorage(peer, { read: true, write: true });
  await confirmReset(peer);
  await expect(peer.getByText("Other open tabs may need their own reset.", { exact: false })).toBeVisible();
  await expect(page.getByText("Checkpoint: reviewed", { exact: true })).toBeVisible();
  expect(await page.evaluate((name) => localStorage.getItem(name), key)).toBeNull();
});

test("failed peer removal broadcasts reset intent without resurrecting stored flags", async ({ page, context }) => {
  await page.goto(`/lessons/${second}`);
  await seedComplete(page);
  const peer = await context.newPage();
  await peer.goto("/topics/python-control-flow");
  await blockStorage(page, { write: true });
  await reviewCheckpoint(page, [0, 1]);
  await blockStorage(peer, { write: true, remove: true });
  await confirmReset(peer);
  await expect(page.getByText("Checkpoint: awaiting review", { exact: true })).toBeVisible();
  await expect(page.getByText("0 of 8 published journeys complete.", { exact: false })).toBeVisible();
  await restoreStorage(page);
  await reviewCheckpoint(page, [0, 1]);
  const lessons = await readLessons(page);
  expect(lessons[first]).toEqual({ quizReviewed: false, practiceReviewed: false, completed: false });
  expect(lessons[second].quizReviewed).toBe(true);
});

for (const corrupt of ["loading", "unavailable"]) {
  test(`corrupt stored sentinel ${corrupt} remains recoverable`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("h2compute.progress", value), corrupt);
    await page.goto(`/lessons/${first}`);
    await expect(page.getByText("Saved progress was invalid", { exact: false })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset local progress", exact: true })).toBeEnabled();
    await confirmReset(page);
    expect(await page.evaluate((name) => localStorage.getItem(name), key)).toBeNull();
  });
}

test("peer reset survives later localStorage getter denial and still rejects sessionStorage events", async ({ page, context }) => {
  await page.goto("/exercises/classify-a-score");
  const peer = await context.newPage();
  await peer.goto("/topics/python-control-flow");
  await blockStorage(page, { write: true });
  await page.getByText("Show model explanation", { exact: true }).click();
  await page.getByRole("button", { name: "I reviewed the model explanation", exact: true }).click();
  await page.evaluate(() => {
    for (const name of ["h2compute.progress", null]) {
      window.dispatchEvent(new StorageEvent("storage", { key: name, newValue: null, storageArea: sessionStorage }));
    }
  });
  await expect(page.getByRole("button", { name: "Model explanation reviewed", exact: true })).toBeDisabled();
  await page.evaluate(() => {
    const target = window as typeof window & { restoreProgressGetter: () => void };
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage")!;
    Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new Error("Getter denied"); } });
    target.restoreProgressGetter = () => Object.defineProperty(window, "localStorage", descriptor);
    window.dispatchEvent(new Event("h2compute-progress"));
  });
  await confirmReset(peer);
  expect(await peer.evaluate((name) => localStorage.getItem(name), key)).toBeNull();
  await expect(page.getByRole("button", { name: "I reviewed the model explanation", exact: true })).toBeEnabled();
  await page.evaluate(() => (window as typeof window & { restoreProgressGetter: () => void }).restoreProgressGetter());
  await restoreStorage(page);
  await page.getByRole("link", { name: "Return to lesson completion" }).click();
  await reviewCheckpoint(page);
  const lessons = await readLessons(page);
  expect(lessons[first].quizReviewed).toBe(true);
  expect(lessons[first].practiceReviewed).toBe(false);
});
