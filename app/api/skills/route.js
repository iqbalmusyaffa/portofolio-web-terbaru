import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, parseValidId } from '@/lib/security';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM skills ORDER BY category ASC, id ASC');
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows });
    }
    return NextResponse.json({ success: true, data: getFallbackData().skills });
  } catch (err) {
    console.error('Error fetching skills:', err);
    return NextResponse.json({ success: true, data: getFallbackData().skills, fallback: true });
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const { category, name, icon = 'Code', level = 'Advanced' } = body;

    if (!category || !name) {
      return NextResponse.json({ success: false, error: 'Kategori dan nama skill wajib diisi' }, { status: 400 });
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

    return NextResponse.json({ success: true, data: newSkill });
  } catch (err) {
    console.error('Error creating skill:', err);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan skill' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'ID, Kategori dan nama skill wajib diisi' }, { status: 400 });
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

    return NextResponse.json({ success: true, message: 'Skill berhasil diperbarui' });
  } catch (err) {
    console.error('Error updating skill:', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui skill' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID skill tidak valid' }, { status: 400 });
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM skills WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.skills = fallback.skills.filter(s => s.id !== id);

    return NextResponse.json({ success: true, message: 'Skill berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    return NextResponse.json({ success: false, error: 'Gagal menghapus skill' }, { status: 500 });
  }
}
