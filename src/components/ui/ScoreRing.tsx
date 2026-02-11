interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function scoreColor(score: number): string {
  if (score >= 8) return '#16a34a';
  if (score >= 6) return '#ca8a04';
  if (score >= 4) return '#ea580c';
  return '#dc2626';
}

export function ScoreRing({ score, size = 80, strokeWidth = 6, label }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="animate-score-fill">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e7e5e4" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2} y={size / 2}
          textAnchor="middle" dominantBaseline="central"
          className="font-semibold fill-stone-800"
          fontSize={size * 0.28}
        >
          {score}
        </text>
      </svg>
      {label && <span className="text-xs text-stone-500 capitalize">{label}</span>}
    </div>
  );
}
