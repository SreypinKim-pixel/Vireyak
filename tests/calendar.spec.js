const { test, expect } = require("@playwright/test");

test("calendar selects a blue stay range and carries it into search", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Check-in", { exact: true }).fill("2030-11-10");
  await page
    .getByRole("button", { name: "Choose check-in", exact: true })
    .click();
  await page.locator('[data-day="2030-11-13"] button').click();
  await expect(page.getByLabel("Check-out", { exact: true })).toHaveValue(
    "2030-11-13",
  );
  await page
    .getByRole("button", { name: "Choose check-out", exact: true })
    .click();
  await expect(page.locator('[data-day="2030-11-10"] button')).toHaveCSS(
    "background-color",
    "rgb(59, 130, 246)",
  );
  await expect(page.locator('[data-day="2030-11-12"]')).toHaveCSS(
    "background-color",
    "rgba(59, 130, 246, 0.2)",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Choose check-out", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/checkin=2030-11-10&checkout=2030-11-13/);
});

test("mobile experience picker selects a single date", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Find an experience" }).click();
  await page.getByLabel("Experience date", { exact: true }).fill("2030-11-10");
  await page
    .getByRole("button", { name: "Choose experience date", exact: true })
    .click();
  await page.locator('[data-day="2030-11-15"] button').click();
  await expect(page.getByLabel("Experience date", { exact: true })).toHaveValue(
    "2030-11-15",
  );
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/attraction\?checkin=2030-11-15/);
});
