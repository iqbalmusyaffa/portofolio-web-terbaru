import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, parseValidId } from '@/lib/security';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM certificates ORDER BY id ASC');
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows });
    }
    return NextResponse.json({ success: true, data: getFallbackData().certificates });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    return NextResponse.json({ success: true, data: getFallbackData().certificates, fallback: true });
  }
}

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const { title, issuer, issue_date, credential_url, image_url } = body;

    if (!title || !issuer) {
      return NextResponse.json({ success: false, error: 'Judul dan penerbit sertifikat wajib diisi' }, { status: 400 });
    }

    const cleanTitle = sanitizeString(title, 255);
    const cleanIssuer = sanitizeString(issuer, 200);
    const cleanDate = sanitizeString(issue_date || '', 100);
    const cleanCred = sanitizeString(credential_url || '', 500);
    const cleanImg = sanitizeString(image_url || '', 500);

    await ensureDatabaseAndTables();
    const result = await query(
      'INSERT INTO certificates (title, issuer, issue_date, credential_url, image_url) VALUES (?, ?, ?, ?, ?)',
      [cleanTitle, cleanIssuer, cleanDate, cleanCred, cleanImg]
    );

    const newCert = { id: result.insertId || Date.now(), title: cleanTitle, issuer: cleanIssuer, issue_date: cleanDate, credential_url: cleanCred, image_url: cleanImg };
    getFallbackData().certificates.push(newCert);

    return NextResponse.json({ success: true, data: newCert });
  } catch (err) {
    console.error('Error creating certificate:', err);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan sertifikat' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const body = await request.json();
    const id = parseValidId(body.id);
    const { title, issuer, issue_date, credential_url, image_url } = body;

    if (!id || !title || !issuer) {
      return NextResponse.json({ success: false, error: 'ID, judul, dan penerbit sertifikat wajib diisi' }, { status: 400 });
    }

    const cleanTitle = sanitizeString(title, 255);
    const cleanIssuer = sanitizeString(issuer, 200);
    const cleanDate = sanitizeString(issue_date || '', 100);
    const cleanCred = sanitizeString(credential_url || '', 500);
    const cleanImg = sanitizeString(image_url || '', 500);

    await ensureDatabaseAndTables();
    await query(
      'UPDATE certificates SET title = ?, issuer = ?, issue_date = ?, credential_url = ?, image_url = ? WHERE id = ?',
      [cleanTitle, cleanIssuer, cleanDate, cleanCred, cleanImg, id]
    );

    const list = getFallbackData().certificates;
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { id, title: cleanTitle, issuer: cleanIssuer, issue_date: cleanDate, credential_url: cleanCred, image_url: cleanImg };
    }

    return NextResponse.json({ success: true, message: 'Sertifikat berhasil diperbarui' });
  } catch (err) {
    console.error('Error updating certificate:', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui sertifikat' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID sertifikat tidak valid' }, { status: 400 });
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM certificates WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.certificates = fallback.certificates.filter(c => c.id !== id);

    return NextResponse.json({ success: true, message: 'Sertifikat berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    return NextResponse.json({ success: false, error: 'Gagal menghapus sertifikat' }, { status: 500 });
  }
}
