const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portofolio_iqbal'
  });

  console.log('Connected to MySQL. Migrating profile table for About and SEO...');

  const columns = [
    { name: 'about_title', def: "VARCHAR(255) DEFAULT 'Dedikasi untuk Solusi Digital Berkualitas'" },
    { name: 'about_bio_2', def: 'TEXT' },
    { name: 'about_highlights', def: 'TEXT' },
    { name: 'availability_status', def: "VARCHAR(255) DEFAULT 'Terbuka untuk kesempatan kerja Full-time, Remote, Hybrid, maupun Freelance di bidang Software Engineering.'" },
    { name: 'code_philosophy_title', def: "VARCHAR(150) DEFAULT 'Clean, Fast & Impactful'" },
    { name: 'code_philosophy_desc', def: 'TEXT' },
    { name: 'gpa_score', def: "VARCHAR(50) DEFAULT '3.40'" },
    { name: 'meta_title', def: "VARCHAR(255) DEFAULT 'Iqbal Musyaffa - Software Engineer & Fullstack Developer'" },
    { name: 'meta_description', def: 'TEXT' },
    { name: 'meta_keywords', def: 'TEXT' },
    { name: 'og_image', def: "VARCHAR(500) DEFAULT '/foto2.jpg'" },
    { name: 'canonical_url', def: "VARCHAR(500) DEFAULT 'https://iqbalmusyaffa.my.id/'" },
    { name: 'google_site_verification', def: "VARCHAR(255) DEFAULT ''" }
  ];

  for (const col of columns) {
    try {
      await conn.query(`ALTER TABLE profile ADD COLUMN \`${col.name}\` ${col.def}`);
      console.log(`+ Kolom ditambahkan: ${col.name}`);
    } catch (e) {
      if (e.errno === 1060) {
        console.log(`= Kolom sudah ada: ${col.name}`);
      } else {
        console.error(`! Error pada ${col.name}:`, e.message);
      }
    }
  }

  const defaultHighlights = JSON.stringify([
    'Pengembangan web modern end-to-end (Frontend & Backend)',
    'Arsitektur RESTful API performa tinggi & keamanan JWT',
    'Optimasi database relasional MySQL & query efisien',
    'Pengalaman kerja nyata di industri dan tim kolaboratif',
    'Penerapan clean code, reusable components & SEO friendly'
  ]);

  await conn.query(`
    UPDATE profile SET
      about_title = COALESCE(NULLIF(about_title, ''), 'Dedikasi untuk Solusi Digital Berkualitas'),
      about_bio_2 = COALESCE(NULLIF(about_bio_2, ''), 'Dengan pengalaman dalam ekosistem modern seperti Next.js, React, Node.js, Laravel, dan MySQL, saya siap berkontribusi secara nyata dalam menyelesaikan tantangan bisnis melalui solusi teknologi yang tepat sasaran.'),
      about_highlights = COALESCE(NULLIF(about_highlights, ''), ?),
      availability_status = COALESCE(NULLIF(availability_status, ''), 'Terbuka untuk kesempatan kerja Full-time, Remote, Hybrid, maupun Freelance di bidang Software Engineering.'),
      code_philosophy_title = COALESCE(NULLIF(code_philosophy_title, ''), 'Clean, Fast & Impactful'),
      code_philosophy_desc = COALESCE(NULLIF(code_philosophy_desc, ''), 'Fokus utama saya bukan sekadar menulis baris kode, melainkan menciptakan sistem yang stabil, mudah dirawat, dan memberikan dampak positif bagi para penggunanya.'),
      gpa_score = COALESCE(NULLIF(gpa_score, ''), '3.40'),
      meta_title = COALESCE(NULLIF(meta_title, ''), 'Iqbal Musyaffa - Software Engineer & Fullstack Developer'),
      meta_description = COALESCE(NULLIF(meta_description, ''), 'Portofolio profesional Iqbal Musyaffa - Software Engineer & Fullstack Developer lulusan Telkom University Surabaya. Spesialis Next.js, React, Laravel, dan MySQL.'),
      meta_keywords = COALESCE(NULLIF(meta_keywords, ''), 'Iqbal Musyaffa, Software Engineer, Fullstack Developer, Next.js, React, Laravel, MySQL, Portfolio, Web Developer Surabaya'),
      og_image = COALESCE(NULLIF(og_image, ''), '/foto2.jpg'),
      canonical_url = COALESCE(NULLIF(canonical_url, ''), 'https://iqbalmusyaffa.my.id/')
    WHERE id = 1
  `, [defaultHighlights]);

  console.log('[SUKSES] Tabel profile berhasil diperbarui dengan data SEO dan About Me!');
  await conn.end();
}

migrate().catch(console.error);
