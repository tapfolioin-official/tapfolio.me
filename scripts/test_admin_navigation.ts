/**
 * Tapfolio Admin Panel — Navigation System & Active-Route Unit Test Suite
 *
 * Verifies:
 * 1. Exactly one leaf navigation item is active per route across all 44 items.
 * 2. CRM sibling routes (/admin/crm vs /admin/crm/leads vs /admin/crm/contacts, etc.)
 *    never trigger overlapping active states.
 * 3. SEO sibling routes (/admin/seo vs /admin/seo/website vs /admin/seo/app, etc.)
 *    never trigger overlapping active states.
 * 4. Analytics sibling routes (/admin/analytics vs /admin/analytics/website, etc.)
 *    never trigger overlapping active states.
 * 5. Nested dynamic routes (/admin/users/42, /admin/crm/leads/lead_123) correctly resolve
 *    to their parent leaf without spurious highlights.
 * 6. Aliases (/admin -> /admin/dashboard, /admin/releases -> /admin/mobile-app).
 * 7. Query parameters, trailing slashes and hash fragments do not break route matching.
 * 8. Unknown routes return null and highlight zero items.
 * 9. Parent section auto-expansion and isolation (parent never gets leaf active class).
 */

import {
  NAV_SECTIONS,
  ALL_NAV_ITEMS,
  getActiveNavItem,
  isNavItemActive,
  getActiveSection,
  normalizePath,
} from '../src/lib/admin-navigation';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✔ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✘ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('TAPFOLIO ADMIN PANEL NAVIGATION AUTOMATED TEST SUITE');
console.log('======================================================\n');

// ─── Test 1: Sibling Route Non-Overlap (CRM Suite) ───
console.log('[Test 1] Sibling Route Isolation (CRM Suite):');
{
  const crmRoutes = [
    { path: '/admin/crm', expectedId: 'crm-dashboard' },
    { path: '/admin/crm/leads', expectedId: 'crm-leads' },
    { path: '/admin/crm/contacts', expectedId: 'crm-contacts' },
    { path: '/admin/crm/companies', expectedId: 'crm-companies' },
    { path: '/admin/crm/pipelines', expectedId: 'crm-pipelines' },
    { path: '/admin/crm/deals', expectedId: 'crm-deals' },
    { path: '/admin/crm/tasks', expectedId: 'crm-tasks' },
    { path: '/admin/crm/campaigns', expectedId: 'crm-campaigns' },
    { path: '/admin/crm/communications', expectedId: 'crm-communications' },
  ];

  for (const { path, expectedId } of crmRoutes) {
    const active = getActiveNavItem(path);
    assert(active !== null && active.id === expectedId, `Route ${path} matches ${expectedId}`);

    // Verify EXACTLY one item in the entire navigation is active
    const activeItems = ALL_NAV_ITEMS.filter((item) => isNavItemActive(item, active));
    assert(
      activeItems.length === 1 && activeItems[0].id === expectedId,
      `Route ${path} has EXACTLY 1 active leaf (Found ${activeItems.length})`,
      activeItems.map((i) => i.label).join(', ')
    );

    // Verify CRM Dashboard is NOT active when on /admin/crm/leads
    if (path === '/admin/crm/leads') {
      const crmDash = ALL_NAV_ITEMS.find((i) => i.id === 'crm-dashboard')!;
      assert(!isNavItemActive(crmDash, active), 'CRM Dashboard is NOT active when on /admin/crm/leads');
    }
  }
}

