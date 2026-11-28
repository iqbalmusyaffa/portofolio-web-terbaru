import mysql from 'mysql2/promise';
import {
  initialProfile,
  initialSkills,
  initialExperiences,
  initialEducations,
  initialProjects,
  initialCertificates,
  initialBlogs
} from './initialData';
import { cleanTagsToString } from './tagUtils';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portofolio_iqbal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// In-memory fallback storage in case MySQL is temporarily unavailable
let inMemoryFallback = {
  profile: { ...initialProfile, id: 1 },
  skills: initialSkills.map((s, idx) => ({ ...s, id: idx + 1 })),
  experiences: initialExperiences.map((e, idx) => ({ ...e, id: idx + 1 })),
  educations: initialEducations.map((e, idx) => ({ ...e, id: idx + 1 })),
  projects: initialProjects.map((p, idx) => ({ ...p, id: idx + 1 })),
  certificates: initialCertificates.map((c, idx) => ({ ...c, id: idx + 1 })),
  blogs: initialBlogs.map((b, idx) => ({ ...b, id: idx + 1 })),
  messages: []
};

let pool = null;
let isInitialized = false;
let dbStatus = {
  connected: false,
  error: null,
  mode: 'unknown'
};

export function getDbStatus() {
  return dbStatus;
}

export async function getPool() {
  if (pool) return pool;

  try {
    pool = mysql.createPool(DB_CONFIG);
    // test connection
    const conn = await pool.getConnection();
    conn.release();
    dbStatus.connected = true;
    dbStatus.mode = 'mysql';
    dbStatus.error = null;
    return pool;
  } catch (err) {
    console.warn('[DB] MySQL connection pool failed, will attempt database creation or fallback:', err.message);
    dbStatus.connected = false;
    dbStatus.error = err.message;
    dbStatus.mode = 'fallback';
    return null;
  }
}

