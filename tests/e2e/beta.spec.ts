import { test, expect } from "@playwright/test";
import { lessons } from "../../lib/content";
import { TOPICS } from "../../lib/lesson-ids";

for (const lesson of lessons()) {
  test(`keyboard completes ${lesson.slug}, retains progress and filters its own path`, async ({ page }) => {
    await page.goto(`/lessons/${lesson.slug}`);
    for (const [index, question] of lesson.quiz.entries()) {
      const choice = page.getByRole("group").nth(index).getByRole("radio").nth(question.answer);
      await choice.focus(); await page.keyboard.press("Space");
    }
    await page.getByRole("button", { name: "Check answers" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(`${lesson.quiz.length} of ${lesson.quiz.length} correct.`, { exact: false })).toBeVisible();
    await expect(page.locator(".feedback")).toHaveCount(lesson.quiz.length);
    await page.getByRole("link", { name: "Try the offline task" }).click();
    await page.getByText("Show model explanation", { exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("details[open]").getByRole("heading", { name: "Model explanation", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "I reviewed the model explanation" }).click();
    await page.getByRole("link", { name: "Return to lesson completion" }).click();
    await page.getByRole("button", { name: "Mark lesson complete" }).click();
    await page.reload();
    await expect(page.getByRole("button", { name: "Journey complete", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Back to the topic", exact: false }).click();
    await expect(page).toHaveURL(new RegExp(`/topics/${lesson.topic}$`));
    await page.getByRole("button", { name: "Incomplete lessons" }).click();
    await expect(page.getByRole("link", { name: lesson.title, exact: true })).toHaveCount(0);
    const ownPath = TOPICS.find(topic => topic.id === lesson.topic)!;
    await expect(page.locator("article.lesson-card")).toHaveCount(ownPath.lessonIds.length - 1);
    await page.getByRole("button", { name: "All lessons" }).click();
    await expect(page.getByRole("link", { name: lesson.title, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Reset local progress" }).click();
    await page.getByRole("button", { name: "Confirm reset" }).click();
    await page.getByRole("button", { name: "Incomplete lessons" }).click();
    await expect(page.locator("article.lesson-card")).toHaveCount(ownPath.lessonIds.length);
  });
}
test("all paths are discoverable and final lessons keep navigation inside their topic", async ({ page }) => {
  await page.goto("/");
  for (const topic of TOPICS) {
    await page.getByRole("heading", { name: topic.title, exact: true }).getByRole("link").last().click();
    await expect(page).toHaveURL(new RegExp(`/topics/${topic.id}$`));
    await page.goto(`/lessons/${topic.lessonIds.at(-1)}`);
    await expect(page.getByRole("link", { name: "Next:", exact: false })).toHaveCount(0);
    await page.getByRole("link", { name: "Review the topic", exact: false }).click();
    await expect(page).toHaveURL(new RegExp(`/topics/${topic.id}$`));
    await page.goto("/");
  }
  await expect(page.getByRole("button", { name: /Run|Check examples|Submit code/ })).toHaveCount(0);
});
test("old v2 progress coexists with new areas and unknown routes give a recovery path", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("h2compute.progress", JSON.stringify({ version: 2, lessons: { "sequence-and-selection": { quizReviewed: true, practiceReviewed: true, completed: true } } })));
  await page.goto("/lessons/binary-search");
  const lesson = lessons().find(item => item.slug === "binary-search")!;
  for (const [index, q] of lesson.quiz.entries()) await page.getByRole("group").nth(index).getByRole("radio").nth(q.answer).check();
  await page.getByRole("button", { name: "Check answers" }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("h2compute.progress")!));
  expect(saved.lessons["sequence-and-selection"].completed).toBe(true);
  expect(saved.lessons["binary-search"].quizReviewed).toBe(true);
  expect(saved.lessons["relations-and-keys"].completed).toBe(false);
  for (const route of ["/topics/unknown", "/exercises/unknown"]) {
    expect((await page.goto(route))?.status()).toBe(404);
    await expect(page.getByRole("link", { name: "Browse all learning paths", exact: false })).toBeVisible();
  }
});

test("a completed path has an honest empty incomplete filter and can be revisited", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("h2compute.progress", JSON.stringify({ version: 2, lessons: { "lists-and-linear-search": { quizReviewed: true, practiceReviewed: true, completed: true }, "binary-search": { quizReviewed: true, practiceReviewed: true, completed: true } } })));
  await page.goto("/topics/algorithms-and-data-structures");
  await page.getByRole("button", { name: "Incomplete lessons" }).click();
  await expect(page.getByText("All lessons in this path are marked complete.", { exact: false })).toBeVisible();
  await expect(page.locator("article.lesson-card")).toHaveCount(0);
  await page.getByRole("button", { name: "All lessons" }).click();
  await expect(page.locator("article.lesson-card")).toHaveCount(2);
});

test("home Python path progress excludes completed searching and SQL lessons", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("h2compute.progress", JSON.stringify({ version: 2, lessons: {
    "lists-and-linear-search": { quizReviewed: true, practiceReviewed: true, completed: true },
    "relations-and-keys": { quizReviewed: true, practiceReviewed: true, completed: true }
  } })));
  await page.reload();
  await expect(page.locator(".intro-grid").getByText("0 of 3 lessons complete", { exact: true })).toBeVisible();
  for (const [title, badge] of [["Python control flow", "0 of 3 lessons complete"], ["Searching lists", "1 of 2 lessons complete"], ["Relational data and SQL", "1 of 3 lessons complete"]]) {
    const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
    await expect(card.getByText(badge, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole("region", { name: "Local learning progress" }).getByText("2 of 8 published journeys complete.", { exact: false })).toBeVisible();
});