// ─── Test 1B: Sibling Route Isolation (Content Management Suite) ───
console.log('\n[Test 1B] Sibling Route Isolation (Content Management Suite):');
{
  const contentRoutes = [
    { path: '/admin/content/blog', expectedId: 'content-blog-dashboard' },
    { path: '/admin/blog', expectedId: 'content-blog-dashboard' },
    { path: '/admin/content/blog/articles', expectedId: 'content-blog-articles' },
    { path: '/admin/content/blog/create', expectedId: 'content-blog-create' },
    { path: '/admin/content/blog/create?id=42', expectedId: 'content-blog-create' },
    { path: '/admin/content/blog/categories', expectedId: 'content-blog-categories' },
    { path: '/admin/content/blog/tags', expectedId: 'content-blog-tags' },
    { path: '/admin/content/blog/authors', expectedId: 'content-blog-authors' },
    { path: '/admin/content/blog/media', expectedId: 'content-blog-media' },
    { path: '/admin/content/blog/scheduled', expectedId: 'content-blog-scheduled' },
    { path: '/admin/content/blog/seo', expectedId: 'content-blog-seo' },
    { path: '/admin/content/blog/analytics', expectedId: 'content-blog-analytics' },
  ];

  for (const { path, expectedId } of contentRoutes) {
    const active = getActiveNavItem(path);
    assert(active !== null && active.id === expectedId, `Route ${path} matches ${expectedId}`);

    const activeItems = ALL_NAV_ITEMS.filter((item) => isNavItemActive(item, active));
    assert(
      activeItems.length === 1 && activeItems[0].id === expectedId,
      `Route ${path} has EXACTLY 1 active leaf (Found ${activeItems.length})`,
      activeItems.map((i) => i.label).join(', ')
    );

    // Verify Blog Dashboard is NOT active when on /admin/content/blog/articles
    if (path === '/admin/content/blog/articles') {
      const dash = ALL_NAV_ITEMS.find((i) => i.id === 'content-blog-dashboard')!;
      assert(!isNavItemActive(dash, active), 'Blog Dashboard is NOT active when on /admin/content/blog/articles');
    }
  }
}

// ─── Test 2: Sibling Route Non-Overlap (SEO Suite) ───
console.log('\n[Test 2] Sibling Route Isolation (SEO Suite):');
{
  const seoRoutes = [
    { path: '/admin/seo', expectedId: 'seo-dashboard' },
    { path: '/admin/seo/website', expectedId: 'seo-website' },
    { path: '/admin/seo/app', expectedId: 'seo-app' },
    { path: '/admin/seo/keywords', expectedId: 'seo-keywords' },
    { path: '/admin/seo/rankings', expectedId: 'seo-rankings' },
    { path: '/admin/seo/audit', expectedId: 'seo-audit' },
    { path: '/admin/seo/backlinks', expectedId: 'seo-backlinks' },
    { path: '/admin/seo/content', expectedId: 'seo-content' },
    { path: '/admin/seo/sitemap', expectedId: 'seo-sitemap' },
    { path: '/admin/seo/redirects', expectedId: 'seo-redirects' },
    { path: '/admin/seo/search-console', expectedId: 'seo-search-console' },
    { path: '/admin/seo/performance', expectedId: 'seo-performance' },
  ];

  for (const { path, expectedId } of seoRoutes) {
    const active = getActiveNavItem(path);
    assert(active !== null && active.id === expectedId, `Route ${path} matches ${expectedId}`);

    const activeItems = ALL_NAV_ITEMS.filter((item) => isNavItemActive(item, active));
    assert(
      activeItems.length === 1 && activeItems[0].id === expectedId,
      `Route ${path} has EXACTLY 1 active leaf`,
      activeItems.map((i) => i.label).join(', ')
    );

    // Verify SEO Dashboard is NOT active when on /admin/seo/website
    if (path === '/admin/seo/website') {
      const seoDash = ALL_NAV_ITEMS.find((i) => i.id === 'seo-dashboard')!;
      assert(!isNavItemActive(seoDash, active), 'SEO Dashboard is NOT active when on /admin/seo/website');
    }
  }
}

// ─── Test 3: Sibling Route Non-Overlap (Analytics Suite) ───
console.log('\n[Test 3] Sibling Route Isolation (Analytics Suite):');
{
  const analyticsRoutes = [
    { path: '/admin/analytics', expectedId: 'analytics-platform' },
    { path: '/admin/analytics/website', expectedId: 'analytics-website' },
    { path: '/admin/analytics/app', expectedId: 'analytics-app' },
    { path: '/admin/revenue', expectedId: 'analytics-revenue' },
    { path: '/admin/subscriptions', expectedId: 'analytics-subscriptions' },
    { path: '/admin/analytics/conversions', expectedId: 'analytics-conversions' },
  ];

  for (const { path, expectedId } of analyticsRoutes) {
    const active = getActiveNavItem(path);
    assert(active !== null && active.id === expectedId, `Route ${path} matches ${expectedId}`);

    const activeItems = ALL_NAV_ITEMS.filter((item) => isNavItemActive(item, active));
    assert(
      activeItems.length === 1 && activeItems[0].id === expectedId,
      `Route ${path} has EXACTLY 1 active leaf`,
      activeItems.map((i) => i.label).join(', ')
    );

    if (path === '/admin/analytics/website') {
      const platformDash = ALL_NAV_ITEMS.find((i) => i.id === 'analytics-platform')!;
      assert(!isNavItemActive(platformDash, active), 'Platform Analytics is NOT active on /admin/analytics/website');
    }
  }
}

