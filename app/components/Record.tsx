import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpIcon, XMarkIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  background: var(--color-base-bg-main);
  border-radius: 1.5rem;
  padding: 0.75rem 0.5rem;
  width: 28rem;
  min-width: 28rem;
  max-width: 28rem;
  min-height: 5rem;
  height: auto;
  box-shadow: 0 4px 16px 0 rgba(233, 183, 195, 0.12);
  position: relative;
  gap: 1rem;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const IconButton = styled.button<{ color?: string }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => color || 'var(--color-brand-primary)'};
  box-shadow: 0 2px 8px 0 rgba(233, 183, 195, 0.10);
  transition: background 0.2s;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    background: ${({ color }) => {
      if (color === '#e5e5e5') return '#cccccc'; // darker grey for cancel
      if (color === 'var(--color-brand-primary)') return 'var(--color-brand-primary-hover)'; // pink hover
      if (color) return color;
      return 'var(--color-brand-primary-hover)';
    }};
  }
`;

const WaveformContainer = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  gap: 2px;
  flex: 1 1 0%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  margin-right: 1.5rem;
`;

const WaveformBar = styled.div<{ height: number }>`
  width: 4px;
  height: ${({ height }) => height}px;
  background: var(--color-brand-primary);
  border-radius: 2px;
  margin: 0 1px;
  transition: height 0.1s linear;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.svg`
  animation: ${spin} 1s linear infinite;
  width: 20px;
  height: 20px;
`;

const CenterText = styled.span<{ color?: string; weight?: number; size?: string; margin?: string }>`
  flex: 1;
  text-align: left;
  color: ${({ color }) => color || '#000'};
  font-family: var(--font-family-sans);
  font-weight: ${({ weight }) => weight || 500};
  font-size: ${({ size }) => size || '1.1rem'};
  margin: 0;
  padding: 0;
`;

const ResultText = styled.span`
  color: #000;
  font-family: var(--font-family-sans);
  font-weight: 500;
  font-size: 1.1rem;
  margin-right: 16px;
  padding: 0;
  text-align: left;
`;

const StartButton = styled.button`
  font-family: var(--font-family-sans);
  font-size: 1.5rem;
  font-weight: 500;
  color: #000;
  background: var(--color-brand-primary);
  border: none;
  border-radius: 9999px;
  padding: 1.25rem 3rem;
  box-shadow: 0 4px 16px 0 rgba(233, 183, 195, 0.12);
  cursor: pointer;
  transition: background 0.2s;
  margin: 1.5rem 0;
  &:hover {
    background: var(--color-brand-primary-hover);
  }
`;

// Shared row for status (icon + text + button)
const StatusRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.1rem 0.25rem;
  overflow: hidden;
  min-width: 0;
`;

// Shared wrapper for icon to ensure consistent alignment
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  margin-right: 0.75rem;
`;

const ButtonActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 0.5rem;
`;

export type RecorderStatus = 'idle' | 'recording' | 'cloning' | 'result';

interface VoiceRecordingProps {
  status: RecorderStatus;
  onStart: () => void;
  onStop: () => void;
  onSend: () => void;
  onRetry: () => void;
  result: 'success' | 'error' | null;
}

const NUM_BARS = 40;
const MIN_BAR_HEIGHT = 4;
const MAX_BAR_HEIGHT = 48;

const RealTimeWaveform: React.FC<{ active: boolean }> = ({ active }) => {
  const [barHeights, setBarHeights] = useState<number[]>(Array(NUM_BARS).fill(MIN_BAR_HEIGHT));
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!active) {
      setBarHeights(Array(NUM_BARS).fill(MIN_BAR_HEIGHT));
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    let isMounted = true;
    let localStream: MediaStream | null = null;

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream = stream;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        analyserRef.current = analyser;
        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        dataArrayRef.current = dataArray;

        const animate = () => {
          if (!isMounted) return;
          analyser.getByteFrequencyData(dataArray);
          // Map frequency data to bar heights
          const step = Math.floor(dataArray.length / NUM_BARS);
          const newHeights = Array(NUM_BARS)
            .fill(0)
            .map((_, i) => {
              // Average the values in this step for smoother bars
              let sum = 0;
              let count = 0;
              for (let j = i * step; j < (i + 1) * step && j < dataArray.length; j++) {
                sum += dataArray[j];
                count++;
              }
              const avg = count > 0 ? sum / count : 0;
              return Math.max(MIN_BAR_HEIGHT, Math.min(MAX_BAR_HEIGHT, (avg / 255) * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT) + MIN_BAR_HEIGHT));
            });
          setBarHeights(newHeights);
          animationRef.current = requestAnimationFrame(animate);
        };
        animate();
      } catch (e) {
        // fallback to static waveform
        setBarHeights(Array(NUM_BARS).fill(MIN_BAR_HEIGHT));
      }
    };
    setup();
    return () => {
      isMounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [active]);

  return (
    <WaveformContainer>
      {barHeights.map((h, i) => (
        <WaveformBar key={i} height={h} />
      ))}
    </WaveformContainer>
  );
};

const AnimatedDots = () => {
  const [dotCount, setDotCount] = React.useState(1);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return <span>{'.'.repeat(dotCount)}</span>;
};

const LargeCheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22L19 29L32 15" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const VoiceRecording: React.FC<VoiceRecordingProps> = ({
  status,
  onStart,
  onStop,
  onSend,
  onRetry,
  result,
}) => {
  return (
    <Container>
      {status === 'idle' ? (
        <StartButton onClick={onStart} aria-label="Start recording">Start recording</StartButton>
      ) : (
        <Inner>
          {status === 'recording' && (
            <StatusRow>
              <RealTimeWaveform active={true} />
              <ButtonActionsWrapper>
                <IconButton color="var(--color-brand-primary)" onClick={onSend} aria-label="Send">
                  <ArrowUpIcon className="w-6 h-6" style={{ color: '#000' }} />
                </IconButton>
                <IconButton color="#e5e5e5" onClick={onStop} aria-label="Cancel">
                  <XMarkIcon className="w-6 h-6" style={{ color: '#000' }} />
                </IconButton>
              </ButtonActionsWrapper>
            </StatusRow>
          )}
          {status === 'cloning' && (
            <StatusRow>
              <IconWrapper>
                <Spinner viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="var(--color-brand-primary)" strokeWidth="4" strokeDasharray="60" strokeDashoffset="20" />
                </Spinner>
              </IconWrapper>
              <CenterText color="#000" weight={600} margin="0">
                Cloning<AnimatedDots />
              </CenterText>
              <ButtonActionsWrapper />
            </StatusRow>
          )}
          {status === 'result' && (
            <StatusRow>
              <IconWrapper>
                {result === 'success' ? (
                  <LargeCheckIcon />
                ) : (
                  <XMarkIcon className="w-12 h-12" style={{ color: '#000' }} />
                )}
              </IconWrapper>
              <ResultText>
                {result === 'success' ? 'Voice cloned' : 'Something went wrong. Try again?'}
              </ResultText>
              <ButtonActionsWrapper>
                <IconButton color="var(--color-brand-primary)" onClick={onRetry} aria-label="Retry">
                  {result === 'success' ? (
                    <ArrowPathIcon className="w-6 h-6" style={{ color: '#000' }} />
                  ) : (
                    <ArrowUpIcon className="w-6 h-6" style={{ color: '#000' }} />
                  )}
                </IconButton>
              </ButtonActionsWrapper>
            </StatusRow>
          )}
        </Inner>
      )}
    </Container>
  );
}; 