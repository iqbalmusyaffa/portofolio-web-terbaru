import { useState } from 'react';

export function useContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    hp_trap: '' // Anti-bot honeypot
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check: bot silent reject
    if (formData.hp_trap) {
      setStatus({ type: 'success', message: 'Pesan berhasil dikirim!' });
      return;
    }

    if (formData.name.trim().length < 2) {
      setStatus({ type: 'error', message: 'Nama lengkap minimal 2 karakter' });
      return;
    }

    if (formData.message.trim().length < 5) {
      setStatus({ type: 'error', message: 'Pesan minimal 5 karakter' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: data.message || 'Terima kasih! Pesan Anda telah berhasil terkirim dan disimpan di database MySQL. Saya akan segera menghubungi Anda kembali.'
        });
        setFormData({ name: '', email: '', subject: '', message: '', hp_trap: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.'
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Gagal terhubung ke server database. Silakan periksa koneksi Anda.'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    status,
    handleSubmit
  };
}
