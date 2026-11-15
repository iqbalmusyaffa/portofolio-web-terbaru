import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString } from '@/lib/security';

// GET Profile: Public
export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const rows = await query('SELECT * FROM profile LIMIT 1');
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows[0] });
    }
    return NextResponse.json({ success: true, data: getFallbackData().profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return NextResponse.json({ success: true, data: getFallbackData().profile, fallback: true });
  }
}

// PUT Profile: Admin Only
export async function PUT(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json(auth.response, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      full_name,
      tagline,
      roles,
      bio,
      avatar_url,
      cv_url,
      github_url,
      linkedin_url,
      instagram_url,
      facebook_url,
      email,
      location
    } = body;

    // Sanitize values
    const cleanName = sanitizeString(name || 'Iqbal Musyaffa', 150);
    const cleanFullName = sanitizeString(full_name || '', 200);
    const cleanTagline = sanitizeString(tagline || '', 200);
    const cleanBio = sanitizeString(bio || '', 3000);
    const cleanAvatar = sanitizeString(avatar_url || '', 500);
    const cleanCv = sanitizeString(cv_url || '', 500);
    const cleanGithub = sanitizeString(github_url || '', 255);
    const cleanLinkedin = sanitizeString(linkedin_url || '', 255);
    const cleanInstagram = sanitizeString(instagram_url || '', 255);
    const cleanFacebook = sanitizeString(facebook_url || '', 255);
    const cleanEmail = sanitizeString(email || '', 150);
    const cleanLocation = sanitizeString(location || '', 150);

    const rolesStr = typeof roles === 'string' ? roles : JSON.stringify(roles || []);

    await ensureDatabaseAndTables();

    const existing = await query('SELECT id FROM profile LIMIT 1');
    if (existing && existing.length > 0) {
      await query(
        `UPDATE profile SET 
          name = ?, full_name = ?, tagline = ?, roles = ?, bio = ?, avatar_url = ?, 
          cv_url = ?, github_url = ?, linkedin_url = ?, instagram_url = ?, facebook_url = ?, 
          email = ?, location = ?
         WHERE id = ?`,
        [
          cleanName, cleanFullName, cleanTagline, rolesStr, cleanBio, cleanAvatar,
          cleanCv, cleanGithub, cleanLinkedin, cleanInstagram, cleanFacebook,
          cleanEmail, cleanLocation, existing[0].id
        ]
      );
    } else {
      await query(
        `INSERT INTO profile (name, full_name, tagline, roles, bio, avatar_url, cv_url, github_url, linkedin_url, instagram_url, facebook_url, email, location)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cleanName, cleanFullName, cleanTagline, rolesStr, cleanBio, cleanAvatar,
          cleanCv, cleanGithub, cleanLinkedin, cleanInstagram, cleanFacebook,
          cleanEmail, cleanLocation
        ]
      );
    }

    const fallback = getFallbackData();
    fallback.profile = {
      ...fallback.profile,
      name: cleanName,
      full_name: cleanFullName,
      tagline: cleanTagline,
      roles: rolesStr,
      bio: cleanBio,
      avatar_url: cleanAvatar,
      cv_url: cleanCv,
      github_url: cleanGithub,
      linkedin_url: cleanLinkedin,
      instagram_url: cleanInstagram,
      facebook_url: cleanFacebook,
      email: cleanEmail,
      location: cleanLocation
    };

    return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui di database' });
  } catch (err) {
    console.error('Error updating profile:', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
