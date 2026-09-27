import { test, expect } from "@playwright/test";

test("featured destinations open their matching province image and information", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator(
    'section[aria-labelledby="featured-destinations-title"] article',
  );
  await expect(cards).toHaveCount(3);
  const destinations = await cards.evaluateAll((nodes) =>
    nodes.map((node) => ({
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
