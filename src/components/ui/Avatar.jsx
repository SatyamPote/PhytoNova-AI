import { useMemo, useState } from 'react';

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashColor(str) {
  const colors = [
    'bg-emerald-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-amber-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const initials = useMemo(() => getInitials(name), [name]);
  const bgClass = useMemo(() => hashColor(name || ''), [name]);

  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${sizeClass} ${bgClass} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}