import { test, expect } from "@playwright/test";
import { attractions, stays } from "../data/travel";
import { siteUrl } from "../lib/seo";

for (const [kind, item] of [
  ["attraction", attractions[0]],
  ["stays", stays[0]],
] as const) {
  test(`${kind} detail metadata matches its content`, async ({ page }) => {
    await page.goto(`/${kind}/${item.id}?guests=3`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveTitle(
      `${item.name} in ${item.destination} | Vireyak`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      item.description,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${siteUrl}/${kind}/${item.id}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new URL(item.image, siteUrl).href,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });
}

test("destination listings have dynamic metadata and clean canonicals", async ({
  page,
}) => {
  await page.goto("/attraction?destination=Siem+Reap&guests=3", {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveTitle(
    "Siem Reap Attractions & Experiences | Vireyak",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}/attraction?destination=Siem+Reap`,
  );
  await page.goto("/stays?destination=Phnom+Penh", {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveTitle("Places to Stay in Phnom Penh | Vireyak");
  await page.goto("/attraction?destination=Unknown", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}/attraction`,
  );
});

test("province social metadata and indexing endpoints", async ({
  page,
  request,
}) => {
  await page.goto("/provinces/siem-reap/attractions", {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveTitle(
    "Siem Reap Attractions & Travel Guide | Vireyak",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `${siteUrl}/images/provinces/siem-reap.jpg`,
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain(
    `${siteUrl}/attraction/${attractions[0].id}`,
  );
  expect(await sitemap.text()).not.toContain("/login");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const missing = await request.get("/attraction/does-not-exist");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('content="noindex"');
});

test("API provinces are discoverable with matching page metadata", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const provincePath = sitemap.match(
    /<loc>[^<]*?(\/provinces\/\d+)<\/loc>/,
  )?.[1];
  expect(
    provincePath,
    "Sitemap should include live API province pages",
  ).toBeTruthy();
  await page.goto(provincePath!, { waitUntil: "domcontentloaded" });
  const name = await page.getByRole("heading", { level: 1 }).textContent();
  await expect(page).toHaveTitle(
    `${name} Attractions & Travel Guide | Vireyak`,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}${provincePath}`,
  );
  await expect(page.locator('meta[property="og:image"]')).not.toHaveAttribute(
    "content",
    `${siteUrl}/images/thumbnail.png`,
  );
});
