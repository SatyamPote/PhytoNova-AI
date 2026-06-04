import { useEffect, useState } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Deterministic mock data for first-time / demo users
// ---------------------------------------------------------------------------
const MOCK_STATS = {
  totalScans: 47,
  diseasesDetected: 23,
  healthyScans: 24,
  topDisease: 'Early Blight',
};

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------
function useCountUp(target, duration = 1200) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, target, { duration, ease: 'easeOut' });
    const unsub = rounded.on('change', setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [target, duration, motionVal, rounded]);

  return display;
}

// ---------------------------------------------------------------------------
// Single stat card
// ---------------------------------------------------------------------------
function StatCard({ icon, label, value, color, isText }) {
  const animated = useCountUp(value);

  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  return (
    <div className="backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className={`text-3xl ${colorMap[color] ?? 'text-primary'}`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-text-primary tabular-nums">
          {isText ? value : animated}
        </div>
        <div className="mt-1 text-sm text-text-secondary">{label}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatsCards — fetches real stats or falls back to mock
// ---------------------------------------------------------------------------
export default function StatsCards({ isDemo: _isDemo }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || !supabase) {
      setStats(MOCK_STATS);
      return;
    }

    async function fetchStats() {
      const { data, error } = await supabase
        .from('detections')
        .select('disease, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setStats(MOCK_STATS);
        return;
      }

      const total = data.length;
      const diseaseCount = data.filter((d) => d.disease && d.disease !== 'Healthy').length;
      const healthyCount = total - diseaseCount;

      // Find most frequent non-healthy disease
      const freq = {};
      data.forEach((d) => {
        if (d.disease && d.disease !== 'Healthy') {
          freq[d.disease] = (freq[d.disease] || 0) + 1;
        }
      });
      const topDisease =
        Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None';

      setStats({ totalScans: total, diseasesDetected: diseaseCount, healthyScans: healthyCount, topDisease });
    }

    fetchStats();
  }, [user]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        }
        label="Total Scans"
        value={stats.totalScans}
        color="primary"
      />
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        }
        label="Diseases Detected"
        value={stats.diseasesDetected}
        color="red"
      />
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        label="Healthy Scans"
        value={stats.healthyScans}
        color="primary"
      />
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        }
        label="Top Disease"
        value={stats.topDisease}
        isText={true}
        color="secondary"
      />
    </div>
  );
}