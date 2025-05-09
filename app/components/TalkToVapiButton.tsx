'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import { buttonTheme } from './Button.theme';
import { MicIcon } from './MicIcon';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { cn } from '../utils/cn';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
  align-items: center;
  gap: 1rem;

  /* This ensures the main button stays centered */
  & > *:first-child {
    grid-column: 2;
  }
`;

const RetryButton = styled(motion.button)`
  grid-column: 3;
  justify-self: start;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(14, 14, 19, 0.7);
  border: 1px solid rgb(63 63 70);
  color: rgb(255 250 234);

  &:hover {
    background: white;
    border-color: white;
    color: rgb(14 14 19);
    transform: scale(1.05);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &::before {
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: rgb(255 250 234);
    opacity: 0;
    transition: opacity 0.2s ease;
    white-space: nowrap;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }
`;

interface TalkToVapiButtonProps extends HTMLMotionProps<'button'> {
  isRecording: boolean;
  recordingTime: number;
  error: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRetry?: () => void;
  label?: string;
  className?: string;
  isComplete?: boolean;
}

export const TalkToVapiButton = ({
  className,
  label,
  isRecording,
  recordingTime,
  error,
  onStartRecording,
  onStopRecording,
  onRetry,
  isComplete = false,
  ...props
}: TalkToVapiButtonProps) => {
  return (
    <ButtonContainer>
      <motion.button
        aria-label={label}
        className={cn(
          buttonTheme({ variant: 'tertiary', size: 'lg' }),
          'group w-[13.5rem] gap-3 after:-inset-2 active:disabled:scale-100',
          'sm:w-[23.3125rem] sm:gap-4 sm:text-[1.25rem] sm:leading-[100%] sm:after:-inset-3',
          'relative font-mono font-medium after:absolute after:rounded-[inherit] after:border after:border-white/50',
          'cursor-pointer',
          isComplete
            ? 'bg-[rgb(98_246_181)] hover:bg-[rgb(98_246_181)] border-[rgb(98_246_181)] hover:border-[rgb(98_246_181)] text-black hover:text-black !text-black'
            : isRecording
              ? 'bg-base-bg-main hover:bg-base-bg-main border-base-bg-alt hover:border-base-bg-alt !text-white'
              : 'hover:enabled:bg-base-bg-main hover:enabled:border-base-bg-alt',
          className,
        )}
        disabled={isComplete}
        onClick={isRecording ? onStopRecording : onStartRecording}
        {...props}
      >
        <span className="flex items-center gap-2">
          {isComplete ? 'Recording Complete' : isRecording ? (
            <>
              <span className="group-hover:hidden">just talk!</span>
              <span className="hidden group-hover:inline">click to stop?</span>
            </>
          ) : label}
          {isComplete ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <MicIcon isTalking={isRecording} />
          )}
        </span>
      </motion.button>

      {isComplete && onRetry && (
        <RetryButton
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onRetry}
          aria-label="Retry recording"
        >
          <ArrowPathIcon className="animate-spin-once" />
        </RetryButton>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-sm p-1 text-center">
          {error}
        </div>
      )}
    </ButtonContainer>
  );
}; 