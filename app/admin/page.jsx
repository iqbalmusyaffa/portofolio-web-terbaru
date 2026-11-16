'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  FolderGit2,
  Zap,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  User,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  LogOut,
  ArrowLeft,
  Eye,
  Database,
  Check,
  X,
  Search,
  Sparkles,
  Globe
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('projects');

  // Data states
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
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
  const [credForm, setCredForm] = useState({ username: '', newPassword: '', confirmPassword: '' });
  const [credLoading, setCredLoading] = useState(false);

  // Ensure Admin page always stays in high-contrast dark theme
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
          new_password: credForm.newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Username & password admin berhasil diperbarui di database!', 'success');
        setCredForm({ username: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.error || 'Gagal memperbarui kredensial', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setCredLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3500);
  };

  const loadAllData = async () => {
    try {
      const [pRes, prRes, sRes, eRes, edRes, cRes, mRes, dbRes] = await Promise.all([
        fetch('/api/profile').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/skills').then(r => r.json()),
        fetch('/api/experiences').then(r => r.json()),
        fetch('/api/educations').then(r => r.json()),
        fetch('/api/certificates').then(r => r.json()),
        fetch('/api/messages').then(r => r.json()),
        fetch('/api/db/init').then(r => r.json())
      ]);

      if (pRes?.data) setProfile(pRes.data);
      if (prRes?.data) setProjects(prRes.data);
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

  // ===================== CRUD HANDLERS =====================

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
                Username
              </label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Masukkan username admin"
                className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 focus:bg-[#1a1344] transition-all"
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
    <div className="min-h-screen bg-[#030014] text-white flex flex-col font-sans">
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

      {/* Top Header */}
      <header className="border-b border-purple-900/30 bg-[#070518]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-[#a78bfa]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-base text-white">
              Admin Panel
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleSeedReset}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 rounded-xl transition-all"
            title="Reset dan isi ulang data awal website"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Awal</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">Lihat Web</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-purple-900/30">
          {[
            { id: 'projects', label: 'Proyek', icon: FolderGit2, count: projects.length },
            { id: 'skills', label: 'Skills', icon: Zap, count: skills.length },
            { id: 'experience', label: 'Pengalaman', icon: Briefcase, count: experiences.length },
            { id: 'education', label: 'Pendidikan', icon: GraduationCap, count: educations.length },
            { id: 'certificates', label: 'Sertifikasi', icon: Award, count: certificates.length },
            { id: 'profile', label: 'Biodata & About Me', icon: User },
            { id: 'seo', label: 'Pengaturan SEO', icon: Globe },
            { id: 'messages', label: 'Pesan Masuk', icon: MessageSquare, count: messages.filter(m => !m.is_read).length, isBadge: true },
            { id: 'security', label: 'Keamanan Akun', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#8245ec] to-[#9333ea] text-white shadow-md shadow-purple-900/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      tab.isBadge && tab.count > 0
                        ? 'bg-rose-500 text-white font-bold animate-pulse'
                        : active
                        ? 'bg-purple-950 text-purple-200'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==================== TAB 1: PROJECTS ==================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Kelola Proyek</h2>
                <p className="text-xs text-gray-400">Total {projects.length} proyek tersimpan di MySQL</p>
              </div>
              <button
                onClick={() => {
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-[#0b081e] rounded-2xl overflow-hidden border border-purple-500/20 flex flex-col justify-between shadow-xl">
                  <div className="h-40 relative bg-black/40 overflow-hidden">
                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                    {proj.featured ? (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/90 text-purple-200 border border-purple-500/40">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base mb-1">{proj.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{proj.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-purple-900/20">
                      <div className="flex items-center gap-2">
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" className="text-xs text-purple-300 hover:text-white flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Live
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingItem({ ...proj });
                            setModalType('project');
                          }}
                          className="p-1.5 rounded-lg text-purple-300 hover:bg-purple-900/40 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SKILLS ==================== */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Kelola Skills</h2>
                <p className="text-xs text-gray-400">Total {skills.length} skills tersimpan di MySQL</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem({ category: 'Frontend', name: '', icon: 'Code', level: 'Advanced' });
                  setModalType('skill');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((s) => (
                <div key={s.id} className="bg-[#0b081e] p-4 rounded-2xl border border-purple-500/20 flex items-center justify-between group shadow-lg">
                  <div>
                    <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">{s.category}</span>
                    <h4 className="font-bold text-white text-sm">{s.name}</h4>
                    <span className="text-xs text-gray-400">{s.level}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditingItem({ ...s });
                        setModalType('skill');
                      }}
                      className="p-1.5 rounded text-purple-300 hover:bg-white/10 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSkill(s.id)}
                      className="p-1.5 rounded text-rose-400 hover:bg-white/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: EXPERIENCE ==================== */}
        {activeTab === 'experience' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Kelola Pengalaman</h2>
                <p className="text-xs text-gray-400">Total {experiences.length} pengalaman kerja / bootcamp</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem({
                    role: '',
                    company: '',
                    period: '',
                    type: 'Work',
                    description: '',
                    technologies: 'React, Node.js, MySQL',
                    location: 'Indonesia'
                  });
                  setModalType('experience');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengalaman</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-[#0b081e] p-6 rounded-2xl border border-purple-500/20 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-xl">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-base">{exp.role}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-300">{exp.company} • {exp.location}</div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem({ ...exp });
                        setModalType('experience');
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-purple-900/40 text-purple-300 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: EDUCATION ==================== */}
        {activeTab === 'education' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Kelola Pendidikan</h2>
                <p className="text-xs text-gray-400">Total {educations.length} riwayat pendidikan</p>
              </div>
              <button
                onClick={() => {
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pendidikan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {educations.map((edu) => (
                <div key={edu.id} className="bg-[#0b081e] p-6 rounded-2xl border border-purple-500/20 flex flex-col justify-between shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                        {edu.period}
                      </span>
                      {edu.grade && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                          {edu.grade}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base">{edu.school}</h3>
                    <div className="text-xs text-purple-300 font-semibold">{edu.degree}</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{edu.description}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-purple-900/20">
                    <button
                      onClick={() => {
                        setEditingItem({ ...edu });
                        setModalType('education');
                      }}
                      className="p-1.5 rounded text-purple-300 hover:bg-white/10 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1.5 rounded text-rose-400 hover:bg-white/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: CERTIFICATES ==================== */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Kelola Sertifikasi</h2>
                <p className="text-xs text-gray-400">Total {certificates.length} sertifikat tersimpan di MySQL</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem({
                    title: '',
                    issuer: '',
                    issue_date: '',
                    credential_url: 'https://drive.google.com/drive/folders/1Pot8GeUM6s_4J7n_8VlcULaMaycx1sD4?usp=sharing',
                    image_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80'
                  });
                  setModalType('certificate');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Sertifikat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-[#0b081e] p-5 rounded-2xl border border-purple-500/20 flex flex-col justify-between shadow-xl">
                  <div>
                    <span className="text-[10px] text-purple-400 font-medium">{cert.issue_date}</span>
                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{cert.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{cert.issuer}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-purple-900/20">
                    {cert.credential_url ? (
                      <a href={cert.credential_url} target="_blank" className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Verifikasi
                      </a>
                    ) : <span />}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem({ ...cert });
                          setModalType('certificate');
                        }}
                        className="p-1 rounded text-purple-300 hover:bg-white/10 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCertificate(cert.id)}
                        className="p-1 rounded text-rose-400 hover:bg-white/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: PROFILE & ABOUT ME ==================== */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl bg-[#0b081e] p-6 sm:p-8 rounded-3xl border border-purple-500/20 space-y-8 animate-fadeIn shadow-2xl">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Biodata & Konten About Me</h2>
              <p className="text-xs text-gray-400">Kelola identitas utama, ringkasan bio, checklist keahlian, dan filosofi kode yang tampil di website</p>
            </div>

            <form onSubmit={saveProfile} className="space-y-6">
              {/* Bagian 1: Identitas Utama */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-purple-300 border-b border-purple-900/30 pb-2">
                  1. Identitas Utama & Kontak
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Nama Tampilan</label>
                    <input
                      type="text"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={profile.tagline || ''}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      placeholder="Software Engineer"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Alamat Email</label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Lokasi</label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Foto Avatar URL</label>
                    <input
                      type="text"
                      value={profile.avatar_url || ''}
                      onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                      placeholder="/foto2.jpg"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Link Google Drive CV</label>
                    <input
                      type="text"
                      value={profile.cv_url || ''}
                      onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">File / Link Direct PDF CV</label>
                    <input
                      type="text"
                      value={profile.cv_pdf_url || ''}
                      onChange={(e) => setProfile({ ...profile, cv_pdf_url: e.target.value })}
                      placeholder="/cv-iqbal-musyaffa.pdf"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Media Sosial */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-purple-300 border-b border-purple-900/30 pb-2">
                  2. Media Sosial
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profile.github_url || ''}
                      onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile.linkedin_url || ''}
                      onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={profile.instagram_url || ''}
                      onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={profile.facebook_url || ''}
                      onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 3: Konten Section About Me */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-purple-300 border-b border-purple-900/30 pb-2">
                  3. Konten Section About Me
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1">Judul Utama About</label>
                  <input
                    type="text"
                    value={profile.about_title || ''}
                    onChange={(e) => setProfile({ ...profile, about_title: e.target.value })}
                    placeholder="Dedikasi untuk Solusi Digital Berkualitas"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Paragraf 1 Bio</label>
                    <textarea
                      rows={4}
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Saya adalah lulusan S1 Sistem Informasi Universitas Telkom Surabaya..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Paragraf 2 Bio</label>
                    <textarea
                      rows={4}
                      value={profile.about_bio_2 || ''}
                      onChange={(e) => setProfile({ ...profile, about_bio_2: e.target.value })}
                      placeholder="Dengan pengalaman dalam ekosistem modern seperti Next.js, React, Node.js..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1">
                    Checklist Poin Keahlian / Highlights (Pisahkan dengan baris baru / Enter)
                  </label>
                  <textarea
                    rows={5}
                    value={
                      (() => {
                        if (!profile.about_highlights) return '';
                        try {
                          const parsed = typeof profile.about_highlights === 'string'
                            ? (profile.about_highlights.startsWith('[') ? JSON.parse(profile.about_highlights) : profile.about_highlights)
                            : profile.about_highlights;
                          return Array.isArray(parsed) ? parsed.join('\n') : String(profile.about_highlights);
                        } catch (e) {
                          return String(profile.about_highlights || '');
                        }
                      })()
                    }
                    onChange={(e) => setProfile({ ...profile, about_highlights: e.target.value })}
                    placeholder="Pengembangan web modern end-to-end (Frontend & Backend)&#10;Arsitektur RESTful API performa tinggi & keamanan JWT&#10;Optimasi database relasional MySQL & query efisien"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm font-mono text-xs focus:outline-none focus:border-purple-400"
                  />
                  <span className="text-[11px] text-gray-400">Setiap baris akan otomatis menjadi 1 item checklist berikon centang di website.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Keterangan Lokasi & Ketersediaan</label>
                    <textarea
                      rows={2}
                      value={profile.availability_status || ''}
                      onChange={(e) => setProfile({ ...profile, availability_status: e.target.value })}
                      placeholder="Terbuka untuk kesempatan kerja Full-time, Remote, Hybrid, maupun Freelance..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Nilai IPK Telkom</label>
                    <input
                      type="text"
                      value={profile.gpa_score || ''}
                      onChange={(e) => setProfile({ ...profile, gpa_score: e.target.value })}
                      placeholder="3.40"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Judul Filosofi Kode</label>
                    <input
                      type="text"
                      value={profile.code_philosophy_title || ''}
                      onChange={(e) => setProfile({ ...profile, code_philosophy_title: e.target.value })}
                      placeholder="Clean, Fast & Impactful"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-200 mb-1">Deskripsi Filosofi Kode</label>
                    <textarea
                      rows={3}
                      value={profile.code_philosophy_desc || ''}
                      onChange={(e) => setProfile({ ...profile, code_philosophy_desc: e.target.value })}
                      placeholder="Fokus utama saya bukan sekadar menulis baris kode, melainkan menciptakan sistem..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-900/30">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Biodata & About Me</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== TAB 7: SEO & METADATA ==================== */}
        {activeTab === 'seo' && (
          <div className="max-w-4xl bg-[#0b081e] p-6 sm:p-8 rounded-3xl border border-purple-500/20 space-y-8 animate-fadeIn shadow-2xl">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold font-heading text-white">Pengaturan SEO & OpenGraph</h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Atur judul, deskripsi pencarian Google, kata kunci, dan gambar thumbnail sosial media untuk WhatsApp, Facebook, Twitter/X, dan LinkedIn.
              </p>
            </div>

            {/* Live Google Search Results Snippet Preview */}
            <div className="p-5 rounded-2xl bg-[#030014] border border-purple-500/30 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Hasil Pencarian Google (Live Search Snippet)</span>
              </div>

              <div className="pt-2">
                <div className="text-[12px] text-gray-400 font-mono truncate">
                  {profile.canonical_url || 'https://iqbalmusyaffa.my.id'}
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-[#8ab4f8] hover:underline cursor-pointer truncate">
                  {profile.meta_title || `${profile.name || 'Iqbal Musyaffa'} - Software Engineer & Fullstack Developer`}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                  {profile.meta_description || profile.bio || 'Portofolio profesional Iqbal Musyaffa - Software Engineer & Fullstack Developer lulusan Telkom University Surabaya.'}
                </p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  Judul Website (Meta Title) *
                </label>
                <input
                  type="text"
                  required
                  value={profile.meta_title || ''}
                  onChange={(e) => setProfile({ ...profile, meta_title: e.target.value })}
                  placeholder="Iqbal Musyaffa - Software Engineer & Fullstack Developer"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
                <span className="text-[11px] text-gray-400">Tampil sebagai judul tab browser dan judul link di Google (Ideal: 50-60 karakter).</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-200">
                    Deskripsi Mesin Pencari (Meta Description) *
                  </label>
                  <span className="text-[11px] text-purple-300">
                    {(profile.meta_description || '').length} / 160 karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={profile.meta_description || ''}
                  onChange={(e) => setProfile({ ...profile, meta_description: e.target.value })}
                  placeholder="Portofolio resmi Iqbal Musyaffa - Software Engineer & Fullstack Developer lulusan Telkom University Surabaya..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
                <span className="text-[11px] text-gray-400">Tampil sebagai ringkasan teks di bawah judul pencarian Google dan saat dibagikan ke WhatsApp.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  Kata Kunci Pencarian (Meta Keywords)
                </label>
                <textarea
                  rows={2}
                  value={profile.meta_keywords || ''}
                  onChange={(e) => setProfile({ ...profile, meta_keywords: e.target.value })}
                  placeholder="Iqbal Musyaffa, Software Engineer, Fullstack Developer, Next.js, React, Laravel, MySQL, Portfolio"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
                <span className="text-[11px] text-gray-400">Pisahkan setiap kata kunci pencarian dengan koma (,).</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1">
                    URL Domain Resmi (Canonical URL)
                  </label>
                  <input
                    type="text"
                    value={profile.canonical_url || ''}
                    onChange={(e) => setProfile({ ...profile, canonical_url: e.target.value })}
                    placeholder="https://iqbalmusyaffa.my.id/"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                  <span className="text-[11px] text-gray-400">URL utama situs untuk mencegah duplikasi konten SEO.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1">
                    Gambar Thumbnail Sosial (OpenGraph Image URL)
                  </label>
                  <input
                    type="text"
                    value={profile.og_image || ''}
                    onChange={(e) => setProfile({ ...profile, og_image: e.target.value })}
                    placeholder="/foto2.jpg"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                  <span className="text-[11px] text-gray-400">Gambar kartu pratinjau yang muncul saat link website dikirim di WhatsApp atau sosmed.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  Google Search Console Verification Tag (Opsional)
                </label>
                <input
                  type="text"
                  value={profile.google_site_verification || ''}
                  onChange={(e) => setProfile({ ...profile, google_site_verification: e.target.value })}
                  placeholder="Kode verifikasi Google Search Console (content code)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
                <span className="text-[11px] text-gray-400">Masukkan kode verifikasi HTML tag Google untuk memantau performa ranking website Anda.</span>
              </div>

              <div className="pt-4 border-t border-purple-900/30">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-[#8245ec] to-[#a855f7] shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan SEO & Metadata</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== TAB 7: MESSAGES ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Pesan Masuk (Kontak Form)</h2>
              <p className="text-xs text-gray-400">Pesan dari pengunjung yang tersimpan di tabel messages MySQL</p>
            </div>

            {messages.length === 0 ? (
              <div className="bg-[#0b081e] p-12 text-center rounded-3xl border border-purple-500/20 text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-purple-400/50" />
                <p className="text-sm">Belum ada pesan masuk dari form kontak.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`bg-[#0b081e] p-5 rounded-2xl border transition-all ${
                      m.is_read
                        ? 'border-purple-900/20 opacity-75'
                        : 'border-purple-500/50 shadow-md shadow-purple-950/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {!m.is_read && (
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                        )}
                        <h4 className="font-bold text-white text-sm sm:text-base">{m.name}</h4>
                        <span className="text-xs text-gray-400">&lt;{m.email}&gt;</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{new Date(m.created_at).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-purple-300 mb-2">
                      Subjek: {m.subject}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-[#130f2e] p-3 rounded-xl border border-purple-500/20 mb-4">
                      {m.message}
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleMessageRead(m.id, m.is_read)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                      >
                        {m.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                      </button>
                      <a
                        href={`mailto:${m.email}?subject=Balasan: ${encodeURIComponent(m.subject)}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-900/40 text-purple-200 border border-purple-500/30"
                      >
                        Balas via Email
                      </a>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 8: SECURITY (CHANGE CREDENTIALS) ==================== */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Keamanan Akun & Kredensial</h2>
              <p className="text-xs text-gray-400">
                Ubah username dan password akun admin. Password disimpan dalam format hash kriptografis PBKDF2-SHA512 di database MySQL (tidak pernah disimpan dalam bentuk teks biasa).
              </p>
            </div>

            <div className="bg-[#0b081e] p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6 shadow-xl">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-200 leading-relaxed">
                  <strong className="text-white block mb-0.5">Penyimpanan Aman (Database-Level)</strong>
                  Kredensial login dikelola langsung di tabel MySQL <code className="bg-black/40 px-1.5 py-0.5 rounded text-purple-300">admins</code> dan dienkripsi penuh menggunakan salt acak. File <code className="bg-black/40 px-1.5 py-0.5 rounded text-purple-300">.env</code> Anda kini bersih tanpa ada username atau password plaintext.
                </div>
              </div>

              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Username Baru (Opsional, kosongkan jika tidak ingin mengubah username)
                  </label>
                  <input
                    type="text"
                    value={credForm.username}
                    onChange={(e) => setCredForm({ ...credForm, username: e.target.value })}
                    placeholder="Contoh: iqbal"
                    className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Password Baru (Minimal 6 karakter) *
                  </label>
                  <input
                    type="password"
                    required
                    value={credForm.newPassword}
                    onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
                    placeholder="Masukkan password baru Anda"
                    className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Ulangi Password Baru *
                  </label>
                  <input
                    type="password"
                    required
                    value={credForm.confirmPassword}
                    onChange={(e) => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                    placeholder="Ulangi password baru Anda"
                    className="w-full px-4 py-3 rounded-xl bg-[#140f33] border border-purple-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={credLoading}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8245ec] via-[#9333ea] to-[#a855f7] hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-purple-600/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {credLoading ? 'Menyimpan...' : 'Perbarui Kredensial Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ===================== EDIT / ADD MODAL ===================== */}
      {modalType && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e0a29] max-w-lg w-full rounded-3xl border border-purple-500/40 p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto text-white shadow-2xl">
            <button
              onClick={() => {
                setModalType(null);
                setEditingItem(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-heading text-white mb-4">
              {editingItem.id ? 'Edit' : 'Tambah'} {modalType.toUpperCase()}
            </h3>

            {/* PROJECT FORM */}
            {modalType === 'project' && (
              <form onSubmit={saveProject} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Judul Proyek</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">URL Gambar Preview</label>
                  <input
                    type="text"
                    value={editingItem.image_url || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Live URL Demo</label>
                    <input
                      type="text"
                      value={editingItem.live_url || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, live_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">GitHub Repo URL</label>
                    <input
                      type="text"
                      value={editingItem.github_url || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, github_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Tags (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={typeof editingItem.tags === 'string' ? editingItem.tags : JSON.stringify(editingItem.tags || [])}
                    onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value })}
                    placeholder="Next.js, Tailwind, MySQL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={!!editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked ? 1 : 0 })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="feat" className="text-xs text-gray-300">Tampilkan sebagai Featured Project</label>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] cursor-pointer"
                  >
                    Simpan Proyek
                  </button>
                </div>
              </form>
            )}

            {/* SKILL FORM */}
            {modalType === 'skill' && (
              <form onSubmit={saveSkill} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Kategori</label>
                  <select
                    value={editingItem.category || 'Frontend'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Languages">Languages</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Nama Skill</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="Contoh: Next.js"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Tingkat Kemahiran</label>
                  <select
                    value={editingItem.level || 'Advanced'}
                    onChange={(e) => setEditingItem({ ...editingItem, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] cursor-pointer"
                  >
                    Simpan Skill
                  </button>
                </div>
              </form>
            )}

            {/* EXPERIENCE FORM */}
            {modalType === 'experience' && (
              <form onSubmit={saveExperience} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Role / Posisi</label>
                  <input
                    type="text"
                    required
                    value={editingItem.role || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Perusahaan / Organisasi</label>
                  <input
                    type="text"
                    required
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Periode</label>
                    <input
                      type="text"
                      required
                      value={editingItem.period || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                      placeholder="Juni 2024 - November 2024"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Lokasi</label>
                    <input
                      type="text"
                      value={editingItem.location || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                      placeholder="Surabaya, Indonesia"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Deskripsi Tugas & Hasil</label>
                  <textarea
                    rows={4}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Teknologi yang Digunakan (koma)</label>
                  <input
                    type="text"
                    value={typeof editingItem.technologies === 'string' ? editingItem.technologies : JSON.stringify(editingItem.technologies || [])}
                    onChange={(e) => setEditingItem({ ...editingItem, technologies: e.target.value })}
                    placeholder="HTML, CSS, JavaScript, Laravel, MySQL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] cursor-pointer"
                  >
                    Simpan Pengalaman
                  </button>
                </div>
              </form>
            )}

            {/* EDUCATION FORM */}
            {modalType === 'education' && (
              <form onSubmit={saveEducation} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Institusi / Sekolah</label>
                  <input
                    type="text"
                    required
                    value={editingItem.school || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, school: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Jurusan / Jenjang</label>
                  <input
                    type="text"
                    required
                    value={editingItem.degree || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    placeholder="Sarjana S1 Sistem Informasi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Tahun Periode</label>
                    <input
                      type="text"
                      required
                      value={editingItem.period || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                      placeholder="2021 - 2025"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Nilai / IPK</label>
                    <input
                      type="text"
                      value={editingItem.grade || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                      placeholder="IPK: 3.4 / 4.0"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Deskripsi & Kegiatan</label>
                  <textarea
                    rows={3}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] cursor-pointer"
                  >
                    Simpan Pendidikan
                  </button>
                </div>
              </form>
            )}

            {/* CERTIFICATE FORM */}
            {modalType === 'certificate' && (
              <form onSubmit={saveCertificate} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Nama Sertifikat</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Penerbit (Issuer)</label>
                  <input
                    type="text"
                    required
                    value={editingItem.issuer || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                    placeholder="Dicoding Indonesia"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Tanggal Terbit</label>
                  <input
                    type="text"
                    value={editingItem.issue_date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, issue_date: e.target.value })}
                    placeholder="25 April 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">URL Kredensial / PDF Sertifikat</label>
                  <input
                    type="text"
                    value={editingItem.credential_url || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, credential_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8245ec] to-[#a855f7] cursor-pointer"
                  >
                    Simpan Sertifikat
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
