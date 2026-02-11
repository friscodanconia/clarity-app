import { useMemo } from 'react';
import { getSessions } from '../lib/storage';

export function useStreak() {
  return useMemo(() => {
    const sessions = getSessions();
    if (sessions.length === 0) return { current: 0, longest: 0, total: 0 };

    const days = new Set(
      sessions.map(s => new Date(s.createdAt).toDateString())
    );
    const sortedDays = Array.from(days)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let current = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const firstDay = sortedDays[0];
    firstDay.setHours(0, 0, 0, 0);

    if (firstDay.getTime() === today.getTime() || firstDay.getTime() === yesterday.getTime()) {
      current = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const prev = sortedDays[i - 1];
        const curr = sortedDays[i];
        const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.round(diff) === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    let longest = 1;
    let streak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prev = sortedDays[i - 1];
      const curr = sortedDays[i];
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 1;
      }
    }

    return { current, longest, total: sessions.length };
  }, []);
}
