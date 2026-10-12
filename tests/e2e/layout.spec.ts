import { test, expect } from "@playwright/test";
test("notes theme and generated controls remain readable with dark system preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/lessons/sequence-and-selection");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "h2notes");
  const reset = page.getByRole("button", { name: "Reset local progress" });
  await expect(reset).toBeEnabled();
  const size = await reset.boundingBox();
  expect(size?.height).toBeGreaterThanOrEqual(44);
  const first = page.getByRole("radio", { name: "Review, then Recorded", exact: true });
  await first.focus();
  await page.keyboard.press("ArrowDown");
  const selected = page.getByRole("radio", { name: "Ready, then Recorded", exact: true });
  await expect(selected).toBeFocused();
  expect(await selected.evaluate(element => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(3);
  expect(await page.locator("body").evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgb(248, 247, 242)");
});
test("published routes fit narrow screens and expose semantic navigation", async ({
  page,
}, testInfo) => {
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/topics/python-control-flow",
      "/lessons/sequence-and-selection",
      "/exercises/classify-a-score",
      "/about",
      "/privacy",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByRole("navigation", { name: "Main navigation" }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
      if (route === "/") {
        await expect(page.getByText("Original content · Local progress · No sign-up", { exact: true })).toBeVisible();
        await page.screenshot({
          path: testInfo.outputPath(`home-${width}.png`),
        });
      }
      if (route === "/exercises/classify-a-score") {
        await page.getByText("Show model explanation", { exact: true }).click();
        await expect(page.locator("details[open] pre")).toBeVisible();
        await expect(page.locator("details[open] pre")).toHaveCSS("background-color", "rgb(32, 55, 47)");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        if (width === 320)
          await page.screenshot({
            path: testInfo.outputPath("practice-320.png"),
          });
      }
    }
  }
});
