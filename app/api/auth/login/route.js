import { NextResponse } from 'next/server';
import {
  createSecureSessionToken,
  verifySecureSessionToken,
  verifyPassword,
  hashPassword,
  checkRateLimit,
  getClientIp,
  requireAdminAuth
} from '@/lib/security';
import { query, ensureDatabaseAndTables } from '@/lib/db';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // 1. Rate Limiting Protection (Max 5 attempts per 15 minutes)
    const rateLimit = checkRateLimit(`login_${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${rateLimit.resetInSeconds} detik.`
        },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    // 2. Validate inputs
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    await ensureDatabaseAndTables();

    // 3. Check credentials against MySQL database (admins table)
    let authenticatedUser = null;
    let isPasswordCorrect = false;

    try {
      const rows = await query('SELECT * FROM admins WHERE username = ? LIMIT 1', [cleanUsername]);
      if (rows && rows.length > 0) {
        const adminRecord = rows[0];
        isPasswordCorrect = verifyPassword(password, adminRecord.password_hash);
        if (isPasswordCorrect) {
          authenticatedUser = adminRecord.username;
        }
      }
    } catch (dbErr) {
      console.warn('[AUTH] Database check failed, trying environment fallback:', dbErr.message);
    }

    // Fallback to process.env if environment variables are set (optional backward compatibility)
    if (!authenticatedUser && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
      const isUserMatch = cleanUsername === process.env.ADMIN_USERNAME.trim();
      const isPassMatch = verifyPassword(password, process.env.ADMIN_PASSWORD);
      if (isUserMatch && isPassMatch) {
        authenticatedUser = process.env.ADMIN_USERNAME.trim();
        isPasswordCorrect = true;
      }
    }

    // 4. If credentials valid, issue encrypted JWE session cookie
    if (authenticatedUser && isPasswordCorrect) {
      const token = createSecureSessionToken(authenticatedUser, 24);

      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: authenticatedUser
      });

      // Secure HTTP-Only Cookie with Strict SameSite
      response.cookies.set('admin_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: `Username atau password tidak cocok. Sisa percobaan: ${rateLimit.remaining}`
      },
      { status: 401 }
    );
  } catch (err) {
    console.error('[AUTH ERROR]', err);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}

export async function GET(request) {
  const cookie = request.cookies.get('admin_auth');
  const token = cookie?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false });
  }

  const payload = verifySecureSessionToken(token);
  return NextResponse.json({
    isAuthenticated: !!payload,
    user: payload ? payload.user : null
  });
}

export async function PUT(request) {
  // Change password / update credentials endpoint
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { new_username, new_password } = await request.json();
    if (!new_password || typeof new_password !== 'string' || new_password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password baru minimal harus 6 karakter' },
        { status: 400 }
      );
    }

    const targetUser = new_username && typeof new_username === 'string' ? new_username.trim() : auth.user;
    const passwordHash = hashPassword(new_password);

    await ensureDatabaseAndTables();

    // Check if user exists
    const existing = await query('SELECT id FROM admins WHERE username = ?', [auth.user]);
    if (existing && existing.length > 0) {
      await query('UPDATE admins SET username = ?, password_hash = ? WHERE username = ?', [
        targetUser,
        passwordHash,
        auth.user
      ]);
    } else {
      await query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [
        targetUser,
        passwordHash
      ]);
    }

    // Refresh token with new username
    const newToken = createSecureSessionToken(targetUser, 24);
    const response = NextResponse.json({
      success: true,
      message: 'Kredensial admin berhasil diperbarui'
    });

    response.cookies.set('admin_auth', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return response;
  } catch (err) {
    console.error('[UPDATE ADMIN ERROR]', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui kredensial' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Berhasil keluar' });
  response.cookies.delete('admin_auth');
  return response;
}
