interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function RecordButton({ isRecording, onClick, disabled }: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative flex items-center justify-center disabled:opacity-40 touch-manipulation"
      title={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording && (
        <span className="absolute w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-red-400 animate-pulse-ring" />
      )}
      <span
        className={`relative w-20 h-20 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-stone-800 hover:bg-stone-700'
        }`}
      >
        {isRecording ? (
          <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </span>
    </button>
  );
}
