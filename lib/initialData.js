export const initialProfile = {
  name: "Iqbal Musyaffa",
  full_name: "Iqbal Musyaffa Yusa'Bbih Lillah",
  tagline: "Software Engineer",
  roles: JSON.stringify(["Software Engineer", "Fullstack Developer", "Problem Solver"]),
  bio: "Saya adalah lulusan S1 Sistem Informasi Universitas Telkom Surabaya yang memiliki passion mendalam pada perancangan dan pembangunan aplikasi web yang scalable, responsif, dan mudah digunakan.",
  bio_en: "Information Systems graduate from Telkom University Surabaya with a strong passion for architecting and engineering scalable, responsive, and intuitive web applications.",
  avatar_url: "/foto2.jpg",
  cv_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
  cv_pdf_url: "/cv-iqbal-musyaffa.pdf",
  github_url: "https://github.com/iqbalmusyaffa",
  linkedin_url: "https://www.linkedin.com/in/iqbalmusyaffa",
  instagram_url: "https://www.instagram.com/iqbal_musyaffa78/",
  facebook_url: "https://www.facebook.com/iqbal.musyaffayusa",
  email: "contact@iqbaldeveloper.my.id",
  location: "Surabaya, Jawa Timur, Indonesia",

  // About Section Details
  about_title: "Dedikasi untuk Solusi Digital Berkualitas",
  about_title_en: "Dedication to High-Impact Digital Solutions",
  about_bio_2: "Dengan pengalaman dalam ekosistem modern seperti Next.js, React, Node.js, Laravel, dan MySQL, saya siap berkontribusi secara nyata dalam menyelesaikan tantangan bisnis melalui solusi teknologi yang tepat sasaran.",
  about_highlights: JSON.stringify([
    "Pengembangan web modern end-to-end (Frontend & Backend)",
    "Arsitektur RESTful API performa tinggi & keamanan JWT",
    "Optimasi database relasional MySQL & query efisien",
    "Pengalaman kerja nyata di industri dan tim kolaboratif",
    "Penerapan clean code, reusable components & SEO friendly"
  ]),
  availability_status: "Terbuka untuk Full-time, Remote, Hybrid, maupun On-site di Jakarta, Surabaya, Bandung, Tangerang, Yogyakarta, Semarang, Sidoarjo, Malang, dan Banyuwangi.",
  relocation_cities: "Jakarta, Surabaya, Bandung, Tangerang, Yogyakarta, Semarang, Sidoarjo, Malang, Banyuwangi, Remote (WFH)",
  code_philosophy_label: "Prinsip Rekayasa",
  code_philosophy_title: "Maintainable & Scalable Architecture",
  code_philosophy_desc: "Mengutamakan struktur kode modular yang mudah dirawat tim, optimasi query database relasional, serta penerapan standar RESTful API yang handal.",
  gpa_score: "3.40",

  // SEO & Social OpenGraph Settings
  meta_title: "Iqbal Musyaffa - Software Engineer & Fullstack Developer",
  meta_description: "Portofolio profesional Iqbal Musyaffa - Software Engineer & Fullstack Developer lulusan Telkom University Surabaya. Spesialis Next.js, React, Laravel, dan MySQL.",
  meta_keywords: "Iqbal Musyaffa, Software Engineer, Fullstack Developer, Next.js, React, Laravel, MySQL, Portfolio, Web Developer Surabaya",
  og_image: "/foto2.jpg",
  canonical_url: "https://iqbalmusyaffa.my.id/",
  google_site_verification: ""
};

