'use client';

import React from 'react';
import { useState } from 'react';
import { useRecording } from './hooks/useRecording';
import { MainContainer, BackgroundContainer, Title, Subtitle } from './components/StyledComponents';
import { VoiceRecording, RecorderStatus } from './components/Record';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 34rem;
  max-width: 34rem;
  margin: 0 auto;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(233, 183, 195, 0.12);
  padding: 2rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 100%;
    max-width: 100vw;
    min-width: 0;
    margin: 0;
    padding: 1rem 0.5rem 1.5rem 0.5rem;
    border-radius: 0.5rem;
    box-shadow: none;
    gap: 0.8rem;
    overflow-y: auto;
    max-height: 100vh;
  }
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
  box-sizing: border-box;
  &:focus {
    border-color: #e9b7c3;
    background: #fff;
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 0.7rem;
    min-height: 2.2rem;
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
  min-height: 4.5rem;
  resize: vertical;
  transition: border 0.2s;
  box-sizing: border-box;
  &:focus {
    border-color: #e9b7c3;
    background: #fff;
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 0.7rem;
    min-height: 2.2rem;
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
  margin-bottom: 0.5rem;
  &:hover:not(:disabled) {
    background: #f5c1d1;
    color: #23221e;
  }
  &:disabled {
    background: #f3e8ee;
    color: #bfaeae;
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    font-size: 1.05rem;
    padding: 1rem 0;
    margin-bottom: 1rem;
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
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 100vw;
    max-width: 100vw;
    min-width: 0;
    margin-left: 0;
    margin-right: 0;
    padding: 0.7rem 0.2rem;
    border-radius: 0.7rem;
  }
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

const ResponsiveMainContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #f9f9fa;
  @media (max-width: 600px) {
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    overflow-x: hidden;
  }
`;

export default function Home() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [customer, setCustomer] = useState('');
  const [message, setMessage] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [question3, setQuestion3] = useState('');
  const [poem, setPoem] = useState('');
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  const [isMakingCall, setIsMakingCall] = useState(false);
  const [poemGenerated, setPoemGenerated] = useState(false);
  const [step, setStep] = useState(1);

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

  const handleGeneratePoem = async () => {
    try {
      setIsGeneratingPoem(true);
      setError(null);
      setPoem('');
      if (!question1 || !question2 || !question3) {
        throw new Error('Please answer all questions');
      }
      const response = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question1,
          question2,
          question3,
          name: name || 'Your child',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate poem');
      }
      setPoem(data.poem);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to generate poem');
    } finally {
      setIsGeneratingPoem(false);
    }
  };

  const handleContinue = () => {
    setStep(3);
  };

  const handlePlaceCall = async () => {
    try {
      setIsMakingCall(true);
      setError(null);
      if (!customer || !voiceId || !name || !poem) {
        throw new Error('Please fill in all fields');
      }
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(customer)) {
        setIsMakingCall(false);
        setError('Please enter a valid phone number in E.164 format (e.g., +14155552671) including the country code.');
        return;
      }
      const callRes = await fetch('/api/vapi/schedule-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartesiaVoiceId: voiceId,
          name: name,
          firstMessage: `Hey Mom, this is ${name}. Happy Mother's Day! I love you so much and wrote this poem for you.\n\n${poem}\n\nHow is your day going so far?`,
          customer
        }),
      });
      const callData = await callRes.json();
      if (!callRes.ok) {
        throw new Error(callData.error || 'Failed to send message');
      }
      setStatus('idle');
      setResult(null);
      setCustomer('');
      setVoiceId('');
      setName('');
      setQuestion1('');
      setQuestion2('');
      setQuestion3('');
      setPoem('');
      setStep(1);
      setIsMakingCall(false);
      alert('Message sent! The call will be made shortly.');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      setIsMakingCall(false);
    }
  };

  if (typeof window !== 'undefined') {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
  }

  return (
    <ResponsiveMainContainer>
      <BackgroundContainer>
        <StyledTitle>Mother's Day Voice Agent</StyledTitle>
        <StyledSubtitle>Record your voice, clone it, answer a few questions. We'll write a poem, call your mom and deliver it in a natural conversation.</StyledSubtitle>
        {error && <div className="text-red-500 mb-4" style={{background:'#fff0f3',border:'1.5px solid #e9b7c3',borderRadius:'0.75rem',padding:'1rem',fontWeight:500}}>{error}</div>}
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
                value={`Today is Mother's Day, and even though I'm sending a message to my mom with a voice agent, I should still make sure I call her, laugh with her, and hopefully send her some flowers. My mom deserves it because she's the best and I love her a lot.`}
                readOnly
              />
            </TranscriptContainer>
          )}
          {status === 'result' && result === 'success' && (
            <FormContainer>
              {step === 1 && (
                <>
                  <div>
                    <StyledLabel>What's one beautiful thing your mom does?</StyledLabel>
                    <StyledTextarea
                      value={question1}
                      onChange={(e) => setQuestion1(e.target.value)}
                      placeholder="Tells you how amazing you are everytime you call..."
                      style={{ marginBottom: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <StyledLabel>What is your favrourite memory with your mom?</StyledLabel>
                    <StyledTextarea
                      value={question2}
                      onChange={(e) => setQuestion2(e.target.value)}
                      placeholder="Making you an amazing dinner whenever you visit..."
                      style={{ marginBottom: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <StyledLabel>What feeling do you associate most strongly with your mom?</StyledLabel>
                    <StyledTextarea
                      value={question3}
                      onChange={(e) => setQuestion3(e.target.value)}
                      placeholder="Warmth, love, incredible care and grounding..."
                      style={{ marginBottom: '0.5rem' }}
                    />
                  </div>
                  <StyledButton
                    onClick={handleGeneratePoem}
                    disabled={isGeneratingPoem}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {isGeneratingPoem ? 'Generating Poem...' : 'Generate Poem'}
                  </StyledButton>
                </>
              )}
              {step === 2 && (
                <>
                  <div style={{ marginTop: '1.5rem', background: '#f9f9fa', border: '1.5px solid #e9b7c3', borderRadius: '1rem', padding: '1.5rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.7rem' }}>Generated Poem:</div>
                    <div style={{ whiteSpace: 'pre-line', fontFamily: 'serif', fontSize: '1.1rem' }}>{poem}</div>
                  </div>
                  <StyledButton
                    onClick={handleContinue}
                    style={{ marginTop: '1.5rem' }}
                  >
                    Continue
                  </StyledButton>
                </>
              )}
              {step === 3 && (
                <>
                  <div>
                    <StyledLabel htmlFor="name">Your first name</StyledLabel>
                    <StyledInput
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your first name"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <StyledLabel htmlFor="customer">Mom's phone number (with country code)</StyledLabel>
                    <StyledInput
                      id="customer"
                      type="tel"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      placeholder="+1XXXXXXXXXX"
                      autoComplete="tel"
                      pattern="^\+[1-9]\d{1,14}$"
                      title="Please enter a valid phone number with country code (e.g., +1XXXXXXXXXX)"
                    />
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                      Must include country code (e.g., +1 for US)
                    </div>
                  </div>
                  <StyledButton
                    onClick={handlePlaceCall}
                    disabled={isMakingCall}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {isMakingCall ? 'Calling...' : 'Place Call'}
                  </StyledButton>
                </>
              )}
            </FormContainer>
          )}
        </div>
      </BackgroundContainer>
    </ResponsiveMainContainer>
  );
}
