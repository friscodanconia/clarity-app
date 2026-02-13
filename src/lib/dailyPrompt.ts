import type { Domain, Prompt } from '../types';
import { PROMPTS } from '../data/prompts';

function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDailyPrompt(domains: Domain[]): Prompt {
  const today = new Date().toISOString().slice(0, 10);
  const pool = PROMPTS.filter(p => p.domains.some(d => domains.includes(d)));
  if (pool.length === 0) return PROMPTS[0];
  const idx = hashDate(today) % pool.length;
  return pool[idx];
}
