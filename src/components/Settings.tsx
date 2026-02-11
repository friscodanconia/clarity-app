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
  const [apiKey, setApiKey] = useState(profile?.apiKey || '');
  const [domains, setDomains] = useState<Domain[]>(profile?.domains || []);
  const [saved, setSaved] = useState(false);

  const toggleDomain = (d: Domain) => {
    setDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleSave = () => {
    if (!profile) return;
    saveProfile({ ...profile, apiKey, domains });
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
        <label className="block text-sm font-medium text-stone-700 mb-1">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
        />
      </Card>

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

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={domains.length < 2 || !apiKey}>
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
        <Button variant="ghost" onClick={handleReset} className="text-red-600 hover:bg-red-50">
          Reset All Data
        </Button>
      </div>
    </div>
  );
}
