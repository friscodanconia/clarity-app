type SpeechCallback = (transcript: string, isFinal: boolean) => void;

interface SpeechSession {
  stop: () => void;
}

export function startSpeechRecognition(onResult: SpeechCallback, onEnd: () => void): SpeechSession | null {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let finalTranscript = '';

  recognition.onresult = (event: any) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += text + ' ';
        onResult(finalTranscript.trim(), true);
      } else {
        interim += text;
        onResult((finalTranscript + interim).trim(), false);
      }
    }
  };

  recognition.onerror = (event: any) => {
    if (event.error !== 'aborted') {
      console.error('Speech recognition error:', event.error);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  recognition.start();

  return {
    stop: () => {
      recognition.stop();
    },
  };
}

export function isSpeechSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}
