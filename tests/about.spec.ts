import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    teamHoverFrames: { active: number; dimensions: number[][] }[];
    teamHoverStop: boolean;
  }
}

function visiblePanelWidths(nodes: Element[]) {
  return nodes.map((node) => {
    const clip = getComputedStyle(node).clipPath;
    const right = Number(clip.match(/^inset\(0px ([\d.]+)px/)?.[1] || 0);
    return Math.round(node.getBoundingClientRect().width - right);
  });
}

test("about page renders live Cambodia catalogue data, team, and mentor", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/about");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Discover Cambodia",
  );
  await expect(
    page.getByRole("link", { name: /See featured places/ }),
  ).toHaveAttribute("href", "#explore-cambodia");

  for (const id of [
    "about-vireyak",
    "cambodia",
    "explore-cambodia",
    "team",
    "why-vireyak",
    "travel-thoughtfully",
    "questions",
  ]) {
    await expect(page.locator(`#${id}`), `#${id} should exist`).toHaveCount(1);
  }

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

  const places = page.locator("#explore-cambodia article");
  await expect(places).toHaveCount(6);
  for (const card of await places.all()) {
    await expect(card.getByRole("heading", { level: 3 })).toHaveText(/\S/);
  }

  const team = page.locator("#team");
  expect(
    await team.locator('[data-slot="profile-photo"]').count(),
    "every team card should expose a photo frame",
  ).toBe(7);
  expect(
    await team
      .locator("article")
      .evaluateAll((cards) =>
        cards.findIndex((card) => card.textContent?.includes("Mentor")),
      ),
    "the mentor card should be presented above the team members",
  ).toBe(0);
  await expect(team.locator("article")).toHaveCount(7);
  await expect(team.getByText("Mentor", { exact: true })).toBeVisible();
  const mentorArticle = team.locator("article").first();
  await expect(mentorArticle.getByRole("heading", { level: 3 })).toHaveText(
    "Srorng Sokcheat",
  );

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

  const widths = () => cards.evaluateAll(visiblePanelWidths);

  const idle = await widths();
  expect(
    Math.max(...idle) - Math.min(...idle),
    "cards should start at similar widths",
  ).toBeLessThanOrEqual(8);

  const settle = () => page.waitForTimeout(1300);

  await cards.nth(2).hover({ position: { x: 20, y: 30 } });
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

  await cards.nth(4).hover({ position: { x: 20, y: 30 } });
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

    const widths = () => cards.evaluateAll(visiblePanelWidths);

    await cards.nth(1).tap({ position: { x: 20, y: 30 } });
    await expect
      .poll(
        async () => {
          const current = await widths();
          return current[1] > current[0] * 2;
        },
        { message: "a tapped card should expand" },
      )
      .toBe(true);

    await cards.nth(3).tap({ position: { x: 20, y: 30 } });
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

test("team hover stays stable across gaps and brief exits", async ({
  page,
}) => {
  await page.goto("/about");
  const gallery = page.locator('[data-slot="team-gallery"]');
  const cards = gallery.locator("article");
  await cards.nth(2).hover({ position: { x: 20, y: 30 } });
  await expect(cards.nth(2)).toHaveAttribute("data-active", "true");
  await page.waitForTimeout(750);
  const box = await cards.nth(2).boundingBox();
  if (!box) throw new Error("Hovered team card has no bounding box.");

  await page.mouse.move(box.x + box.width + 6, box.y + 30);
  await page.waitForTimeout(180);
  await expect(cards.nth(2)).toHaveAttribute("data-active", "true");

  await page.mouse.move(box.x + box.width / 2, box.y - 3);
  await page.mouse.move(box.x + box.width / 2, box.y + 30);
  await page.waitForTimeout(180);
  await expect(cards.nth(2)).toHaveAttribute("data-active", "true");

  await page.mouse.move(5, 5);
  await expect(gallery.locator('[data-active="true"]')).toHaveCount(0);
});

test("mentor photo does not zoom on hover", async ({ page }) => {
  await page.goto("/about");
  const mentor = page.locator("#team article").first();
  await mentor.hover();
  await page.waitForTimeout(800);
  expect(
    await mentor
      .locator("img")
      .evaluate((img) => getComputedStyle(img).transform),
  ).toBe("none");
});

test("team portraits stay at a fixed size while an expansion is interrupted", async ({
  page,
}) => {
  await page.goto("/about");
  const cards = page.locator(".team-gallery-card");
  await cards.first().scrollIntoViewIfNeeded();
  const photoSizes = () =>
    cards.locator("img").evaluateAll((images) =>
      images.map((img) => {
        const rect = img.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );
  const initialPhotos = await photoSizes();
  await cards.nth(2).focus();
  await page.waitForTimeout(160);
  const beforeSwitch = await cards
    .nth(2)
    .evaluate(
      (card) =>
        card.getBoundingClientRect().width -
        Number(
          getComputedStyle(card).clipPath.match(
            /^inset\(0px ([\d.]+)px/,
          )?.[1] || 0,
        ),
    );
  await cards.nth(4).focus();
  const samples = await cards.nth(2).evaluate(
    (card) =>
      new Promise<number[]>((resolve) => {
        const widths: number[] = [];
        const start = performance.now();
        const sample = (time: number) => {
          widths.push(
            card.getBoundingClientRect().width -
              Number(
                getComputedStyle(card).clipPath.match(
                  /^inset\(0px ([\d.]+)px/,
                )?.[1] || 0,
              ),
          );
          if (time - start < 450) requestAnimationFrame(sample);
          else resolve(widths);
        };
        requestAnimationFrame(sample);
      }),
  );
  expect(Math.abs(samples[0] - beforeSwitch)).toBeLessThan(45);
  expect(new Set(samples.map(Math.round)).size).toBeGreaterThan(5);
  expect(samples.at(-1)).toBeLessThan(samples[0]);
  const finalPhotos = await photoSizes();
  for (const [index, photo] of finalPhotos.entries()) {
    expect(photo.width).toBeCloseTo(initialPhotos[index].width, 3);
    expect(photo.height).toBeCloseTo(initialPhotos[index].height, 3);
  }
  await expect(cards.nth(4)).toHaveAttribute("data-active", "true");
});

test("team gallery respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  const cards = page.locator(".team-gallery-card");
  await cards.nth(2).focus();
  await expect(cards.nth(2)).toHaveAttribute("data-active", "true");
  expect(
    await cards
      .nth(2)
      .evaluate((card) => getComputedStyle(card).transitionDuration),
  ).toBe("0s");
  const widths = await cards.evaluateAll(visiblePanelWidths);
  expect(widths[2]).toBeGreaterThan(widths[0] * 3);
  await cards.nth(4).focus();
  const switched = await cards.evaluateAll(visiblePanelWidths);
  expect(switched[4]).toBeGreaterThan(switched[2] * 3);
});

test("accordion layers never resize or retrigger under a stationary pointer", async ({
  page,
}) => {
  await page.goto("/about");
  const cards = page.locator(".team-gallery-card");
  await cards.first().scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(750);
  await page.evaluate(() => {
    window.teamHoverFrames = [];
    window.teamHoverStop = false;
    const sample = () => {
      const nodes = [
        ...document.querySelectorAll<HTMLElement>(".team-gallery-card"),
      ];
      window.teamHoverFrames.push({
        active: nodes.findIndex((node) => node.dataset.active === "true"),
        dimensions: nodes.map((node) => [node.offsetWidth, node.offsetHeight]),
      });
      if (!window.teamHoverStop) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await cards.nth(2).hover({ position: { x: 20, y: 30 } });
  await page.waitForTimeout(1000);
  const frames = await page.evaluate(() => {
    window.teamHoverStop = true;
    return window.teamHoverFrames;
  });
  expect(frames.length).toBeGreaterThan(10);
  for (const frame of frames)
    expect(frame.dimensions).toEqual(frames[0].dimensions);
  const activeFrames = frames.filter((frame) => frame.active !== -1);
  expect(activeFrames.length).toBeGreaterThan(10);
  expect(activeFrames.every((frame) => frame.active === 2)).toBe(true);
});