export const initialSkills = [
  // Frontend
  { category: "Frontend", name: "HTML", icon: "Code", level: "Advanced" },
  { category: "Frontend", name: "CSS", icon: "Palette", level: "Advanced" },
  { category: "Frontend", name: "SASS", icon: "FileCode", level: "Intermediate" },
  { category: "Frontend", name: "JavaScript", icon: "Zap", level: "Advanced" },
  { category: "Frontend", name: "React JS", icon: "Atom", level: "Advanced" },
  { category: "Frontend", name: "Next JS", icon: "Globe", level: "Intermediate" },
  { category: "Frontend", name: "Tailwind CSS", icon: "Wind", level: "Advanced" },
  { category: "Frontend", name: "Bootstrap", icon: "Layout", level: "Advanced" },

  // Backend
  { category: "Backend", name: "Node JS", icon: "Server", level: "Intermediate" },
  { category: "Backend", name: "Express JS", icon: "Cpu", level: "Intermediate" },
  { category: "Backend", name: "MySQL", icon: "Database", level: "Advanced" },
  { category: "Backend", name: "SQLite", icon: "HardDrive", level: "Intermediate" },
  { category: "Backend", name: "Laravel", icon: "Layers", level: "Advanced" },
  { category: "Backend", name: "Firebase", icon: "Flame", level: "Intermediate" },

  // Languages
  { category: "Languages", name: "PHP", icon: "FileCode2", level: "Advanced" },
  { category: "Languages", name: "JavaScript", icon: "Zap", level: "Advanced" },
  { category: "Languages", name: "Python", icon: "Terminal", level: "Intermediate" },

  // Tools
  { category: "Tools", name: "Git", icon: "GitBranch", level: "Advanced" },
  { category: "Tools", name: "GitHub", icon: "Github", level: "Advanced" },
  { category: "Tools", name: "VS Code", icon: "Laptop", level: "Advanced" },
  { category: "Tools", name: "Postman", icon: "Send", level: "Advanced" },
  { category: "Tools", name: "Vercel", icon: "Triangle", level: "Intermediate" },
  { category: "Tools", name: "Figma", icon: "Figma", level: "Intermediate" }
];

export const initialExperiences = [
  {
    role: "Full Stack Developer (Internship)",
    company: "PT PastiDjadi",
    company_logo: "",
    period: "Juni 2024 - November 2024",
    type: "Internship",
    description: "Sebagai Full Stack Developer Intern, saya bertanggung jawab dalam pengembangan end-to-end aplikasi web, mulai dari pembuatan antarmuka pengguna yang responsif menggunakan HTML, CSS, JavaScript, dan Bootstrap, hingga pengelolaan logika backend dengan PHP dan Laravel.",
    technologies: "HTML, CSS, JavaScript, Bootstrap, Git, GitHub, Laravel, PHP",
    location: "Indonesia"
  },
  {
    role: "Backend Developer (Bootcamp Project)",
    company: "PT. Linkdataku Solusi Indonesia (Maxy Academy)",
    company_logo: "",
    period: "April 2024 - July 2024",
    type: "Bootcamp",
    description: "Sebagai backend developer dalam program bootcamp Maxy Academy, saya berfokus pada pembangunan API yang kokoh dan skalabel untuk mendukung aplikasi koperasi Deus Code. Menggunakan framework populer seperti Node.js dan menerapkan arsitektur RESTful untuk memastikan integrasi frontend yang efisien.",
    technologies: "HTML, CSS, JavaScript, Laravel, Node JS, MySQL, Postman, Git, GitHub",
    location: "Indonesia"
  }
];

export const initialEducations = [
  {
    school: "Universitas Telkom Surabaya",
    degree: "Sarjana S1 Sistem Informasi",
    period: "2021 - 2025",
    grade: "IPK: 3.4 / 4.0",
    location: "Surabaya",
    description: "Selama masa studi, saya terlibat dalam beberapa proyek pengembangan yang memperkuat keahlian saya. Saya berperan sebagai Back-End Developer untuk website 'Kampung Bebek', di mana saya menggunakan Laravel dan MySQL untuk membangun platform dan berhasil meningkatkan visibilitasnya melalui strategi SEO."
  },
  {
    school: "SMA Negeri 2 Taruna Bhayangkara",
    degree: "SMA/Sederajat IPS",
    period: "2018 - 2021",
    grade: "Nilai: 86.00",
    location: "Banyuwangi",
    description: "Menyelesaikan pendidikan menengah atas di jurusan Ilmu Pengetahuan Sosial dengan fokus pada disiplin, kepemimpinan, dan kerja sama tim melalui berbagai kegiatan sekolah."
  }
];

