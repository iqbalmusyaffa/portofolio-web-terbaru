import { NextResponse } from 'next/server';
import {
  createSecureSessionToken,
  verifySecureSessionToken,
  verifyPassword,
  checkRateLimit,
  getClientIp
} from '@/lib/security';

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

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedUser || !expectedPass) {
      console.error('[AUTH SECURITY ERROR] ADMIN_USERNAME atau ADMIN_PASSWORD belum diatur di file .env');
      return NextResponse.json(
        {
          success: false,
          error: 'Autentikasi admin belum dikonfigurasi di server. Harap tentukan ADMIN_USERNAME dan ADMIN_PASSWORD di environment server.'
        },
        { status: 500 }
      );
    }

    // 2. Validate inputs
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    // 3. Timing-safe verification
    const isUserValid = typeof username === 'string' && username.trim() === expectedUser.trim();
    const isPassValid = verifyPassword(password, expectedPass);

    if (isUserValid && isPassValid) {
      // Generate cryptographic JWE token with 24 hours expiration
      const token = createSecureSessionToken(expectedUser, 24);

      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil'
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
  const activeAdmin = process.env.ADMIN_USERNAME;
  const isValid = !!payload && (!activeAdmin || payload.user === activeAdmin);

  return NextResponse.json({
    isAuthenticated: isValid,
    user: isValid ? payload.user : null
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Berhasil keluar' });
  response.cookies.delete('admin_auth');
  return response;
}
