import { test, expect, type Page } from "@playwright/test";

async function choose(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

test("global navigation, local photography, theme persistence, and mobile layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /SIEM REAP|KOH RONG|KAMPOT|PHNOM PENH|KIRIROM/,
  );
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link"),
  ).toHaveCount(4);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => {
        image.loading = "eager";
        return image.decode().catch(() => {});
      }),
    );
  });
  expect(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0,
        ),
      ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/vireyak-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.screenshot({
    path: "/tmp/vireyak-desktop-top.png",
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.screenshot({
    path: "/tmp/vireyak-dark.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Stays", exact: true })
    .click();
  await expect(page).toHaveURL(/\/stays/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  for (const path of [
    "/",
    "/stays",
    "/attraction",
    "/about",
    "/login",
    "/register",
    "/stays/lotus-blanc-retreat",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `${path} should not overflow`,
    ).toBe(true);
    if (path === "/register") {
      await expect(page.locator("footer")).toHaveCount(0);
      await expect(
        page.getByRole("navigation", { name: "Main navigation", exact: true }),
      ).toHaveCount(0);
    } else {
      await expect(page.locator("footer")).toBeVisible();
    }
  }
  await page.goto("/");
  await page.screenshot({
    path: "/tmp/vireyak-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(errors).toEqual([]);
});

test("search carries dates and travelers to a stay preview", async ({
  page,
}) => {
  await page.goto("/");
  await choose(page, "Destination", "Siem Reap");
  await page.getByLabel("Check-in", { exact: true }).fill("2030-11-10");
  await page.getByLabel("Check-out", { exact: true }).fill("2030-11-13");
  await choose(page, "Travelers", "3 guests");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/destination=Siem\+Reap/);
  await expect(page.locator("article")).toHaveCount(2);
  await page
    .getByRole("link", { name: "Lotus Blanc Retreat", exact: true })
    .click();
  await expect(page.getByLabel("Check-in", { exact: true })).toHaveValue(
    "2030-11-10",
  );
  await expect(page.getByLabel("Check-out", { exact: true })).toHaveValue(
    "2030-11-13",
  );
  await expect(page.getByText("$255", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Preview your trip" }).click();
  await expect(page.getByRole("status")).toContainText(
    "no booking or payment has been made",
  );
});

test("filters, sorting, saved favorites, and empty results", async ({
  page,
}) => {
  await page.goto("/stays");
  await expect(page.locator("article")).toHaveCount(6);
  await choose(page, "Sort results", "Price: low to high");
  await expect(page.locator("article").first()).toContainText(
    "Kampot River Lodge",
  );
  await page
    .getByRole("button", { name: "Save Lotus Blanc Retreat", exact: true })
    .click();
  await page.reload();
  await page.getByLabel("My saved favorites").check();
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Unsave Lotus Blanc Retreat", exact: true })
    .click();
  await expect(page.locator("article")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await choose(page, "Nightly budget", "Up to $80");
  await expect(page.locator("article")).toHaveCount(2);
  await page.getByRole("radio", { name: "Private villa", exact: true }).check();
  await expect(
    page.getByRole("heading", { name: "A different path might be perfect." }),
  ).toBeVisible();
});

test("experiences, honest account forms, legacy redirects, and missing pages", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Find an experience" }).click();
  await choose(page, "Destination", "Kampot");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/\/attraction\?/);
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .getByRole("link", { name: "The slower side of Kampot", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The slower side of Kampot",
  );
  await page.getByLabel("Experience date", { exact: true }).fill("2030-11-10");
  await expect(page.getByLabel("Experience date", { exact: true })).toHaveValue(
    "2030-11-10",
  );
  await page.getByRole("button", { name: "Preview your trip" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Reservations are not open yet",
  );
  await page.goto("/login");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("demonstration-only");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Sign-in is not available yet",
  );
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  for (const route of ["/products", "/products/1", "/table"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/stays$/);
  }
  const response = await page.goto("/stays/does-not-exist");
  expect(response!.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Off the beaten path." }),
  ).toBeVisible();
});

test("themed dropdowns support keyboard navigation, dismissal, reset, and mobile boundaries", async ({
  page,
}) => {
  await page.goto("/");
  const destination = page.getByRole("combobox", {
    name: "Destination",
    exact: true,
    includeHidden: true, // Radix hides the trigger from the accessibility tree while open.
  });
  await destination.focus();
  await page.keyboard.press("Enter");
  await expect(destination).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("option", { name: "Explore Cambodia", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("End");
  // Radix moves keyboard focus on the next task; wait before selecting.
  await expect(
    page.getByRole("option", { name: "Tboung Khmum", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(destination).toContainText("Tboung Khmum");
  await expect(destination).toBeFocused();
  await destination.press("ArrowDown");
  await expect(
    page.getByRole("option", { name: "Tboung Khmum", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("option", { name: "Explore Cambodia", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(destination).toContainText("Explore Cambodia");
  await destination.click();
  await page.keyboard.press("Escape");
  await expect(destination).toHaveAttribute("aria-expanded", "false");
  await expect(destination).toBeFocused();
  await destination.click();
  await page.locator("h1").click({ force: true });
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await destination.click();
  await page.screenshot({
    path: "/tmp/vireyak-dropdown-light.png",
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await destination.click();
  await page.screenshot({
    path: "/tmp/vireyak-dropdown-dark.png",
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await destination.click();
  const box = await page.getByRole("listbox").boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  await page.screenshot({
    path: "/tmp/vireyak-dropdown-mobile.png",
    animations: "disabled",
  });
  await page.getByRole("option", { name: "Koh Rong", exact: true }).click();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/destination=Koh\+Rong/);
  await expect(page.locator("article")).toHaveCount(1);
});