export const initialProjects = [
  {
    title: "Portfolio Iqbal Musyaffa",
    title_en: "Iqbal Musyaffa Portfolio",
    description: "Website portofolio interaktif dan modern yang dibangun menggunakan Next.js dan Tailwind CSS dengan tema dark space, animasi smooth, serta integrasi CRUD MySQL.",
    description_en: "Interactive and modern portfolio website engineered with Next.js and Tailwind CSS featuring dark space aesthetics, smooth animations, and CRUD MySQL integration.",
    live_url: "https://iqbalmusyaffa.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/portofolio",
    image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    tags: "Next.js, React, Tailwind CSS, MySQL, CRUD",
    featured: 1
  },
  {
    title: "Company Profile Aneka Jaya",
    title_en: "Aneka Jaya Company Profile",
    description: "Aplikasi company profile profesional yang dikembangkan menggunakan arsitektur modern. Memiliki tampilan responsif dan performa tinggi untuk mendukung branding perusahaan.",
    description_en: "Professional corporate website engineered with a modern architecture. Features responsive design and high performance to support enterprise branding.",
    live_url: "https://anekajaya.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/company-profile-aneka",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: "Laravel, PHP, Bootstrap, MySQL, SEO",
    featured: 1
  },
  {
    title: "AutoRent - Web Sewa Mobil",
    title_en: "AutoRent - Car Rental Platform",
    description: "Platform penyewaan mobil digital (Rent Car) end-to-end yang memudahkan pelanggan melakukan pemesanan kendaraan dengan antarmuka yang bersih dan user-friendly.",
    description_en: "End-to-end digital car rental platform enabling streamlined vehicle reservations through a clean, intuitive, and user-friendly interface.",
    live_url: "https://autorent.iqbaldeveloper.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/websewamobil",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    tags: "Laravel, MySQL, Tailwind CSS, Booking System",
    featured: 1
  },
  {
    title: "E-Commerce Store Frontend",
    title_en: "E-Commerce Store Frontend",
    description: "Aplikasi antarmuka toko online modern dilengkapi fitur keranjang belanja, katalog produk interaktif, filter kategori, dan pengalaman checkout yang responsif.",
    description_en: "Modern online storefront featuring interactive product catalogs, shopping cart management, dynamic category filters, and an optimized checkout flow.",
    live_url: "https://store.iqbaldeveloper.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/e-commerce-frontend",
    image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    tags: "React, Tailwind CSS, REST API, E-Commerce",
    featured: 1
  },
  {
    title: "E-Commerce Backend RESTful API",
    title_en: "E-Commerce Backend RESTful API",
    description: "Layanan backend API (RESTful) untuk mendukung operasional E-Commerce. Menangani manajemen pengguna, autentikasi JWT, transaksi pesanan, dan integrasi database secara efisien.",
    description_en: "RESTful backend API service designed to support e-commerce operations. Efficiently handles user management, JWT authentication, order transactions, and database integration.",
    live_url: "https://apistore.iqbaldeveloper.my.id/admin/login",
    github_url: "https://github.com/iqbalmusyaffa/e-commerce-backend",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    tags: "Node.js, Express, MySQL, JWT Auth, REST API",
    featured: 1
  },
  {
    title: "OpenSky Radar Monitoring System",
    description: "Sistem pelacakan dan monitoring radar interaktif. Proyek ini memproses dan memvisualisasikan data navigasi kompleks menjadi antarmuka visual yang mudah dipahami pengguna.",
    live_url: "https://github.com/iqbalmusyaffa/opensky-radar",
    github_url: "https://github.com/iqbalmusyaffa/opensky-radar",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    tags: JSON.stringify(["JavaScript", "Data Visualization", "OpenSky API", "GIS"]),
    featured: 0
  }
];

export const initialCertificates = [
  {
    title: "Virtual Internship",
    issuer: "PT. Deus Digital Transformasi Universal",
    issue_date: "29 April - 30 Juni 2024",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Bootcamp Bersertifikat Backend",
    issuer: "Maxy Academy",
    issue_date: "25 Mei 2024 - 20 Juli 2024",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Sertifikat Hak Kekayaan Intelektual (HKI)",
    issuer: "Universitas Telkom",
    issue_date: "28 Juni 2024",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Ethical Hacker For Dummies",
    issuer: "Digital Talent Scholarship (Komdigi)",
    issue_date: "21 Oktober 2025",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Introduction to Cyber Security and Career Awareness",
    issuer: "Digital Talent Scholarship (Komdigi)",
    issue_date: "7 November 2025",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Belajar Dasar AI",
    issuer: "Dicoding Indonesia",
    issue_date: "25 April 2025",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Belajar Dasar Cloud dan Gen AI di AWS",
    issuer: "Dicoding Indonesia",
    issue_date: "25 April 2025",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Belajar Dasar Structured Query Language (SQL)",
    issuer: "Dicoding Indonesia",
    issue_date: "26 April 2025",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "AI Praktis untuk Produktivitas",
    issuer: "Dicoding Indonesia",
    issue_date: "21 Juni 2025",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    issue_date: "19 Juli 2026",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Prompt Engineering untuk Software Developer",
    issuer: "Dicoding Indonesia",
    issue_date: "19 Juli 2026",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "AI Productivity and AI API Integration",
    issuer: "Maju.ai",
    issue_date: "23 Sept - 22 Oct 2025",
    credential_url: "https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
  }
];

