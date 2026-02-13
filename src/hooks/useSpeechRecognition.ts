import { useState, useRef, useCallback, useEffect } from 'react';
import { startSpeechRecognition } from '../lib/speech';

interface UseSpeechOptions {
  maxDuration?: number;
  onAutoStop?: () => void;
}

export function useSpeechRecognition(options?: UseSpeechOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const sessionRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const maxDuration = options?.maxDuration;
  const onAutoStop = options?.onAutoStop;

  const stopRecording = useCallback(() => {
    sessionRef.current?.stop();
    sessionRef.current = null;
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const start = useCallback(async () => {
    setTranscript('');
    setElapsed(0);
    setAudioBlob(null);
    setIsRecording(true);
    startTimeRef.current = Date.now();
    audioChunksRef.current = [];

    // Start MediaRecorder for audio playback
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
    } catch {
      // MediaRecorder not supported — continue without audio
    }

    timerRef.current = window.setInterval(() => {
      const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(sec);
      if (maxDuration && sec >= maxDuration) {
        stopRecording();
        onAutoStop?.();
      }
    }, 1000);

    sessionRef.current = startSpeechRecognition(
      (text) => setTranscript(text),
      () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    );
  }, [maxDuration, onAutoStop, stopRecording]);

  const stop = stopRecording;

  useEffect(() => {
    return () => {
      sessionRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return { isRecording, transcript, elapsed, audioBlob, start, stop, setTranscript };
}
