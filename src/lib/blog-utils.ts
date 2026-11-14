/**
 * Pure client-safe blog helper utilities (No DB / Node dependencies)
 */

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadingTime(content: string): string {
  if (!content) return '1 min read';
  const clean = content.replace(/<[^>]*>/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function countWords(content: string): number {
  if (!content) return 0;
  const clean = content.replace(/<[^>]*>/g, ' ');
  return clean.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Resolves any blog image reference into a valid database-driven image endpoint or public URL.
 * Handles:
 * 1. Database image UUID: e.g. "c7b39c0f-..." -> "/api/blog/images/c7b39c0f-..."
 * 2. API image route: e.g. "/api/blog/images/..." -> unchanged
 * 3. External HTTP URL: e.g. "https://..." -> unchanged
 * 4. Legacy path: e.g. "/assets/blog/xyz.png" -> "/api/blog/images/xyz.png"
 * 5. Fallback if empty
 */
export function resolveBlogImageUrl(featuredImage?: string | null, slug?: string | null): string {
  if (!featuredImage || !featuredImage.trim()) {
    return '/tapfolio_logo.png';
  }

  const trimmed = featuredImage.trim();

  // Database UUID pattern
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
    return `/api/blog/images/${trimmed}`;
  }

  // Already an API image route
  if (trimmed.startsWith('/api/blog/images/')) {
    return trimmed;
  }

  // External absolute URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a legacy /assets/blog/... path, extract basename and route through database API
  if (trimmed.startsWith('/assets/blog/')) {
    const filename = trimmed.replace('/assets/blog/uploads/', '').replace('/assets/blog/', '');
    return `/api/blog/images/${filename}`;
  }

  return trimmed.startsWith('/') ? trimmed : `/api/blog/images/${trimmed}`;
}
