'use client';

import React from 'react';
import { useState } from 'react';
import { useRecording } from './hooks/useRecording';
import { MainContainer, BackgroundContainer, Title, Subtitle } from './components/StyledComponents';
import { VoiceRecording, RecorderStatus } from './components/Record';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 34rem;
  min-width: 34rem;
  max-width: 34rem;
  margin: 0 auto;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(233, 183, 195, 0.12);
  padding: 2rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
`;

const StyledLabel = styled.label`
  font-size: 1.08rem;
  font-weight: 500;
  color: #23221e;
  margin-bottom: 0.7rem;
  font-family: 'Inter', 'Geist', 'system-ui', 'sans-serif';
  display: block;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1.15rem 1.2rem;
  border: 1.5px solid #e9b7c3;
  border-radius: 1rem;
  background: #fff;
  color: #23221e;
  font-size: 1.13rem;
  font-family: 'Inter', 'Geist', 'system-ui', 'sans-serif';
  outline: none;
  transition: border 0.2s;
  margin-bottom: 0.1rem;
  &:focus {
    border-color: #e9b7c3;
    background: #fff;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1.15rem 1.2rem;
  border: 1.5px solid #e9b7c3;
  border-radius: 1rem;
  background: #fff;
  color: #23221e;
  font-size: 1.13rem;
  font-family: 'Inter', 'Geist', 'system-ui', 'sans-serif';
  outline: none;
  min-height: 8.5rem;
  resize: vertical;
  transition: border 0.2s;
  margin-bottom: 0.1rem;
  &:focus {
    border-color: #e9b7c3;
    background: #fff;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 1.15rem 0;
  background: #e9b7c3;
  color: #23221e;
  font-size: 1.18rem;
  font-weight: 600;
  border: none;
  border-radius: 1rem;
  font-family: 'Inter', 'Geist', 'system-ui', 'sans-serif';
  box-shadow: 0 2px 8px rgba(233, 183, 195, 0.08);
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  margin-top: 0.5rem;
  &:hover:not(:disabled) {
    background: #f5c1d1;
    color: #23221e;
  }
  &:disabled {
    background: #f3e8ee;
    color: #bfaeae;
    cursor: not-allowed;
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 0.3rem;
  color: #000;
`;

const StyledSubtitle = styled(Subtitle)`
  margin-bottom: 2.5rem;
`;

const TranscriptContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1.5px solid #e9b7c3;
  border-radius: 1rem;
  background: #fff;
  color: #23221e;
  width: 100%;
  max-width: 64rem;
  min-width: 36rem;
  margin-left: auto;
  margin-right: auto;
`;

const TranscriptTextarea = styled.textarea`
  width: 100%;
  min-height: 20rem;
  border: 1.5px solid #e9b7c3;
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 1.08rem;
  font-family: 'Inter', 'Geist', 'system-ui', 'sans-serif';
  resize: vertical;
  background: #f9f9fa;
  box-sizing: border-box;
  line-height: 1.6;
`;

export default function Home() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');

  const {
    isRecording,
    audioChunks,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecording(10);

  const handleStart = async () => {
    setStatus('recording');
    setResult(null);
    await startRecording();
  };

  const handleStop = () => {
    stopRecording();
    setStatus('idle');
    setResult(null);
    resetRecording();
  };

  const handleSend = async () => {
    await stopRecording();
    setStatus('cloning');
    setResult(null);
    try {
      if (audioChunks.length === 0) {
        throw new Error('Please record your voice first');
      }
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
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
      setStatus('result');
      setResult('success');
    } catch (err) {
      setStatus('result');
      setResult('error');
      setVoiceId('');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setResult(null);
    setVoiceId('');
    resetRecording();
  };

  const handleSendMessage = async () => {
    try {
      setIsSending(true);
      setError(null);
      if (!phoneNumber || !message || !voiceId) {
        throw new Error('Please fill in all fields');
      }
      const response = await fetch('/api/vapi/schedule-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartesiaVoiceId: voiceId,
          name: name,
          firstMessage: message,
          phoneNumber: phoneNumber
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setStatus('idle');
      setResult(null);
      setPhoneNumber('');
      setMessage('');
      setVoiceId('');
      setName('');
      alert('Message sent!');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MainContainer>
      <BackgroundContainer>
        <StyledTitle>Mother's Day Voice Agent</StyledTitle>
        <StyledSubtitle>Record your voice, clone it, write a message, and we'll call your mom and deliver it in a natural conversation.</StyledSubtitle>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="space-y-4">
          <VoiceRecording
            status={status}
            onStart={handleStart}
            onStop={handleStop}
            onSend={handleSend}
            onRetry={handleRetry}
            result={result}
          />
          {status === 'recording' && (
            <TranscriptContainer>
              <label htmlFor="transcript" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Talk for at least 10 seconds. You can read this transcript.</label>
              <TranscriptTextarea
                id="transcript"
                value={`Hey Mom — remember that time I tried to make you breakfast in bed and nearly set the toaster on fire? Yeah… I've come a long way since then. But honestly, that moment kind of sums up how much I've always wanted to do something special for you — even if I had no idea what I was doing. You've always shown up for me with so much love and patience, even when I was a total mess. So this year, I figured I'd try something a little different… and let AI say what my heart's been trying to for years: I love you. Happy Mother's Day.`}
                readOnly
              />
            </TranscriptContainer>
          )}
          {/* Only show the phone/message form after a successful voice clone */}
          {status === 'result' && result === 'success' && (
            <FormContainer>
              <div>
                <StyledLabel htmlFor="name">Your name</StyledLabel>
                <StyledInput
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              </div>
              <div>
                <StyledLabel htmlFor="phone">Mom's phone number (with country code)</StyledLabel>
                <StyledInput
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  autoComplete="tel"
                />
              </div>
              <div>
                <StyledLabel htmlFor="message">Your message. We'll read this first, and then chat with your mom. </StyledLabel>
                <StyledTextarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                />
              </div>
              <StyledButton
                onClick={handleSendMessage}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </StyledButton>
            </FormContainer>
          )}
        </div>
      </BackgroundContainer>
    </MainContainer>
  );
}
