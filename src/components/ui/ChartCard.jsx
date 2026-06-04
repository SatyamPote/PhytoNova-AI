/**
 * ChartCard — glassmorphism card wrapper designed for charts.
 * Inherits the same visual style as GlassCard but adds a title slot
 * and a responsive height container so recharts always fit cleanly.
 */
export default function ChartCard({ title, subtitle, children, className = '', ...props }) {
  return (
    <div
      className={`backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-6 pt-6 pb-4">
          {title && (
            <h3 className="text-base font-semibold text-text-primary leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
      )}
      <div className="h-64 sm:h-72 w-full px-2 pb-4">
        {children}
      </div>
    </div>
  );
}