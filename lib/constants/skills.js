import {
  Code,
  Palette,
  FileCode,
  Zap,
  Atom,
  Globe,
  Wind,
  Layout,
  Server,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Flame,
  FileCode2,
  Terminal,
  GitBranch,
  Github,
  Laptop,
  Send,
  Triangle,
  Figma,
  Box,
  Braces,
  Sparkles
} from 'lucide-react';

export const iconMap = {
  Code,
  Palette,
  FileCode,
  Zap,
  Atom,
  Globe,
  Wind,
  Layout,
  Server,
  Cpu,
  Database,
  HardDrive,
  Layers,
  Flame,
  FileCode2,
  Terminal,
  GitBranch,
  Github,
  Laptop,
  Send,
  Triangle,
  Figma,
  Box,
  Braces,
  Sparkles
};

// Pemetaan nama teknologi ke icon Lucide bawaan
export const defaultSkillIconMap = {
  'html': Code,
  'css': Palette,
  'sass': FileCode,
  'scss': FileCode,
  'javascript': Zap,
  'js': Zap,
  'react': Atom,
  'react js': Atom,
  'react.js': Atom,
  'reactjs': Atom,
  'next': Globe,
  'next js': Globe,
  'next.js': Globe,
  'nextjs': Globe,
  'tailwind': Wind,
  'tailwind css': Wind,
  'bootstrap': Layout,
  'node': Server,
  'node js': Server,
  'node.js': Server,
  'nodejs': Server,
  'express': Cpu,
  'express js': Cpu,
  'express.js': Cpu,
  'expressjs': Cpu,
  'mysql': Database,
  'sqlite': HardDrive,
  'laravel': Layers,
  'firebase': Flame,
  'php': FileCode2,
  'python': Terminal,
  'git': GitBranch,
  'github': Github,
  'vs code': Laptop,
  'vscode': Laptop,
  'visual studio code': Laptop,
  'postman': Send,
  'vercel': Triangle,
  'figma': Figma
};

export function isImageIcon(val) {
  if (!val || typeof val !== 'string') return false;
  return (
    val.startsWith('http://') ||
    val.startsWith('https://') ||
    val.startsWith('/') ||
    val.startsWith('data:image/') ||
    /\.(png|jpe?g|svg|webp|gif|ico)(\?.*)?$/i.test(val)
  );
}
