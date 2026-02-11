interface TranscriptDisplayProps {
  transcript: string;
  isRecording: boolean;
  elapsed: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TranscriptDisplay({ transcript, isRecording, elapsed }: TranscriptDisplayProps) {
  if (!transcript && !isRecording) return null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-stone-400 uppercase tracking-wider">Transcript</span>
        <span className={`text-sm font-mono tabular-nums ${
          elapsed > 90 ? 'text-amber-600' : 'text-stone-500'
        }`}>
          {formatTime(elapsed)}
        </span>
      </div>
      <div className="rounded-lg bg-stone-50 border border-stone-200 p-4 min-h-[100px]">
        <p className="font-serif text-stone-700 leading-relaxed whitespace-pre-wrap">
          {transcript || (
            <span className="text-stone-400 italic">Listening...</span>
          )}
          {isRecording && <span className="inline-block w-0.5 h-4 bg-stone-400 ml-0.5 animate-pulse align-text-bottom" />}
        </p>
      </div>
    </div>
  );
}
