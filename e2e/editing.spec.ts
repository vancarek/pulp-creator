import { expect, test } from "@playwright/test";

import { openCharacter } from "./utils";

test("picking a portrait shows it on the sheet", async ({ page }) => {
  await openCharacter(page, "przyklad");
  await page.getByRole("link", { name: "Portret" }).click();
  await expect(page.getByRole("heading", { name: "Portret" })).toBeVisible();
  await page.getByRole("button", { name: /Portret 3/ }).click();
  await expect(page.getByRole("button", { name: /Portret 3/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "Zapisz portret" }).click();
  await expect(page).toHaveURL(/\/p\/przyklad$/);
  await expect(page.getByRole("img", { name: "Portret 3" })).toBeVisible();
});

test("upgrading from Call of Cthulhu to Pulp", async ({ page }) => {
  await openCharacter(page, "przyklad");
  await page.getByRole("link", { name: "Edytuj" }).click();
  await expect(
    page.getByRole("heading", { name: "Z Zewu do Pulp" }),
  ).toBeVisible();

  // 1. The CoC sheet's characteristics.
  await page.getByLabel(/^KON/).fill("70");
  await page.getByRole("button", { name: "Dalej" }).click();

  // 2. Skills, plus a specialization.
  await page.getByLabel("Historia", { exact: true }).fill("30");
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Nauka" }).click();
  await page.getByPlaceholder("np. Chemia").fill("Chemia");
  await page.getByRole("button", { name: "Dodaj" }).click();
  await expect(
    page.getByLabel("Nauka (Chemia)", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dalej" }).click();

  // 3. Archetype and its core characteristic.
  await page.getByRole("combobox").first().click();
  await page.getByRole("option", { name: "Twardziel" }).click();
  await expect(page.getByText("KON w Pulp (na karcie Zewu: 55)")).toBeVisible();
  await page.getByRole("button", { name: "Dalej" }).click();

  // 4. The archetype's 100 points.
  await page.getByRole("button", { name: "Historia: dodaj 5" }).click();
  await page.getByRole("button", { name: "Historia: dodaj 5" }).click();
  await expect(page.getByText("90/100")).toBeVisible();
  await page.getByRole("button", { name: "Dalej" }).click();

  // 5. Talents.
  await page.getByLabel("Talent 1").fill("Żelazna wola");
  await page.getByRole("button", { name: "Zapisz" }).click();

  await expect(page).toHaveURL(/\/p\/przyklad$/);
  await expect(page.getByText("Historia (05%)")).toBeVisible();
  const historia = page
    .getByRole("listitem")
    .filter({ hasText: "Historia (05%)" });
  await expect(historia).toContainText("40");
  await page.getByRole("tab", { name: "Historia" }).click();
  await expect(page.getByText("Żelazna wola")).toBeVisible();
});
