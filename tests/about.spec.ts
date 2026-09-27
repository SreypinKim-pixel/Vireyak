import { test, expect } from "@playwright/test";

test("about page renders live Cambodia catalogue data, team, and mentor", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/about");

  // Hero
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Discover Cambodia",
  );
  await expect(
    page.getByRole("link", { name: /See featured places/ }),
  ).toHaveAttribute("href", "#explore-cambodia");

  // Every required section is present, including the anchors the footer uses.
  for (const id of [
    "about-camtrip",
    "cambodia",
    "explore-cambodia",
    "team",
    "why-camtrip",
    "travel-thoughtfully",
    "questions",
  ]) {
    await expect(page.locator(`#${id}`), `#${id} should exist`).toHaveCount(1);
  }

  // Cambodia section: every figure is calculated from live API responses, so
  // each value must be a number rather than placeholder text.
  const cambodia = page.locator("#cambodia");
  const statValues = cambodia.locator("dl").first().locator("dd");
  expect(
    await statValues.count(),
    "at least three API-derived statistics should render",
  ).toBeGreaterThanOrEqual(3);
  for (const value of await statValues.all()) {
    await expect(value).toHaveText(/^\d[\d,]*$/);
  }
  await expect(
    cambodia.getByRole("heading", { name: "Provinces in the catalogue" }),
  ).toBeVisible();
  expect(
    await cambodia.locator("ul li").count(),
    "province list should render every province returned by the API",
  ).toBeGreaterThanOrEqual(20);
  expect(
    await cambodia.innerText(),
    "Khmer names should be rendered from the API",
  ).toMatch(/[\u1780-\u17FF]/);

  // Explore Cambodia: six featured places from GET /api/attractions.
  const places = page.locator("#explore-cambodia article");
  await expect(places).toHaveCount(6);
  for (const card of await places.all()) {
    await expect(card.getByRole("heading", { level: 3 })).toHaveText(/\S/);
  }

  // Team: the mentor card leads the section, kept separate from the six-member
  // interactive gallery that sits under it.
  const team = page.locator("#team");
  expect(
    await team.locator('[data-slot="profile-photo"]').count(),
    "every team card should expose a photo frame",
  ).toBe(7);
  expect(
    await team
      .locator("article")
      .evaluateAll((cards) =>
        cards.findIndex((card) => card.textContent.includes("Mentor")),
      ),
    "the mentor card should be presented above the team members",
  ).toBe(0);
  await expect(team.locator("article")).toHaveCount(7);
  await expect(team.getByText("Mentor", { exact: true })).toBeVisible();
  const mentorArticle = team.locator("article").first();
  await expect(mentorArticle.getByRole("heading", { level: 3 })).toHaveText(
    "Srorng Sokcheat",
  );

  // Photos are lazy-loaded, so walk every card before checking that it decoded:
  // a missing or misnamed photo never loads and would leave the card on its
  // initials fallback instead.
  const teamCards = team.locator("article");
  const teamCardCount = await teamCards.count();
  for (let index = 1; index < teamCardCount; index += 1) {
    await teamCards.nth(index).scrollIntoViewIfNeeded();
  }
  await expect
    .poll(
      () =>
        team
          .locator("article img")
          .evaluateAll(
            (photos) =>
              photos.length > 0 &&
              photos.every(
                (photo) =>
                  photo instanceof HTMLImageElement && photo.naturalWidth > 0,
              ),
          ),
      { message: "every team photo should load", timeout: 15000 },
    )
    .toBe(true);

  // Cards in order: the mentor first, then the six members as data/team.ts lists
  // them, each with their own bundled photo.
  const cards = await teamCards.evaluateAll((articles) =>
    articles.map((article) => {
      const photo = article.querySelector("img");
      return {
        heading: article.querySelector("h3")?.textContent?.trim() || "",
        src: photo?.getAttribute("src") || null,
        loaded: Boolean(photo?.naturalWidth),
      };
    }),
  );
  const mentorCard = cards[0];
  expect(mentorCard.heading, "the mentor card should lead the section").toBe(
    "Srorng Sokcheat",
  );
  expect(mentorCard.loaded, "the mentor photo should load").toBe(true);
  expect(
    mentorCard.src,
    "the mentor photo should come from the built bundle",
  ).toMatch(/^\/_next\/static\/media\/.+\.(png|jpe?g|webp)$/i);
  const memberCards = cards.slice(1);
  expect(
    memberCards.map((card) => card.heading),
    "every member should be listed by full name, in order",
  ).toEqual([
    "Kim Sreypin",
    "Leang Seavminh",
    "Keo Hengleap",
    "Sok Chanpanha",
    "Koem Longhuy",
    "Chhom Nadaraguel",
  ]);
  expect(
    memberCards.filter((card) => card.loaded).length,
    "every member card should show a decoded photo",
  ).toBe(6);
  expect(
    new Set(memberCards.map((card) => card.src)).size,
    "each member should show their own photo",
  ).toBe(6);
  for (const card of memberCards) {
    expect(card.src, "team photos should come from the built bundle").toMatch(
      /^\/_next\/static\/media\/.+\.(png|jpe?g|webp)$/i,
    );
  }
  await team.screenshot({
    path: "/tmp/vireyak-about-team.png",
    animations: "disabled",
  });

  // Values and closing call to action.
  await expect(
    page.getByRole("heading", { name: "Discover", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Ready to explore Cambodia?" }),
  ).toBeVisible();

  await page.screenshot({
    path: "/tmp/vireyak-about-desktop.png",
    fullPage: true,
    animations: "disabled",
  });

  expect(errors).toEqual([]);
});

