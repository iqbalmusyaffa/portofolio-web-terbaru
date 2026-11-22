const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

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

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portofolio_iqbal'
  });

  console.log('Connected to MySQL');

  try {
    await connection.query('ALTER TABLE skills MODIFY COLUMN icon VARCHAR(500) DEFAULT "Code";');
    console.log('Successfully altered skills.icon to VARCHAR(500)');
  } catch (err) {
    console.log('Alter skills table result:', err.message);
  }

  const [rows] = await connection.query('SELECT id, category, name, icon, level FROM skills ORDER BY category, id');
  console.log(`Current skills count: ${rows.length}`);
  rows.forEach(r => console.log(`[${r.category}] ${r.name} -> icon: ${r.icon} (${r.level})`));

  await connection.end();
}

run().catch(console.error);
