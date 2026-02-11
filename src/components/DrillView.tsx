import { useState } from 'react';
import { useSession } from '../hooks/useSession';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { isSpeechSupported } from '../lib/speech';
import { QUESTION_TYPE_LABELS } from '../data/prompts';
import { CategoryPicker } from './CategoryPicker';
import { RecordButton } from './RecordButton';
import { TranscriptDisplay } from './TranscriptDisplay';
import { FeedbackPanel } from './FeedbackPanel';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';

export function DrillView() {
  const session = useSession();
  const speech = useSpeechRecognition();
  const [showCategory, setShowCategory] = useState(true);

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
        onSelect={(type) => {
          session.startDrill(type);
          setShowCategory(false);
        }}
      />
    );
  }

  const handleToggleRecord = () => {
    if (speech.isRecording) {
      speech.stop();
    } else {
      speech.start();
      session.setPhase('recording');
    }
  };

  const handleSubmit = () => {
    if (speech.transcript.trim().length < 10) return;
    session.submitRecording(speech.transcript, speech.elapsed);
  };

  const handleRetry = () => {
    speech.setTranscript('');
    session.retry();
  };

  const handleNext = () => {
    speech.setTranscript('');
    setShowCategory(true);
    session.nextDrill();
  };

  const currentAttempt = session.attempts.length + 1;
  const lastAnalysis = session.attempts.length > 0
    ? session.attempts[session.attempts.length - 1].analysis
    : null;

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
          />

          {session.attempts.length >= 2 && (
            <Card className="border-green-200 bg-green-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {session.attempts[session.attempts.length - 1].analysis.overall >
                   session.attempts[0].analysis.overall ? '📈' : '📊'}
                </span>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Attempt 1: {session.attempts[0].analysis.overall} → Attempt {session.attempts.length}: {session.attempts[session.attempts.length - 1].analysis.overall}
                  </p>
                  <p className="text-xs text-green-600">
                    {session.attempts[session.attempts.length - 1].analysis.overall > session.attempts[0].analysis.overall
                      ? 'Nice improvement!'
                      : 'Keep practicing — improvement comes with reps.'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleRetry} className="flex-1">
              Try Again
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Next Question
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <TranscriptDisplay
            transcript={speech.transcript}
            isRecording={speech.isRecording}
            elapsed={speech.elapsed}
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
        </div>
      )}
    </div>
  );
}