export async function ensureDatabaseAndTables() {
  if (isInitialized) return true;

  try {
    // 1. First connect without selecting a database, to create the DB if needed
    const rootConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password
    });

    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConn.end();

    // 2. Connect with pool to create tables
    const dbPool = await getPool();
    if (!dbPool) {
      console.warn('[DB] Could not obtain pool, operating in memory fallback mode');
      isInitialized = true;
      return false;
    }

    // 3. Create tables
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(150) NOT NULL,
        full_name VARCHAR(200),
        tagline VARCHAR(200),
        roles TEXT,
        bio TEXT,
        avatar_url VARCHAR(500),
        cv_url VARCHAR(500),
        cv_pdf_url VARCHAR(500) DEFAULT '/cv-iqbal-musyaffa.pdf',
        github_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        instagram_url VARCHAR(255),
        facebook_url VARCHAR(255),
        email VARCHAR(150),
        location VARCHAR(150),
        about_title VARCHAR(255) DEFAULT 'Dedikasi untuk Solusi Digital Berkualitas',
        about_bio_2 TEXT,
        about_highlights TEXT,
        availability_status VARCHAR(255) DEFAULT 'Terbuka untuk kesempatan kerja Full-time, Remote, Hybrid, maupun Freelance di bidang Software Engineering.',
        relocation_cities TEXT,
        code_philosophy_label VARCHAR(100) DEFAULT 'Prinsip Rekayasa',
        code_philosophy_title VARCHAR(150) DEFAULT 'Maintainable & Scalable Architecture',
        code_philosophy_desc TEXT,
        gpa_score VARCHAR(50) DEFAULT '3.40',
        meta_title VARCHAR(255) DEFAULT 'Iqbal Musyaffa - Software Engineer & Fullstack Developer',
        meta_description TEXT,
        meta_keywords TEXT,
        og_image VARCHAR(500) DEFAULT '/foto2.jpg',
        canonical_url VARCHAR(500) DEFAULT 'https://iqbalmusyaffa.my.id/',
        google_site_verification VARCHAR(255) DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(500) DEFAULT 'Code',
        level VARCHAR(50) DEFAULT 'Advanced',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role VARCHAR(150) NOT NULL,
        role_en VARCHAR(150),
        company VARCHAR(150) NOT NULL,
        period VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'Work',
        description TEXT,
        description_en TEXT,
        technologies TEXT,
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS educations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        school VARCHAR(200) NOT NULL,
        degree VARCHAR(150) NOT NULL,
        period VARCHAR(100) NOT NULL,
        grade VARCHAR(50),
        location VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        title_en VARCHAR(200),
        description TEXT,
        description_en TEXT,
        live_url VARCHAR(500),
        github_url VARCHAR(500),
        image_url VARCHAR(500),
        tags TEXT,
        featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(200) NOT NULL,
        issue_date VARCHAR(100),
        credential_url VARCHAR(500),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        subject VARCHAR(200),
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(150),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        summary TEXT NOT NULL,
        summary_en TEXT,
        content LONGTEXT NOT NULL,
        content_en LONGTEXT,
        category VARCHAR(100) NOT NULL DEFAULT 'Backend Architecture',
        tags TEXT,
        image_url VARCHAR(500),
        read_time VARCHAR(50) DEFAULT '5 min read',
        published_at VARCHAR(100),
        is_featured TINYINT(1) DEFAULT 0,
        is_published TINYINT(1) DEFAULT 1,
        claps INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 4. Seed tables if empty
    try {
      await dbPool.query('ALTER TABLE profile ADD COLUMN relocation_cities TEXT');
    } catch (e) {
      // Column already exists or table updated
    }
    try {
      await dbPool.query(
        "UPDATE profile SET relocation_cities = 'Jakarta, Surabaya, Bandung, Tangerang, Yogyakarta, Semarang, Sidoarjo, Malang, Banyuwangi, Remote (WFH)' WHERE relocation_cities IS NULL OR TRIM(relocation_cities) = ''"
      );
    } catch (e) {
      // Ignored
    }
    try {
      await dbPool.query("ALTER TABLE profile ADD COLUMN code_philosophy_label VARCHAR(100) DEFAULT 'Prinsip Rekayasa'");
    } catch (e) {
      // Column already exists
    }
    try {
      await dbPool.query('ALTER TABLE admins ADD COLUMN email VARCHAR(150)');
    } catch (e) {
      // Column already exists
    }
    try {
      await dbPool.query('ALTER TABLE projects ADD COLUMN title_en VARCHAR(200)');
    } catch (e) {}
    try {
      await dbPool.query('ALTER TABLE projects ADD COLUMN description_en TEXT');
    } catch (e) {}
    try {
      await dbPool.query('ALTER TABLE experiences ADD COLUMN role_en VARCHAR(150)');
    } catch (e) {}
    try {
      await dbPool.query('ALTER TABLE experiences ADD COLUMN description_en TEXT');
    } catch (e) {}
    try {
      await dbPool.query('ALTER TABLE profile ADD COLUMN bio_en TEXT');
    } catch (e) {}
    try {
      await dbPool.query('ALTER TABLE profile ADD COLUMN about_title_en VARCHAR(200)');
    } catch (e) {}
    try {
      await dbPool.query('ALTER TABLE blogs ADD COLUMN claps INT DEFAULT 0');
    } catch (e) {}

    await seedIfEmpty(dbPool);

    // Auto-clean legacy HTML escaped tags in MySQL (e.g. &quot;, brackets)
    try {
      const [projRows] = await dbPool.query('SELECT id, tags, image_url, live_url, github_url FROM projects');
      if (Array.isArray(projRows)) {
        for (const p of projRows) {
          let needsUpdate = false;
          let cleanTags = p.tags;
          let cleanImg = p.image_url;
          let cleanLive = p.live_url;
          let cleanGit = p.github_url;

          if (p.tags && (p.tags.includes('&quot;') || p.tags.includes('[') || p.tags.includes('"'))) {
            cleanTags = cleanTagsToString(p.tags);
            needsUpdate = true;
          }
          if (p.image_url && p.image_url.includes('&#x2F;')) {
            cleanImg = p.image_url.replace(/&#x2F;/g, '/').replace(/&amp;/g, '&');
            needsUpdate = true;
          }
          if (p.live_url && p.live_url.includes('&#x2F;')) {
            cleanLive = p.live_url.replace(/&#x2F;/g, '/').replace(/&amp;/g, '&');
            needsUpdate = true;
          }
          if (p.github_url && p.github_url.includes('&#x2F;')) {
            cleanGit = p.github_url.replace(/&#x2F;/g, '/').replace(/&amp;/g, '&');
            needsUpdate = true;
          }

          if (needsUpdate) {
            await dbPool.query(
              'UPDATE projects SET tags = ?, image_url = ?, live_url = ?, github_url = ? WHERE id = ?',
              [cleanTags, cleanImg, cleanLive, cleanGit, p.id]
            );
          }
        }
      }
    } catch (e) {}

    try {
      const [expRows] = await dbPool.query('SELECT id, technologies FROM experiences');
      if (Array.isArray(expRows)) {
        for (const exp of expRows) {
          if (exp.technologies && (exp.technologies.includes('&quot;') || exp.technologies.includes('[') || exp.technologies.includes('"'))) {
            const clean = cleanTagsToString(exp.technologies);
            await dbPool.query('UPDATE experiences SET technologies = ? WHERE id = ?', [clean, exp.id]);
          }
        }
      }
    } catch (e) {}

    isInitialized = true;
    dbStatus.connected = true;
    dbStatus.mode = 'mysql';
    return true;
  } catch (err) {
    console.error('[DB] Error initializing MySQL tables:', err.message);
    dbStatus.connected = false;
    dbStatus.error = err.message;
    dbStatus.mode = 'fallback';
    isInitialized = true; // prevent endless loop
    return false;
  }
}

async function seedIfEmpty(dbPool) {
  // Check profile
  const [profiles] = await dbPool.query('SELECT COUNT(*) as count FROM profile');
  if (profiles[0].count === 0) {
    await dbPool.query(
      `INSERT INTO profile (
        name, full_name, tagline, roles, bio, avatar_url, cv_url, github_url,
        linkedin_url, instagram_url, facebook_url, email, location,
        about_title, about_bio_2, about_highlights, availability_status, relocation_cities,
        code_philosophy_title, code_philosophy_desc, gpa_score,
        meta_title, meta_description, meta_keywords, og_image, canonical_url, google_site_verification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        initialProfile.name,
        initialProfile.full_name,
        initialProfile.tagline,
        initialProfile.roles,
        initialProfile.bio,
        initialProfile.avatar_url,
        initialProfile.cv_url,
        initialProfile.github_url,
        initialProfile.linkedin_url,
        initialProfile.instagram_url,
        initialProfile.facebook_url,
        initialProfile.email,
        initialProfile.location,
        initialProfile.about_title,
        initialProfile.about_bio_2,
        initialProfile.about_highlights,
        initialProfile.availability_status,
        initialProfile.relocation_cities,
        initialProfile.code_philosophy_title,
        initialProfile.code_philosophy_desc,
        initialProfile.gpa_score,
        initialProfile.meta_title,
        initialProfile.meta_description,
        initialProfile.meta_keywords,
        initialProfile.og_image,
        initialProfile.canonical_url,
        initialProfile.google_site_verification
      ]
    );
  }

  // Check skills
  const [skills] = await dbPool.query('SELECT COUNT(*) as count FROM skills');
  if (skills[0].count === 0) {
    for (const s of initialSkills) {
      await dbPool.query(
        'INSERT INTO skills (category, name, icon, level) VALUES (?, ?, ?, ?)',
        [s.category, s.name, s.icon, s.level]
      );
    }
  }

  // Check experiences
  const [experiences] = await dbPool.query('SELECT COUNT(*) as count FROM experiences');
  if (experiences[0].count === 0) {
    for (const e of initialExperiences) {
      await dbPool.query(
        'INSERT INTO experiences (role, company, period, type, description, technologies, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [e.role, e.company, e.period, e.type, e.description, e.technologies, e.location]
      );
    }
  }

  // Check educations
  const [educations] = await dbPool.query('SELECT COUNT(*) as count FROM educations');
  if (educations[0].count === 0) {
    for (const ed of initialEducations) {
      await dbPool.query(
        'INSERT INTO educations (school, degree, period, grade, location, description) VALUES (?, ?, ?, ?, ?, ?)',
        [ed.school, ed.degree, ed.period, ed.grade, ed.location, ed.description]
      );
    }
  }

  // Check projects
  const [projects] = await dbPool.query('SELECT COUNT(*) as count FROM projects');
  if (projects[0].count === 0) {
    for (const p of initialProjects) {
      await dbPool.query(
        'INSERT INTO projects (title, description, live_url, github_url, image_url, tags, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.title, p.description, p.live_url, p.github_url, p.image_url, p.tags, p.featured]
      );
    }
  }

  // Check certificates
  const [certs] = await dbPool.query('SELECT COUNT(*) as count FROM certificates');
  if (certs[0].count === 0) {
    for (const c of initialCertificates) {
      await dbPool.query(
        'INSERT INTO certificates (title, issuer, issue_date, credential_url, image_url) VALUES (?, ?, ?, ?, ?)',
        [c.title, c.issuer, c.issue_date, c.credential_url, c.image_url]
      );
    }
  }

  // Check blogs table
  const [blogs] = await dbPool.query('SELECT COUNT(*) as count FROM blogs');
  if (blogs[0].count === 0) {
    for (const b of initialBlogs) {
      await dbPool.query(
        `INSERT INTO blogs (
          slug, title, title_en, summary, summary_en, content, content_en,
          category, tags, image_url, read_time, published_at, is_featured, is_published
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          b.slug,
          b.title,
          b.title_en,
          b.summary,
          b.summary_en,
          b.content,
          b.content_en,
          b.category,
          b.tags,
          b.image_url,
          b.read_time,
          b.published_at,
          b.is_featured,
          b.is_published
        ]
      );
    }
  }

  // Check admins table
  const [admins] = await dbPool.query('SELECT COUNT(*) as count FROM admins');
  if (admins[0].count === 0) {
    // Default admin: iqbal with secure PBKDF2 salt:hash
    const defaultSalt = 'd8f37b19a2e4c0558b9d62e1a473f8a0';
    const defaultHash = 'b6d0c1e847c29fb13637c35eb64528340d216f21226002f232ce5ee09ad437340b001d8e12fe27d0f04cbb8e469d4dcfcaef01a75b22b7bf74b0fe489e273010';
    await dbPool.query(
      'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
      ['iqbal', `${defaultSalt}:${defaultHash}`]
    );
  }
}

