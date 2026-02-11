import { useState, useRef, useCallback, useEffect } from 'react';
import { startSpeechRecognition } from '../lib/speech';

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const sessionRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    setTranscript('');
    setElapsed(0);
    setIsRecording(true);
    startTimeRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    sessionRef.current = startSpeechRecognition(
      (text) => setTranscript(text),
      () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    );
  }, []);

  const stop = useCallback(() => {
    sessionRef.current?.stop();
    sessionRef.current = null;
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      sessionRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { isRecording, transcript, elapsed, start, stop, setTranscript };
}
