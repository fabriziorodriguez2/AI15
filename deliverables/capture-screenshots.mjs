import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 600, height: 1000 } });

await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Continuar" }).click();
await page.getByRole("button", { name: "Continuar" }).click();
await page.getByRole("button", { name: "Ver demo" }).click();
await page.waitForURL("**/dashboard");
await page.screenshot({
  path: "deliverables/assets/dashboard.png",
  fullPage: false,
});

await page.goto("http://localhost:3100/presupuesto", {
  waitUntil: "networkidle",
});
await page.screenshot({
  path: "deliverables/assets/presupuesto.png",
  fullPage: false,
});

await page.goto("http://localhost:3100/cronograma", {
  waitUntil: "networkidle",
});
await page.screenshot({
  path: "deliverables/assets/cronograma.png",
  fullPage: false,
});

await browser.close();
