import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, parseValidId } from '@/lib/security';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM projects ORDER BY featured DESC, id DESC');
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows });
    }
    return NextResponse.json({ success: true, data: getFallbackData().projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    return NextResponse.json({ success: true, data: getFallbackData().projects, fallback: true });
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, live_url, github_url, image_url, tags, featured = 0 } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Judul proyek wajib diisi' }, { status: 400 });
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

    return NextResponse.json({ success: true, data: newProj });
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan proyek' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'ID dan judul proyek wajib diisi' }, { status: 400 });
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

    return NextResponse.json({ success: true, message: 'Proyek berhasil diperbarui' });
  } catch (err) {
    console.error('Error updating project:', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui proyek' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID proyek tidak valid' }, { status: 400 });
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM projects WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.projects = fallback.projects.filter(p => p.id !== id);

    return NextResponse.json({ success: true, message: 'Proyek berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ success: false, error: 'Gagal menghapus proyek' }, { status: 500 });
  }
}
