// Display helpers for API content. Every field may be missing: never assume shape.
import {
  Bot, MessageSquare, Cpu, Cog, Globe, Smartphone, CircuitBoard, PenTool, Layers,
} from 'lucide-react';

// ---------------------------------------------------------------- Generic
export const asArray = (value) => (Array.isArray(value) ? value : []);

/** Only http(s) and mailto links coming from the CMS are rendered as links. */
export const safeUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) return null;
  try {
    const parsed = new URL(url.trim(), window.location.origin);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
};

const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());

const toDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isValidDate(d) ? d : null;
};

/** "Sep 2023" (dates are pinned at 12:00 UTC, so local formatting is safe). */
export const formatMonthYear = (value) => {
  const d = toDate(value);
  return d ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
};

export const formatYear = (value) => {
  const d = toDate(value);
  return d ? String(d.getFullYear()) : null;
};

/** "Sep 2023 – Present" / "Jun 2022 – Aug 2023" / null. */
export const formatDateRange = (start, end, isCurrent = false) => {
  const from = formatMonthYear(start);
  const to = isCurrent || !end ? 'Present' : formatMonthYear(end);
  if (!from) return null;
  return `${from} – ${to}`;
};

/** Fallback when the API does not send a `duration` label (same rule as the API). */
export const durationBetween = (start, end) => {
  const s = toDate(start);
  if (!s) return null;
  const e = toDate(end) || new Date();
  const months = Math.max(0, Math.round((e - s) / (1000 * 60 * 60 * 24 * 30.44)));
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
  const m = rest > 0 || years === 0 ? `${rest} month${rest > 1 ? 's' : ''}` : '';
  return [y, m].filter(Boolean).join(' ');
};

/** "full-time" → "Full-time". */
export const humanize = (value) => {
  if (!value || typeof value !== 'string') return '';
  const text = value.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// ---------------------------------------------------------------- Projects
export const PROJECT_CATEGORIES = {
  'ai-agent': { label: 'AI Agents', icon: Bot, gradient: 'from-orange-500 to-red-600' },
  chatbot: { label: 'Chatbots', icon: MessageSquare, gradient: 'from-purple-500 to-pink-600' },
  iot: { label: 'IoT', icon: Cpu, gradient: 'from-green-500 to-teal-600' },
  robotics: { label: 'Robotics', icon: Cog, gradient: 'from-red-500 to-orange-600' },
  web: { label: 'Web', icon: Globe, gradient: 'from-cyan-500 to-blue-600' },
  mobile: { label: 'Mobile', icon: Smartphone, gradient: 'from-blue-500 to-purple-600' },
  embedded: { label: 'Embedded', icon: CircuitBoard, gradient: 'from-yellow-500 to-orange-600' },
  cad: { label: 'CAD/3D', icon: PenTool, gradient: 'from-pink-500 to-rose-600' },
  other: { label: 'Other', icon: Layers, gradient: 'from-slate-500 to-slate-700' },
};

export const getProjectCategory = (key) => PROJECT_CATEGORIES[key] || {
  label: humanize(key) || 'Other',
  icon: Layers,
  gradient: 'from-slate-500 to-slate-700',
};

export const PROJECT_STATUS = {
  completed: { label: 'Completed', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  'in-progress': { label: 'In progress', className: 'bg-amber-500/15 text-amber-200 border-amber-400/30' },
  planned: { label: 'Planned', className: 'bg-sky-500/15 text-sky-200 border-sky-400/30' },
};

export const getPrimaryImage = (project) => {
  const images = asArray(project?.images).filter((img) => img && safeUrl(img.url));
  return images.find((img) => img.isPrimary) || images[0] || null;
};

export const projectPath = (project) => `/projects/${encodeURIComponent(project?.slug || project?.id || '')}`;
