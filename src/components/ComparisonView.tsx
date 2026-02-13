import type { Attempt } from '../types';
import { Card } from './ui/Card';

interface ComparisonViewProps {
  attempts: Attempt[];
}

function DeltaIndicator({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous;
  if (delta === 0) return <span className="text-stone-400 text-xs">=</span>;
  return (
    <span className={`text-xs font-medium ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
      {delta > 0 ? '+' : ''}{delta}
    </span>
  );
}

export function ComparisonView({ attempts }: ComparisonViewProps) {
  if (attempts.length < 2) return null;

  const first = attempts[0];
  const latest = attempts[attempts.length - 1];
  const dims = Object.keys(first.analysis.dimensions) as (keyof typeof first.analysis.dimensions)[];
  const overallDelta = latest.analysis.overall - first.analysis.overall;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          Comparison
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-600">Overall:</span>
          <span className="text-sm font-semibold text-stone-800">{first.analysis.overall}</span>
          <span className="text-stone-400">&rarr;</span>
          <span className="text-sm font-semibold text-stone-800">{latest.analysis.overall}</span>
          <span className={`text-sm font-semibold ${overallDelta > 0 ? 'text-green-600' : overallDelta < 0 ? 'text-red-500' : 'text-stone-400'}`}>
            ({overallDelta > 0 ? '+' : ''}{overallDelta})
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {dims.map(dim => (
          <div key={dim} className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-500 capitalize w-24 shrink-0">{dim}</span>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm text-stone-600 w-6 text-right">{first.analysis.dimensions[dim].score}</span>
              <div className="flex-1 h-1.5 bg-stone-100 rounded-full relative">
                <div
                  className="absolute h-1.5 bg-stone-300 rounded-full"
                  style={{ width: `${first.analysis.dimensions[dim].score * 10}%` }}
                />
                <div
                  className={`absolute h-1.5 rounded-full ${latest.analysis.dimensions[dim].score >= first.analysis.dimensions[dim].score ? 'bg-green-500' : 'bg-red-400'}`}
                  style={{ width: `${latest.analysis.dimensions[dim].score * 10}%` }}
                />
              </div>
              <span className="text-sm text-stone-600 w-6">{latest.analysis.dimensions[dim].score}</span>
              <DeltaIndicator
                current={latest.analysis.dimensions[dim].score}
                previous={first.analysis.dimensions[dim].score}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-2">Attempt 1</h4>
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-4">{first.transcript}</p>
        </div>
        <div>
          <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-2">Attempt {attempts.length}</h4>
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-4">{latest.transcript}</p>
        </div>
      </div>
    </Card>
  );
}
