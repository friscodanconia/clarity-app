import { useState, useMemo, useCallback } from 'react';
import { useSession } from '../hooks/useSession';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { isSpeechSupported } from '../lib/speech';
import { getProfile } from '../lib/storage';
import { QUESTION_TYPE_LABELS } from '../data/prompts';
import type { Prompt } from '../types';
import { CategoryPicker } from './CategoryPicker';
import { RecordButton } from './RecordButton';
import { TranscriptDisplay } from './TranscriptDisplay';
import { FeedbackPanel } from './FeedbackPanel';
import { KeyboardHints } from './KeyboardHints';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';

export function DrillView() {
  const session = useSession();
  const profile = getProfile();
  const maxDuration = profile?.timedMode ? profile.timerDuration : undefined;

  const onAutoStop = useCallback(() => {
    // auto-stop just stops the recording; user can then submit
  }, []);

  const speech = useSpeechRecognition({ maxDuration, onAutoStop });
  const [showCategory, setShowCategory] = useState(true);

  const handleToggleRecord = useCallback(() => {
    if (speech.isRecording) {
      speech.stop();
    } else {
      speech.start();
      session.setPhase('recording');
    }
  }, [speech, session]);

  const handleSubmit = useCallback(() => {
    if (speech.transcript.trim().length < 10) return;
    session.submitRecording(speech.transcript, speech.elapsed);
  }, [speech, session]);

  const handleRetry = useCallback(() => {
    speech.setTranscript('');
    session.retry();
  }, [speech, session]);

  const handleNext = useCallback(() => {
    speech.setTranscript('');
    setShowCategory(true);
    session.nextDrill();
  }, [speech, session]);

  const shortcuts = useMemo(() => {
    const map: Record<string, () => void> = {};
    if (session.phase === 'feedback') {
      map['r'] = handleRetry;
      map['n'] = handleNext;
    } else if (session.phase === 'ready' || session.phase === 'recording') {
      map[' '] = handleToggleRecord; // Space
      if (!speech.isRecording && speech.transcript.trim().length >= 10) {
        map['Enter'] = handleSubmit;
      }
    }
    return map;
  }, [session.phase, speech.isRecording, speech.transcript, handleToggleRecord, handleSubmit, handleRetry, handleNext]);

  useKeyboardShortcuts(shortcuts);

  const keyboardHints = useMemo(() => {
    if (session.phase === 'feedback') {
      return [{ key: 'R', label: 'Retry' }, { key: 'N', label: 'Next' }];
    }
    if (session.phase === 'ready' || session.phase === 'recording') {
      const hints = [{ key: 'Space', label: speech.isRecording ? 'Stop' : 'Record' }];
      if (!speech.isRecording && speech.transcript.trim().length >= 10) {
        hints.push({ key: 'Enter', label: 'Submit' });
      }
      return hints;
    }
    return [];
  }, [session.phase, speech.isRecording, speech.transcript]);

  if (!isSpeechSupported()) {
    return (
      <Card>
        <p className="text-stone-600">
          Speech recognition is not supported in this browser. Please use Chrome or Edge.
        </p>
      </Card>
    );
  }

  if (showCategory && !session.prompt) {
    return (
      <CategoryPicker
        onSelect={(typeOrPrompt) => {
          if (typeOrPrompt && typeof typeOrPrompt === 'object') {
            session.startDrill(typeOrPrompt as Prompt);
          } else {
            session.startDrill(typeOrPrompt as string | undefined);
          }
          setShowCategory(false);
        }}
      />
    );
  }

  const currentAttempt = session.attempts.length + 1;
  const lastAnalysis = session.attempts.length > 0
    ? session.attempts[session.attempts.length - 1].analysis
    : null;

  const sessionForExport = session.prompt && session.attempts.length > 0 ? {
    id: '',
    prompt: session.prompt,
    attempts: session.attempts,
    createdAt: session.attempts[0].recordedAt,
  } : undefined;

  return (
    <div className="space-y-6">
      {session.prompt && (
        <div className="animate-fade-in">
          <Badge>{QUESTION_TYPE_LABELS[session.prompt.type]?.label}</Badge>
          <h2 className="text-xl font-semibold text-stone-800 mt-2 leading-snug">
            {session.prompt.text}
          </h2>
          {currentAttempt > 1 && (
            <p className="text-sm text-stone-500 mt-1">Attempt {currentAttempt}</p>
          )}
        </div>
      )}

      {session.phase === 'analyzing' ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="text-stone-400" />
            <p className="text-sm text-stone-500">Analyzing your response...</p>
          </div>
        </Card>
      ) : session.phase === 'feedback' && lastAnalysis ? (
        <div className="space-y-6">
          <FeedbackPanel
            analysis={lastAnalysis}
            attemptNumber={session.attempts.length}
            attempts={session.attempts}
            audioBlob={speech.audioBlob}
            sessionForExport={sessionForExport}
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleRetry} className="flex-1">
              Try Again
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Next Question
            </Button>
          </div>

          <KeyboardHints hints={keyboardHints} />
        </div>
      ) : (
        <div className="space-y-6">
          <TranscriptDisplay
            transcript={speech.transcript}
            isRecording={speech.isRecording}
            elapsed={speech.elapsed}
            maxDuration={maxDuration}
          />

          <div className="flex flex-col items-center gap-4">
            <RecordButton
              isRecording={speech.isRecording}
              onClick={handleToggleRecord}
            />
            <p className="text-xs text-stone-400">
              {speech.isRecording ? 'Click to stop' : 'Click to start recording'}
            </p>
          </div>

          {!speech.isRecording && speech.transcript.trim().length >= 10 && (
            <div className="flex gap-3 animate-fade-in">
              <Button variant="secondary" onClick={() => { speech.setTranscript(''); }} className="flex-1">
                Clear
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Get Feedback
              </Button>
            </div>
          )}

          {session.error && (
            <p className="text-sm text-red-600 text-center">{session.error}</p>
          )}

          <KeyboardHints hints={keyboardHints} />
        </div>
      )}
    </div>
  );
}
