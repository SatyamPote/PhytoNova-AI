const variantClasses = {
  default: 'bg-white/10 text-text-secondary border-white/20',
  primary: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  secondary: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const variantClass = variantClasses[variant] || variantClasses.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}