import { provinceNames } from "../data/province-names";
import {
  getProvincePhoto,
  getAttractionPhoto,
} from "../lib/destination-images";
import { test, expect } from "@playwright/test";

test("featured destinations open their matching province image and information", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator(
    'section[aria-labelledby="featured-destinations-title"] article',
  );
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(6);
  const destinations = await cards.evaluateAll((nodes) =>
    nodes.slice(0, 3).map((node) => ({
      name: node.querySelector("h3")!.textContent!,
      image: node.querySelector("img")!.getAttribute("src")!,
      href: node.querySelector("a")!.getAttribute("href")!,
    })),
  );
  for (const destination of destinations) {
    await cards
      .getByRole("link", { name: `Discover ${destination.name}`, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${destination.href}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      destination.name,
    );
    await expect(
      page.getByRole("img", { name: destination.name, exact: true }),
    ).toHaveAttribute("src", destination.image);
    await expect(
      page.getByRole("heading", {
        name: `Explore ${destination.name}`,
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Featured destinations", exact: false })
      .click();
  }
});

test("mentor and expanded members show social icons ready for profile URLs", async ({
  page,
}) => {
  await page.goto("/about");
  const mentor = page.locator("#team article").first();
  for (const label of ["GitHub", "Telegram"]) {
    await expect(
      mentor.getByRole("link", { name: `${label} — profile coming soon` }),
    ).toBeVisible();
  }
  const cards = page.locator(".team-gallery-card");
  for (const card of await cards.all()) {
    await card.focus();
    for (const label of ["GitHub", "Telegram"]) {
      const icon = card.getByRole("link", {
        name: `${label} — profile coming soon`,
      });
      await expect(icon).toBeVisible();
      await expect(icon.locator("svg")).toHaveCount(1);
    }
  }
});

test("province gallery expands to 25, collapses to six, and opens a later province", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator(
    'section[aria-labelledby="featured-destinations-title"]',
  );
  const cards = section.locator("article");
  await expect(cards).toHaveCount(6);
  const expand = section.getByRole("button", {
    name: "View all 25 provinces",
    exact: true,
  });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expand.click();
  await expect(cards).toHaveCount(25);
  const collapse = section.getByRole("button", {
    name: "Show fewer provinces",
    exact: true,
  });
  await expect(collapse).toHaveAttribute("aria-expanded", "true");
  await expect(page).toHaveURL(/\/$/);
  expect(new Set(await cards.locator("h3").allTextContents()).size).toBe(25);
  await collapse.focus();
  await page.keyboard.press("Enter");
  await expect(cards).toHaveCount(6);
  await expand.click();
  await cards
    .getByRole("link", { name: "Discover Koh Kong", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Koh Kong");
  const attractions = page.locator("main article");
  await expect(attractions.first()).toBeVisible();
  expect(await attractions.count()).toBeGreaterThan(0);
  expect(await attractions.locator("img").count()).toBeGreaterThan(0);
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});

test("every province card shows its own locally served cover image", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator(
    'section[aria-labelledby="featured-destinations-title"]',
  );
  const cards = section.locator("article");
  await section
    .getByRole("button", { name: "View all 25 provinces", exact: true })
    .click();
  await expect(cards).toHaveCount(25);
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded();
    const name = await card.locator("h3").innerText();
    const image = card.locator("img");
    await expect(image, name).toHaveCount(1);
    // Covers are local files, so a slow or hotlink-blocking third party cannot
    // leave a card with an empty image area.
    await expect(image, name).toHaveAttribute("src", /^\/images\//);
    await expect
      .poll(() =>
        image.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await expect(section.getByText("Image unavailable")).toHaveCount(0);
});

test("all provinces have named photos and attractions never borrow a province cover", () => {
  for (const name of provinceNames) {
    const photo = getProvincePhoto(name);
    expect(photo, name).toBeTruthy();
    expect(photo!.src).not.toMatch(/flag|placeholder|Special:FilePath/i);
    // Every province cover is served from this site, so the card cannot break
    // when a remote host rate-limits or blocks hotlinked requests.
    expect(photo!.src, name).toMatch(/^\/images\//);
    expect(photo!.alt.length).toBeGreaterThan(5);
    expect(photo!.source).toMatch(/^https:\/\//);
  }
  expect(getProvincePhoto("Tbong Khmum")).toEqual(
    getProvincePhoto("Tboung Khmum"),
  );
  expect(getAttractionPhoto("Bayon Temple", "Siem Reap")?.src).not.toBe(
    getProvincePhoto("Siem Reap")?.src,
  );
  expect(getAttractionPhoto("Royal Palace", "Phnom Penh")).toBeTruthy();
  const context = getAttractionPhoto("Unverified local site", "Kep");
  expect(context).toBeNull();
  expect(
    getAttractionPhoto("Unknown", "Unknown", [
      "https://example.com/Flag_of_Cambodia.svg",
    ]),
  ).toBeNull();
  expect(
    getAttractionPhoto("Unknown", "Unknown", ["javascript:alert(1)"]),
  ).toBeNull();
});
