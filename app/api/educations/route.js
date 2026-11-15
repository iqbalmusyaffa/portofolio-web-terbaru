import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, parseValidId } from '@/lib/security';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM educations ORDER BY id ASC');
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows });
    }
    return NextResponse.json({ success: true, data: getFallbackData().educations });
  } catch (err) {
    console.error('Error fetching educations:', err);
    return NextResponse.json({ success: true, data: getFallbackData().educations, fallback: true });
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const { school, degree, period, grade, location, description } = body;

    if (!school || !degree || !period) {
      return NextResponse.json({ success: false, error: 'Institusi, gelar, dan periode wajib diisi' }, { status: 400 });
    }

    const cleanSchool = sanitizeString(school, 200);
    const cleanDegree = sanitizeString(degree, 150);
    const cleanPeriod = sanitizeString(period, 100);
    const cleanGrade = sanitizeString(grade || '', 50);
    const cleanLoc = sanitizeString(location || '', 100);
    const cleanDesc = sanitizeString(description || '', 3000);

    await ensureDatabaseAndTables();
    const result = await query(
      'INSERT INTO educations (school, degree, period, grade, location, description) VALUES (?, ?, ?, ?, ?, ?)',
      [cleanSchool, cleanDegree, cleanPeriod, cleanGrade, cleanLoc, cleanDesc]
    );

    const newEdu = { id: result.insertId || Date.now(), school: cleanSchool, degree: cleanDegree, period: cleanPeriod, grade: cleanGrade, location: cleanLoc, description: cleanDesc };
    getFallbackData().educations.push(newEdu);

    return NextResponse.json({ success: true, data: newEdu });
  } catch (err) {
    console.error('Error creating education:', err);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan pendidikan' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const id = parseValidId(body.id);
    const { school, degree, period, grade, location, description } = body;

    if (!id || !school || !degree || !period) {
      return NextResponse.json({ success: false, error: 'ID, Institusi, gelar, dan periode wajib diisi' }, { status: 400 });
    }

    const cleanSchool = sanitizeString(school, 200);
    const cleanDegree = sanitizeString(degree, 150);
    const cleanPeriod = sanitizeString(period, 100);
    const cleanGrade = sanitizeString(grade || '', 50);
    const cleanLoc = sanitizeString(location || '', 100);
    const cleanDesc = sanitizeString(description || '', 3000);

    await ensureDatabaseAndTables();
    await query(
      'UPDATE educations SET school = ?, degree = ?, period = ?, grade = ?, location = ?, description = ? WHERE id = ?',
      [cleanSchool, cleanDegree, cleanPeriod, cleanGrade, cleanLoc, cleanDesc, id]
    );

    const list = getFallbackData().educations;
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx] = { id, school: cleanSchool, degree: cleanDegree, period: cleanPeriod, grade: cleanGrade, location: cleanLoc, description: cleanDesc };
    }

    return NextResponse.json({ success: true, message: 'Pendidikan berhasil diperbarui' });
  } catch (err) {
    console.error('Error updating education:', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui pendidikan' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID pendidikan tidak valid' }, { status: 400 });
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM educations WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.educations = fallback.educations.filter(e => e.id !== id);

    return NextResponse.json({ success: true, message: 'Pendidikan berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting education:', err);
    return NextResponse.json({ success: false, error: 'Gagal menghapus pendidikan' }, { status: 500 });
  }
}
