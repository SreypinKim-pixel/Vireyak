import { test, expect } from "@playwright/test";

test("hero shows a skeleton until its photo loads", async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/images/angkor.jpg", async (route) => {
    await ready;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const card = page.getByRole("button", {
    name: "Show SIEM REAP",
    exact: true,
  });
  await expect(card.getByTestId("hero-image-skeleton")).toBeVisible();
  release();
  await expect(card.getByTestId("hero-image-skeleton")).toHaveCount(0);
  await expect(card.getByRole("img")).toHaveCSS("opacity", "1");
});

test("failed hero photos stop loading and show a fallback", async ({
  page,
}) => {
  await page.route("**/images/angkor.jpg", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const card = page.getByRole("button", {
    name: "Show SIEM REAP",
    exact: true,
  });
  await expect(card.getByText("Photo unavailable")).toBeVisible();
  await expect(card.getByTestId("hero-image-skeleton")).toHaveCount(0);
});