export const initialBlogs = [
  {
    slug: "strategi-keamanan-jwt-aes-256-nextjs",
    title: "Strategi Mengamankan Otentikasi JWT dengan Enkripsi AES-256 di Next.js App Router",
    title_en: "Securing JWT Authentication with AES-256 Encryption in Next.js App Router",
    summary: "Pelajari bagaimana mengamankan token otentikasi di aplikasi Next.js menggunakan cookie HttpOnly, enkripsi simetris AES-256-GCM, dan pencegahan serangan XSS/CSRF.",
    summary_en: "Learn how to secure authentication tokens in Next.js applications using HttpOnly cookies, AES-256-GCM symmetric encryption, and mitigation against XSS/CSRF attacks.",
    content: `Dalam arsitektur web modern dengan Next.js App Router, pengelolaan sesi otentikasi yang aman merupakan prioritas utama. Menyimpan JSON Web Token (JWT) mentah di *localStorage* atau *sessionStorage* membuka celah keamanan serius terhadap serangan Cross-Site Scripting (XSS).

### 1. Mengapa Menggunakan HttpOnly Cookie?
Dengan menyimpan token di dalam cookie yang diberi atribut \`httpOnly: true\`, JavaScript di sisi klien tidak dapat membaca token tersebut secara langsung. Selain itu, parameter \`secure: true\` (pada mode HTTPS) dan \`sameSite: 'lax'\` atau \`'strict'\` secara signifikan mereduksi risiko Cross-Site Request Forgery (CSRF).

### 2. Lapisan Tambahan: Enkripsi AES-256-GCM
Meskipun JWT memiliki tanda tangan kriptografis (*signature*), muatan (*payload*) JWT hanya di-encode dengan Base64Url sehingga siapapun yang melihat cookie tetap bisa membaca datanya. Untuk memastikan kerahasiaan penuh:
- Gunakan cipher \`aes-256-gcm\` bawaan modul \`crypto\` Node.js.
- Buat kunci enkripsi 32-byte dari rahasia environment variable.
- Setiap kali enkripsi dijalankan, gunakan Initialization Vector (IV) 12-byte acak yang unik.
- Sertakan Auth Tag (16-byte) untuk menjamin integritas data (Authenticated Encryption).

\`\`\`javascript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export function encryptPayload(text, secretKey) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return \`\${iv.toString('hex')}:\${tag.toString('hex')}:\${encrypted}\`;
}
\`\`\`

### 3. Validasi di Next.js Middleware
Next.js Middleware mengevaluasi setiap permintaan rute yang dilindungi (*protected routes*) sebelum halaman dirender. Middleware membaca cookie, mendekripsi payload, dan memeriksa masa berlaku (*expiration*) token. Jika kedaluwarsa atau tidak valid, pengguna langsung dialihkan ke halaman login tanpa kebocoran data.

Penerapan pertahanan berlapis (*defense in depth*) ini menjamin aplikasi portofolio maupun sistem produksi tetap aman dan tahan terhadap berbagai vektor serangan umum di web.`,
    content_en: `In modern web architectures utilizing Next.js App Router, managing secure authentication sessions is a fundamental requirement. Storing raw JSON Web Tokens (JWT) in *localStorage* or *sessionStorage* exposes applications to serious Cross-Site Scripting (XSS) vulnerabilities.

### 1. Why HttpOnly Cookies Matter
By storing tokens inside cookies configured with \`httpOnly: true\`, client-side JavaScript cannot directly access or extract the token. Furthermore, pairing it with \`secure: true\` (under HTTPS) and \`sameSite: 'lax'\` or \`'strict'\` drastically reduces the attack surface for Cross-Site Request Forgery (CSRF).

### 2. Added Layer: AES-256-GCM Encryption
While JWTs contain a cryptographic signature to prevent tampering, their payloads are merely Base64Url encoded—meaning anyone who inspects the cookie can view the contents. To ensure complete confidentiality:
- Utilize the \`aes-256-gcm\` authenticated cipher provided by Node.js \`crypto\`.
- Derive a 32-byte symmetric key from a protected environment secret.
- Generate a unique 12-byte Initialization Vector (IV) for every encryption pass.
- Verify the 16-byte Authentication Tag to prevent ciphertext manipulation.

\`\`\`javascript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export function encryptPayload(text, secretKey) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return \`\${iv.toString('hex')}:\${tag.toString('hex')}:\${encrypted}\`;
}
\`\`\`

### 3. Validation via Next.js Middleware
Next.js Middleware intercepts and inspects every protected route request before server-side rendering takes place. It parses the cookie, decrypts the payload, and evaluates token validity and expiry. If invalid, the request is instantly redirected to the login flow without exposing private assets.

Implementing this defense-in-depth approach ensures both portfolio apps and production enterprise systems remain resilient against contemporary web attack vectors.`,
    category: "Security & Auth",
    tags: "Next.js, JWT, AES-256, Security, Node.js",
    image_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
    read_time: "5 min read",
    published_at: "24 Nov 2026",
    is_featured: 1,
    is_published: 1
  },
  {
    slug: "optimasi-query-mysql-indexing-connection-pooling",
    title: "Optimasi Query Database MySQL: Panduan Indexing, Explain Query, dan Connection Pooling",
    title_en: "MySQL Database Query Optimization: Guide to Indexing, Explain Query, and Connection Pooling",
    summary: "Eksplorasi teknik optimasi database relasional MySQL untuk aplikasi berkinerja tinggi, mulai dari indexing komposit hingga konfigurasi pool koneksi yang efisien.",
    summary_en: "Explore MySQL relational database optimization techniques for high-performance applications, from composite indexing to efficient connection pool configurations.",
    content: `Seiring bertambahnya volume data dalam aplikasi web, performa query database seringkali menjadi *bottleneck* utama. Memahami bagaimana MySQL mengeksekusi query dan mengalokasikan memori adalah kunci rekayasa backend yang efisien.

### 1. Pahami Rencana Eksekusi dengan EXPLAIN
Sebelum menambahkan indeks sembarangan, selalu jalankan perintah \`EXPLAIN\` atau \`EXPLAIN ANALYZE\` pada query yang lambat.
Perhatikan indikator utama:
- **type**: Hindari nilai \`ALL\` (Full Table Scan). Targetkan \`ref\`, \`eq_ref\`, atau \`range\`.
- **rows**: Estimasi baris data yang harus diinspeksi engine database.
- **Extra**: Waspadai \`Using filesort\` dan \`Using temporary\`, yang menandakan MySQL membutuhkan alokasi memori tambahan atau disk untuk menyortir data.

### 2. Memanfaatkan Composite Index dengan Prinsip Leftmost Prefix
Ketika sebuah tabel sering difilter berdasarkan beberapa kolom secara bersamaan (misalnya \`status\` dan \`created_at\`), buat indeks komposit:
\`\`\`sql
CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);
\`\`\`
Perhatikan urutan kolom: MySQL hanya dapat memanfaatkan indeks ini jika query menyertakan kolom paling kiri (*leftmost prefix*).

### 3. Konfigurasi Connection Pooling yang Efektif
Membuka koneksi TCP baru untuk setiap HTTP request sangat membebani CPU dan memori server database. Gunakan connection pool seperti \`mysql2/promise\` di lingkungan Node.js:
\`\`\`javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
\`\`\`
Dengan membatasi jumlah koneksi aktif secara wajar, server database terhindar dari *exhaustion* dan dapat melayani permintaan konkuren dengan latensi yang konsisten.`,
    content_en: `As data volume scales in web applications, database query performance frequently becomes the primary backend bottleneck. Understanding how MySQL plans executions and manages memory is indispensable for high-grade engineering.

### 1. Understanding Execution Plans with EXPLAIN
Before creating arbitrary indices, inspect slow queries using \`EXPLAIN\` or \`EXPLAIN ANALYZE\`.
Critical flags to monitor:
- **type**: Avoid \`ALL\` (Full Table Scan). Aim for \`ref\`, \`eq_ref\`, or \`range\`.
- **rows**: Number of inspected rows estimated by the storage engine.
- **Extra**: Beware of \`Using filesort\` and \`Using temporary\`, which signify expensive memory or disk-based sorting overhead.

### 2. Leveraging Composite Indexes & Leftmost Prefix
When queries routinely filter across multiple fields simultaneously (e.g. \`status\` combined with \`created_at\`), construct composite indexes:
\`\`\`sql
CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);
\`\`\`
Column order is vital: MySQL relies on the leftmost prefix rule, meaning query conditions must match the initial columns of the composite index to leverage it efficiently.

### 3. Configuring Robust Connection Pooling
Opening a new TCP handshake for every incoming HTTP request drains server CPU cycles and database sockets. Configure a managed connection pool like \`mysql2/promise\` in Node.js:
\`\`\`javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
\`\`\`
Restricting pool capacity properly prevents connection thrashing and enables steady, low-latency concurrent processing.`,
    category: "Database & MySQL",
    tags: "MySQL, Database, Indexing, Performance, Backend",
    image_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    read_time: "7 min read",
    published_at: "20 Nov 2026",
    is_featured: 1,
    is_published: 1
  },
  {
    slug: "membangun-arsitektur-rest-api-skalabel-nodejs",
    title: "Membangun Arsitektur RESTful API Skalabel & Clean Code di Node.js",
    title_en: "Building Scalable RESTful API Architecture with Clean Code in Node.js",
    summary: "Panduan mendalam merancang arsitektur backend REST API yang terstruktur rapi dengan Express/Node.js, pemisahan layer controller-service-repository, dan validasi data terpusat.",
    summary_en: "In-depth guide to architecting maintainable and scalable REST APIs in Node.js/Express, separation of controller-service-repository layers, and centralized data validation.",
    content: `Arsitektur kode yang terstruktur rapi membedakan proyek prototipe dengan sistem level produksi yang siap digunakan oleh ribuan pengguna dan dikembangkan bersama tim.

### 1. Pola Controller-Service-Repository
Hindari menaruh semua query database dan logika bisnis di dalam route handler. Pisahkan tanggung jawab menjadi tiga layer utama:
1. **Controller / Route Handler**: Menerima request HTTP, mengekstrak parameter, dan memanggil service terkait. Mengembalikan status code dan respons JSON yang seragam.
2. **Service Layer**: Menyimpan seluruh *business logic*, validasi bisnis, kalkulasi harga, dan orkestrasi operasi.
3. **Repository / Data Access Layer**: Berinteraksi langsung dengan database melalui SQL query atau ORM. Layer ini mengisolasi query sehingga memudahkan migrasi atau testing.

### 2. Standarisasi Format Respons API
Klien frontend membutuhkan respons yang konsisten baik saat berhasil maupun gagal:
\`\`\`json
{
  "success": true,
  "message": "Data berhasil dimuat",
  "data": { ... },
  "meta": { "page": 1, "total": 45 }
}
\`\`\`
Dan untuk kesalahan:
\`\`\`json
{
  "success": false,
  "error": "Validasi input tidak valid",
  "details": ["Email sudah terdaftar"]
}
\`\`\`

### 3. Error Handling Terpusat
Tangani error secara elegan dengan membuat *Global Error Handling Middleware*. Jangan biarkan aplikasi melempar unhandled exception yang dapat menyebabkan server crash atau membocorkan stack trace sensitif ke pengguna publik.

Dengan struktur yang disiplin dan modular, API akan mudah diuji (*unit testing*), diperluas fiturnya, serta siap mendukung pertumbuhan bisnis jangka panjang.`,
    content_en: `Disciplined software architecture distinguishes throwaway prototypes from production-grade backend systems capable of serving thousands of users while remaining pleasant for engineering teams to maintain.

### 1. Controller-Service-Repository Pattern
Avoid embedding raw database queries and intricate domain rules directly in HTTP route handlers. Decouple responsibilities across three discrete layers:
1. **Controller / Route Layer**: Handles incoming HTTP requests, parses payloads, invokes relevant services, and returns consistent JSON responses with appropriate HTTP status codes.
2. **Service Layer**: Houses core business logic, domain validations, calculation rules, and transactional workflows.
3. **Repository / Data Access Layer**: Manages direct database interactions via SQL queries or query builders, encapsulating persistence details and making mock testing straightforward.

### 2. Standardized API Response Contracts
Frontend clients benefit immensely from predictable contract structures across all endpoints:
\`\`\`json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "meta": { "page": 1, "total": 45 }
}
\`\`\`
And for error states:
\`\`\`json
{
  "success": false,
  "error": "Invalid request payload",
  "details": ["Email is already registered"]
}
\`\`\`

### 3. Centralized Exception Handling
Harness Express or Next.js centralized error handling middleware. Never permit unhandled promise rejections to crash Node.js processes or leak sensitive internal stack traces to the public web.

A clean, modular codebase paves the way for reliable unit testing, effortless onboarding, and friction-free feature expansion.`,
    category: "Backend Architecture",
    tags: "REST API, Node.js, Express, Clean Code, Backend",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    read_time: "6 min read",
    published_at: "18 Nov 2026",
    is_featured: 0,
    is_published: 1
  }
];