// ==================== QUERY HELPERS (CRUD) ====================

export async function query(sql, params = []) {
  await ensureDatabaseAndTables();
  const dbPool = await getPool();

  if (dbPool) {
    try {
      const [results] = await dbPool.query(sql, params);
      return results;
    } catch (err) {
      console.error('[DB Query Error]:', err.message);
      throw err;
    }
  }

  // Fallback to in-memory handling
  return handleFallbackQuery(sql, params);
}

function handleFallbackQuery(sql, params) {
  const clean = sql.trim().toUpperCase();

  if (clean.startsWith('SELECT')) {
    if (clean.includes('FROM PROFILE')) return [inMemoryFallback.profile];
    if (clean.includes('FROM SKILLS')) return inMemoryFallback.skills;
    if (clean.includes('FROM EXPERIENCES')) return inMemoryFallback.experiences;
    if (clean.includes('FROM EDUCATIONS')) return inMemoryFallback.educations;
    if (clean.includes('FROM PROJECTS')) return inMemoryFallback.projects;
    if (clean.includes('FROM CERTIFICATES')) return inMemoryFallback.certificates;
    if (clean.includes('FROM BLOGS')) return inMemoryFallback.blogs;
    if (clean.includes('FROM MESSAGES')) return inMemoryFallback.messages;
  }

  return [];
}

export function getFallbackData() {
  return inMemoryFallback;
}
