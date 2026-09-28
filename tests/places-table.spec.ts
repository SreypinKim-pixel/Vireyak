import { test, expect } from "@playwright/test";
const data = [
  {
    id: "z",
    numericId: 10,
    name: "Zebra Temple",
    province: { id: "kampot", name: "Kampot" },
    type: "Temple",
    price: 2,
    rating: "8.5",
  },
  {
    id: "a",
    numericId: 2,
    name: "Angkor Place",
    province: { id: "siem-reap", name: "Siem Reap" },
    type: "Heritage",
    price: 100,
    rating: "9.5",
  },
  {
    id: "b",
    numericId: 1,
    name: "Bayon Place",
    province: { id: "siem-reap", name: "Siem Reap" },
    type: "Temple",
    price: 10,
    rating: "9.0",
  },
];
test("places skeleton, numeric and text sorting, province filter, and empty state", async ({
  page,
}) => {
  let release!: () => void;
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/attractions", async (route) => {
    await ready;
    await route.fulfill({ json: { data } });
  });
  await page.goto("/table", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("status", { name: "Loading places" }),
  ).toBeVisible();
  release();
  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(3);
  await expect(rows.first()).toContainText("Angkor Place");
  await page.getByRole("button", { name: /^ID/ }).click();
  await expect(rows.locator("td:first-child")).toHaveText(["1", "2", "10"]);
  await page.getByRole("button", { name: /^ID/ }).click();
  await expect(rows.locator("td:first-child")).toHaveText(["10", "2", "1"]);
  await page.getByRole("button", { name: "Price", exact: false }).click();
  await expect(rows.first()).toContainText("Zebra Temple");
  await expect(rows.last()).toContainText("Angkor Place");
  await page.getByRole("button", { name: "Price", exact: false }).click();
  await expect(rows.first()).toContainText("Angkor Place");
  await page.getByRole("button", { name: "Province", exact: false }).click();
  await expect(rows.first()).toContainText("Kampot");
  await page.getByRole("combobox", { name: "Filter by province" }).click();
  await page.getByRole("option", { name: "Siem Reap", exact: true }).click();
  await expect(rows).toHaveCount(2);
  await page.getByRole("searchbox", { name: "Search places" }).fill("Bayon");
  await expect(rows).toHaveCount(1);
  await expect(rows).toContainText("Bayon Place");
  await expect(rows.locator("td:first-child")).toHaveText("1");
  await page.getByRole("searchbox", { name: "Search places" }).fill("missing");
  await expect(rows).toHaveCount(0);
  await expect(
    page.getByText("No places found.", { exact: false }),
  ).toBeVisible();
});
test("places load failure can be retried", async ({ page }) => {
  await page.route("**/api/attractions", (route) =>
    route.fulfill({ status: 503 }),
  );
  await page.goto("/table");
  await expect(
    page.getByText("Places could not be loaded.", { exact: false }),
  ).toBeVisible();
  await page.route("**/api/attractions", (route) =>
    route.fulfill({ json: { data } }),
  );
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(3);
});
