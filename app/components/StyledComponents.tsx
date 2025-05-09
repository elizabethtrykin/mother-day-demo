import styled from 'styled-components';
import { motion } from 'framer-motion';

export const MainContainer = styled.main`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BackgroundContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  border: 1px solid var(--color-base-border);
  background-image: repeating-linear-gradient(to bottom, transparent, transparent 48px, rgba(63, 63, 70, 0.3) 48px, rgba(63, 63, 70, 0.3) 49px), 
                   repeating-linear-gradient(to right, transparent, transparent 48px, rgba(63, 63, 70, 0.3) 48px, rgba(63, 63, 70, 0.3) 49px);
  background-color: var(--color-base-bg-main);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled(motion.h1)`
  font-size: var(--font-size-4xl);
  text-align: center;
  font-family: var(--font-family-sans);
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
  margin-bottom: 1rem;
  padding-top: 4rem;
`;

export const Subtitle = styled.span`
  color: var(--color-brand-primary);
  font-size: var(--font-size-xl);
  display: block;
  margin-top: 0.5rem;
`;

export const SlideContainer = styled(motion.div)`
  width: 100%;
  max-width: 42rem;
  margin: 2rem auto;
  padding: 2.5rem;
  border: 1px solid var(--color-base-border);
  border-radius: 0.2rem;
  background-color: var(--color-base-bg-main);
  position: relative;
  height: 500px;
  backdrop-filter: blur(10px);
`;

export const CardHeading = styled.h2`
  font-family: var(--font-family-sans);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const CardSubtitle = styled.p<{ color?: string }>`
  font-family: var(--font-family-sans);
  font-size: var(--font-size-lg);
  color: ${props => props.color || 'var(--color-brand-primary)'};
  text-align: center;
  opacity: 0.9;
  margin-bottom: 2rem;
`;

export const NavigationButton = styled.button`
  position: absolute;
  bottom: 1.25rem;
  padding: 0.75rem 1.5rem;
  height: 2.8rem;
  font-family: var(--font-family-mono);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-wide);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  text-transform: uppercase;
  border: 1px solid transparent;
  border-radius: 9999px;
  background-color: var(--color-brand-purple);
  color: var(--color-base-bg-main);
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    background-color: transparent;
    border-color: var(--color-brand-purple);
    color: var(--color-brand-purple);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const NextButton = styled(NavigationButton)`
  right: 1.25rem;
`;

export const BackButton = styled(NavigationButton)`
  left: 1.25rem;
  opacity: 0.3;

  &:hover:not(:disabled) {
    opacity: 1;
    background-color: transparent;
    border-color: var(--color-brand-purple);
    color: var(--color-brand-purple);
  }
`;

export const SlideCount = styled.span`
  opacity: 0.8;
  font-size: var(--font-size-xs);
  margin-right: 0.75rem;
  font-weight: var(--font-weight-normal);
`;

export const ButtonContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  width: 100%;
`;

export const ShareButton = styled.button`
  font-family: var(--font-family-mono);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-base-bg-main);
  background: var(--color-brand-primary);
  border: 1px solid var(--color-brand-primary);
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto 0;
  padding: 0 1.25rem;
  height: 2.8rem;
  transition: all 0.2s;
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);

  &:hover {
    color: var(--color-text-primary);
    background: var(--color-base-bg-main);
    border-color: var(--color-base-border);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const SlideNumber = styled.span`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  opacity: 0.8;
`; 