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
