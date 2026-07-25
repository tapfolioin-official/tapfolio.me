import sitemap from '@/app/sitemap';

export const INDEXNOW_KEY = 'c04d18a813124e1c94e04e6551583ffe';
export const DEFAULT_HOST = 'www.tapfolio.me';

/**
 * Submits a list of absolute URLs to IndexNow.
 * Extracts the hostname from the first URL to use as the "host" field in the IndexNow payload.
 */
export async function submitToIndexNow(urls: string[]) {
  if (!urls || urls.length === 0) {
    return { success: false, message: 'No URLs provided' };
  }

  try {
    // Standardize all URLs. If any URL is relative (starts with '/'), prepend the site domain.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tapfolio.me';
    const absoluteUrls = urls.map(url => {
      if (url.startsWith('/')) {
        return `${siteUrl}${url}`;
      }
      return url;
    });

    const firstUrl = new URL(absoluteUrls[0]);
    const host = firstUrl.hostname;

    const payload = {
      host,
      key: INDEXNOW_KEY,
      urlList: absoluteUrls,
    };

    console.log(`[IndexNow] Submitting ${absoluteUrls.length} URLs for host ${host}...`);

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      console.log(`[IndexNow] Submission successful (200 OK)`);
      return { success: true, status: 200, message: 'URLs submitted successfully' };
    } else if (response.status === 202) {
      console.log(`[IndexNow] Submission accepted (202 Accepted); key verification pending`);
      return { success: true, status: 202, message: 'URLs received; key verification pending' };
    } else {
      const text = await response.text();
      console.error(`[IndexNow] Submission failed with status ${response.status}: ${text}`);
      return { success: false, status: response.status, message: text || `HTTP ${response.status}` };
    }
  } catch (error: any) {
    console.error('[IndexNow] Error submitting to IndexNow:', error);
    return { success: false, error: error.message || error };
  }
}

/**
 * Fetches the entire site map and submits all active URLs to IndexNow in a batch.
 */
export async function submitSitemapToIndexNow() {
  try {
    console.log('[IndexNow] Fetching sitemap for submission...');
    const sitemapEntries = await sitemap();
    const urls = sitemapEntries.map(entry => entry.url);
    console.log(`[IndexNow] Found ${urls.length} URLs in sitemap`);
    return await submitToIndexNow(urls);
  } catch (error: any) {
    console.error('[IndexNow] Error submitting sitemap:', error);
    return { success: false, error: error.message || error };
  }
}
