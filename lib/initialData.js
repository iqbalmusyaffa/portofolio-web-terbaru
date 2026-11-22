export const initialProfile = {
  name: "Iqbal Musyaffa",
  full_name: "Iqbal Musyaffa Yusa'Bbih Lillah",
  tagline: "Software Engineer",
  roles: JSON.stringify(["Software Engineer", "Fullstack Developer", "Problem Solver"]),
  bio: "Saya adalah lulusan S1 Sistem Informasi Universitas Telkom Surabaya yang memiliki passion mendalam pada perancangan dan pembangunan aplikasi web yang scalable, responsif, dan mudah digunakan.",
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
  code_philosophy_title: "Clean, Fast & Impactful",
  code_philosophy_desc: "Fokus utama saya bukan sekadar menulis baris kode, melainkan menciptakan sistem yang stabil, mudah dirawat, dan memberikan dampak positif bagi para penggunanya.",
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
    period: "Juni 2024 - November 2024",
    type: "Internship",
    description: "Sebagai Full Stack Developer Intern, saya bertanggung jawab dalam pengembangan end-to-end aplikasi web, mulai dari pembuatan antarmuka pengguna yang responsif menggunakan HTML, CSS, JavaScript, dan Bootstrap, hingga pengelolaan logika backend dengan PHP dan Laravel.",
    technologies: JSON.stringify(["HTML", "CSS", "JavaScript", "Bootstrap", "Git", "GitHub", "Laravel", "PHP"]),
    location: "Indonesia"
  },
  {
    role: "Backend Developer (Bootcamp Project)",
    company: "PT. Linkdataku Solusi Indonesia (Maxy Academy)",
    period: "April 2024 - July 2024",
    type: "Bootcamp",
    description: "Sebagai backend developer dalam program bootcamp Maxy Academy, saya berfokus pada pembangunan API yang kokoh dan skalabel untuk mendukung aplikasi koperasi Deus Code. Menggunakan framework populer seperti Node.js dan menerapkan arsitektur RESTful untuk memastikan integrasi frontend yang efisien.",
    technologies: JSON.stringify(["HTML", "CSS", "JavaScript", "Laravel", "Node JS", "MySQL", "Postman", "Git", "GitHub"]),
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
    description: "Website portofolio interaktif dan modern yang dibangun menggunakan Next.js dan Tailwind CSS dengan tema dark space, animasi smooth, serta integrasi CRUD MySQL.",
    live_url: "https://iqbalmusyaffa.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/portofolio",
    image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    tags: JSON.stringify(["Next.js", "React", "Tailwind CSS", "MySQL", "CRUD"]),
    featured: 1
  },
  {
    title: "Company Profile Aneka Jaya",
    description: "Aplikasi company profile profesional yang dikembangkan menggunakan arsitektur modern. Memiliki tampilan responsif dan performa tinggi untuk mendukung branding perusahaan.",
    live_url: "https://anekajaya.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/company-profile-aneka",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: JSON.stringify(["Laravel", "PHP", "Bootstrap", "MySQL", "SEO"]),
    featured: 1
  },
  {
    title: "AutoRent - Web Sewa Mobil",
    description: "Platform penyewaan mobil digital (Rent Car) end-to-end yang memudahkan pelanggan melakukan pemesanan kendaraan dengan antarmuka yang bersih dan user-friendly.",
    live_url: "https://autorent.iqbaldeveloper.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/websewamobil",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    tags: JSON.stringify(["Laravel", "MySQL", "Tailwind CSS", "Booking System"]),
    featured: 1
  },
  {
    title: "E-Commerce Store Frontend",
    description: "Aplikasi antarmuka toko online modern dilengkapi fitur keranjang belanja, katalog produk interaktif, filter kategori, dan pengalaman checkout yang responsif.",
    live_url: "https://store.iqbaldeveloper.my.id/",
    github_url: "https://github.com/iqbalmusyaffa/e-commerce-frontend",
    image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    tags: JSON.stringify(["React", "Tailwind CSS", "REST API", "E-Commerce"]),
    featured: 1
  },
  {
    title: "E-Commerce Backend RESTful API",
    description: "Layanan backend API (RESTful) untuk mendukung operasional E-Commerce. Menangani manajemen pengguna, autentikasi JWT, transaksi pesanan, dan integrasi database secara efisien.",
    live_url: "https://apistore.iqbaldeveloper.my.id/admin/login",
    github_url: "https://github.com/iqbalmusyaffa/e-commerce-backend",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    tags: JSON.stringify(["Node.js", "Express", "MySQL", "JWT Auth", "REST API"]),
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
