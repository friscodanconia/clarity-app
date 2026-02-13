import { useState, useMemo } from 'react';
import type { AnalysisResult, Attempt } from '../types';
import { exportSessionAsText } from '../lib/export';
import { ComparisonView } from './ComparisonView';
import { ScoreRing } from './ui/ScoreRing';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface FeedbackPanelProps {
  analysis: AnalysisResult;
  attemptNumber: number;
  attempts?: Attempt[];
  audioBlob?: Blob | null;
  sessionForExport?: { prompt: { text: string; type: string }; attempts: Attempt[]; createdAt: string };
}

export function FeedbackPanel({ analysis, attemptNumber, attempts, audioBlob, sessionForExport }: FeedbackPanelProps) {
  const dims = Object.entries(analysis.dimensions) as [string, { score: number; note: string }][];
  const [copied, setCopied] = useState(false);

  const audioUrl = useMemo(() => {
    if (!audioBlob) return null;
    return URL.createObjectURL(audioBlob);
  }, [audioBlob]);

  const handleCopy = () => {
    if (!sessionForExport) return;
    const text = exportSessionAsText(sessionForExport as any);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
            Attempt {attemptNumber}
          </h3>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <ScoreRing score={analysis.overall} size={96} strokeWidth={7} />
          <div className="flex-1">
            <p className="text-stone-700 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
          {dims.map(([key, val]) => (
            <ScoreRing key={key} score={val.score} size={56} strokeWidth={4} label={key} />
          ))}
        </div>

        <div className="space-y-3">
          {dims.map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="text-xs font-medium text-stone-500 capitalize w-24 shrink-0 pt-0.5">{key}</span>
              <p className="text-sm text-stone-600">{val.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50">
        <h4 className="text-sm font-medium text-amber-800 mb-1">Key Improvement</h4>
        <p className="text-sm text-amber-700">{analysis.keyImprovement}</p>
      </Card>

      {analysis.fillerWords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-stone-400 mr-1">Filler words detected:</span>
          {analysis.fillerWords.map((w, i) => (
            <Badge key={i} variant="warning">{w}</Badge>
          ))}
        </div>
      )}

      <Card>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
          Polished Version
        </h4>
        <p className="font-serif text-stone-700 leading-relaxed">
          {analysis.polishedVersion}
        </p>
      </Card>

      {audioUrl && (
        <Card>
          <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
            Your Recording
          </h4>
          <audio controls src={audioUrl} className="w-full" />
        </Card>
      )}

      {attempts && attempts.length >= 2 && (
        <ComparisonView attempts={attempts} />
      )}

      {sessionForExport && (
        <Button variant="ghost" size="sm" onClick={handleCopy} className="w-full">
          {copied ? 'Copied!' : 'Copy Summary'}
        </Button>
      )}
    </div>
  );
}
