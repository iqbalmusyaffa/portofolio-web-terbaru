'use client';

import { useState } from 'react';
import { MapPin, Check, Plus, RotateCcw } from 'lucide-react';

const PRESET_CITIES = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Tangerang',
  'Yogyakarta',
  'Semarang',
  'Sidoarjo',
  'Malang',
  'Banyuwangi',
  'Remote (WFH)',
  'Bali',
  'Solo',
  'Bekasi',
  'Depok',
  'Medan',
  'Bogor'
];

export default function CityTagSelector({
  value = '',
  onChange
}) {
  const [customCity, setCustomCity] = useState('');

  // Parse current value into array of trimmed strings
  const currentTokens = (typeof value === 'string' ? value : '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const isSelected = (city) => {
    const target = city.trim().toLowerCase();
    return currentTokens.some((t) => t.toLowerCase() === target);
  };

  const handleToggle = (cityName) => {
    const trimmed = cityName.trim();
    if (!trimmed) return;
    const target = trimmed.toLowerCase();
    const exists = currentTokens.some((t) => t.toLowerCase() === target);

    let nextTokens;
    if (exists) {
      nextTokens = currentTokens.filter((t) => t.toLowerCase() !== target);
    } else {
      nextTokens = [...currentTokens, trimmed];
    }

    if (onChange) {
      onChange(nextTokens.join(', '));
    }
  };

  const handleAddCustom = (e) => {
    if (e) e.preventDefault();
    if (!customCity.trim()) return;
    if (!isSelected(customCity)) {
      handleToggle(customCity.trim());
    }
    setCustomCity('');
  };

  const handleResetDefault = () => {
    const defaults = [
      'Jakarta',
      'Surabaya',
      'Bandung',
      'Tangerang',
      'Yogyakarta',
      'Semarang',
      'Sidoarjo',
      'Malang',
      'Banyuwangi',
      'Remote (WFH)'
    ];
    if (onChange) {
      onChange(defaults.join(', '));
    }
  };

  // Combine PRESET_CITIES with any custom cities already present in currentTokens
  const allAvailable = Array.from(
    new Set([
      ...PRESET_CITIES,
      ...currentTokens
    ])
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-200">
          Daftar Kota Siap Bekerja &amp; Relokasi
        </label>
        <button
          type="button"
          onClick={handleResetDefault}
          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
          title="Reset ke daftar kota standar bawaan"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset ke Standar</span>
        </button>
      </div>

      {/* Interactive Clickable Pills */}
      <div className="p-3 bg-[#120e2e] rounded-xl border border-purple-500/20 space-y-2.5">
        <div className="text-[11px] font-medium text-purple-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-purple-400" />
          <span>Klik kota di bawah untuk memilih / membatalkan:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-purple-900/40">
          {allAvailable.map((city) => {
            const selected = isSelected(city);
            return (
              <button
                type="button"
                key={city}
                onClick={() => handleToggle(city)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border ${
                  selected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium border-purple-400 shadow-md shadow-purple-600/30 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-purple-500/20 hover:border-purple-400/50'
                }`}
                title={selected ? `Klik untuk batalkan ${city}` : `Klik untuk pilih ${city}`}
              >
                <span>{city}</span>
                {selected ? (
                  <Check className="w-3 h-3 text-white ml-0.5" />
                ) : (
                  <Plus className="w-3 h-3 text-gray-400 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Input Tambah Kota Kustom */}
        <div className="flex items-center gap-2 pt-1 border-t border-purple-900/30">
          <input
            type="text"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom(e);
              }
            }}
            placeholder="Tambah kota lain (cth: Bali, Solo, Balikpapan)..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 placeholder-gray-500"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Manual Input string sync */}
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Jakarta, Surabaya, Bandung, Tangerang, Yogyakarta, Semarang, Sidoarjo, Malang, Banyuwangi, Remote (WFH)"
          className="w-full px-3.5 py-2 rounded-xl bg-[#140f33] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 font-mono text-gray-300"
        />
        <span className="text-[10px] text-gray-400 block mt-1">
          Nilai teks yang tersimpan di database dan otomatis tersinkronisasi dengan tampilan website.
        </span>
      </div>
    </div>
  );
}
