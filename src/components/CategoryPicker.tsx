import { useState } from 'react';
import { QUESTION_TYPE_LABELS } from '../data/prompts';
import { getDailyPrompt } from '../lib/dailyPrompt';
import { generateQuestion } from '../lib/anthropic';
import { getProfile } from '../lib/storage';
import type { Prompt, Difficulty } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';

interface CategoryPickerProps {
  onSelect: (typeOrPrompt?: string | Prompt) => void;
}

export function CategoryPicker({ onSelect }: CategoryPickerProps) {
  const types = Object.entries(QUESTION_TYPE_LABELS);
  const profile = getProfile();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(profile?.preferredDifficulty);
  const [generating, setGenerating] = useState<string | null>(null);

  const dailyPrompt = profile ? getDailyPrompt(profile.domains) : null;

  const handleGenerateNew = async (typeKey: string) => {
    if (!profile || generating) return;
    setGenerating(typeKey);
    try {
      const text = await generateQuestion(typeKey, profile.domains, difficulty);
      const prompt: Prompt = {
        id: `ai-${Date.now()}`,
        text,
        type: typeKey as Prompt['type'],
        domains: profile.domains,
        difficulty,
      };
      onSelect(prompt);
    } catch (e) {
      console.error('Failed to generate question:', e);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-stone-800">Choose your drill</h2>
        <p className="text-stone-500 text-sm mt-1">Pick a question type or go random</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400 uppercase tracking-wider">Difficulty:</span>
        {(['easy', 'medium', 'hard'] as const).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(difficulty === d ? undefined : d)}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors capitalize ${
              difficulty === d
                ? 'bg-stone-800 text-stone-50'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {dailyPrompt && (
        <button onClick={() => onSelect(dailyPrompt)} className="w-full text-left">
          <Card className="border-amber-200 bg-amber-50/30 hover:border-amber-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm shrink-0">
                {new Date().getDate()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-amber-800">Daily Challenge</p>
                  <Badge variant="warning">Today</Badge>
                </div>
                <p className="text-sm text-amber-700 truncate">{dailyPrompt.text}</p>
              </div>
            </div>
          </Card>
        </button>
      )}

      <button onClick={() => onSelect()} className="w-full text-left">
        <Card className="hover:border-stone-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            <div>
              <p className="font-medium text-stone-800">Random</p>
              <p className="text-sm text-stone-500">Surprise me with any question type</p>
            </div>
          </div>
        </Card>
      </button>

      <div className="grid gap-2">
        {types.map(([key, val]) => (
          <div key={key} className="flex gap-2">
            <button
              onClick={() => onSelect(key)}
              className="flex-1 text-left"
            >
              <Card className="hover:border-stone-300 transition-colors cursor-pointer py-4">
                <p className="font-medium text-stone-800">{val.label}</p>
                <p className="text-sm text-stone-500">{val.description}</p>
              </Card>
            </button>
            <button
              onClick={() => handleGenerateNew(key)}
              disabled={!!generating}
              className="flex items-center justify-center w-12 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors disabled:opacity-40"
              title="Generate new AI question"
            >
              {generating === key ? (
                <Spinner className="text-stone-400 w-4 h-4" />
              ) : (
                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
