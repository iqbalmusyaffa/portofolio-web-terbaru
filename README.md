# Website Portofolio Modern Iqbal Musyaffa dengan Next.js & MySQL CRUD

Portofolio web modern dan interaktif untuk **Iqbal Musyaffa** (Software Engineer & Fullstack Developer), dibangun menggunakan **Next.js 14 (App Router)**, **Tailwind CSS**, dan database **MySQL** dengan panel **CRUD (Create, Read, Update, Delete)** lengkap.

---

## ✨ Fitur Utama

### 🎨 1. Tampilan Pengunjung (Public Portfolio)
- **Desain Modern Dark Space**: Mengadaptasi tema `#030014` dengan gradien neon ungu/cyan, efek glassmorphism, dan ambient glow.
- **Hero Section Interaktif**:
  - Avatar dengan animasi glowing ring dan status badge *Available*.
  - Efek mesin tik (Typewriter) animasi dinamis: *Software Engineer*, *Fullstack Developer*, *Problem Solver*.
  - Tombol **Lihat CV** (Google Drive) dan **Hubungi Saya**.
  - Tautan media sosial: GitHub, LinkedIn, Instagram, Facebook.
- **About Me**: Statistik proyek selesai, sertifikasi, pengalaman, dan IPK Telkom University (3.40).
- **Skills Categorized**: Pengelompokan Frontend, Backend, Bahasa Pemrograman, dan Tools dengan ikon modern Lucide.
- **Experience Timeline**: Riwayat magang dan bootcamp (PT PastiDjadi & Maxy Academy) beserta tech stacks.
- **Education Section**: Telkom University Surabaya (S1 Sistem Informasi) & SMA Negeri 2 Taruna Bhayangkara.
- **Projects Showcase & Filter**: Filter kategori (*Semua, Fullstack, Frontend, Backend*), tombol Live Demo, link GitHub, dan modal detail proyek.
- **Certifications Gallery**: Daftar 17+ sertifikat (Dicoding, Komdigi, HKI Telkom, Maju.ai, dll) dilengkapi fitur pencarian instan dan verifikasi kredensial.
- **Contact Form Terintegrasi MySQL**: Form kirim pesan yang langsung menyimpan pesan pengunjung ke tabel `messages` di MySQL.

---

### ⚡ 2. Admin CRUD Dashboard (`/admin`)
Panel khusus untuk mengelola seluruh konten website secara dinamis:
- **Autentikasi Aman**: Login berbasis sesi/cookie (Default: `admin` / `admin123`).
- **Indikator Status MySQL**: Menampilkan status koneksi database secara real-time.
- **Proyek CRUD**: Tambah proyek baru, edit, hapus, dan atur *Featured Project*.
- **Skills CRUD**: Tambah skill baru, tentukan kategori (Frontend, Backend, Languages, Tools) dan tingkat keahlian.
- **Pengalaman & Pendidikan CRUD**: Tambah, edit, dan hapus riwayat karier dan pendidikan.
- **Sertifikasi CRUD**: Kelola sertifikat dan link verifikasi.
- **Biodata & Link Sosial**: Update nama, bio, CV link, dan URL media sosial langsung dari UI.
- **Pesan Masuk (Inbox)**: Lihat pesan yang dikirim pengunjung melalui form kontak, tandai sudah dibaca, atau hapus.
- **Tombol Reset Data Awal**: Memungkinkan reset dan seeding ulang data asli kapan saja dengan 1 klik.

---

## 🛠️ Konfigurasi Database (MySQL)

Aplikasi telah dikonfigurasi dan diuji langsung dengan **MySQL (Laragon)**:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=portofolio_iqbal

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

> **Catatan**: Jika database belum dibuat, script inisialisasi otomatis membuat database `portofolio_iqbal` dan seluruh tabel relasionalnya serta mengisi data awal (seeding).

---

## 🚀 Cara Menjalankan

### 1. Inisialisasi Database (Opsional, sudah di-seed)
```bash
npm run db:init
```

### 2. Jalankan Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. Akses Admin CRUD Panel
Buka `http://localhost:3000/admin`
- **Username**: `admin`
- **Password**: `admin123`

### 4. Build untuk Production
```bash
npm run build
npm start
```
