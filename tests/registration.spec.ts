import { test, expect } from "@playwright/test";

test("registration keeps its size while province options load", async ({
  page,
}) => {
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/attractions", async (route) => {
    await pending;
    await route.fulfill({
      json: {
        data: [
          {
            id: "angkor",
            name: "Angkor Wat",
            province: { id: "siem-reap", name: "Siem Reap" },
          },
        ],
      },
    });
  });
  await page.goto("/register");
  await page.evaluate(() => document.fonts.ready);
  const province = page.getByLabel("Province of interest");
  await expect(province).toBeVisible();
  await expect(province).toBeDisabled();
  const before = await page.locator("form").boundingBox();
  release();
  await expect(province).toBeEnabled();
  const after = await page.locator("form").boundingBox();
  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(after!.height).toBeCloseTo(before!.height, 0);
  expect(after!.y).toBeCloseTo(before!.y, 0);
});

test("registration validates fields and loads optional attractions", async ({
  page,
}) => {
  await page.goto("/register");
  await expect(page.getByLabel("Attraction of interest")).toBeEnabled();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await page.getByLabel("Full name").fill("   ");
  await page.getByLabel("Email address").fill("bad-email");
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Use at least 12 characters.")).toBeVisible();
  await page.getByLabel("Full name").fill("Demo Traveler");
  await page.getByLabel("Email address").fill("registered@example.com");
  await page.getByLabel("Password", { exact: true }).fill("demo-password-only");
  await page.getByLabel("Confirm password").fill("different-password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByLabel("Confirm password")).toBeFocused();
  await page.getByLabel("Confirm password").fill("demo-password-only");
  await expect(page.getByText("Your passwords must match.")).not.toBeVisible();
  await page.getByLabel("Attraction of interest").click();
  await page.getByRole("option", { name: "Angkor Wat", exact: true }).click();
  await page.getByLabel("Province of interest").click();
  await page.getByRole("option", { name: "Kampot", exact: true }).click();
  await expect(page.getByLabel("Attraction of interest")).toHaveText(
    "Choose an attraction",
  );
  await page.getByLabel("Attraction of interest").click();
  await expect(
    page.getByRole("option", {
      name: "Angkor Wat",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("option", { name: "Bokor National Park", exact: true })
    .click();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByRole("button", { name: "Signing up…" }),
  ).toBeDisabled();
  await expect(page.getByText(/Sign-up successful!/)).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate(() => sessionStorage.getItem("vireyak-demo-user")),
  ).toBeNull();
});

test("attraction loading failures can be retried and empty results are explained", async ({
  page,
}) => {
  await page.route("**/api/attractions", (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  await page.goto("/register");
  await expect(page.getByText(/Attractions could not be loaded/)).toBeVisible();
  await expect(page.getByLabel("Attraction of interest")).toBeDisabled();
  await page.route("**/api/attractions", (route) =>
    route.fulfill({ json: { data: [] } }),
  );
  await page.getByRole("button", { name: "Retry attractions" }).click();
  await expect(
    page.getByText(/No attractions are available yet/),
  ).toBeVisible();
});

test("invalid attraction and province IDs show the custom 404 with recovery links", async ({
  page,
  request,
}) => {
  for (const path of [
    "/attraction/invalid-id",
    "/provinces/invalid-id/attractions",
    "/missing-page",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /wandered off the map/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to the map" }),
    ).toHaveAttribute("href", "/");
    await page
      .getByRole("link", { name: "Explore Attractions", exact: true })
      .click();
    await expect(page).toHaveURL(/\/attraction$/);
  }
  const missing = await request.get("/api/provinces/invalid-id/attractions");
  expect(missing.status()).toBe(404);
  expect(await missing.json()).toEqual({ error: "Province not found" });
  const valid = await request.get("/api/provinces/siem-reap/attractions");
  expect(valid.ok()).toBe(true);
  expect((await valid.json()).data[0].id).toBe("angkor-sunrise");
  await page.goto("/provinces/siem-reap/attractions");
  await expect(
    page.getByRole("heading", { name: "Explore Siem Reap" }),
  ).toBeVisible();
});

test("malformed attraction data does not block registration", async ({
  page,
}) => {
  await page.route("**/api/attractions", (route) =>
    route.fulfill({
      json: { data: [{ id: "broken", name: "Broken", province: null }] },
    }),
  );
  await page.goto("/register");
  await expect(page.getByText(/Attractions could not be loaded/)).toBeVisible();
  await page.getByLabel("Full name").fill("Demo Traveler");
  await page.getByLabel("Email address").fill("registered@example.com");
  await page.getByLabel("Password", { exact: true }).fill("demo-password-only");
  await page.getByLabel("Confirm password").fill("demo-password-only");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByRole("button", { name: "Signing up…" }),
  ).toBeDisabled();
  await expect(page.getByText(/Sign-up successful!/)).toBeVisible();
});

test("account forms announce failure and let visitors retry", async ({
  page,
}) => {
  for (const [path, button, message] of [
    ["/register", "Create account", "Sign-up failed."],
    ["/login", "Log in", "Login failed."],
  ]) {
    await page.goto(path);
    await page.getByRole("button", { name: button, exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      message,
    );
    await expect(
      page.getByRole("button", { name: button, exact: true }),
    ).toBeEnabled();
  }
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage blocked");
    };
  });
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("DemoPassword@123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Login failed. Your browser could not save the session.",
  );
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("button", { name: "Log in", exact: true }),
  ).toBeEnabled();
});

test("registered accounts can log in and persist without plaintext passwords", async ({
  page,
}) => {
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Local Traveler");
  await page.getByLabel("Email address").fill("traveler@example.com");
  await page.getByLabel("Password", { exact: true }).fill("SamplePassword@123");
  await page.getByLabel("Confirm password").fill("SamplePassword@123");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page).toHaveURL(/\/login$/);
  const saved = await page.evaluate(() =>
    localStorage.getItem("vireyak-local-accounts"),
  );
  expect(saved).toContain("traveler@example.com");
  expect(saved).not.toContain("SamplePassword@123");
  await page.getByLabel("Email address").fill("TRAVELER@example.com");
  await page.getByLabel("Password", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(
    page.getByText("Login failed. Incorrect email or password."),
  ).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("SamplePassword@123");
  await page.getByLabel("Remember me").check();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(
    await page.evaluate(() => localStorage.getItem("vireyak-demo-user")),
  ).toBe("traveler@example.com");
});
