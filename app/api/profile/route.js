import { NextResponse } from 'next/server';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { requireAdminAuth, sanitizeString, sanitizeUrl } from '@/lib/security';

export const dynamic = 'force-dynamic';

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
      cv_pdf_url,
      github_url,
      linkedin_url,
      instagram_url,
      facebook_url,
      email,
      location,

      // About Section Fields
      about_title,
      about_title_en,
      about_bio_2,
      about_highlights,
      availability_status,
      relocation_cities,
      code_philosophy_label,
      code_philosophy_title,
      code_philosophy_desc,
      gpa_score,
      bio_en,

      // SEO & OpenGraph Fields
      meta_title,
      meta_description,
      meta_keywords,
      og_image,
      canonical_url,
      google_site_verification
    } = body;

    // Sanitize values
    const cleanName = sanitizeString(name || 'Iqbal Musyaffa', 150);
    const cleanFullName = sanitizeString(full_name || '', 200);
    const cleanTagline = sanitizeString(tagline || '', 200);
    const cleanBio = sanitizeString(bio || '', 3000);
    const cleanAvatar = sanitizeUrl(avatar_url || '', 500);
    const cleanCv = sanitizeUrl(cv_url || '', 500);
    const cleanCvPdf = sanitizeUrl(cv_pdf_url || '/cv-iqbal-musyaffa.pdf', 500);
    const cleanGithub = sanitizeUrl(github_url || '', 255);
    const cleanLinkedin = sanitizeUrl(linkedin_url || '', 255);
    const cleanInstagram = sanitizeUrl(instagram_url || '', 255);
    const cleanFacebook = sanitizeUrl(facebook_url || '', 255);
    const cleanEmail = sanitizeString(email || '', 150);
    const cleanLocation = sanitizeString(location || '', 150);

    // About sanitization
    const cleanAboutTitle = sanitizeString(about_title || 'Dedikasi untuk Solusi Digital Berkualitas', 255);
    const cleanAboutTitleEn = sanitizeString(about_title_en || 'Dedication to High-Impact Digital Solutions', 255);
    const cleanBioEn = sanitizeString(bio_en || '', 3000);
    const cleanAboutBio2 = sanitizeString(about_bio_2 || '', 3000);
    let highlightsStr = '[]';
    if (Array.isArray(about_highlights)) {
      highlightsStr = JSON.stringify(about_highlights);
    } else if (typeof about_highlights === 'string') {
      if (about_highlights.trim().startsWith('[')) {
        highlightsStr = about_highlights.trim();
      } else {
        const lines = about_highlights.split('\n').map(s => s.trim()).filter(Boolean);
        highlightsStr = JSON.stringify(lines);
      }
    }
    const cleanAvailability = sanitizeString(availability_status || '', 255);
    const cleanRelocationCities = sanitizeString(relocation_cities || 'Jakarta, Surabaya, Bandung, Tangerang, Yogyakarta, Semarang, Sidoarjo, Malang, Banyuwangi, Remote (WFH)', 2000);
    const cleanPhilLabel = sanitizeString(code_philosophy_label || 'Prinsip Rekayasa', 100);
    const cleanPhilTitle = sanitizeString(code_philosophy_title || 'Maintainable & Scalable Architecture', 150);
    const cleanPhilDesc = sanitizeString(code_philosophy_desc || 'Mengutamakan struktur kode modular yang mudah dirawat tim, optimasi query database relasional, serta penerapan standar RESTful API yang handal.', 3000);
    const cleanGpa = sanitizeString(gpa_score || '3.40', 50);

    // SEO sanitization
    const cleanMetaTitle = sanitizeString(meta_title || `${cleanName} - Software Engineer & Fullstack Developer`, 255);
    const cleanMetaDesc = sanitizeString(meta_description || cleanBio, 1000);
    const cleanMetaKeywords = sanitizeString(meta_keywords || '', 1000);
    const cleanOgImage = sanitizeUrl(og_image || cleanAvatar || '/foto2.jpg', 500);
    const cleanCanonical = sanitizeUrl(canonical_url || '', 500);
    const cleanGVerify = sanitizeString(google_site_verification || '', 255);

    const rolesStr = typeof roles === 'string' ? roles : JSON.stringify(roles || []);

    await ensureDatabaseAndTables();

    const existing = await query('SELECT id FROM profile LIMIT 1');
    if (existing && existing.length > 0) {
      await query(
        `UPDATE profile SET 
          name = ?, full_name = ?, tagline = ?, roles = ?, bio = ?, bio_en = ?, avatar_url = ?, 
          cv_url = ?, cv_pdf_url = ?, github_url = ?, linkedin_url = ?, instagram_url = ?, facebook_url = ?, 
          email = ?, location = ?,
          about_title = ?, about_title_en = ?, about_bio_2 = ?, about_highlights = ?, availability_status = ?, relocation_cities = ?,
          code_philosophy_label = ?, code_philosophy_title = ?, code_philosophy_desc = ?, gpa_score = ?,
          meta_title = ?, meta_description = ?, meta_keywords = ?, og_image = ?,
          canonical_url = ?, google_site_verification = ?
         WHERE id = ?`,
        [
          cleanName, cleanFullName, cleanTagline, rolesStr, cleanBio, cleanBioEn, cleanAvatar,
          cleanCv, cleanCvPdf, cleanGithub, cleanLinkedin, cleanInstagram, cleanFacebook,
          cleanEmail, cleanLocation,
          cleanAboutTitle, cleanAboutTitleEn, cleanAboutBio2, highlightsStr, cleanAvailability, cleanRelocationCities,
          cleanPhilLabel, cleanPhilTitle, cleanPhilDesc, cleanGpa,
          cleanMetaTitle, cleanMetaDesc, cleanMetaKeywords, cleanOgImage,
          cleanCanonical, cleanGVerify, existing[0].id
        ]
      );
    } else {
      await query(
        `INSERT INTO profile (
          name, full_name, tagline, roles, bio, avatar_url, cv_url, cv_pdf_url, github_url,
          linkedin_url, instagram_url, facebook_url, email, location,
          about_title, about_bio_2, about_highlights, availability_status, relocation_cities,
          code_philosophy_label, code_philosophy_title, code_philosophy_desc, gpa_score,
          meta_title, meta_description, meta_keywords, og_image,
          canonical_url, google_site_verification
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cleanName, cleanFullName, cleanTagline, rolesStr, cleanBio, cleanAvatar,
          cleanCv, cleanCvPdf, cleanGithub, cleanLinkedin, cleanInstagram, cleanFacebook,
          cleanEmail, cleanLocation,
          cleanAboutTitle, cleanAboutBio2, highlightsStr, cleanAvailability, cleanRelocationCities,
          cleanPhilLabel, cleanPhilTitle, cleanPhilDesc, cleanGpa,
          cleanMetaTitle, cleanMetaDesc, cleanMetaKeywords, cleanOgImage,
          cleanCanonical, cleanGVerify
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
      location: cleanLocation,
      about_title: cleanAboutTitle,
      about_bio_2: cleanAboutBio2,
      about_highlights: highlightsStr,
      availability_status: cleanAvailability,
      relocation_cities: cleanRelocationCities,
      code_philosophy_label: cleanPhilLabel,
      code_philosophy_title: cleanPhilTitle,
      code_philosophy_desc: cleanPhilDesc,
      gpa_score: cleanGpa,
      meta_title: cleanMetaTitle,
      meta_description: cleanMetaDesc,
      meta_keywords: cleanMetaKeywords,
      og_image: cleanOgImage,
      canonical_url: cleanCanonical,
      google_site_verification: cleanGVerify
    };

    return NextResponse.json({ success: true, message: 'Data profil & SEO berhasil disimpan ke database' });
  } catch (err) {
    console.error('Error updating profile:', err);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
