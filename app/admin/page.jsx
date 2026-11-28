'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

// Modular Admin Components
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Modal from '@/components/admin/Modal';

// Form Components
import ProjectForm from '@/components/admin/forms/ProjectForm';
import BlogForm from '@/components/admin/forms/BlogForm';
import SkillForm from '@/components/admin/forms/SkillForm';
import ExperienceForm from '@/components/admin/forms/ExperienceForm';
import EducationForm from '@/components/admin/forms/EducationForm';
import CertificateForm from '@/components/admin/forms/CertificateForm';

// Tab Components
import ProjectsTab from '@/components/admin/tabs/ProjectsTab';
import BlogTab from '@/components/admin/tabs/BlogTab';
import SkillsTab from '@/components/admin/tabs/SkillsTab';
import ExperienceTab from '@/components/admin/tabs/ExperienceTab';
import EducationTab from '@/components/admin/tabs/EducationTab';
import CertificatesTab from '@/components/admin/tabs/CertificatesTab';
import ProfileTab from '@/components/admin/tabs/ProfileTab';
import SeoTab from '@/components/admin/tabs/SeoTab';
import MessagesTab from '@/components/admin/tabs/MessagesTab';
import SecurityTab from '@/components/admin/tabs/SecurityTab';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active Tab & Sidebar State
  const [activeTab, setActiveTab] = useState('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dbStatus, setDbStatus] = useState({ connected: false });

  // Modal / Form states
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Security Credentials states
  const [credForm, setCredForm] = useState({ username: '', email: '', newPassword: '', confirmPassword: '' });
  const [credLoading, setCredLoading] = useState(false);

  // File Upload state & handler
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUploadFile = async (e, onUploaded, folder = 'uploads') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah file');
      }

      onUploaded(data.url);
      showToast('File gambar berhasil diunggah ke assets!');
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.message || 'Upload gagal', 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3500);
  };

  // Ensure high-contrast dark theme & check authentication on load
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/login');
      const data = await res.json();
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(data.error || 'Username atau password salah');
      }
    } catch (err) {
      setLoginError('Gagal melakukan login');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  const loadAllData = async () => {
    try {
      const [pRes, prRes, blRes, sRes, eRes, edRes, cRes, mRes, dbRes] = await Promise.all([
        fetch('/api/profile').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/blogs').then((r) => r.json()),
        fetch('/api/skills').then((r) => r.json()),
        fetch('/api/experiences').then((r) => r.json()),
        fetch('/api/educations').then((r) => r.json()),
        fetch('/api/certificates').then((r) => r.json()),
        fetch('/api/messages').then((r) => r.json()),
        fetch('/api/db/init').then((r) => r.json())
      ]);

      if (pRes?.data) setProfile(pRes.data);
      if (prRes?.data) setProjects(prRes.data);
      if (blRes?.data) setBlogs(blRes.data);
      if (sRes?.data) setSkills(sRes.data);
      if (eRes?.data) setExperiences(eRes.data);
      if (edRes?.data) setEducations(edRes.data);
      if (cRes?.data) setCertificates(cRes.data);
      if (mRes?.data) setMessages(mRes.data);
      if (dbRes?.status) setDbStatus(dbRes.status);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleSeedReset = async () => {
    if (!confirm('Apakah Anda yakin ingin me-reset database dan mengisi ulang data awal Iqbal Musyaffa?')) return;
    try {
      const res = await fetch('/api/db/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_reset' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal reset database', 'error');
    }
  };

  // ===================== CRUD OPERATIONS =====================

  // Project CRUD
  const saveProject = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem.id;
    try {
      const res = await fetch('/api/projects', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Proyek berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
        setModalType(null);
        setEditingItem(null);
        loadAllData();
      } else {
        showToast(data.error || 'Gagal menyimpan', 'error');
      }
    } catch (e) {
      showToast('Gagal menyimpan proyek', 'error');
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Hapus proyek ini?')) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Proyek berhasil dihapus');
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal menghapus proyek', 'error');
    }
  };

  // Blog CRUD
  const saveBlog = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem.id;
    try {
      const res = await fetch('/api/blogs', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Artikel blog berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
        setModalType(null);
        setEditingItem(null);
        loadAllData();
      } else {
        showToast(data.error || 'Gagal menyimpan artikel blog', 'error');
      }
    } catch (e) {
      showToast('Gagal menyimpan artikel blog', 'error');
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Hapus artikel blog ini?')) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Artikel blog berhasil dihapus');
        loadAllData();
      } else {
        showToast(data.error || 'Gagal menghapus', 'error');
      }
    } catch (e) {
      showToast('Gagal menghapus artikel blog', 'error');
    }
  };

  // Skill CRUD
  const saveSkill = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem.id;
    try {
      const res = await fetch('/api/skills', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Skill berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
        setModalType(null);
        setEditingItem(null);
        loadAllData();
      } else {
        showToast(data.error || 'Gagal menyimpan', 'error');
      }
    } catch (e) {
      showToast('Gagal menyimpan skill', 'error');
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm('Hapus skill ini?')) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Skill berhasil dihapus');
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal menghapus skill', 'error');
    }
  };

  // Experience CRUD
  const saveExperience = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem.id;
    try {
      const res = await fetch('/api/experiences', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Pengalaman berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
        setModalType(null);
        setEditingItem(null);
        loadAllData();
      } else {
        showToast(data.error || 'Gagal menyimpan', 'error');
      }
    } catch (e) {
      showToast('Gagal menyimpan pengalaman', 'error');
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm('Hapus pengalaman ini?')) return;
    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Pengalaman berhasil dihapus');
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal menghapus pengalaman', 'error');
    }
  };

  // Education CRUD
  const saveEducation = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem.id;
    try {
      const res = await fetch('/api/educations', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Pendidikan berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
        setModalType(null);
        setEditingItem(null);
        loadAllData();
      } else {
        showToast(data.error || 'Gagal menyimpan', 'error');
      }
    } catch (e) {
      showToast('Gagal menyimpan pendidikan', 'error');
    }
  };

  const deleteEducation = async (id) => {
    if (!confirm('Hapus riwayat pendidikan ini?')) return;
    try {
      const res = await fetch(`/api/educations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Pendidikan berhasil dihapus');
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal menghapus pendidikan', 'error');
    }
  };

  // Certificate CRUD
  const saveCertificate = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem.id;
    try {
      const res = await fetch('/api/certificates', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Sertifikat berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
        setModalType(null);
        setEditingItem(null);
        loadAllData();
      } else {
        showToast(data.error || 'Gagal menyimpan', 'error');
      }
    } catch (e) {
      showToast('Gagal menyimpan sertifikat', 'error');
    }
  };

  const deleteCertificate = async (id) => {
    if (!confirm('Hapus sertifikat ini?')) return;
    try {
      const res = await fetch(`/api/certificates?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Sertifikat berhasil dihapus');
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal menghapus sertifikat', 'error');
    }
  };

  // Profile Save
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Profil berhasil disimpan di MySQL!');
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal menyimpan profil', 'error');
    }
  };

  // Message Delete & Mark Read
  const deleteMessage = async (id) => {
    if (!confirm('Hapus pesan ini?')) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Pesan berhasil dihapus');
        loadAllData();
      }
    } catch (e) {
      showToast('Gagal menghapus pesan', 'error');
    }
  };

  const toggleMessageRead = async (id, isRead) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: !isRead })
      });
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Security Credentials Update
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (credForm.newPassword !== credForm.confirmPassword) {
      showToast('Konfirmasi password tidak cocok', 'error');
      return;
    }
    if (credForm.newPassword.length < 6) {
      showToast('Password baru minimal 6 karakter', 'error');
      return;
    }
    setCredLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_username: credForm.username ? credForm.username.trim() : undefined,
          new_email: credForm.email ? credForm.email.trim() : undefined,
          new_password: credForm.newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Kredensial login admin (username/email/password) berhasil diperbarui!', 'success');
        setCredForm({ username: '', email: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.error || 'Gagal memperbarui kredensial', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setCredLoading(false);
    }
  };

  // Label mapping for current tab breadcrumb
  const tabLabels = {
    projects: 'Proyek',
    blogs: 'Blog & Artikel',
    skills: 'Skills',
    experience: 'Pengalaman',
    education: 'Pendidikan',
    certificates: 'Sertifikasi',
    profile: 'Biodata & About Me',
    seo: 'Pengaturan SEO',
    messages: 'Pesan Masuk',
    security: 'Keamanan Akun'
  };

  // ===================== LOADING SCREEN =====================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-300">Memuat Panel Admin...</p>
        </div>
      </div>
    );
  }

  // ===================== LOGIN SCREEN =====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center p-4 bg-grid-pattern relative">
        <div className="bg-glow-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600/30" />

        <div className="bg-[#0b081e] max-w-md w-full rounded-3xl border border-purple-500/30 p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8245ec] to-[#e879f9] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-purple-600/40">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-white">
              Admin CRUD Panel
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Portofolio Iqbal Musyaffa - Database MySQL
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs mb-5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1.5">
                Username atau Email
              </label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Masukkan username atau email admin"
                className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 focus:bg-[#1a1344] transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 focus:bg-[#1a1344] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] via-[#9333ea] to-[#a855f7] hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-purple-600/40 transition-all cursor-pointer"
            >
              Masuk ke Admin
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===================== ADMIN DASHBOARD =====================
  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col lg:flex-row font-sans">
      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-medium animate-fadeIn ${
            toast.type === 'error'
              ? 'bg-rose-900 border border-rose-500 text-white'
              : 'bg-emerald-900 border border-emerald-500 text-white'
          }`}
        >
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        counts={{
          projects: projects.length,
          blogs: blogs.length,
          skills: skills.length,
          experiences: experiences.length,
          educations: educations.length,
          certificates: certificates.length,
          unreadMessages: messages.filter((m) => !m.is_read).length
        }}
        onSeedReset={handleSeedReset}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Workspace */}
      <main className="flex-1 min-w-0 bg-[#030014] overflow-y-auto">
        {/* Top Header Bar */}
        <AdminHeader
          activeTab={activeTab}
          currentTabLabel={tabLabels[activeTab]}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onAdd={() => {
                setEditingItem({
                  title: '',
                  description: '',
                  live_url: '',
                  github_url: '',
                  image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
                  tags: 'Next.js, React, MySQL',
                  featured: 1
                });
                setModalType('project');
              }}
              onEdit={(proj) => {
                setEditingItem({ ...proj });
                setModalType('project');
              }}
              onDelete={deleteProject}
            />
          )}

          {activeTab === 'blogs' && (
            <BlogTab
              blogs={blogs}
              onAdd={() => {
                setEditingItem({
                  title: '',
                  title_en: '',
                  slug: '',
                  summary: '',
                  summary_en: '',
                  content: '',
                  content_en: '',
                  category: 'Backend Architecture',
                  tags: 'Next.js, MySQL, REST API',
                  image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
                  read_time: '5 min read',
                  published_at: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                  is_featured: 0,
                  is_published: 1
                });
                setModalType('blog');
              }}
              onEdit={(blog) => {
                setEditingItem({ ...blog });
                setModalType('blog');
              }}
              onDelete={deleteBlog}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsTab
              skills={skills}
              onAdd={() => {
                setEditingItem({ category: 'Frontend', name: '', icon: 'Code', level: 'Advanced' });
                setModalType('skill');
              }}
              onEdit={(skill) => {
                setEditingItem({ ...skill });
                setModalType('skill');
              }}
              onDelete={deleteSkill}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceTab
              experiences={experiences}
              onAdd={() => {
                setEditingItem({
                  role: '',
                  company: '',
                  company_logo: '',
                  period: '',
                  type: 'Work',
                  description: '',
                  technologies: 'React, Node.js, MySQL',
                  location: 'Indonesia'
                });
                setModalType('experience');
              }}
              onEdit={(exp) => {
                setEditingItem({ ...exp });
                setModalType('experience');
              }}
              onDelete={deleteExperience}
            />
          )}

          {activeTab === 'education' && (
            <EducationTab
              educations={educations}
              onAdd={() => {
                setEditingItem({
                  school: '',
                  degree: '',
                  period: '',
                  grade: '',
                  location: '',
                  description: ''
                });
                setModalType('education');
              }}
              onEdit={(edu) => {
                setEditingItem({ ...edu });
                setModalType('education');
              }}
              onDelete={deleteEducation}
            />
          )}

          {activeTab === 'certificates' && (
            <CertificatesTab
              certificates={certificates}
              onAdd={() => {
                setEditingItem({
                  title: '',
                  issuer: '',
                  issue_date: '',
                  credential_url: 'https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing',
                  image_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80'
                });
                setModalType('certificate');
              }}
              onEdit={(cert) => {
                setEditingItem({ ...cert });
                setModalType('certificate');
              }}
              onDelete={deleteCertificate}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              setProfile={setProfile}
              onSave={saveProfile}
              onUploadFile={handleUploadFile}
            />
          )}

          {activeTab === 'seo' && (
            <SeoTab
              profile={profile}
              setProfile={setProfile}
              onSave={saveProfile}
              onUploadFile={handleUploadFile}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesTab
              messages={messages}
              onToggleRead={toggleMessageRead}
              onDelete={deleteMessage}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              credForm={credForm}
              setCredForm={setCredForm}
              credLoading={credLoading}
              onUpdateCredentials={handleUpdateCredentials}
            />
          )}
        </div>
      </main>

      {/* 3. Reusable Responsive Modal Manager */}
      <Modal
        isOpen={!!modalType && !!editingItem}
        onClose={() => {
          setModalType(null);
          setEditingItem(null);
        }}
        title={`${editingItem?.id ? 'Edit' : 'Tambah'} ${
          modalType === 'project'
            ? 'Proyek'
            : modalType === 'blog'
            ? 'Artikel Blog'
            : modalType === 'skill'
            ? 'Skill'
            : modalType === 'experience'
            ? 'Pengalaman'
            : modalType === 'education'
            ? 'Pendidikan'
            : modalType === 'certificate'
            ? 'Sertifikasi'
            : ''
        }`}
        subtitle={
          editingItem?.id
            ? 'Perbarui data yang sudah tersimpan'
            : 'Tambahkan item baru ke portfolio'
        }
        maxWidth={
          modalType === 'blog'
            ? 'max-w-4xl lg:max-w-5xl'
            : modalType === 'project' || modalType === 'experience'
            ? 'max-w-2xl sm:max-w-3xl'
            : 'max-w-lg sm:max-w-xl'
        }
      >
        {modalType === 'project' && editingItem && (
          <ProjectForm
            item={editingItem}
            setItem={setEditingItem}
            skills={skills}
            onSubmit={saveProject}
            onClose={() => {
              setModalType(null);
              setEditingItem(null);
            }}
            onUploadFile={handleUploadFile}
          />
        )}

        {modalType === 'blog' && editingItem && (
          <BlogForm
            item={editingItem}
            setItem={setEditingItem}
            onSubmit={saveBlog}
            onClose={() => {
              setModalType(null);
              setEditingItem(null);
            }}
            onUploadFile={handleUploadFile}
          />
        )}

        {modalType === 'skill' && editingItem && (
          <SkillForm
            item={editingItem}
            setItem={setEditingItem}
            onSubmit={saveSkill}
            onClose={() => {
              setModalType(null);
              setEditingItem(null);
            }}
            onUploadFile={handleUploadFile}
            uploadingImage={uploadingImage}
          />
        )}

        {modalType === 'experience' && editingItem && (
          <ExperienceForm
            item={editingItem}
            setItem={setEditingItem}
            skills={skills}
            onSubmit={saveExperience}
            onClose={() => {
              setModalType(null);
              setEditingItem(null);
            }}
            onUploadFile={handleUploadFile}
            uploadingImage={uploadingImage}
          />
        )}

        {modalType === 'education' && editingItem && (
          <EducationForm
            item={editingItem}
            setItem={setEditingItem}
            onSubmit={saveEducation}
            onClose={() => {
              setModalType(null);
              setEditingItem(null);
            }}
          />
        )}

        {modalType === 'certificate' && editingItem && (
          <CertificateForm
            item={editingItem}
            setItem={setEditingItem}
            onSubmit={saveCertificate}
            onClose={() => {
              setModalType(null);
              setEditingItem(null);
            }}
            onUploadFile={handleUploadFile}
          />
        )}
      </Modal>
    </div>
  );
}
