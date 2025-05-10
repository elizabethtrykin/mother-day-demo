import { useState, useRef } from 'react';

interface UseRecordingReturn {
  isRecording: boolean;
  recordingTime: number;
  audioChunks: Blob[];
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecording: () => void;
}

export const useRecording = (maxDuration: number = 10): UseRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetRecording = () => {
    audioChunksRef.current = [];
    setRecordingTime(0);
    setError(null);
  };

  const startRecording = async () => {
    try {
      resetRecording();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, maxDuration * 1000);
      
      const intervalId = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration - 1) {
            clearInterval(intervalId);
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      
      timeoutRef.current = intervalId as unknown as NodeJS.Timeout;
      
    } catch (err) {
      setError('Failed to start recording: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    return new Promise<void>((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = () => {
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }
          setIsRecording(false);
          resolve();
        };
        mediaRecorderRef.current.stop();
      } else {
        setIsRecording(false);
        resolve();
      }
    });
  };

  return {
    isRecording,
    recordingTime,
    audioChunks: audioChunksRef.current,
    error,
    startRecording,
    stopRecording,
    resetRecording
  };
}; 