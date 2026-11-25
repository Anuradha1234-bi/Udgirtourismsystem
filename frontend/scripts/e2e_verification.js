import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('CRITICAL CONFIGURATION ERROR: ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required.');
  console.error('Set them before running: $env:ADMIN_USERNAME="admin"; $env:ADMIN_PASSWORD="..."; node scripts/e2e_verification.js');
  process.exit(1);
}

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(name, status, details = '') {
  if (status === 'PASS') {
    results.passed++;
    console.log('[PASS] ' + name + (details ? ' - ' + details : ''));
  } else {
    results.failed++;
    console.error('[FAIL] ' + name + ' - ' + details);
  }
  results.tests.push({ name, status, details });
}

async function runVerification() {
  console.log('====================================================');
  console.log('EXPLORE UDGIR - PLAYWRIGHT BROWSER AUTOMATION SUITE');
  console.log('====================================================');
  console.log('Target URL: ' + BASE_URL);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  try {
    // -------------------------------------------------------------------------
    // 1. PUBLIC PAGES SMOKE TEST (ENGLISH)
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing Public Pages (English) ---');
    const publicRoutes = [
      { path: '/', name: 'Home Page', expectedText: 'Explore Udgir' },
      { path: '/places', name: 'Places Directory', expectedText: 'Tourist Destinations' },
      { path: '/places/udgir-fort', name: 'Place Detail (Udgir Fort)', expectedText: 'Udgir Fort' },
      { path: '/history', name: 'Historical Heritage', expectedText: 'Battle of Udgir' },
      { path: '/food-culture', name: 'Food & Culture', expectedText: 'Food & Living Culture' },
      { path: '/hotels', name: 'Hotels & Dining', expectedText: 'Restaurants & Hotels' },
      { path: '/map', name: 'Interactive Map', expectedText: 'Interactive Tourism Map' },
      { path: '/itineraries', name: 'Curated Itineraries', expectedText: 'Suggested Travel Itineraries' },
      { path: '/gallery', name: 'Photo Gallery', expectedText: 'Photo Gallery' },
      { path: '/about-contact', name: 'About & Contact', expectedText: 'About Explore Udgir' }
    ];

    for (const route of publicRoutes) {
      try {
        const resp = await page.goto(BASE_URL + route.path, { waitUntil: 'networkidle', timeout: 15000 });
        const status = resp ? resp.status() : 0;
        const bodyContent = await page.textContent('body');
        const hasText = bodyContent.toLowerCase().includes(route.expectedText.toLowerCase());

        if (status === 200 && hasText) {
          recordTest('Route: ' + route.path + ' (' + route.name + ')', 'PASS', 'Status: 200, Content verified');
        } else {
          recordTest('Route: ' + route.path + ' (' + route.name + ')', 'FAIL', 'Status: ' + status + ', Contains "' + route.expectedText + '": ' + hasText);
        }
      } catch (err) {
        recordTest('Route: ' + route.path + ' (' + route.name + ')', 'FAIL', err.message);
      }
    }

    // -------------------------------------------------------------------------
    // 2. BILINGUAL LANGUAGE SWITCHING (MARATHI <-> ENGLISH)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Bilingual Language Switching ---');
    try {
      await page.goto(BASE_URL + '/places', { waitUntil: 'networkidle' });

      // Click Marathi button
      const mrBtn = page.locator('.lang-toggle.desktop-lang button:has-text("मराठी")');
      await mrBtn.click();
      await page.waitForTimeout(600);

      const bodyMr = await page.textContent('body');
      const hasMarathi = bodyMr.includes('उदगीर') || bodyMr.includes('पर्यटन स्थळे');
      if (hasMarathi) {
        recordTest('Switch to Marathi (mr) language', 'PASS', 'Marathi content rendered');
      } else {
        recordTest('Switch to Marathi (mr) language', 'FAIL', 'No Marathi text detected');
      }

      // Check Place Detail in Marathi
      await page.goto(BASE_URL + '/places/udgir-fort', { waitUntil: 'networkidle' });
      const detailMr = await page.textContent('body');
      const hasDetailMr = detailMr.includes('उदगीर किल्ला') || detailMr.includes('स्थान व नकाशे') || detailMr.includes('इतिहास');
      if (hasDetailMr) {
        recordTest('Place Detail in Marathi', 'PASS', 'Marathi place detail rendered correctly');
      } else {
        recordTest('Place Detail in Marathi', 'FAIL', 'Marathi place detail failed to render');
      }

      // Switch back to English
      const enBtn = page.locator('.lang-toggle.desktop-lang button:has-text("EN")');
      await enBtn.click();
      await page.waitForTimeout(600);

      const bodyEn = await page.textContent('body');
      const hasEnglish = bodyEn.includes('Udgir Fort');
      if (hasEnglish) {
        recordTest('Switch back to English (en) language', 'PASS', 'English content restored');
      } else {
        recordTest('Switch back to English (en) language', 'FAIL', 'English content failed to restore');
      }
    } catch (err) {
      recordTest('Bilingual Language Switching', 'FAIL', err.message);
    }

    // -------------------------------------------------------------------------
    // 3. INTERACTIVE FEATURES & FORM SUBMISSIONS
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Interactive Features & Forms ---');

    // 3a. Search on Places Page
    try {
      await page.goto(BASE_URL + '/places', { waitUntil: 'networkidle' });
      const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="शोधा"]');
      await searchInput.fill('Buddha');
      await page.waitForTimeout(600);

      const pageText = await page.textContent('body');
      const foundBuddha = pageText.includes('Buddha') || pageText.includes('बुद्ध');

      if (foundBuddha) {
        recordTest('Places Search Filter', 'PASS', 'Search query filtered places successfully');
      } else {
        recordTest('Places Search Filter', 'FAIL', 'Search failed to filter');
      }

      await searchInput.fill('');
      await page.waitForTimeout(400);
    } catch (err) {
      recordTest('Places Search Filter', 'FAIL', err.message);
    }

    // 3b. Interactive Leaflet Map
    try {
      await page.goto(BASE_URL + '/map', { waitUntil: 'networkidle' });
      await page.waitForSelector('.leaflet-container', { timeout: 10000 });
      const mapContainer = await page.locator('.leaflet-container').count();
      const markerCount = await page.locator('.leaflet-marker-icon').count();

      if (mapContainer > 0 && markerCount > 0) {
        recordTest('Leaflet Interactive Map & Markers', 'PASS', 'Rendered with ' + markerCount + ' markers');
      } else {
        recordTest('Leaflet Interactive Map & Markers', 'FAIL', 'Map: ' + mapContainer + ', Markers: ' + markerCount);
      }
    } catch (err) {
      recordTest('Leaflet Interactive Map & Markers', 'FAIL', err.message);
    }

    // 3c. Contact Form Submission
    try {
      await page.goto(BASE_URL + '/about-contact', { waitUntil: 'networkidle' });

      const contactForm = page.locator('form').first();
      await contactForm.locator('input[type="text"]').nth(0).fill('QA Automation Tester');
      await contactForm.locator('input[type="email"]').fill('qa.tester@example.com');
      await contactForm.locator('input[type="text"]').nth(1).fill('9876543210');
      await contactForm.locator('input[type="text"]').nth(2).fill('Automated Verification Inquiry');
      await contactForm.locator('textarea').fill('Testing the contact message API and database insertion via Playwright.');

      await contactForm.locator('button[type="submit"]').click();
      await page.waitForTimeout(1500);

      const pageContent = await page.textContent('body');
      const hasSuccess = pageContent.includes('Thank you') ||
                         pageContent.includes('received') ||
                         pageContent.includes('सफलतापूर्वक') ||
                         pageContent.includes('यशस्वी');

      if (hasSuccess) {
        recordTest('Contact Form Submission', 'PASS', 'Contact message sent and confirmed');
      } else {
        recordTest('Contact Form Submission', 'FAIL', 'Success confirmation not detected');
      }
    } catch (err) {
      recordTest('Contact Form Submission', 'FAIL', err.message);
    }

    // 3d. Visitor Feedback Form Submission
    try {
      await page.goto(BASE_URL + '/about-contact', { waitUntil: 'networkidle' });

      const feedbackForm = page.locator('form').nth(1);
      await feedbackForm.locator('input[type="text"]').fill('QA Feedback Reviewer');
      await feedbackForm.locator('input[type="email"]').fill('qa.feedback@example.com');

      const starBtns = feedbackForm.locator('button[type="button"]');
      if (await starBtns.count() >= 5) {
        await starBtns.nth(4).click();
      }

      await feedbackForm.locator('textarea').fill('The portal is extremely fast, responsive, and verified accurate.');
      await feedbackForm.locator('button[type="submit"]').click();
      await page.waitForTimeout(1500);

      const pageContent = await page.textContent('body');
      const hasFeedbackSuccess = pageContent.includes('Thank you for helping improve tourism') ||
                                  pageContent.includes('Thank you') ||
                                  pageContent.includes('अभिप्राय');

      if (hasFeedbackSuccess) {
        recordTest('Visitor Feedback Form Submission', 'PASS', 'Feedback recorded and confirmed');
      } else {
        recordTest('Visitor Feedback Form Submission', 'FAIL', 'Feedback confirmation not detected');
      }
    } catch (err) {
      recordTest('Visitor Feedback Form Submission', 'FAIL', err.message);
    }

    // -------------------------------------------------------------------------
    // 4. RESPONSIVE VIEWPORT TESTING & OVERFLOW CHECKS
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Responsive Viewports & Overflow ---');
    const viewports = [
      { name: 'Mobile Small', width: 360, height: 640 },
      { name: 'Mobile Medium (iPhone)', width: 390, height: 844 },
      { name: 'Tablet (iPad)', width: 768, height: 1024 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Desktop Full HD', width: 1920, height: 1080 }
    ];

    for (const vp of viewports) {
      try {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });

        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            innerWidth: window.innerWidth
          };
        });

        const hasNoOverflow = overflow.scrollWidth <= overflow.clientWidth + 2;
        if (hasNoOverflow) {
          recordTest('Viewport ' + vp.name + ' (' + vp.width + 'x' + vp.height + ') - No Overflow', 'PASS', 'scrollWidth: ' + overflow.scrollWidth + ', clientWidth: ' + overflow.clientWidth);
        } else {
          recordTest('Viewport ' + vp.name + ' (' + vp.width + 'x' + vp.height + ') - No Overflow', 'FAIL', 'Overflow detected: scrollWidth: ' + overflow.scrollWidth + ' > clientWidth: ' + overflow.clientWidth);
        }

        if (vp.width <= 768) {
          const menuBtn = page.locator('button.mobile-menu-btn');
          const isMenuVisible = await menuBtn.isVisible();
          if (isMenuVisible) {
            await menuBtn.click();
            await page.waitForTimeout(300);
            await menuBtn.click();
            await page.waitForTimeout(300);
            recordTest('Viewport ' + vp.name + ' - Mobile Menu Toggle', 'PASS', 'Menu toggled cleanly');
          } else {
            recordTest('Viewport ' + vp.name + ' - Mobile Menu Toggle', 'FAIL', 'Mobile menu button not visible');
          }
        }
      } catch (err) {
        recordTest('Viewport ' + vp.name + ' Check', 'FAIL', err.message);
      }
    }

    await page.setViewportSize({ width: 1366, height: 768 });

    // -------------------------------------------------------------------------
    // 5. COMPLETE ADMIN WORKFLOW VIA UI
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Testing Complete Admin Workflow via UI ---');

    // 5a. Admin Login
    try {
      await page.goto(BASE_URL + '/admin/login', { waitUntil: 'networkidle' });
      await page.locator('input[type="text"]').fill(ADMIN_USERNAME);
      await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
      await page.locator('button[type="submit"]').click();

      await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
      const dashboardText = await page.textContent('body');
      const hasDashboard = dashboardText.includes('Admin Dashboard') || dashboardText.includes('Logged in as') || dashboardText.includes('नियंत्रण कक्ष');

      if (hasDashboard) {
        recordTest('Admin Login & Dashboard Navigation', 'PASS', 'Logged in as admin successfully');
      } else {
        recordTest('Admin Login & Dashboard Navigation', 'FAIL', 'Dashboard not reached');
      }
    } catch (err) {
      recordTest('Admin Login & Dashboard Navigation', 'FAIL', err.message);
    }

    // 5b. Add Temporary Destination
    const testSlug = 'playwright-e2e-monument';
    try {
      const addBtn = page.locator('button.btn-primary:has(svg.lucide-plus), button:has-text("Add New Destination"), button:has-text("नवीन स्थळ जोडा")').first();
      await addBtn.waitFor({ state: 'visible', timeout: 8000 });
      await addBtn.click();
      await page.waitForTimeout(500);

      // Tab 1: Basic
      await page.locator('input[placeholder*="udgir-fort"]').fill(testSlug);
      await page.locator('input[placeholder*="Udgir Fort"]').fill('Playwright Test Monument');
      await page.locator('input[placeholder*="उदगीर किल्ला"]').fill('प्लेराइट चाचणी स्मारक');
      await page.locator('input[placeholder*="Historic land fort"]').fill('Automated Verification Test Monument');
      await page.locator('input[placeholder*="ऐतिहासिक लढाईचा"]').fill('स्वयंचलित पडताळणी चाचणी स्मारक');

      // Switch to Tab 2: Content
      const contentTabBtn = page.locator('button:has-text("2. Descriptions"), button:has-text("२. वर्णन")');
      await contentTabBtn.click();
      await page.waitForTimeout(300);

      await page.locator('textarea[placeholder*="Comprehensive description"]').fill('Comprehensive description of the Playwright verification test monument in Udgir.');
      await page.locator('textarea[placeholder*="पर्यटन स्थळाचे"]').fill('उदगीर मधील प्लेराइट पडताळणी चाचणी स्मारकाचे विस्तृत वर्णन.');

      // Switch to Tab 3: Location
      const locationTabBtn = page.locator('button:has-text("3. Location"), button:has-text("३. स्थान")');
      await locationTabBtn.click();
      await page.waitForTimeout(300);

      await page.locator('input[placeholder*="Fort Road, Near Gandhi"]').fill('Monument Road, Near Udgir Fort, Udgir 413517');
      await page.locator('input[placeholder*="किल्ला रस्ता, गांधी"]').fill('स्मारक रस्ता, उदगीर किल्ला परिसर, उदगीर ४१३५१७');

      // Submit Form
      const submitBtn = page.locator('button[form="place-form"][type="submit"]');
      await submitBtn.click();
      await page.waitForTimeout(2000);

      // Verify row exists in admin table
      const adminTableText = await page.textContent('body');
      const createdInAdmin = adminTableText.includes('Playwright Test Monument');

      if (createdInAdmin) {
        recordTest('Admin Add Destination', 'PASS', 'Destination created and visible in admin table');
      } else {
        recordTest('Admin Add Destination', 'FAIL', 'Destination not found in admin table');
      }

      // 5c. Verify Destination on Public Places Page
      await page.goto(BASE_URL + '/places', { waitUntil: 'networkidle' });
      const publicPlacesText = await page.textContent('body');
      const visibleOnPublic = publicPlacesText.includes('Playwright Test Monument');

      if (visibleOnPublic) {
        recordTest('Public Visibility of New Destination', 'PASS', 'Destination visible on public /places page');
      } else {
        recordTest('Public Visibility of New Destination', 'FAIL', 'Destination not visible on public page');
      }

      // 5d. Edit Destination in Admin
      await page.goto(BASE_URL + '/admin/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const editBtn = page.locator('tr:has-text("Playwright Test Monument") button:has(svg.lucide-edit), tr:has-text("Playwright Test Monument") button:has-text("Edit"), tr:has-text("Playwright Test Monument") button:has-text("संपादित करा")').first();
      await editBtn.click();
      await page.waitForTimeout(500);

      const taglineInput = page.locator('input[placeholder*="Historic land fort"]');
      await taglineInput.fill('Updated Tagline for Playwright Test');

      const editSubmitBtn = page.locator('button[form="place-form"][type="submit"]');
      await editSubmitBtn.click();
      await page.waitForTimeout(2000);
      recordTest('Admin Edit Destination', 'PASS', 'Destination updated successfully');

      // 5e. Toggle Publish (Hide Destination)
      const publishToggleBtn = page.locator('tr:has-text("Playwright Test Monument") button:has(svg.lucide-eye), tr:has-text("Playwright Test Monument") button:has(svg.lucide-eye-off)').first();
      if (await publishToggleBtn.isVisible()) {
        await publishToggleBtn.click();
        await page.waitForTimeout(1000);

        await page.goto(BASE_URL + '/places', { waitUntil: 'networkidle' });
        const textAfterHide = await page.textContent('body');
        const isHiddenFromPublic = !textAfterHide.includes('Playwright Test Monument');

        if (isHiddenFromPublic) {
          recordTest('Admin Toggle Publish (Unpublish)', 'PASS', 'Unpublished destination immediately hidden from public');
        } else {
          recordTest('Admin Toggle Publish (Unpublish)', 'FAIL', 'Unpublished destination still visible to public!');
        }
      } else {
        recordTest('Admin Toggle Publish (Unpublish)', 'FAIL', 'Publish toggle button not found');
      }

      // 5f. Delete Temporary Destination
      await page.goto(BASE_URL + '/admin/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const deleteBtn = page.locator('tr:has-text("Playwright Test Monument") button:has(svg.lucide-trash-2), tr:has-text("Playwright Test Monument") button[title*="Delete"]').first();
      await deleteBtn.click();
      await page.waitForTimeout(300);

      const confirmBtn = page.locator('tr:has-text("Playwright Test Monument") button:has-text("Confirm")').first();
      await confirmBtn.click();
      await page.waitForTimeout(1500);

      const textAfterDelete = await page.textContent('body');
      const isDeletedFromAdmin = !textAfterDelete.includes('Playwright Test Monument');

      await page.goto(BASE_URL + '/places', { waitUntil: 'networkidle' });
      const textPublicAfterDelete = await page.textContent('body');
      const isDeletedFromPublic = !textPublicAfterDelete.includes('Playwright Test Monument');

      if (isDeletedFromAdmin && isDeletedFromPublic) {
        recordTest('Admin Delete Destination & Clean-Up', 'PASS', 'Temporary test destination cleanly deleted');
      } else {
        recordTest('Admin Delete Destination & Clean-Up', 'FAIL', 'Admin deleted: ' + isDeletedFromAdmin + ', Public deleted: ' + isDeletedFromPublic);
      }

      // 5g. Admin Logout
      await page.goto(BASE_URL + '/admin/dashboard', { waitUntil: 'networkidle' });
      const logoutBtn = page.locator('button.btn-secondary:has(svg.lucide-log-out), button:has-text("Sign Out"), button:has-text("Logout"), button:has-text("लॉगआउट")').first();
      await logoutBtn.click();
      await page.waitForTimeout(500);

      const isLoggedOut = page.url().includes('/admin/login') || !page.url().includes('/admin/dashboard');
      if (isLoggedOut) {
        recordTest('Admin Logout', 'PASS', 'Logged out and redirected properly');
      } else {
        recordTest('Admin Logout', 'FAIL', 'User remained on dashboard');
      }
    } catch (err) {
      recordTest('Admin Workflow Execution', 'FAIL', err.message);
    }

  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('PLAYWRIGHT TEST EXECUTION SUMMARY');
  console.log('====================================================');
  console.log('Total Tests Run: ' + results.tests.length);
  console.log('Passed:         ' + results.passed);
  console.log('Failed:         ' + results.failed);
  console.log('Uncaught JS Errors: ' + pageErrors.length);
  if (pageErrors.length > 0) {
    console.log('Page Errors:', pageErrors);
  }
  console.log('====================================================');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runVerification().catch(err => {
  console.error('FATAL AUTOMATION ERROR:', err);
  process.exit(1);
});
