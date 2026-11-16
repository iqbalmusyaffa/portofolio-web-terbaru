const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Load environment variables from .env if present
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

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function setAdmin(username, password) {
  const user = username || process.argv[2] || 'iqbal';
  const pass = password || process.argv[3] || 'Iqbal@2026!';

  console.log(`\n========================================`);
  console.log(`  Memperbarui Akun Admin di Database MySQL`);
  console.log(`========================================`);
  console.log(`Username : ${user}`);
  console.log(`Password : ${pass}`);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portofolio_iqbal'
  });

  try {
    // 1. Create table admins if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 2. Hash password with PBKDF2 (SHA-512 with 16-byte random salt)
    const passwordHash = hashPassword(pass);

    // 3. Insert or update user
    const [existing] = await connection.query('SELECT id FROM admins WHERE username = ?', [user]);
    if (existing.length > 0) {
      await connection.query('UPDATE admins SET password_hash = ? WHERE username = ?', [passwordHash, user]);
      console.log(`\n[SUKSES] Password untuk admin '${user}' berhasil diperbarui!`);
    } else {
      await connection.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [user, passwordHash]);
      console.log(`\n[SUKSES] Akun admin '${user}' berhasil ditambahkan ke tabel database!`);
    }

    console.log(`Password disimpan dalam bentuk HASH terenkripsi (PBKDF2-SHA512) di database.`);
    console.log(`Tidak ada plaintext password yang tersimpan di file .env.`);
    console.log(`========================================\n`);
  } catch (err) {
    console.error('[GAGAL] Terjadi kesalahan:', err.message);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  setAdmin();
}

module.exports = { setAdmin, hashPassword };
