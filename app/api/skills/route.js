import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, parseValidId } from '@/lib/security';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM skills ORDER BY category ASC, id ASC');
    if (rows && rows.length > 0) {
      return successResponse(rows);
    }
    return successResponse(getFallbackData().skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    return successResponse(getFallbackData().skills);
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const { category, name, icon = 'Code', level = 'Advanced' } = body;

    if (!category || !name) {
      return errorResponse('Kategori dan nama skill wajib diisi', 400);
    }

    const cleanCategory = sanitizeString(category, 50);
    const cleanName = sanitizeString(name, 100);
    const cleanIcon = sanitizeString(icon, 500);
    const cleanLevel = sanitizeString(level, 50);

    await ensureDatabaseAndTables();
    const result = await query(
      'INSERT INTO skills (category, name, icon, level) VALUES (?, ?, ?, ?)',
      [cleanCategory, cleanName, cleanIcon, cleanLevel]
    );

    const newSkill = { id: result.insertId || Date.now(), category: cleanCategory, name: cleanName, icon: cleanIcon, level: cleanLevel };
    getFallbackData().skills.push(newSkill);

    return successResponse(newSkill);
  } catch (err) {
    console.error('Error creating skill:', err);
    return errorResponse('Gagal menambahkan skill', 500);
  }
}

export async function PUT(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const id = parseValidId(body.id);
    const { category, name, icon = 'Code', level = 'Advanced' } = body;

    if (!id || !category || !name) {
      return errorResponse('ID, Kategori dan nama skill wajib diisi', 400);
    }

    const cleanCategory = sanitizeString(category, 50);
    const cleanName = sanitizeString(name, 100);
    const cleanIcon = sanitizeString(icon, 500);
    const cleanLevel = sanitizeString(level, 50);

    await ensureDatabaseAndTables();
    await query(
      'UPDATE skills SET category = ?, name = ?, icon = ?, level = ? WHERE id = ?',
      [cleanCategory, cleanName, cleanIcon, cleanLevel, id]
    );

    const list = getFallbackData().skills;
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { id, category: cleanCategory, name: cleanName, icon: cleanIcon, level: cleanLevel };
    }

    return successResponse(null, 200, 'Skill berhasil diperbarui');
  } catch (err) {
    console.error('Error updating skill:', err);
    return errorResponse('Gagal memperbarui skill', 500);
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return errorResponse('ID skill tidak valid', 400);
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM skills WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.skills = fallback.skills.filter(s => s.id !== id);

    return successResponse(null, 200, 'Skill berhasil dihapus');
  } catch (err) {
    console.error('Error deleting skill:', err);
    return errorResponse('Gagal menghapus skill', 500);
  }
}
