import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("textbox", { name: "12345678A" }).click();
  await page.getByRole("textbox", { name: "12345678A" }).fill("45678912S");
  await page.getByRole("textbox", { name: "12345678A" }).press("Tab");
  await page.getByRole("textbox", { name: "************" }).click();
  await page.getByRole("textbox", { name: "************" }).fill("123Abc99%");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  const errorMessage = page.locator("p.login-error");
  await expect(errorMessage).toHaveText("DNI o contraseña incorrectos");
  await expect(errorMessage).toBeVisible();
});

test("dni obligatorio", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("textbox", { name: "12345678A" }).click();
  await page.getByRole("textbox", { name: "12345678A" }).fill("");
  await page.getByRole("textbox", { name: "12345678A" }).press("Tab");
  await page.getByRole("textbox", { name: "************" }).click();
  await page.getByRole("textbox", { name: "************" }).fill("123Abc99%");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  const errorMessage = page.locator("p.error");
  await expect(errorMessage).toHaveText("El DNI es obligatorio");
  await expect(errorMessage).toBeVisible();
});

test("contraseña obligatoria", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("textbox", { name: "12345678A" }).click();
  await page.getByRole("textbox", { name: "12345678A" }).fill("45678912S");
  await page.getByRole("textbox", { name: "12345678A" }).press("Tab");
  await page.getByRole("textbox", { name: "************" }).click();
  await page.getByRole("textbox", { name: "************" }).fill("");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  const errorMessage = page.locator("p.error");
  await expect(errorMessage).toHaveText("La contraseña es obligatoria");
  await expect(errorMessage).toBeVisible();
});
