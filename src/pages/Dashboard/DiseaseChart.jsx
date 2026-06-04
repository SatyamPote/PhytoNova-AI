import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/ui/ChartCard';

// ---------------------------------------------------------------------------
// Colors mapped to Tailwind palette for pie slices
// ---------------------------------------------------------------------------
const SLICE_COLORS = [
  '#22c55e', // primary green
  '#06b6d4', // secondary cyan
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

// ---------------------------------------------------------------------------
// Mock disease distribution (deterministic)
// ---------------------------------------------------------------------------
const MOCK_DATA = [
  { name: 'Early Blight', value: 12 },
  { name: 'Late Blight', value: 6 },
  { name: 'Leaf Mold', value: 5 },
  { name: 'Bacterial Spot', value: 4 },
  { name: 'Healthy', value: 24 },
];

// ---------------------------------------------------------------------------
// Custom tooltip with dark glassmorphism background
// ---------------------------------------------------------------------------
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm shadow-glass">
      <span className="text-text-secondary">{name}: </span>
      <span className="text-text-primary font-semibold">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom legend renderer
// ---------------------------------------------------------------------------
function CustomLegend({ payload }) {
  if (!payload?.length) return null;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 px-4">
      {payload.map((entry, i) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// DiseaseChart — pie chart of disease distribution
// ---------------------------------------------------------------------------
export default function DiseaseChart({ isDemo: _isDemo }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user || !supabase) {
      setData(MOCK_DATA);
      return;
    }

    async function fetchData() {
      const { data: rows, error } = await supabase
        .from('detections')
        .select('disease')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !rows || rows.length === 0) {
        setData(MOCK_DATA);
        return;
      }

      // Aggregate by disease
      const freq = {};
      rows.forEach((r) => {
        const d = r.disease || 'Unknown';
        freq[d] = (freq[d] || 0) + 1;
      });

      const aggregated = Object.entries(freq)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      setData(aggregated.length > 0 ? aggregated : MOCK_DATA);
    }

    fetchData();
  }, [user]);

  if (!data) return null;

  return (
    <ChartCard
      title="Disease Distribution"
      subtitle="All-time scan results"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                stroke="rgba(255,255,255,0.08)"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}