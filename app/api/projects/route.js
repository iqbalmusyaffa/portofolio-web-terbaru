import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, parseValidId } from '@/lib/security';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM projects ORDER BY featured DESC, id DESC');
    if (rows && rows.length > 0) {
      return successResponse(rows);
    }
    return successResponse(getFallbackData().projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return successResponse(getFallbackData().projects);
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, live_url, github_url, image_url, tags, featured = 0 } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return errorResponse('Judul proyek wajib diisi', 400);
    }

    const cleanTitle = sanitizeString(title, 200);
    const cleanDesc = sanitizeString(description || '', 3000);
    const cleanLiveUrl = sanitizeString(live_url || '', 500);
    const cleanGithubUrl = sanitizeString(github_url || '', 500);
    const cleanImageUrl = sanitizeString(image_url || '', 500);
    const tagsStr = typeof tags === 'string' ? sanitizeString(tags, 500) : JSON.stringify(tags || []);

    await ensureDatabaseAndTables();
    const result = await query(
      'INSERT INTO projects (title, description, live_url, github_url, image_url, tags, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cleanTitle, cleanDesc, cleanLiveUrl, cleanGithubUrl, cleanImageUrl, tagsStr, featured ? 1 : 0]
    );

    const newProj = {
      id: result?.insertId || Date.now(),
      title: cleanTitle,
      description: cleanDesc,
      live_url: cleanLiveUrl,
      github_url: cleanGithubUrl,
      image_url: cleanImageUrl,
      tags: tagsStr,
      featured: featured ? 1 : 0
    };
    getFallbackData().projects.unshift(newProj);

    return successResponse(newProj);
  } catch (err) {
    console.error('Error creating project:', err);
    return errorResponse('Gagal menambahkan proyek', 500);
  }
}

export async function PUT(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const id = parseValidId(body.id);
    const { title, description, live_url, github_url, image_url, tags, featured = 0 } = body;

    if (!id || !title) {
      return errorResponse('ID dan judul proyek wajib diisi', 400);
    }

    const cleanTitle = sanitizeString(title, 200);
    const cleanDesc = sanitizeString(description || '', 3000);
    const cleanLiveUrl = sanitizeString(live_url || '', 500);
    const cleanGithubUrl = sanitizeString(github_url || '', 500);
    const cleanImageUrl = sanitizeString(image_url || '', 500);
    const tagsStr = typeof tags === 'string' ? sanitizeString(tags, 500) : JSON.stringify(tags || []);

    await ensureDatabaseAndTables();
    await query(
      'UPDATE projects SET title = ?, description = ?, live_url = ?, github_url = ?, image_url = ?, tags = ?, featured = ? WHERE id = ?',
      [cleanTitle, cleanDesc, cleanLiveUrl, cleanGithubUrl, cleanImageUrl, tagsStr, featured ? 1 : 0, id]
    );

    const list = getFallbackData().projects;
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { id, title: cleanTitle, description: cleanDesc, live_url: cleanLiveUrl, github_url: cleanGithubUrl, image_url: cleanImageUrl, tags: tagsStr, featured: featured ? 1 : 0 };
    }

    return successResponse(null, 200, 'Proyek berhasil diperbarui');
  } catch (err) {
    console.error('Error updating project:', err);
    return errorResponse('Gagal memperbarui proyek', 500);
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return errorResponse('ID proyek tidak valid', 400);
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM projects WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.projects = fallback.projects.filter(p => p.id !== id);

    return successResponse(null, 200, 'Proyek berhasil dihapus');
  } catch (err) {
    console.error('Error deleting project:', err);
    return errorResponse('Gagal menghapus proyek', 500);
  }
}
