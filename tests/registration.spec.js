const { test, expect } = require("@playwright/test");

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
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("demo-password-only");
  await page.getByLabel("Confirm password").fill("different-password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByLabel("Confirm password")).toBeFocused();
  await page.getByLabel("Confirm password").fill("demo-password-only");
  await page
    .getByLabel("Attraction of interest")
    .selectOption("angkor-sunrise");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByText(/Account creation is not available yet/),
  ).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
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
    expect(response.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Off the beaten path." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Back Home" })).toHaveAttribute(
      "href",
      "/",
    );
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
