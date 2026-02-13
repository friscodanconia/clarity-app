interface Hint {
  key: string;
  label: string;
}

interface KeyboardHintsProps {
  hints: Hint[];
}

export function KeyboardHints({ hints }: KeyboardHintsProps) {
  if (hints.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {hints.map(h => (
        <span key={h.key} className="flex items-center gap-1.5 text-xs text-stone-400">
          <kbd className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded border border-stone-300 bg-stone-50 font-mono text-[10px] text-stone-500">
            {h.key}
          </kbd>
          <span>{h.label}</span>
        </span>
      ))}
    </div>
  );
}
