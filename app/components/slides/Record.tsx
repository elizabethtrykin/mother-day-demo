import React from 'react';
import { VoiceRecordButton } from '../VoiceRecordButton';
import { cn } from '../../utils/cn';

interface VoiceRecordingProps {
  isRecording: boolean;
  recordingTime: number;
  onStart: () => void;
  onStop: () => void;
  onRetry: () => void;
  hasRecordedAudio: boolean;
}

export const VoiceRecording: React.FC<VoiceRecordingProps> = ({
  isRecording,
  recordingTime,
  onStart,
  onStop,
  onRetry,
  hasRecordedAudio,
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Record Your Voice</h2>
        <p className="text-gray-600">
          Record a short message that we'll use to clone your voice. Speak clearly and naturally.
        </p>
      </div>
      
      <div className="flex justify-center">
        <VoiceRecordButton 
          label={isRecording ? "Stop Recording" : "Start Recording"}
          isRecording={isRecording}
          recordingTime={recordingTime}
          error={null}
          onStartRecording={onStart}
          onStopRecording={onStop}
          onRetry={onRetry}
          className="text-black hover:text-white text-sm w-48 h-12"
          isComplete={hasRecordedAudio}
        />
      </div>

      {hasRecordedAudio && (
        <div className="text-center text-sm text-gray-600">
          Voice recorded! Click continue to proceed.
        </div>
      )}
    </div>
  );
}; 