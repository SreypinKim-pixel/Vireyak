import { test, expect } from "@playwright/test";
import { stays, attractions } from "../data/travel";

for (const kind of ["stays", "attraction"] as const) {
  test(`${kind} filters immediately when Where to changes`, async ({
    page,
  }) => {
    await page.goto(`/${kind}`);
    const items =
      kind === "stays"
        ? stays.filter((item) => item.capacity >= 2)
        : attractions;
    const cards = page.locator("article");
    const dropdown = page.getByRole("combobox", {
      name: "Destination",
      exact: true,
    });
    await expect(cards).toHaveCount(items.length);
    await page.getByRole("spinbutton", { name: "Travelers" }).fill("3");
    for (const [choice, destination] of [
      ["Siem Reap", "Siem Reap"],
      ["Kampot", "Kampot"],
      ["Preah Sihanouk", "Koh Rong"],
      ["Pailin", "Pailin"],
    ]) {
      await dropdown.click();
      await page.getByRole("option", { name: choice, exact: true }).click();
      const matching = items.filter((item) => item.destination === destination);
      await expect(cards).toHaveCount(matching.length);
      for (const item of matching) {
        await expect(
          cards.getByRole("link", { name: item.name, exact: true }),
        ).toBeVisible();
      }
      await expect(
        page.getByRole("heading", { name: choice, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("spinbutton", { name: "Travelers" }),
      ).toHaveValue("3");
    }
    await dropdown.click();
    await page
      .getByRole("option", { name: "Explore Cambodia", exact: true })
      .click();
    await expect(cards).toHaveCount(items.length);
    await dropdown.click();
    await page.getByRole("option", { name: "Kampot", exact: true }).click();
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL(/destination=Kampot/);
    await page.reload();
    await expect(dropdown).toContainText("Kampot");
    const matching = items.filter(
      (item) =>
        item.destination === "Kampot" &&
        (kind !== "stays" || ("capacity" in item && item.capacity >= 3)),
    );
    await expect(cards).toHaveCount(matching.length);
  });
}
