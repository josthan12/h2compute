import { test, expect, type Page } from "@playwright/test";

async function reviewCheckpoint(page: Page, answers: number[]) {
  for (const [index, answer] of answers.entries()) {
    await page
      .getByRole("group")
      .nth(index)
      .getByRole("radio")
      .nth(answer)
      .check();
  }
  await page.getByRole("button", { name: "Check answers" }).click();
  await expect(
    page.getByText("2 of 2 correct.", { exact: false }),
  ).toBeVisible();
}
async function completeLesson(page: Page, answers: number[]) {
  await reviewCheckpoint(page, answers);
  await page.getByRole("link", { name: "Try the offline task" }).click();
  await page.getByText("Show model explanation", { exact: true }).click();
  await expect(page.locator("details[open] pre").first()).toBeVisible();
  await page
    .getByRole("button", { name: "I reviewed the model explanation" })
    .click();
  await page.getByRole("link", { name: "Return to lesson completion" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
}

test("three connected journeys keep separate progress across navigation, refresh and reset", async ({
  page,
}, testInfo) => {
  await page.goto("/topics/python-control-flow");
  await expect(page.getByRole("link", { name: "Start lesson" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Open lesson" })).toHaveCount(2);
  await page.getByRole("link", { name: "Start lesson" }).click();
  await completeLesson(page, [1, 2]);
  await page.getByRole("link", { name: "Next: Repeat with a purpose" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Repeat with a purpose",
  );
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toBeDisabled();
  await completeLesson(page, [0, 1]);
  await page
    .getByRole("link", { name: "Next: Trace decisions inside a loop" })
    .click();
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toBeDisabled();
  await completeLesson(page, [2, 0]);
  await page.getByRole("link", { name: "Review the topic" }).click();
  await expect(page).toHaveURL(/\/topics\/python-control-flow$/);
  await page.reload();
  await expect(page.getByText("Lesson complete", { exact: true })).toHaveCount(
    3,
  );
  await expect(
    page.getByText("3 of 3 published journeys complete.", { exact: false }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("completed-topic.png"),
    fullPage: true,
  });
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("h2compute.progress")!),
  );
  expect(saved.version).toBe(2);
  expect(Object.keys(saved.lessons)).toHaveLength(3);
  await page.getByRole("button", { name: "Reset local progress" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await page.reload();
  await expect(
    page.getByText("Not yet completed", { exact: true }),
  ).toHaveCount(3);
  expect(
    await page.evaluate(() => localStorage.getItem("h2compute.progress")),
  ).toBeNull();
});

test("legacy completion migrates without marking later lessons complete", async ({
  page,
}) => {
  await page.goto("/topics/python-control-flow");
  await page.evaluate(() =>
    localStorage.setItem(
      "h2compute.progress",
      JSON.stringify({
        version: 1,
        lessons: {
          "sequence-and-selection": {
            quizReviewed: true,
            practiceReviewed: true,
            completed: true,
          },
        },
      }),
    ),
  );
  await page.reload();
  await expect(page.getByText("Lesson complete", { exact: true })).toHaveCount(
    1,
  );
  await expect(
    page.getByText("Not yet completed", { exact: true }),
  ).toHaveCount(2);
  await page.getByRole("link", { name: "Open lesson" }).first().click();
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toBeDisabled();
  await completeLesson(page, [0, 1]);
  await page.reload();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("h2compute.progress")!),
  );
  expect(saved.version).toBe(2);
  expect(saved.lessons["sequence-and-selection"].completed).toBe(true);
  expect(saved.lessons["counted-and-conditional-loops"].completed).toBe(true);
  expect(saved.lessons["combined-flow-and-tracing"].completed).toBe(false);
});

test("two tabs retain independent checkpoint updates and share a reset", async ({
  page,
}) => {
  await page.goto("/lessons/sequence-and-selection");
  const second = await page.context().newPage();
  await second.goto("/lessons/counted-and-conditional-loops");
  await reviewCheckpoint(page, [1, 2]);
  await reviewCheckpoint(second, [0, 1]);
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("h2compute.progress")!),
  );
  expect(saved.lessons["sequence-and-selection"].quizReviewed).toBe(true);
  expect(saved.lessons["counted-and-conditional-loops"].quizReviewed).toBe(
    true,
  );
  await page.getByRole("button", { name: "Reset local progress" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await expect(
    second.getByText("Checkpoint: awaiting review", { exact: true }),
  ).toBeVisible();
  await second.close();
});

for (const resetMethod of ["owned key removal", "site storage clear"]) {
  test(`${resetMethod} clears failed-save memory without resurrecting progress`, async ({
    page,
  }) => {
    await page.goto("/topics/python-control-flow");
    await page.evaluate(() => {
      localStorage.setItem(
        "h2compute.progress",
        JSON.stringify({
          version: 1,
          lessons: {
            "sequence-and-selection": {
              quizReviewed: true,
              practiceReviewed: true,
              completed: true,
            },
          },
        }),
      );
    });
    await page.goto("/lessons/counted-and-conditional-loops");
    await expect(
      page.getByText("1 of 3 published journeys complete.", { exact: false }),
    ).toBeVisible();
    const second = await page.context().newPage();
    await second.goto("/topics/python-control-flow");
    await expect(
      second.getByRole("button", { name: "Reset local progress" }),
    ).toBeEnabled();
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === "h2compute.progress")
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        original.call(this, key, value);
      };
      Object.defineProperty(window, "restoreProgressWrites", {
        value: () => {
          Storage.prototype.setItem = original;
        },
      });
    });
    await reviewCheckpoint(page, [0, 1]);
    await expect(
      page.getByText("Progress is available for this visit only", {
        exact: false,
      }),
    ).toBeVisible();
    if (resetMethod === "owned key removal") {
      await second
        .getByRole("button", { name: "Reset local progress" })
        .click();
      await second.getByRole("button", { name: "Confirm reset" }).click();
    } else {
      await second.evaluate(() => localStorage.clear());
    }
    await expect(
      page.getByText("Checkpoint: awaiting review", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("0 of 3 published journeys complete.", { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByText("Local progress reset in another tab.", { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => localStorage.getItem("h2compute.progress")),
    ).toBeNull();
    await page.evaluate(() => {
      (
        window as typeof window & { restoreProgressWrites: () => void }
      ).restoreProgressWrites();
    });
    await reviewCheckpoint(page, [0, 1]);
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("h2compute.progress")!),
    );
    expect(saved.version).toBe(2);
    expect(saved.lessons["sequence-and-selection"]).toEqual({
      quizReviewed: false,
      practiceReviewed: false,
      completed: false,
    });
    expect(saved.lessons["counted-and-conditional-loops"]).toEqual({
      quizReviewed: true,
      practiceReviewed: false,
      completed: false,
    });
    await page.reload();
    await expect(
      page.getByText("0 of 3 published journeys complete.", { exact: false }),
    ).toBeVisible();
    await second.close();
  });
}

test("blocked storage preserves all three journeys in memory until refresh", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Blocked");
      },
    });
  });
  await page.goto("/lessons/sequence-and-selection");
  await completeLesson(page, [1, 2]);
  await page.getByRole("link", { name: "Next: Repeat with a purpose" }).click();
  await completeLesson(page, [0, 1]);
  await page
    .getByRole("link", { name: "Next: Trace decisions inside a loop" })
    .click();
  await completeLesson(page, [2, 0]);
  await expect(
    page.getByText("3 of 3 published journeys complete.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("Progress is available for this visit only", {
      exact: false,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toBeDisabled();
  await expect(
    page.getByText("0 of 3 published journeys complete.", { exact: false }),
  ).toBeVisible();
});
