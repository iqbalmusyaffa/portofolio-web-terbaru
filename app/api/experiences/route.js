import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, parseValidId } from '@/lib/security';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM experiences ORDER BY id DESC');
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows });
    }
    return NextResponse.json({ success: true, data: getFallbackData().experiences });
  } catch (err) {
    console.error('Error fetching experiences:', err);
    return NextResponse.json({ success: true, data: getFallbackData().experiences, fallback: true });
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const { role, company, period, type = 'Work', description, technologies, location } = body;

    if (!role || !company || !period) {
      return NextResponse.json({ success: false, error: 'Posisi, perusahaan, dan periode wajib diisi' }, { status: 400 });
    }

    const cleanRole = sanitizeString(role, 150);
    const cleanCompany = sanitizeString(company, 150);
    const cleanPeriod = sanitizeString(period, 100);
    const cleanType = sanitizeString(type, 50);
    const cleanDesc = sanitizeString(description || '', 3000);
    const cleanLoc = sanitizeString(location || '', 100);
    const techStr = typeof technologies === 'string' ? sanitizeString(technologies, 500) : JSON.stringify(technologies || []);

    await ensureDatabaseAndTables();
    const result = await query(
      'INSERT INTO experiences (role, company, period, type, description, technologies, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cleanRole, cleanCompany, cleanPeriod, cleanType, cleanDesc, techStr, cleanLoc]
    );

    const newExp = { id: result.insertId || Date.now(), role: cleanRole, company: cleanCompany, period: cleanPeriod, type: cleanType, description: cleanDesc, technologies: techStr, location: cleanLoc };
    getFallbackData().experiences.unshift(newExp);

    return NextResponse.json({ success: true, data: newExp });
  } catch (err) {
    console.error('Error creating experience:', err);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan pengalaman' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const id = parseValidId(body.id);
    const { role, company, period, type = 'Work', description, technologies, location } = body;

    if (!id || !role || !company || !period) {
      return NextResponse.json({ success: false, error: 'ID, Posisi, perusahaan, dan periode wajib diisi' }, { status: 400 });
    }

    const cleanRole = sanitizeString(role, 150);
    const cleanCompany = sanitizeString(company, 150);
    const cleanPeriod = sanitizeString(period, 100);
    const cleanType = sanitizeString(type, 50);
    const cleanDesc = sanitizeString(description || '', 3000);
    const cleanLoc = sanitizeString(location || '', 100);
    const techStr = typeof technologies === 'string' ? sanitizeString(technologies, 500) : JSON.stringify(technologies || []);

    await ensureDatabaseAndTables();
    await query(
      'UPDATE experiences SET role = ?, company = ?, period = ?, type = ?, description = ?, technologies = ?, location = ? WHERE id = ?',
      [cleanRole, cleanCompany, cleanPeriod, cleanType, cleanDesc, techStr, cleanLoc, id]
    );

    const list = getFallbackData().experiences;
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx] = { id, role: cleanRole, company: cleanCompany, period: cleanPeriod, type: cleanType, description: cleanDesc, technologies: techStr, location: cleanLoc };
    }

    return NextResponse.json({ success: true, message: 'Pengalaman berhasil diperbarui' });
  } catch (err) {
    console.error('Error updating experience:', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui pengalaman' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID pengalaman tidak valid' }, { status: 400 });
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM experiences WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.experiences = fallback.experiences.filter(e => e.id !== id);

    return NextResponse.json({ success: true, message: 'Pengalaman berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting experience:', err);
    return NextResponse.json({ success: false, error: 'Gagal menghapus pengalaman' }, { status: 500 });
  }
}
