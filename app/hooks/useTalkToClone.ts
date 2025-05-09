import { useState, useRef, useEffect } from 'react';
import Vapi from "@vapi-ai/web";

export const useTalkToClone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);

  const startRecording = async (assistantId: string) => {
    try {
      if (vapiRef.current) {
        await vapiRef.current.stop();
        vapiRef.current = null;
      }

      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setIsRecording(true);
      });

      vapi.on("call-end", () => {
        setIsRecording(false);
        vapiRef.current = null;
      });

      vapi.on("error", (e: Error) => {
        setError(e?.message || 'An error occurred with the voice call');
        setIsRecording(false);
        vapiRef.current = null;
      });

      await vapi.start(assistantId);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to start recording. Please check your microphone permissions.');
      setIsRecording(false);
      vapiRef.current = null;
    }
  };

  const stopRecording = async () => {
    try {
      if (vapiRef.current) {
        await vapiRef.current.stop();
        vapiRef.current = null;
        setIsRecording(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to stop recording');
    }
  };

  const resetRecording = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
    resetRecording
  };
}; 