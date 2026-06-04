export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}