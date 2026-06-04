import { useEffect, useState } from 'react';
import { getTreatment } from '../../utils/treatments';

function ConfidenceBar({ confidence }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const target = Math.round(confidence * 100);
    const step = Math.ceil(target / 40);
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setPct(current);
      if (current >= target) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [confidence]);

  const color =
    pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-secondary">Confidence</span>
        <span className="text-text-primary font-medium">{pct}%</span>
      </div>
      <div className="h-3 bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultPanel({ result, preview }) {
  if (!result) return null;

  const treatment = getTreatment(result.label);
  const isDemo = result.source === 'demo';

  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-md p-6 space-y-6">
      {/* Demo mode banner */}
      {isDemo && (
        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>Demo mode — add a Hugging Face token for real AI inference.</span>
        </div>
      )}

      {/* Preview + label */}
      <div className="flex gap-5 items-start">
        {preview && (
          <img
            src={preview}
            alt="Uploaded plant"
            className="w-24 h-24 object-cover flex-shrink-0 border border-white/10"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-text-secondary text-sm mb-1">Detected Disease</p>
          <h2 className="text-xl font-bold text-text-primary leading-snug">
            {result.label.replace(/_/g, ' ')}
          </h2>
        </div>
      </div>

      {/* Confidence bar */}
      <ConfidenceBar confidence={result.confidence} />

      {/* Treatment */}
      <div className="space-y-3">
        <h3 className="text-text-primary font-semibold text-lg">
          {treatment.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {treatment.description}
        </p>

        {treatment.steps.length > 0 && (
          <ol className="space-y-2 mt-4">
            {treatment.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-text-primary">
                <span className="flex-shrink-0 w-6 h-6 rounded-sm bg-primary text-background flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="leading-snug pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}