import { useState } from 'react';
import { getProfile, saveProfile, clearProfile } from '../lib/storage';
import { ALL_DOMAINS } from '../data/prompts';
import type { Domain } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface SettingsProps {
  onReset: () => void;
}

export function Settings({ onReset }: SettingsProps) {
  const profile = getProfile();
  const [domains, setDomains] = useState<Domain[]>(profile?.domains || []);
  const [timedMode, setTimedMode] = useState(profile?.timedMode ?? false);
  const [timerDuration, setTimerDuration] = useState<60 | 90 | 120>(profile?.timerDuration ?? 90);
  const [saved, setSaved] = useState(false);

  const toggleDomain = (d: Domain) => {
    setDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleSave = () => {
    if (!profile) return;
    saveProfile({ ...profile, domains, timedMode, timerDuration });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('This will clear all your data. Are you sure?')) {
      clearProfile();
      localStorage.removeItem('clarity_sessions');
      localStorage.removeItem('clarity_used_prompts');
      onReset();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-stone-800">Settings</h2>

      <Card>
        <label className="block text-sm font-medium text-stone-700 mb-2">Domains</label>
        <div className="flex flex-wrap gap-2">
          {ALL_DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => toggleDomain(d.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                domains.includes(d.id)
                  ? 'bg-stone-800 text-stone-50'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-sm font-medium text-stone-700">Timed Mode</label>
            <p className="text-xs text-stone-400 mt-0.5">Auto-stop recording after a set duration</p>
          </div>
          <button
            onClick={() => setTimedMode(!timedMode)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              timedMode ? 'bg-stone-800' : 'bg-stone-300'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                timedMode ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        {timedMode && (
          <div className="flex gap-2">
            {([60, 90, 120] as const).map(d => (
              <button
                key={d}
                onClick={() => setTimerDuration(d)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  timerDuration === d
                    ? 'bg-stone-800 text-stone-50'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={domains.length < 2}>
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
        <Button variant="ghost" onClick={handleReset} className="text-red-600 hover:bg-red-50">
          Reset All Data
        </Button>
      </div>
    </div>
  );
}