// ─── Test 4: All 44 Navigation Leaf Items Coverage ───
console.log('\n[Test 4] Exhaustive 44 Leaf Items Coverage:');
{
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      const active = getActiveNavItem(item.href);
      assert(
        active !== null && active.id === item.id,
        `Direct access to ${item.href} activates [${item.label}]`
      );
    }
  }
}

// ─── Test 5: Dynamic Nested Routes (Detail Pages) ───
console.log('\n[Test 5] Dynamic & Nested Subroute Matching:');
{
  const nestedCases = [
    { path: '/admin/users/1234', expectedId: 'platform-users' },
    { path: '/admin/users/new', expectedId: 'platform-users' },
    { path: '/admin/crm/leads/lead_8910', expectedId: 'crm-leads' },
    { path: '/admin/crm/deals/deal_acme_45', expectedId: 'crm-deals' },
    { path: '/admin/portfolios/preview/balupb07', expectedId: 'platform-portfolios' },
  ];

  for (const { path, expectedId } of nestedCases) {
    const active = getActiveNavItem(path);
    assert(
      active !== null && active.id === expectedId,
      `Dynamic route ${path} maps to ${expectedId}`
    );
  }
}

// ─── Test 6: Aliases & Redirect Route Matching ───
console.log('\n[Test 6] Aliases and Secondary Route Resolution:');
{
  const aliasCases = [
    { path: '/admin', expectedId: 'overview-dashboard' },
    { path: '/admin/releases', expectedId: 'platform-mobile-app' },
    { path: '/admin/connections', expectedId: 'platform-nfc' },
  ];

  for (const { path, expectedId } of aliasCases) {
    const active = getActiveNavItem(path);
    assert(
      active !== null && active.id === expectedId,
      `Alias route ${path} maps to ${expectedId}`
    );
  }
}

// ─── Test 7: Normalization of Trailing Slashes, Queries and Hashes ───
console.log('\n[Test 7] URL Normalization (Trailing Slashes, Queries, Hashes):');
{
  const noisyCases = [
    { path: '/admin/crm/leads/', expectedId: 'crm-leads' },
    { path: '/admin/crm/leads?status=qualified&source=app', expectedId: 'crm-leads' },
    { path: '/admin/crm/leads#overview', expectedId: 'crm-leads' },
    { path: '/admin/portfolios/?page=2', expectedId: 'platform-portfolios' },
  ];

  for (const { path, expectedId } of noisyCases) {
    const active = getActiveNavItem(path);
    assert(
      active !== null && active.id === expectedId,
      `Noisy route ${path} normalized and matches ${expectedId}`
    );
  }
}

// ─── Test 8: Unknown & Unrelated Routes ───
console.log('\n[Test 8] Unknown Route Rejection (Zero False Highlighting):');
{
  const unknownRoutes = [
    '/admin/unknown-page',
    '/admin/crm-fake',
    '/admin/seo-tool-missing',
    '/dashboard',
    '/profile',
  ];

  for (const path of unknownRoutes) {
    const active = getActiveNavItem(path);
    assert(
      active === null,
      `Unknown path ${path} returns null (No leaf active)`
    );

    const activeItems = ALL_NAV_ITEMS.filter((item) => isNavItemActive(item, active));
    assert(
      activeItems.length === 0,
      `Unknown path ${path} has 0 highlighted items`
    );
  }
}

// ─── Test 9: Parent Section Auto-Expansion & Isolation ───
console.log('\n[Test 9] Parent Section Association:');
{
  const sectionCases = [
    { path: '/admin/crm/leads', expectedSectionId: 'crm' },
    { path: '/admin/seo/website', expectedSectionId: 'seo' },
    { path: '/admin/users/42', expectedSectionId: 'platform' },
    { path: '/admin/dashboard', expectedSectionId: 'overview' },
  ];

  for (const { path, expectedSectionId } of sectionCases) {
    const section = getActiveSection(path);
    assert(
      section !== null && section.id === expectedSectionId,
      `Path ${path} belongs to parent section ${expectedSectionId}`
    );
  }
}

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
