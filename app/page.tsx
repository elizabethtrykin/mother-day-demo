'use client';

import { useState, useRef } from 'react';
import { useRecording } from './hooks/useRecording';
import { MainContainer, BackgroundContainer, Title, Subtitle } from './components/StyledComponents';
import { VoiceRecording } from './components/slides/Record';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    isRecording: isVoiceRecording, 
    recordingTime, 
    audioChunks, 
    error: recordingError, 
    startRecording, 
    stopRecording,
    resetRecording 
  } = useRecording(10);

  const handleRetry = () => {
    resetRecording();
  };

  const processRecording = async () => {
    try {
      setIsCloning(true);
      setError(null);
      
      if (audioChunks.length === 0) {
        throw new Error('Please record your voice first');
      }

      const audioBlob = new Blob(audioChunks, { 
        type: 'audio/webm'
      });
      
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('name', 'Mother Day Voice');
      
      const voiceResponse = await fetch('/api/assistant/clone-voice', {
        method: 'POST',
        body: formData,
      });
      
      if (!voiceResponse.ok) {
        throw new Error('Voice cloning failed');
      }
      
      const voiceData = await voiceResponse.json();
      setVoiceId(voiceData.voiceId);
      setCurrentStep(1);
      
    } catch (error: any) {
      setError(error.message || 'Failed to process recording');
    } finally {
      setIsCloning(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      setIsSending(true);
      setError(null);

      if (!phoneNumber || !message || !voiceId) {
        throw new Error('Please fill in all fields');
      }

      const response = await fetch('/api/assistant/create-with-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          voiceId,
          phoneNumber,
          message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setCurrentStep(2);
    } catch (error: any) {
      setError(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MainContainer>
      <BackgroundContainer>
        <Title>Mother's Day Voice Message</Title>
        <Subtitle>Record your voice, write a message, and we'll call your mom!</Subtitle>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {currentStep === 0 && (
          <div className="space-y-4">
            <VoiceRecording
              isRecording={isVoiceRecording}
              recordingTime={recordingTime}
              onStart={startRecording}
              onStop={stopRecording}
              onRetry={handleRetry}
              hasRecordedAudio={audioChunks.length > 0}
            />
            {audioChunks.length > 0 && !isCloning && (
              <button
                onClick={processRecording}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mom's Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-2 border rounded-lg h-32"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Message Sent!</h2>
            <p>Your message will be delivered to your mom shortly.</p>
            <button
              onClick={() => {
                setCurrentStep(0);
                resetRecording();
                setPhoneNumber('');
                setMessage('');
                setVoiceId('');
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        )}
      </BackgroundContainer>
    </MainContainer>
  );
}
