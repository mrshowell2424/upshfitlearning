import { test, expect } from "@playwright/test";

test.describe("Critical user paths", () => {
  test("homepage loads and shows main features", async ({ page }) => {
    await page.goto("/");

    // Check header is visible
    await expect(page.locator("text=UPSHIFT")).toBeVisible();

    // Check navigation works
    await expect(page.locator("button:has-text('HOME')")).toBeVisible();
    await expect(page.locator("button:has-text('STANDARD MATCH')")).toBeVisible();
    await expect(page.locator("button:has-text('RESOURCES')")).toBeVisible();
  });

  test("resource library loads and displays resources", async ({ page }) => {
    await page.goto("/resources");

    // Check library header
    await expect(page.locator("text=Resource library")).toBeVisible();

    // Check that resources are displayed
    await expect(page.locator("[class*='grid']")).toBeVisible();

    // Check pagination exists
    await expect(page.locator("text=Show 30 more")).toBeVisible();
  });

  test("standard matcher search works", async ({ page }) => {
    await page.goto("/match");

    // Check search interface
    await expect(page.locator("text=What are you teaching?")).toBeVisible();
    await expect(page.locator("input")).toBeVisible();

    // Try searching for a standard
    await page.fill("input", "RL.2.1");
    await page.click("button:has-text('Match my standard')");

    // Should navigate to detail page
    await page.waitForURL(/\/match\/RL\.2\.1/);
    await expect(page.locator("text=RL.2.1")).toBeVisible();
  });

  test("standard detail page shows all tabs", async ({ page }) => {
    await page.goto("/match/RL.2.1");

    // Check all tabs are visible
    await expect(page.locator("text=Lesson blueprint")).toBeVisible();
    await expect(page.locator("text=Unpack the standard")).toBeVisible();
    await expect(page.locator("text=Resources to remix")).toBeVisible();
    await expect(page.locator("text=Make it for my learners")).toBeVisible();

    // Check blueprint content
    await expect(page.locator("text=CONTEXT")).toBeVisible();
    await expect(page.locator("text=INSTRUCTIONAL ROUTE")).toBeVisible();
    await expect(page.locator("text=8-STEP LESSON PATH")).toBeVisible();
  });

  test("upgrade modal shows for free users on generation", async ({ page }) => {
    await page.goto("/match/RL.2.1");

    // Click on generation tab
    await page.click("button:has-text('Make it for my learners')");

    // Check generation UI
    await expect(page.locator("text=OUTPUT FORMAT")).toBeVisible();
    await expect(page.locator("text=STUDENT NEEDS")).toBeVisible();

    // Click generate (should show upgrade modal since not logged in)
    await page.click("button:has-text('Generate for my learners')");

    // Should see upgrade modal
    await expect(page.locator("text=Upgrade to Pro")).toBeVisible();
  });

  test("pricing page loads with all tiers", async ({ page }) => {
    await page.goto("/pricing");

    // Check all pricing tiers
    await expect(page.locator("text=Free")).toBeVisible();
    await expect(page.locator("text=Pro")).toBeVisible();
    await expect(page.locator("text=School")).toBeVisible();

    // Check CTA buttons
    await expect(page.locator("button:has-text('Get started')")).toBeVisible();
    await expect(page.locator("button:has-text('Start free trial')")).toBeVisible();
  });

  test("login page loads and accepts input", async ({ page }) => {
    await page.goto("/auth/login");

    // Check form fields
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("button:has-text('Sign in')")).toBeVisible();

    // Check signup link
    await expect(page.locator("text=Create an account")).toBeVisible();
  });

  test("signup page loads and accepts input", async ({ page }) => {
    await page.goto("/auth/signup");

    // Check form fields
    await expect(page.locator("input[type='text']")).toBeVisible(); // name
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("button:has-text('Create account')")).toBeVisible();

    // Check login link
    await expect(page.locator("text=Sign in")).toBeVisible();
  });

  test("responsive design on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/resources");

    // Check that layout is responsive
    await expect(page.locator("text=Resource library")).toBeVisible();

    // Grid should respond to mobile
    const grid = page.locator("[class*='grid']");
    await expect(grid).toBeVisible();
  });
});
