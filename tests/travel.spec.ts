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
  ).toHaveCount(5);
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
  await page.getByRole("spinbutton", { name: "Travelers" }).fill("3");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/destination=Siem\+Reap/);
  // Lotus Blanc Retreat, Angkor Garden Villas, and Raffles Grand Hotel
  // d'Angkor all sleep at least three guests.
  await expect(page.locator("article")).toHaveCount(3);
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
  // Six curated previews plus eleven named Cambodian properties.
  await expect(page.locator("article")).toHaveCount(17);
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
    .getByRole("link", { name: "Bokor National Park", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Bokor National Park",
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
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("DemoPassword123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Login successful!",
  );
  await expect(page).toHaveURL(/\/$/);
  for (const route of ["/products", "/products/1"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/stays$/);
  }
  const response = await page.goto("/stays/does-not-exist");
  expect(response!.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /wandered off the map/ }),
  ).toBeVisible();
});

test("login validates fields and completes a labeled demo session", async ({
  page,
}) => {
  await page.goto("/login");

  // Empty submission shows both field errors and stays on the page.
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("#email-error")).toContainText(
    "Email is required.",
  );
  await expect(page.locator("#password-error")).toContainText(
    "Password is required.",
  );
  await expect(page).toHaveURL(/\/login$/);

  // An invalid email format is rejected even with a filled password.
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Password", { exact: true }).fill("DemoPassword123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("#email-error")).toContainText(
    "Enter a valid email address.",
  );
  await expect(page.locator("#password-error")).toHaveCount(0);

  // A missing password is rejected even when the email is valid.
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("#password-error")).toContainText(
    "Password is required.",
  );
  await expect(page.locator("#email-error")).toHaveCount(0);

  // Wrong passwords never create a session, even when their format is valid.
  for (const password of ["Ab1", "WrongPassword123", "demopassword123"]) {
    await page.getByLabel("Email address").fill("demo@example.com");
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Log in", exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Incorrect email or password",
    );
    await expect(page).toHaveURL(/\/login$/);
    expect(
      await page.evaluate(() => sessionStorage.getItem("vireyak-demo-user")),
    ).toBeNull();
  }
  await page.getByLabel("Email address").fill("wrong@example.com");
  await page.getByLabel("Password", { exact: true }).fill("DemoPassword123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Incorrect email or password",
  );

  // Remember me is visible and unchecked by default (session-only marker).
  const remember = page.getByRole("checkbox", { name: "Remember me" });
  await expect(remember).toBeVisible();
  await expect(remember).not.toBeChecked();

  // A valid password passes client-side validation without claiming real login,
  // then opens the home page as a guest so the preview does not dead-end.
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("DemoPassword123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Logging in…" }),
  ).toBeDisabled();
  const status = page.locator("form").getByRole("alert");
  await expect(status).toContainText(
    "Login successful! Taking you to the homepage…",
  );

  await expect(page).toHaveURL(/\/$/);

  // Default unchecked login uses session-only storage, never persistent.
  expect(
    await page.evaluate(() => sessionStorage.getItem("vireyak-demo-user")),
  ).toBe("demo@example.com");
  expect(
    await page.evaluate(() => localStorage.getItem("vireyak-demo-user")),
  ).toBe(null);

  // The navbar shows the demo sign-in and a log-out action.
  await expect(
    page.getByRole("button", { name: "Log out", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Signed in as demo@example.com")).toBeVisible();

  // The login page still links to the existing register page.
  await page.goto("/login");
  await page
    .locator("p")
    .filter({ hasText: "New to Vireyak?" })
    .getByRole("link", { name: "Sign up", exact: true })
    .click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(
    page.getByRole("heading", {
      name: "Your journey starts here.",
      exact: true,
    }),
  ).toBeVisible();

  // Logging out clears both stores and restores the guest nav.
  await page.goto("/");
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Log in", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => sessionStorage.getItem("vireyak-demo-user")),
  ).toBe(null);
  expect(
    await page.evaluate(() => localStorage.getItem("vireyak-demo-user")),
  ).toBe(null);

  // Checking "Remember me" keeps the demo marker in persistent local storage.
  await page.goto("/login");
  await remember.check();
  await expect(remember).toBeChecked();
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("DemoPassword123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(
    await page.evaluate(() => localStorage.getItem("vireyak-demo-user")),
  ).toBe("demo@example.com");
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("vireyak-demo-user")),
  ).toBe(null);
});

test("province lookup fetches live teacher API data with loading and error states", async ({
  page,
}) => {
  await page.goto("/");

  // Slow this same-origin proxy request so the loading state is observable.
  await page.route("**/api/provinces/2", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.continue();
  });

  await page.getByLabel("Province ID").fill("2");
  await page
    .getByRole("button", { name: "View province", exact: true })
    .click();
  await expect(page.getByTestId("province-loading")).toContainText(
    "Loading province 2",
  );
  await expect(page.getByTestId("province-result")).toContainText("Battambang");
  await expect(page.getByTestId("province-result")).toContainText(
    "Northwest Cambodia",
  );
  await expect(page.getByTestId("province-result")).toContainText(
    "GET /api/provinces/2",
  );

  // Local name-matched photos replace wrong or missing remote images, e.g.
  // Kampong Thom (14) keeps the current curated local province cover.
  await page.getByLabel("Province ID").fill("14");
  await page
    .getByRole("button", { name: "View province", exact: true })
    .click();
  await expect(page.getByTestId("province-result")).toContainText(
    "Kampong Thom",
  );
  await expect(
    page.getByTestId("province-result").getByRole("img"),
  ).toHaveAttribute("src", "/images/provinces/kampong-thom.jpg");
  await expect
    .poll(async () =>
      page
        .getByTestId("province-result")
        .getByRole("img")
        .evaluate(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0,
        ),
    )
    .toBe(true);

  // A missing province is reported clearly, without showing stale data.
  await page.getByLabel("Province ID").fill("99999");
  await page
    .getByRole("button", { name: "View province", exact: true })
    .click();
  await expect(page.getByTestId("province-error")).toContainText(
    "Province not found",
  );
  await expect(page.getByTestId("province-result")).toHaveCount(0);

  // Empty input is rejected locally before any request is attempted.
  await page.getByLabel("Province ID").fill("");
  await page
    .getByRole("button", { name: "View province", exact: true })
    .click();
  await expect(page.getByTestId("province-error")).toContainText(
    "Enter a positive province ID",
  );
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
  // The island hideaway and The Royal Sands Koh Rong both sleep four.
  await expect(page.locator("article")).toHaveCount(2);
});
