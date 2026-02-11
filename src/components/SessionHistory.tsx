import { useState } from 'react';
import { getSessions } from '../lib/storage';
import { QUESTION_TYPE_LABELS } from '../data/prompts';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ScoreRing } from './ui/ScoreRing';
import { FeedbackPanel } from './FeedbackPanel';

export function SessionHistory() {
  const sessions = getSessions();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500">No sessions yet. Complete a drill to see your history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-stone-800">Session History</h2>

      {sessions.map(session => {
        const isExpanded = expandedId === session.id;
        const firstAttempt = session.attempts[0];
        if (!firstAttempt) return null;

        return (
          <div key={session.id}>
            <button
              onClick={() => setExpandedId(isExpanded ? null : session.id)}
              className="w-full text-left"
            >
              <Card className="hover:border-stone-300 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <ScoreRing score={firstAttempt.analysis.overall} size={48} strokeWidth={4} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 leading-snug">
                      {session.prompt.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge>{QUESTION_TYPE_LABELS[session.prompt.type]?.label}</Badge>
                      <span className="text-xs text-stone-400">
                        {new Date(session.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </span>
                      {session.attempts.length > 1 && (
                        <span className="text-xs text-stone-400">
                          · {session.attempts.length} attempts
                        </span>
                      )}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-stone-400 transition-transform shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Card>
            </button>

            {isExpanded && (
              <div className="mt-3 ml-4 space-y-4">
                {session.attempts.map((attempt, i) => (
                  <div key={i}>
                    <Card className="mb-3 bg-stone-50">
                      <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-2">
                        Your Response (Attempt {i + 1})
                      </h4>
                      <p className="font-serif text-stone-700 text-sm leading-relaxed">
                        {attempt.transcript}
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        Duration: {Math.floor(attempt.duration / 60)}:{(attempt.duration % 60).toString().padStart(2, '0')}
                      </p>
                    </Card>
                    <FeedbackPanel analysis={attempt.analysis} attemptNumber={i + 1} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
