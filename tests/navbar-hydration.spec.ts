import { test, expect } from "@playwright/test";

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`navbar with ${reducedMotion} motion`, () => {
    test.use({ reducedMotion });

    test("hydrates without warnings and keeps navigation interactive", async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/about");
      await expect(
        page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "About", exact: true }),
      ).toHaveAttribute("aria-current", "page");
      await page.getByRole("button", { name: /Switch to .* mode/ }).click();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Close navigation" }).click();
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" }),
      ).toHaveCount(0);
      expect(
        errors.filter((message) =>
          /hydrat|didn't match|does not match|server rendered/i.test(message),
        ),
      ).toEqual([]);
    });
  });
}