test("team gallery expands the hovered member card and shrinks the rest", async ({
  page,
}) => {
  await page.goto("/about");

  const cards = page.locator('#team [data-slot="team-gallery"] article');
  await expect(cards).toHaveCount(6);

  const widths = () =>
    cards.evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
    );

  // Default state: nothing is hovered, so the six panels are about equal.
  const idle = await widths();
  expect(
    Math.max(...idle) - Math.min(...idle),
    "cards should start at similar widths",
  ).toBeLessThanOrEqual(8);

  // The width transition runs for 500ms, so wait for it to settle before
  // measuring the resting widths of the two states.
  const settle = () => page.waitForTimeout(700);

  // Hovering a card expands it and shrinks the other five.
  await cards.nth(2).hover();
  await settle();
  const expanded = await widths();
  expect(
    expanded[2],
    "the hovered card should be about 3-4 times wider than a narrowed card",
  ).toBeGreaterThan(expanded[0] * 2.5);
  for (const [index, width] of expanded.entries()) {
    if (index === 2) {
      expect(
        width,
        "the hovered card should be wider than before",
      ).toBeGreaterThan(idle[index]);
      continue;
    }
    expect(
      width,
      `card ${index} should shrink while card 2 is active`,
    ).toBeLessThan(idle[index]);
  }

  // Moving the pointer to another card hands the expansion over.
  await cards.nth(4).hover();
  await settle();
  const handedOver = await widths();
  expect(
    handedOver[4],
    "the newly hovered card should take the expansion",
  ).toBeGreaterThan(handedOver[2] * 2.5);
  expect(
    handedOver[2],
    "the previously expanded card should shrink back",
  ).toBeLessThan(expanded[2]);

  // Leaving the gallery restores the equal-width default state.
  await page.mouse.move(5, 5);
  await settle();
  const restored = await widths();
  expect(
    Math.max(...restored) - Math.min(...restored),
    "leaving the gallery should restore equal widths",
  ).toBeLessThanOrEqual(8);
});

test.describe("team gallery on touch screens", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test("tapping a card expands it, and tapping another card switches the focus", async ({
    page,
  }) => {
    await page.goto("/about");

    const cards = page.locator('#team [data-slot="team-gallery"] article');
    await expect(cards).toHaveCount(6);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      "the gallery should scroll inside itself instead of widening the page",
    ).toBe(true);

    const widths = () =>
      cards.evaluateAll((nodes) =>
        nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
      );

    await cards.nth(1).tap();
    await expect
      .poll(
        async () => {
          const current = await widths();
          return current[1] > current[0] * 2;
        },
        { message: "a tapped card should expand" },
      )
      .toBe(true);

    await cards.nth(3).tap();
    await expect
      .poll(
        async () => {
          const current = await widths();
          return current[3] > current[1] * 2;
        },
        { message: "tapping another card should hand the expansion over" },
      )
      .toBe(true);
  });
});

test("about page call to action links use the existing routes", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(
    page.getByRole("link", { name: /Explore destinations/ }),
  ).toHaveAttribute("href", "/stays");
  await expect(
    page.getByRole("link", { name: /Browse experiences/ }).first(),
  ).toHaveAttribute("href", "/attraction");

  await page.getByRole("link", { name: /Explore destinations/ }).click();
  await expect(page).toHaveURL(/\/stays$/);

  await page.goto("/about#questions");
  await expect(
    page.getByRole("heading", { name: "Good questions. Honest answers." }),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "/about should not overflow on mobile",
  ).toBe(true);
  await expect(page.locator("#team article")).toHaveCount(7);

  // Walk the team cards so the lazy-loaded photos are fetched before the
  // screenshots below, which would otherwise capture the initials placeholders.
  const mobileCards = page.locator("#team article");
  for (let index = 0; index < (await mobileCards.count()); index += 1) {
    await mobileCards.nth(index).scrollIntoViewIfNeeded();
  }
  await expect
    .poll(
      () =>
        page
          .locator("#team article img")
          .evaluateAll(
            (photos) =>
              photos.length > 0 &&
              photos.every(
                (photo) =>
                  photo instanceof HTMLImageElement && photo.naturalWidth > 0,
              ),
          ),
      { message: "team photos should load at mobile width", timeout: 15000 },
    )
    .toBe(true);

  await page.screenshot({
    path: "/tmp/vireyak-about-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
});
