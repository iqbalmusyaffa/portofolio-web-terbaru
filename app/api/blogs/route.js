import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, sanitizeUrl, parseValidId } from '@/lib/security';
import { cleanTagsToString } from '@/lib/tagUtils';

export const dynamic = 'force-dynamic';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(request) {
  try {
    await ensureDatabaseAndTables();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    let sql = 'SELECT * FROM blogs';
    const params = [];
    const conditions = [];

    if (slug) {
      conditions.push('slug = ?');
      params.push(slug);
    }

    if (category && category !== 'Semua' && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY is_featured DESC, id DESC';

    const rows = await query(sql, params);
    if (rows && rows.length > 0) {
      return successResponse(rows);
    }

    // Fallback in-memory
    let fallbackBlogs = getFallbackData().blogs || [];
    if (slug) {
      fallbackBlogs = fallbackBlogs.filter(b => b.slug === slug);
    }
    if (category && category !== 'Semua' && category !== 'all') {
      fallbackBlogs = fallbackBlogs.filter(b => b.category === category);
    }
    return successResponse(fallbackBlogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    return successResponse(getFallbackData().blogs || []);
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const {
      title,
      title_en,
      slug,
      summary,
      summary_en,
      content,
      content_en,
      category = 'Backend Architecture',
      tags,
      image_url,
      read_time = '5 min read',
      published_at,
      is_featured = 0,
      is_published = 1
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return errorResponse('Judul artikel blog wajib diisi', 400);
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return errorResponse('Konten artikel blog wajib diisi', 400);
    }

    const cleanTitle = sanitizeString(title, 255);
    const cleanTitleEn = sanitizeString(title_en || '', 255);
    const generatedSlug = slugify(slug || cleanTitle) || `blog-${Date.now()}`;
    const cleanSummary = sanitizeString(summary || '', 1000) || cleanTitle;
    const cleanSummaryEn = sanitizeString(summary_en || '', 1000);
    const cleanCategory = sanitizeString(category, 100);
    const cleanImageUrl = sanitizeUrl(image_url || '', 500);
    const cleanReadTime = sanitizeString(read_time || '5 min read', 50);
    const cleanPublishedAt = sanitizeString(published_at || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), 100);
    const tagsStr = cleanTagsToString(tags);

    // Keep markdown content intact (just basic string type check)
    const validContent = typeof content === 'string' ? content : '';
    const validContentEn = typeof content_en === 'string' ? content_en : '';

    await ensureDatabaseAndTables();
    const result = await query(
      `INSERT INTO blogs (
        slug, title, title_en, summary, summary_en, content, content_en,
        category, tags, image_url, read_time, published_at, is_featured, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generatedSlug,
        cleanTitle,
        cleanTitleEn,
        cleanSummary,
        cleanSummaryEn,
        validContent,
        validContentEn,
        cleanCategory,
        tagsStr,
        cleanImageUrl,
        cleanReadTime,
        cleanPublishedAt,
        is_featured ? 1 : 0,
        is_published ? 1 : 0
      ]
    );

    const newBlog = {
      id: result?.insertId || Date.now(),
      slug: generatedSlug,
      title: cleanTitle,
      title_en: cleanTitleEn,
      summary: cleanSummary,
      summary_en: cleanSummaryEn,
      content: validContent,
      content_en: validContentEn,
      category: cleanCategory,
      tags: tagsStr,
      image_url: cleanImageUrl,
      read_time: cleanReadTime,
      published_at: cleanPublishedAt,
      is_featured: is_featured ? 1 : 0,
      is_published: is_published ? 1 : 0
    };

    if (getFallbackData().blogs) {
      getFallbackData().blogs.unshift(newBlog);
    }

    return successResponse(newBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    return errorResponse('Gagal menambahkan artikel blog: ' + err.message, 500);
  }
}

export async function PUT(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const id = parseValidId(body.id);
    const {
      title,
      title_en,
      slug,
      summary,
      summary_en,
      content,
      content_en,
      category = 'Backend Architecture',
      tags,
      image_url,
      read_time = '5 min read',
      published_at,
      is_featured = 0,
      is_published = 1
    } = body;

    if (!id || !title) {
      return errorResponse('ID dan judul artikel blog wajib diisi', 400);
    }

    const cleanTitle = sanitizeString(title, 255);
    const cleanTitleEn = sanitizeString(title_en || '', 255);
    const generatedSlug = slugify(slug || cleanTitle) || `blog-${id}`;
    const cleanSummary = sanitizeString(summary || '', 1000) || cleanTitle;
    const cleanSummaryEn = sanitizeString(summary_en || '', 1000);
    const cleanCategory = sanitizeString(category, 100);
    const cleanImageUrl = sanitizeUrl(image_url || '', 500);
    const cleanReadTime = sanitizeString(read_time || '5 min read', 50);
    const cleanPublishedAt = sanitizeString(published_at || '', 100);
    const tagsStr = cleanTagsToString(tags);

    const validContent = typeof content === 'string' ? content : '';
    const validContentEn = typeof content_en === 'string' ? content_en : '';

    await ensureDatabaseAndTables();
    await query(
      `UPDATE blogs SET
        slug = ?, title = ?, title_en = ?, summary = ?, summary_en = ?,
        content = ?, content_en = ?, category = ?, tags = ?, image_url = ?,
        read_time = ?, published_at = ?, is_featured = ?, is_published = ?
       WHERE id = ?`,
      [
        generatedSlug,
        cleanTitle,
        cleanTitleEn,
        cleanSummary,
        cleanSummaryEn,
        validContent,
        validContentEn,
        cleanCategory,
        tagsStr,
        cleanImageUrl,
        cleanReadTime,
        cleanPublishedAt,
        is_featured ? 1 : 0,
        is_published ? 1 : 0,
        id
      ]
    );

    const updatedBlog = {
      id,
      slug: generatedSlug,
      title: cleanTitle,
      title_en: cleanTitleEn,
      summary: cleanSummary,
      summary_en: cleanSummaryEn,
      content: validContent,
      content_en: validContentEn,
      category: cleanCategory,
      tags: tagsStr,
      image_url: cleanImageUrl,
      read_time: cleanReadTime,
      published_at: cleanPublishedAt,
      is_featured: is_featured ? 1 : 0,
      is_published: is_published ? 1 : 0
    };

    if (getFallbackData().blogs) {
      const list = getFallbackData().blogs;
      const idx = list.findIndex(b => b.id === id);
      if (idx !== -1) list[idx] = updatedBlog;
    }

    return successResponse(updatedBlog);
  } catch (err) {
    console.error('Error updating blog:', err);
    return errorResponse('Gagal memperbarui artikel blog: ' + err.message, 500);
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return errorResponse('ID blog tidak valid', 400);
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM blogs WHERE id = ?', [id]);

    if (getFallbackData().blogs) {
      getFallbackData().blogs = getFallbackData().blogs.filter(b => b.id !== id);
    }

    return successResponse({ id, deleted: true });
  } catch (err) {
    console.error('Error deleting blog:', err);
    return errorResponse('Gagal menghapus artikel blog', 500);
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { slug, id } = body;

    if (!slug && !id) {
      return errorResponse('Slug atau ID artikel wajib disertakan', 400);
    }

    await ensureDatabaseAndTables();

    let updatedClaps = 1;

    if (slug) {
      await query('UPDATE blogs SET claps = COALESCE(claps, 0) + 1 WHERE slug = ?', [slug]);
      const rows = await query('SELECT claps FROM blogs WHERE slug = ? LIMIT 1', [slug]);
      if (rows && rows.length > 0) {
        updatedClaps = rows[0].claps;
      }
    } else if (id) {
      const validId = parseValidId(id);
      await query('UPDATE blogs SET claps = COALESCE(claps, 0) + 1 WHERE id = ?', [validId]);
      const rows = await query('SELECT claps FROM blogs WHERE id = ? LIMIT 1', [validId]);
      if (rows && rows.length > 0) {
        updatedClaps = rows[0].claps;
      }
    }

    // In-memory fallback support
    if (getFallbackData().blogs) {
      const b = getFallbackData().blogs.find(item => item.slug === slug || item.id === id);
      if (b) {
        b.claps = (b.claps || 0) + 1;
        updatedClaps = b.claps;
      }
    }

    return successResponse({ claps: updatedClaps });
  } catch (err) {
    console.error('Error incrementing claps:', err);
    return errorResponse('Gagal menambahkan apresiasi', 500);
  }
}
