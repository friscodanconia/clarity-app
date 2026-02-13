import type { UserProfile, Session } from '../types';

const KEYS = {
  profile: 'clarity_profile',
  sessions: 'clarity_sessions',
  usedPrompts: 'clarity_used_prompts',
} as const;

export function migrateProfile(): void {
  const raw = localStorage.getItem(KEYS.profile);
  if (!raw) return;
  try {
    const profile = JSON.parse(raw);
    if ('apiKey' in profile) {
      delete profile.apiKey;
      localStorage.setItem(KEYS.profile, JSON.stringify(profile));
    }
  } catch { /* ignore corrupt data */ }
}

export function getProfile(): UserProfile | null {
  const raw = localStorage.getItem(KEYS.profile);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(KEYS.profile);
}

export function getSessions(): Session[] {
  const raw = localStorage.getItem(KEYS.sessions);
  return raw ? JSON.parse(raw) : [];
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
}

export function getUsedPromptIds(): string[] {
  const raw = localStorage.getItem(KEYS.usedPrompts);
  return raw ? JSON.parse(raw) : [];
}

export function markPromptUsed(id: string): void {
  const used = getUsedPromptIds();
  if (!used.includes(id)) {
    used.push(id);
    localStorage.setItem(KEYS.usedPrompts, JSON.stringify(used));
  }
}
