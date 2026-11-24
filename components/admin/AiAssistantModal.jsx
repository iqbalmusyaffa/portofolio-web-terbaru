'use client';

import { useState } from 'react';
import { Bot, Languages, Wand2, Copy, Check, ArrowRight, Loader2, X, AlertCircle } from 'lucide-react';

export default function AiAssistantModal({
  isOpen,
  onClose,
  initialText = '',
  onApply,
  title = 'Asisten AI Gemini'
}) {
  const [inputText, setInputText] = useState(initialText || '');
  const [resultText, setResultText] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [mode, setMode] = useState('translate'); // 'translate' | 'polish' | 'generate'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [isAuthError, setIsAuthError] = useState(false);

  if (!isOpen) return null;

  const handleRunAi = async () => {
    if (!inputText.trim()) {
      setError('Masukkan teks terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setIsAuthError(false);
    setResultText('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          text: inputText,
          targetLang: targetLang,
          prompt: inputText
        })
      });

      const data = await res.json();
      if (data.success) {
        setResultText(data.result);
      } else {
        if (res.status === 401 || data.isAuthError || (data.error && data.error.includes('Sesi login'))) {
          setIsAuthError(true);
          setError(data.error || 'Sesi login telah kedaluwarsa. Silakan login kembali.');
        } else {
          setError(data.error || 'Gagal memproses AI');
        }
      }
    } catch (err) {
      setError('Gagal menghubungi server AI. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyResult = () => {
    if (resultText && onApply) {
      onApply(resultText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b081e] w-full max-w-xl rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-900/30 flex items-center justify-between bg-[#100b2b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">{title}</h3>
              <p className="text-[10px] text-gray-400">Powered by Google Gemini 1.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-900/40 flex-1">
          {/* Mode Selector Tabs */}
          <div className="flex gap-2 p-1 bg-[#140f33] rounded-xl border border-purple-500/20">
            <button
              type="button"
              onClick={() => setMode('translate')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === 'translate'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Terjemahkan (ID ⇄ EN)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('polish')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === 'polish'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Perbagus Tulisan</span>
            </button>
          </div>

          {mode === 'translate' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Target Bahasa:</span>
              <button
                type="button"
                onClick={() => setTargetLang('en')}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                  targetLang === 'en'
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                    : 'border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setTargetLang('id')}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                  targetLang === 'id'
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                    : 'border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                🇮🇩 Bahasa Indonesia
              </button>
            </div>
          )}

          {/* Input Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              {mode === 'translate' ? 'Teks yang ingin diterjemahkan:' : 'Teks yang ingin dipoles / disempurnakan:'}
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik atau tempel teks di sini..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 placeholder-gray-500"
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleRunAi}
            disabled={loading || !inputText.trim()}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-purple-600/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses dengan Gemini AI...</span>
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5" />
                <span>{mode === 'translate' ? 'Terjemahkan Sekarang' : 'Poles dengan AI'}</span>
              </>
            )}
          </button>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed flex-1">{error}</div>
              </div>
              {isAuthError && (
                <div className="pt-2 border-t border-rose-500/30 flex items-center justify-end">
                  <a
                    href="/admin/login"
                    className="px-3 py-1.5 rounded-lg bg-rose-700/80 hover:bg-rose-600 text-white font-semibold text-[11px] transition-colors"
                  >
                    Login Ulang Sekarang →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Result Area */}
          {resultText && (
            <div className="p-3.5 rounded-xl bg-[#120e2e] border border-purple-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-purple-300">Hasil AI:</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-xs text-white leading-relaxed bg-[#19133f] p-3 rounded-lg border border-purple-500/20 whitespace-pre-wrap">
                {resultText}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-purple-900/30 bg-[#0e0a26] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Tutup
          </button>
          {resultText && onApply && (
            <button
              type="button"
              onClick={handleApplyResult}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Terapkan ke Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
