import { useStats } from '../hooks/useStats';
import { useStreak } from '../hooks/useStreak';
import { useCoaching } from '../hooks/useCoaching';
import { Card } from './ui/Card';
import { ScoreRing } from './ui/ScoreRing';

export function Dashboard() {
  const stats = useStats();
  const streak = useStreak();
  const coaching = useCoaching();

  if (stats.totalSessions === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500">No sessions yet. Start a drill to see your stats.</p>
      </div>
    );
  }

  const dims = Object.entries(stats.scoresByDimension);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-stone-800">Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="py-4 text-center">
          <p className="text-2xl font-semibold text-stone-800">{stats.totalSessions}</p>
          <p className="text-xs text-stone-500">Sessions</p>
        </Card>
        <Card className="py-4 text-center">
          <p className="text-2xl font-semibold text-stone-800">{streak.current}</p>
          <p className="text-xs text-stone-500">Day Streak</p>
        </Card>
        <Card className="py-4 text-center">
          <p className="text-2xl font-semibold text-stone-800">{stats.averageScore.toFixed(1)}</p>
          <p className="text-xs text-stone-500">Avg Score</p>
        </Card>
        <Card className="py-4 text-center">
          <p className="text-2xl font-semibold text-stone-800">
            {stats.averageImprovement > 0 ? '+' : ''}{stats.averageImprovement.toFixed(1)}
          </p>
          <p className="text-xs text-stone-500">Avg Improvement</p>
        </Card>
      </div>

      {coaching.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider mb-3">
            Coaching Corner
          </h3>
          <div className="space-y-3">
            {coaching.map(insight => (
              <div key={insight.dimension}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-blue-900 capitalize">{insight.dimension}</span>
                  <span className="text-xs text-blue-600">avg: {insight.avgScore}</span>
                </div>
                <p className="text-sm text-blue-700">{insight.tip}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {dims.length > 0 && (
        <Card>
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
            Dimension Averages
          </h3>
          <div className="flex justify-around">
            {dims.map(([key, score]) => (
              <ScoreRing key={key} score={Math.round(score * 10) / 10} size={64} strokeWidth={5} label={key} />
            ))}
          </div>
        </Card>
      )}

      {stats.recentScores.length > 1 && (
        <Card>
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
            Recent Scores
          </h3>
          <div className="h-32">
            <ScoreTrend scores={stats.recentScores} />
          </div>
        </Card>
      )}
    </div>
  );
}

function ScoreTrend({ scores }: { scores: { date: string; score: number }[] }) {
  if (scores.length < 2) return null;

  const width = 500;
  const height = 120;
  const padding = { top: 10, right: 10, bottom: 24, left: 30 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;

  const points = scores.map((s, i) => ({
    x: padding.left + (i / (scores.length - 1)) * w,
    y: padding.top + h - ((s.score - 1) / 9) * h,
    ...s,
  }));

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {[2, 4, 6, 8, 10].map(v => {
        const y = padding.top + h - ((v - 1) / 9) * h;
        return (
          <g key={v}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e7e5e4" strokeWidth={1} />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" className="fill-stone-400" fontSize={9}>{v}</text>
          </g>
        );
      })}
      <path d={line} fill="none" stroke="#292524" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill="#292524" />
          {(i === 0 || i === points.length - 1 || scores.length <= 6) && (
            <text x={p.x} y={height - 4} textAnchor="middle" className="fill-stone-400" fontSize={8}>{p.date}</text>
          )}
        </g>
      ))}
    </svg>
  );
}
