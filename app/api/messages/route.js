import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import {
  requireAdminAuth,
  sanitizeString,
  isValidEmail,
  checkRateLimit,
  getClientIp,
  parseValidId
} from '@/lib/security';

// GET Messages: Restricted to Admin
export async function GET(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json(auth.response, { status: 401 });
  }

  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM messages ORDER BY id DESC');
    return NextResponse.json({ success: true, data: rows || [] });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return NextResponse.json({ success: true, data: getFallbackData().messages, fallback: true });
  }
}

// POST Message: Public Contact Form with Spam Protection & Input Sanitization
export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // 1. Rate Limiting Protection (Max 4 messages per 10 minutes per IP)
    const rateLimit = checkRateLimit(`contact_${ip}`, 4, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak pengiriman pesan dari IP Anda. Mohon tunggu ${rateLimit.resetInSeconds} detik sebelum mengirim lagi.`
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // 2. Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Nama lengkap wajib diisi minimal 2 karakter' }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Format alamat email tidak valid' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Pesan wajib diisi minimal 5 karakter' }, { status: 400 });
    }

    // 3. Input Sanitization (Anti-XSS)
    const cleanName = sanitizeString(name, 100);
    const cleanEmail = sanitizeString(email, 120);
    const cleanSubject = sanitizeString(subject || 'Pesan dari Portofolio', 150);
    const cleanMessage = sanitizeString(message, 3000);

    await ensureDatabaseAndTables();

    // 4. Parameterized Query (Anti-SQLi)
    const result = await query(
      'INSERT INTO messages (name, email, subject, message, is_read) VALUES (?, ?, ?, ?, 0)',
      [cleanName, cleanEmail, cleanSubject, cleanMessage]
    );

    const newMsg = {
      id: result?.insertId || Date.now(),
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      is_read: 0,
      created_at: new Date().toISOString()
    };
    getFallbackData().messages.unshift(newMsg);

    return NextResponse.json({
      success: true,
      message: 'Pesan Anda telah berhasil dikirim dan tersimpan dengan aman di database MySQL!'
    });
  } catch (err) {
    console.error('Error saving message:', err);
    return NextResponse.json({ success: false, error: 'Gagal memproses pesan' }, { status: 500 });
  }
}

// PATCH Message: Mark Read/Unread (Admin only)
export async function PATCH(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json(auth.response, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = parseValidId(body.id);
    const is_read = body.is_read ? 1 : 0;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID pesan tidak valid' }, { status: 400 });
    }

    await ensureDatabaseAndTables();
    await query('UPDATE messages SET is_read = ? WHERE id = ?', [is_read, id]);

    const msg = getFallbackData().messages.find(m => m.id === id);
    if (msg) msg.is_read = is_read;

    return NextResponse.json({ success: true, message: 'Status pesan diperbarui' });
  } catch (err) {
    console.error('Error updating message status:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE Message: Admin only
export async function DELETE(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json(auth.response, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = parseValidId(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID pesan tidak valid' }, { status: 400 });
    }

    await ensureDatabaseAndTables();
    await query('DELETE FROM messages WHERE id = ?', [id]);

    const fallback = getFallbackData();
    fallback.messages = fallback.messages.filter(m => m.id !== id);

    return NextResponse.json({ success: true, message: 'Pesan berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting message:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
