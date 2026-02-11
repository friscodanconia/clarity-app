import { useState, useCallback } from 'react';
import type { DrillPhase, Prompt, Attempt, Session } from '../types';
import { analyzeResponse } from '../lib/anthropic';
import { saveSession, markPromptUsed, getUsedPromptIds, getProfile } from '../lib/storage';
import { pickPrompt } from '../data/prompts';

export function useSession() {
  const [phase, setPhase] = useState<DrillPhase>('ready');
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startDrill = useCallback((preferredType?: string) => {
    const profile = getProfile();
    if (!profile) return;
    const used = getUsedPromptIds();
    const p = pickPrompt(profile.domains, used, preferredType);
    setPrompt(p);
    setAttempts([]);
    setSessionId(crypto.randomUUID());
    setPhase('ready');
    setError(null);
  }, []);

  const submitRecording = useCallback(async (transcript: string, duration: number) => {
    if (!prompt) return;
    const profile = getProfile();
    if (!profile) return;

    setPhase('analyzing');
    setError(null);

    try {
      const analysis = await analyzeResponse(profile.apiKey, prompt.text, prompt.type, transcript);
      const attempt: Attempt = {
        transcript,
        duration,
        analysis,
        recordedAt: new Date().toISOString(),
      };
      const newAttempts = [...attempts, attempt];
      setAttempts(newAttempts);

      const session: Session = {
        id: sessionId,
        prompt,
        attempts: newAttempts,
        createdAt: newAttempts[0]?.recordedAt || new Date().toISOString(),
      };
      saveSession(session);
      markPromptUsed(prompt.id);
      setPhase('feedback');
    } catch (e: any) {
      setError(e.message || 'Analysis failed');
      setPhase('ready');
    }
  }, [prompt, attempts, sessionId]);

  const retry = useCallback(() => {
    setPhase('ready');
  }, []);

  const nextDrill = useCallback((preferredType?: string) => {
    startDrill(preferredType);
  }, [startDrill]);

  return {
    phase, setPhase, prompt, attempts, error,
    startDrill, submitRecording, retry, nextDrill,
  };
}
