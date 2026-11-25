import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// 5. REQUIRE ADMIN CREDENTIALS VIA ENVIRONMENT VARIABLES ONLY
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('CRITICAL CONFIGURATION ERROR: ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required.');
  console.error('Set them before running: $env:ADMIN_USERNAME="admin"; $env:ADMIN_PASSWORD="..."; node scripts/e2e_gap_verification.js');
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

async function runGapVerification() {
  console.log('====================================================');
  console.log('EXPLORE UDGIR - PLAYWRIGHT FINAL GAP VERIFICATION');
  console.log('====================================================');
  console.log('Target URL: ' + BASE_URL);
  console.log('Admin Username: ' + ADMIN_USERNAME + ' (Loaded from environment variable)');
  console.log('Admin Password: [PROTECTED] (Length: ' + ADMIN_PASSWORD.length + ' chars, from env)');

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
    // 1. STRENGTHENED SEARCH TEST - VERIFY UNRELATED RESULTS DISAPPEAR (TASK 1)
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing Search Filter & Unrelated Results Disappearance ---');
    try {
      await page.goto(BASE_URL + '/places', { waitUntil: 'networkidle' });
      await page.waitForSelector('input[placeholder*="Search"], input[placeholder*="शोधा"]');
      const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="शोधा"]');

      // 1a. Search for "Buddha"
      await searchInput.fill('Buddha');
      await page.waitForTimeout(600);

      const titlesBuddha = await page.locator('.place-card .place-card-title').allTextContents();
      const hasBuddha = titlesBuddha.some(t => t.includes('Buddha') || t.includes('बुद्ध'));
      const hasUdgirFort = titlesBuddha.some(t => t.includes('Udgir Fort'));
      const hasAusaFort = titlesBuddha.some(t => t.includes('Ausa Fort'));
      const hasHattibet = titlesBuddha.some(t => t.includes('Hattibet'));
      const hasKharosa = titlesBuddha.some(t => t.includes('Kharosa'));

      if (hasBuddha && !hasUdgirFort && !hasAusaFort && !hasHattibet && !hasKharosa && titlesBuddha.length === 1) {
        recordTest('Search "Buddha" - Unrelated results disappear', 'PASS', `Exact 1 result: "${titlesBuddha[0]}"; Forts, Hattibet, Kharosa completely absent`);
      } else {
        recordTest('Search "Buddha" - Unrelated results disappear', 'FAIL', `Count: ${titlesBuddha.length}, Titles: ${titlesBuddha.join(', ')}`);
      }

      // 1b. Search for "Fort"
      await searchInput.fill('Fort');
      await page.waitForTimeout(600);

      const titlesFort = await page.locator('.place-card .place-card-title').allTextContents();
      const fortHasUdgir = titlesFort.some(t => t.includes('Udgir Fort'));
      const fortHasAusa = titlesFort.some(t => t.includes('Ausa Fort'));
      const fortHasBuddha = titlesFort.some(t => t.includes('Buddha') || t.includes('बुद्ध'));
      const fortHasTemple = titlesFort.some(t => t.includes('Dudhiya Hanuman'));

      if (fortHasUdgir && fortHasAusa && !fortHasBuddha && !fortHasTemple) {
        recordTest('Search "Fort" - Non-fort destinations disappear', 'PASS', `Fort matches present: [${titlesFort.join(', ')}]; Buddha Vihar and Temples completely absent`);
      } else {
        recordTest('Search "Fort" - Non-fort destinations disappear', 'FAIL', `Count: ${titlesFort.length}, Titles: ${titlesFort.join(', ')}`);
      }

      // 1c. Clear search -> verify full restoration of all 11 destinations
      await searchInput.fill('');
      await page.waitForTimeout(500);
      const titlesRestored = await page.locator('.place-card .place-card-title').allTextContents();

      if (titlesRestored.length === 11) {
        recordTest('Search Clear - All 11 destinations restored', 'PASS', `All ${titlesRestored.length} authentic destinations restored`);
      } else {
        recordTest('Search Clear - All 11 destinations restored', 'FAIL', `Expected 11, found ${titlesRestored.length}`);
      }
    } catch (err) {
      recordTest('Search Filter Verification', 'FAIL', err.message);
    }

    // -------------------------------------------------------------------------
    // 2. MOBILE NAVIGATION DRAWER ACTUAL OPEN & CLOSE (TASK 3)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Mobile Navigation Drawer Open & Close Mechanics ---');
    try {
      await page.setViewportSize({ width: 360, height: 640 });
      await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });

      // Before opening: drawer must NOT be open/visible
      const isInitiallyOpen = await page.locator('.nav-drawer.open').isVisible().catch(() => false);
      if (!isInitiallyOpen) {
        recordTest('Mobile Drawer Initial State', 'PASS', 'Drawer is closed initially');
      } else {
        recordTest('Mobile Drawer Initial State', 'FAIL', 'Drawer is unexpectedly open on page load');
      }

      // Click Hamburger button to open
      const menuBtn = page.locator('button.mobile-menu-btn');
      await menuBtn.click();
      await page.waitForTimeout(400);

      const isOpenVisible = await page.locator('.nav-drawer.open').isVisible();
      const backdropVisible = await page.locator('.nav-backdrop').isVisible();
      const navLinksCount = await page.locator('.drawer-links a').count();

      if (isOpenVisible && backdropVisible && navLinksCount >= 7) {
        recordTest('Mobile Drawer Open via Hamburger', 'PASS', `Drawer open with backdrop and ${navLinksCount} navigation links`);
      } else {
        recordTest('Mobile Drawer Open via Hamburger', 'FAIL', `Drawer: ${isOpenVisible}, Backdrop: ${backdropVisible}, Links: ${navLinksCount}`);
      }

      // Click Close button (X) inside drawer
      const closeBtn = page.locator('.drawer-close-btn');
      await closeBtn.click();
      await page.waitForTimeout(400);

      const isDrawerVisibleAfterClose = await page.locator('.nav-drawer.open').isVisible().catch(() => false);
      if (!isDrawerVisibleAfterClose) {
        recordTest('Mobile Drawer Close via Close Button', 'PASS', 'Drawer closed cleanly when clicking close button');
      } else {
        recordTest('Mobile Drawer Close via Close Button', 'FAIL', 'Drawer remained visible after clicking close button');
      }

      // Re-open and verify closing on navigation link click
      await menuBtn.click();
      await page.waitForTimeout(400);
      const placesLink = page.locator('.drawer-links a[href="/places"]').first();
      await placesLink.click();
      await page.waitForTimeout(600);

      const isDrawerVisibleAfterNav = await page.locator('.nav-drawer.open').isVisible().catch(() => false);
      const isUrlPlaces = page.url().includes('/places');

      if (!isDrawerVisibleAfterNav && isUrlPlaces) {
        recordTest('Mobile Drawer Close via Link Navigation', 'PASS', 'Drawer automatically closed upon selecting /places route');
      } else {
        recordTest('Mobile Drawer Close via Link Navigation', 'FAIL', `Drawer visible: ${isDrawerVisibleAfterNav}, URL: ${page.url()}`);
      }
    } catch (err) {
      recordTest('Mobile Drawer Mechanics', 'FAIL', err.message);
    }

    // Reset viewport to desktop standard
    await page.setViewportSize({ width: 1366, height: 768 });

    // -------------------------------------------------------------------------
    // 3. COMPREHENSIVE BILINGUAL CONTENT VERIFICATION (TASK 4)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing English & Marathi Content Across All Public Pages ---');

    const publicPages = [
      {
        path: '/',
        name: 'Home',
        en: ['Explore Udgir', 'Discover the Timeless Splendor', 'Featured Destinations'],
        mr: ['एक्सप्लोर उदगीर', 'उदगीरचा ऐतिहासिक आणि सांस्कृतिक वारसा', 'प्रमुख वैशिष्ट्यपूर्ण स्थळे']
      },
      {
        path: '/places',
        name: 'Places Directory',
        en: ['Discover Destinations in Udgir', 'All Categories', 'All Locations'],
        mr: ['उदगीर आणि परिसरातील पर्यटन स्थळे', 'सर्व विभाग', 'सर्व ठिकाणे']
      },
      {
        path: '/places/udgir-fort',
        name: 'Place Detail (Udgir Fort)',
        en: ['Udgir Fort', 'Destination Overview', 'Historical Background'],
        mr: ['उदगीर किल्ला', 'ऐतिहासिक पार्श्वभूमी']
      },
      {
        path: '/history',
        name: 'Historical Heritage',
        en: ['History & Heritage of Udgir', 'The Battle of Udgir (1760)', 'Sadashivrao Bhau'],
        mr: ['उदगीरचा इतिहास व वारसा', 'उदगीरची ऐतिहासिक लढाई']
      },
      {
        path: '/food-culture',
        name: 'Food & Culture',
        en: ['Food & Living Culture', 'Jowar Bhakri', 'Pithla & Zunka'],
        mr: ['खाद्यसंस्कृती आणि लोकजीवन', 'ज्वारीची भाकरी']
      },
      {
        path: '/hotels',
        name: 'Hotels & Dining',
        en: ['Restaurants & Hotels in Udgir', 'Restaurants (16)', 'Hotels & Lodges'],
        mr: ['उदगीरमधील रेस्टॉरंट्स व हॉटेल्स', 'रेस्टॉरंट्स (१६)', 'हॉटेल्स व लॉजेस']
      },
      {
        path: '/map',
        name: 'Interactive Map',
        en: ['Interactive Tourism Map', 'Show My Location'],
        mr: ['परस्परसंवादी पर्यटन नकाशा', 'माझे सध्याचे स्थान दाखवा']
      },
      {
        path: '/itineraries',
        name: 'Curated Itineraries',
        en: ['Suggested Travel Itineraries', 'Trip Itineraries'],
        mr: ['प्रवास नियोजन आराखडे', 'प्रवास नियोजन']
      },
      {
        path: '/gallery',
        name: 'Photo Gallery',
        en: ['Explore Udgir Photo Gallery', 'Udgir Fort'],
        mr: ['छायाचित्र दालन', 'उदगीर किल्ला']
      },
      {
        path: '/about-contact',
        name: 'About & Contact',
        en: ['About Explore Udgir & Contact Us', 'Anuradha Biradar', 'Send a Tourism Inquiry'],
        mr: ['माहिती व संपर्क', 'अनुराधा बिरादार', 'चौकशी संदेश पाठवा']
      }
    ];

    // English Pass
    for (const pg of publicPages) {
      try {
        await page.goto(BASE_URL + pg.path, { waitUntil: 'networkidle' });
        const bodyEn = await page.textContent('body');
        const missingEn = pg.en.filter(phrase => !bodyEn.toLowerCase().includes(phrase.toLowerCase()));

        if (missingEn.length === 0) {
          recordTest(`English Content: ${pg.name} (${pg.path})`, 'PASS', `Verified anchors: ${pg.en.join(' | ')}`);
        } else {
          recordTest(`English Content: ${pg.name} (${pg.path})`, 'FAIL', `Missing: ${missingEn.join(', ')}`);
        }
      } catch (err) {
        recordTest(`English Content: ${pg.name}`, 'FAIL', err.message);
      }
    }

    // Switch language to Marathi
    await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
    const mrLangBtn = page.locator('.lang-toggle.desktop-lang button:has-text("मराठी")');
    await mrLangBtn.click();
    await page.waitForTimeout(500);

    // Marathi Pass
    for (const pg of publicPages) {
      try {
        await page.goto(BASE_URL + pg.path, { waitUntil: 'networkidle' });
        const bodyMr = await page.textContent('body');
        const missingMr = pg.mr.filter(phrase => !bodyMr.includes(phrase));

        if (missingMr.length === 0) {
          recordTest(`Marathi Content: ${pg.name} (${pg.path})`, 'PASS', `Verified Marathi anchors: ${pg.mr.join(' | ')}`);
        } else {
          recordTest(`Marathi Content: ${pg.name} (${pg.path})`, 'FAIL', `Missing: ${missingMr.join(', ')}`);
        }
      } catch (err) {
        recordTest(`Marathi Content: ${pg.name}`, 'FAIL', err.message);
      }
    }

    // Switch back to English
    const enLangBtn = page.locator('.lang-toggle.desktop-lang button:has-text("EN")');
    if (await enLangBtn.isVisible()) {
      await enLangBtn.click();
      await page.waitForTimeout(400);
    }

    // -------------------------------------------------------------------------
    // 4. EDITED DESTINATION PERSISTENCE AFTER HARD RELOAD (TASK 2)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Edited Destination Persistence After Page Reload ---');
    const testSlug = 'persistence-verification-site';
    const originalTagline = 'Original Tagline Prior to Update';
    const updatedTagline = 'Persisted Tagline After Hard Reload 2026';

    try {
      // 4a. Login using ENV CREDENTIALS
      await page.goto(BASE_URL + '/admin/login', { waitUntil: 'networkidle' });
      await page.locator('input[type="text"]').fill(ADMIN_USERNAME);
      await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

      // 4b. Add temporary destination
      const addBtn = page.locator('button.btn-primary:has(svg.lucide-plus), button:has-text("Add New Destination"), button:has-text("नवीन स्थळ जोडा")').first();
      await addBtn.click();
      await page.waitForTimeout(400);

      // Tab 1: Basic
      await page.locator('input[placeholder*="udgir-fort"]').fill(testSlug);
      await page.locator('input[placeholder*="Udgir Fort"]').fill('Persistence Test Site');
      await page.locator('input[placeholder*="उदगीर किल्ला"]').fill('स्थायित्व चाचणी स्थळ');
      await page.locator('input[placeholder*="Historic land fort"]').fill(originalTagline);
      await page.locator('input[placeholder*="ऐतिहासिक लढाईचा"]').fill('मूळ मराठी घोषवाक्य');

      // Tab 2: Content
      const contentTabBtn = page.locator('button:has-text("2. Descriptions"), button:has-text("२. वर्णन")');
      await contentTabBtn.click();
      await page.waitForTimeout(200);
      await page.locator('textarea[placeholder*="Comprehensive description"]').fill('Description verifying database persistence after reload.');
      await page.locator('textarea[placeholder*="पर्यटन स्थळाचे"]').fill('पुनः लोड केल्यानंतर डेटाबेस स्थायित्व तपासणारे वर्णन.');

      // Tab 3: Location
      const locationTabBtn = page.locator('button:has-text("3. Location"), button:has-text("३. स्थान")');
      await locationTabBtn.click();
      await page.waitForTimeout(200);
      await page.locator('input[placeholder*="Fort Road, Near Gandhi"]').fill('Station Road, Udgir, Maharashtra 413517');
      await page.locator('input[placeholder*="किल्ला रस्ता, गांधी"]').fill('स्टेशन रस्ता, उदगीर, महाराष्ट्र ४१३५१७');

      // Submit Form
      await page.locator('button[form="place-form"][type="submit"]').click();
      await page.waitForTimeout(2000);

      // 4c. Edit the destination to new tagline
      const editBtn = page.locator('tr:has-text("Persistence Test Site") button:has(svg.lucide-edit), tr:has-text("Persistence Test Site") button:has-text("Edit"), tr:has-text("Persistence Test Site") button:has-text("संपादित करा")').first();
      await editBtn.click();
      await page.waitForTimeout(500);

      const taglineInput = page.locator('input[placeholder*="Historic land fort"]');
      await taglineInput.fill(updatedTagline);
      await page.locator('button[form="place-form"][type="submit"]').click();
      await page.waitForTimeout(2000);

      // 4d. PERFORM HARD PAGE RELOAD
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Inspect edit modal again after reload to verify value persisted from DB
      const editBtnAfterReload = page.locator('tr:has-text("Persistence Test Site") button:has(svg.lucide-edit), tr:has-text("Persistence Test Site") button:has-text("Edit"), tr:has-text("Persistence Test Site") button:has-text("संपादित करा")').first();
      await editBtnAfterReload.click();
      await page.waitForTimeout(500);

      const loadedTagline = await page.locator('input[placeholder*="Historic land fort"]').inputValue();
      const isTaglinePersistedInAdmin = loadedTagline === updatedTagline;

      // Close modal
      await page.locator('.btn-secondary:has-text("Cancel"), .btn-secondary:has-text("रद्द करा")').first().click();
      await page.waitForTimeout(400);

      // 4e. Verify tagline on public place detail page where tagline is rendered as subtitle
      await page.goto(BASE_URL + '/places/' + testSlug, { waitUntil: 'networkidle' });
      const detailContent = await page.textContent('body');
      const isTaglineOnPublic = detailContent.includes(updatedTagline);

      if (isTaglinePersistedInAdmin && isTaglineOnPublic) {
        recordTest('Edited Destination Tagline Persists After Reload', 'PASS', `Tagline "${updatedTagline}" verified in Admin edit form and public /places/${testSlug} hero after hard reload`);
      } else {
        recordTest('Edited Destination Tagline Persists After Reload', 'FAIL', `Admin loaded: "${loadedTagline}", Public has tagline: ${isTaglineOnPublic}`);
      }

      // 4f. Cleanup: Delete the temporary persistence destination
      await page.goto(BASE_URL + '/admin/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const delBtn = page.locator('tr:has-text("Persistence Test Site") button:has(svg.lucide-trash-2), tr:has-text("Persistence Test Site") button[title*="Delete"]').first();
      await delBtn.click();
      await page.waitForTimeout(300);
      await page.locator('tr:has-text("Persistence Test Site") button:has-text("Confirm")').first().click();
      await page.waitForTimeout(1500);

      // Verify deletion from both admin and public
      const adminAfterDelete = await page.textContent('body');
      const isCleanedUpAdmin = !adminAfterDelete.includes('Persistence Test Site');

      await page.goto(BASE_URL + '/places/' + testSlug, { waitUntil: 'networkidle' });
      const publicAfterDelete = await page.textContent('body');
      const isCleanedUpPublic = publicAfterDelete.includes('Destination Not Found') || publicAfterDelete.includes('पर्यटन स्थळ आढळले नाही');

      if (isCleanedUpAdmin && isCleanedUpPublic) {
        recordTest('Cleanup of Persistence Test Destination', 'PASS', 'Temporary persistence record cleanly deleted from database');
      } else {
        recordTest('Cleanup of Persistence Test Destination', 'FAIL', `Admin cleaned: ${isCleanedUpAdmin}, Public 404: ${isCleanedUpPublic}`);
      }

      // Logout
      await page.goto(BASE_URL + '/admin/dashboard', { waitUntil: 'networkidle' });
      const logoutBtn = page.locator('button.btn-secondary:has(svg.lucide-log-out), button:has-text("Sign Out"), button:has-text("Logout"), button:has-text("लॉगआउट")').first();
      await logoutBtn.click();
      await page.waitForTimeout(400);

    } catch (err) {
      recordTest('Destination Persistence Lifecycle', 'FAIL', err.message);
    }

  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('GAP VERIFICATION TEST EXECUTION SUMMARY');
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

runGapVerification().catch(err => {
  console.error('FATAL GAP VERIFICATION ERROR:', err);
  process.exit(1);
});
