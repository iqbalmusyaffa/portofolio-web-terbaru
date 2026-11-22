'use client';

import { useState, useEffect } from 'react';
import { Code, Check, Tag } from 'lucide-react';
import { iconMap, defaultSkillIconMap, isImageIcon } from '@/lib/constants/skills';

export default function SkillTagSelector({
  label = 'Teknologi yang Digunakan (koma)',
  value = '',
  onChange,
  skills = [],
  placeholder = 'React, Node.js, MySQL'
}) {
  const [skillList, setSkillList] = useState(skills || []);
  const [loading, setLoading] = useState(false);

  // Fallback to fetch /api/skills if skills prop is not supplied or empty
  useEffect(() => {
    if (skills && skills.length > 0) {
      setSkillList(skills);
    } else {
      setLoading(true);
      fetch('/api/skills')
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            setSkillList(data);
          } else if (data && Array.isArray(data.skills)) {
            setSkillList(data.skills);
          }
        })
        .catch((err) => console.error('Failed to fetch skills in SkillTagSelector:', err))
        .finally(() => setLoading(false));
    }
  }, [skills]);

  // Parse comma-separated string into an array of trimmed tokens
  const currentTokens = (typeof value === 'string' ? value : '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const isSelected = (skillName) => {
    const target = skillName.trim().toLowerCase();
    return currentTokens.some((t) => t.toLowerCase() === target);
  };

  const handleToggle = (skillName) => {
    const trimmedName = skillName.trim();
    const target = trimmedName.toLowerCase();
    const exists = currentTokens.some((t) => t.toLowerCase() === target);

    let nextTokens;
    if (exists) {
      // Remove token
      nextTokens = currentTokens.filter((t) => t.toLowerCase() !== target);
    } else {
      // Append token
      nextTokens = [...currentTokens, trimmedName];
    }

    if (onChange) {
      onChange(nextTokens.join(', '));
    }
  };

  const renderIcon = (skill) => {
    if (skill.icon && isImageIcon(skill.icon)) {
      return (
        <img
          src={skill.icon}
          alt={skill.name}
          className="w-3.5 h-3.5 object-contain shrink-0"
        />
      );
    }
    const IconComponent =
      (skill.icon && iconMap[skill.icon]) ||
      (skill.name && defaultSkillIconMap[skill.name.toLowerCase()]) ||
      Code;

    return <IconComponent className="w-3.5 h-3.5 shrink-0" />;
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-200">
        {label}
      </label>

      {/* Manual Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-[#16113b] border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400 placeholder-gray-500 transition-all"
      />

      {/* Quick Select from Skills API */}
      <div className="p-3 bg-[#120e2e] rounded-xl border border-purple-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-purple-300 flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-purple-400" />
            <span>Pilih cepat dari daftar Skills (klik untuk tambah/hapus):</span>
          </span>
          {loading && (
            <span className="text-[10px] text-gray-400 animate-pulse">
              Memuat skills...
            </span>
          )}
        </div>

        {skillList.length === 0 && !loading ? (
          <p className="text-[11px] text-gray-400 italic">
            Belum ada data skill di database. Anda bisa menambahkannya di tab Skills.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-purple-900/40">
            {skillList.map((skill) => {
              const selected = isSelected(skill.name);
              return (
                <button
                  type="button"
                  key={skill.id || skill.name}
                  onClick={() => handleToggle(skill.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer border ${
                    selected
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold border-purple-400 shadow-md shadow-purple-600/30 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-purple-500/20 hover:border-purple-400/50'
                  }`}
                  title={`${selected ? 'Klik untuk hapus' : 'Klik untuk tambah'} ${skill.name}`}
                >
                  {renderIcon(skill)}
                  <span>{skill.name}</span>
                  {selected && <Check className="w-3 h-3 text-white ml-0.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
