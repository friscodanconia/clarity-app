import { useMemo } from 'react';
import { getSessions } from '../lib/storage';

interface CoachingInsight {
  dimension: string;
  tip: string;
  avgScore: number;
}

const COACHING_TIPS: Record<string, string> = {
  structure: 'Try the "preview, body, recap" framework: state your main point, give 2-3 supporting details, then summarize. This gives listeners a clear roadmap.',
  clarity: 'Replace vague phrases with specifics. Instead of "we should improve things," say "we should reduce response time from 3s to 1s." Concrete language builds credibility.',
  conciseness: 'Practice the "headline first" technique: lead with your conclusion, then add detail only if needed. Cut any sentence that doesn\'t add new information.',
  altitude: 'Match your answer to the question level. Strategic questions need frameworks, not tactics. Tactical questions need steps, not vision. Re-read the question before answering.',
  confidence: 'Eliminate hedging phrases like "I think maybe" or "sort of." State your position directly. If you\'re uncertain, say "my hypothesis is..." rather than undermining your point.',
};

export function useCoaching(): CoachingInsight[] {
  return useMemo(() => {
    const sessions = getSessions().slice(0, 10);
    if (sessions.length < 3) return [];

    const dims = ['structure', 'clarity', 'conciseness', 'altitude', 'confidence'] as const;
    const insights: CoachingInsight[] = [];

    for (const dim of dims) {
      const scores = sessions
        .filter(s => s.attempts.length > 0)
        .map(s => s.attempts[0].analysis.dimensions[dim].score);

      if (scores.length < 3) continue;

      const lowCount = scores.filter(s => s < 6).length;
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      if (lowCount / scores.length >= 0.6) {
        insights.push({
          dimension: dim,
          tip: COACHING_TIPS[dim],
          avgScore: Math.round(avgScore * 10) / 10,
        });
      }
    }

    return insights;
  }, []);
}
