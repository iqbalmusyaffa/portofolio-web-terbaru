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

async function updateLoc() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portofolio_iqbal'
  });

  const availabilityText = 'Terbuka untuk Full-time, Remote, Hybrid, maupun On-site di Jakarta, Surabaya, Bandung, Tangerang, Yogyakarta, Semarang, Sidoarjo, Malang, dan Banyuwangi.';

  await conn.query('UPDATE profile SET availability_status = ? WHERE id = 1', [availabilityText]);
  console.log('[SUKSES] availability_status updated in MySQL!');
  await conn.end();
}

updateLoc().catch(console.error);
