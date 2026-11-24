/**
 * Utility for parsing and normalizing project tags and experience technologies.
 * Handles messy legacy data like:
 * - '[&quot;Node.js&quot;, &quot;Express&quot;]'
 * - '["React", "Tailwind CSS"]'
 * - 'React, Next.js, MySQL'
 *
 * Always returns clean arrays or clean comma-separated strings without brackets or HTML entities.
 */

export function cleanTagsList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => cleanTagsList(item))
      .flat()
      .filter(Boolean);
  }

  if (typeof raw !== 'string') return [];

  // 1. Unescape HTML entities
  let clean = raw
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // 2. If it's valid JSON array
  if (clean.trim().startsWith('[') && clean.trim().endsWith(']')) {
    try {
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed)) {
        return parsed
          .map((s) => String(s).replace(/^["'\[\]]+|["'\[\]]+$/g, '').trim())
          .filter(Boolean);
      }
    } catch (e) {
      // JSON parse failed, proceed to fallback cleaning
    }
  }

  // 3. Strip any remaining brackets and quotes
  return clean
    .replace(/[\[\]"]/g, '')
    .split(',')
    .map((s) => s.replace(/^["'\[\]]+|["'\[\]]+$/g, '').trim())
    .filter(Boolean);
}

export function cleanTagsToString(raw) {
  const list = cleanTagsList(raw);
  return list.join(', ');
}
