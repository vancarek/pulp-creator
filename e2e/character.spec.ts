import { expect, test } from "@playwright/test";

import { goHome, openCharacter } from "./utils";

test("home lists the characters and opens one", async ({ page }) => {
  await goHome(page);
  await expect(page.getByRole("heading", { name: "Badacze" })).toBeVisible();
  await page.getByRole("link", { name: /Eleanor Whitmore/ }).click();
  await expect(page).toHaveURL(/\/p\/przyklad$/);
  await expect(
    page.getByRole("heading", { name: "Eleanor Whitmore" }),
  ).toBeVisible();
});

test("a character's link works as a deep link", async ({ page }) => {
  await openCharacter(page, "przyklad");
  await expect(page.getByRole("heading", { name: "Cechy" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Umiejętności" }),
  ).toBeVisible();
});

test("the second page of the sheet is a tab", async ({ page }) => {
  await openCharacter(page, "przyklad");
  await page.getByRole("tab", { name: "Historia" }).click();
  await expect(
    page.getByRole("heading", { name: "Historia Bohatera" }),
  ).toBeVisible();
  await expect(page.getByText("Aparat Kodak po ojcu.")).toBeVisible();
});

test("printing includes both pages of the sheet", async ({ page }) => {
  await openCharacter(page, "przyklad");
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("heading", { name: "Cechy" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Historia Bohatera" }),
  ).toBeVisible();
});

test("an unknown character says so", async ({ page }) => {
  await openCharacter(page, "nikt");
  await expect(page.getByText("Nie ma postaci „nikt”.")).toBeVisible();
});
