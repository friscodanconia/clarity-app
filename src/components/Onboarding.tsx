import { useState } from 'react';
import { ALL_DOMAINS } from '../data/prompts';
import { saveProfile } from '../lib/storage';
import type { Domain, UserProfile } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>([]);
  const [error, setError] = useState('');

  const toggleDomain = (d: Domain) => {
    setSelectedDomains(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  const handleFinish = () => {
    if (selectedDomains.length < 2) {
      setError('Pick at least 2 domains');
      return;
    }
    const profile: UserProfile = {
      domains: selectedDomains,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Clarity</h1>
          <p className="text-stone-500 mt-1">Voice-first communication practice</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Your domains (pick 2-5)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DOMAINS.map(d => (
                <button
                  key={d.id}
                  onClick={() => toggleDomain(d.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedDomains.includes(d.id)
                      ? 'bg-stone-800 text-stone-50'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={handleFinish} disabled={selectedDomains.length < 2} className="w-full">
            Start Practicing
          </Button>
        </div>
      </Card>
    </div>
  );
}
