import { useMemo } from 'react';
import { getSessions } from '../lib/storage';
import type { Stats } from '../types';

export function useStats(): Stats {
  return useMemo(() => {
    const sessions = getSessions();

    if (sessions.length === 0) {
      return {
        totalSessions: 0, currentStreak: 0, longestStreak: 0,
        averageScore: 0, averageImprovement: 0,
        scoresByDimension: {}, recentScores: [],
      };
    }

    const allFirstAttempts = sessions
      .filter(s => s.attempts.length > 0)
      .map(s => s.attempts[0]);

    const averageScore = allFirstAttempts.length > 0
      ? allFirstAttempts.reduce((sum, a) => sum + a.analysis.overall, 0) / allFirstAttempts.length
      : 0;

    const improvements = sessions
      .filter(s => s.attempts.length >= 2)
      .map(s => s.attempts[s.attempts.length - 1].analysis.overall - s.attempts[0].analysis.overall);
    const averageImprovement = improvements.length > 0
      ? improvements.reduce((a, b) => a + b, 0) / improvements.length
      : 0;

    const dims = ['structure', 'clarity', 'conciseness', 'altitude', 'confidence'] as const;
    const scoresByDimension: Record<string, number> = {};
    for (const dim of dims) {
      const scores = allFirstAttempts.map(a => a.analysis.dimensions[dim].score);
      scoresByDimension[dim] = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    }

    const recentScores = sessions
      .slice(0, 20)
      .reverse()
      .filter(s => s.attempts.length > 0)
      .map(s => ({
        date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: s.attempts[0].analysis.overall,
      }));

    return {
      totalSessions: sessions.length,
      currentStreak: 0,
      longestStreak: 0,
      averageScore,
      averageImprovement,
      scoresByDimension,
      recentScores,
    };
  }, []);
}
