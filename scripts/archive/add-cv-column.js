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

async function addCol() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portofolio_iqbal'
  });

  try {
    await conn.query("ALTER TABLE profile ADD COLUMN `cv_pdf_url` VARCHAR(500) DEFAULT '/cv-iqbal-musyaffa.pdf'");
    console.log('+ Kolom cv_pdf_url ditambahkan');
  } catch (e) {
    if (e.errno === 1060) {
      console.log('= Kolom cv_pdf_url sudah ada');
    } else {
      console.error(e.message);
    }
  }

  await conn.query("UPDATE profile SET cv_pdf_url = COALESCE(NULLIF(cv_pdf_url, ''), '/cv-iqbal-musyaffa.pdf') WHERE id = 1");
  console.log('[SUKSES] cv_pdf_url ter-update');
  await conn.end();
}

addCol().catch(console.error);
