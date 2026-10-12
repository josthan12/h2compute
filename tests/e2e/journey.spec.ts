import { test, expect } from "@playwright/test";
test("complete journey, explanation, persistence, reset and narrow layout", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore Python control flow" }).click();
  await page.getByRole("link", { name: "Start lesson" }).click();
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toBeDisabled();
  await page
    .getByRole("radio", { name: "Review, then Recorded", exact: true })
    .check();
  await page
    .getByRole("radio", {
      name: "Otherwise a score of 85 would match >= 60 first",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Check answers" }).click();
  await expect(
    page.getByText("1 of 2 correct.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("Revisit this idea.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("radio", { name: "Ready, then Recorded", exact: true })
    .check();
  await page.getByRole("button", { name: "Check answers" }).click();
  await expect(
    page.getByText("2 of 2 correct.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Try the offline task" }).click();
  await expect(
    page.getByRole("button", { name: "I reviewed the model explanation" }),
  ).toBeDisabled();
  await page.getByText("Show model explanation", { exact: true }).click();
  await page
    .getByRole("button", { name: "I reviewed the model explanation" })
    .click();
  await page.getByRole("link", { name: "Return to lesson completion" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Journey complete", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText("1 of 3 published journeys complete.", { exact: false }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("completed-journey.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Reset local progress" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Journey complete", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset local progress" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Mark lesson complete" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(() => localStorage.getItem("h2compute.progress")),
  ).toBeNull();
});
test("keyboard navigation, radio group and model disclosure", async ({
  page,
}) => {
  await page.goto("/lessons/sequence-and-selection");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const radio = page.getByRole("radio", {
    name: "Review, then Recorded",
    exact: true,
  });
  await radio.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("radio", { name: "Ready, then Recorded", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("radio", {
      name: "Otherwise a score of 85 would match >= 60 first",
      exact: true,
    })
    .focus();
  await page.keyboard.press("Space");
  const check = page.getByRole("button", { name: "Check answers" });
  await check.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("2 of 2 correct.", { exact: false }),
  ).toBeVisible();
  const practice = page.getByRole("link", { name: "Try the offline task" });
  await practice.focus();
  await page.keyboard.press("Enter");
  const summary = page.getByText("Show model explanation", { exact: true });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Model explanation" }),
  ).toBeVisible();
});
test("corrupted storage recovers and missing lesson returns useful 404", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("h2compute.progress", "{bad"),
  );
  await page.goto("/lessons/sequence-and-selection");
  await expect(
    page.getByText("Saved progress was invalid", { exact: false }),
  ).toBeVisible();
  const response = await page.goto("/lessons/not-published");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("link", { name: "Browse Python control flow" }),
  ).toBeVisible();
});
test("blocked storage allows the full journey for this visit", async ({
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
  await expect(
    page.getByText("Browser storage is unavailable.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("radio", { name: "Ready, then Recorded", exact: true })
    .check();
  await page
    .getByRole("radio", {
      name: "Otherwise a score of 85 would match >= 60 first",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Check answers" }).click();
  await page.getByRole("link", { name: "Try the offline task" }).click();
  await page.getByText("Show model explanation", { exact: true }).click();
  await page
    .getByRole("button", { name: "I reviewed the model explanation" })
    .click();
  await page.getByRole("link", { name: "Return to lesson completion" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(
    page.getByText("Progress is available for this visit only", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Journey complete", exact: true }),
  ).toBeVisible();
});
