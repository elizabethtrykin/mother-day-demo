import { motion } from 'framer-motion';

interface MicIconProps {
  isAutoAnimated?: boolean;
  isNotAnimated?: boolean;
  isTalking?: boolean;
}

export const MicIcon = ({
  isAutoAnimated = false,
  isNotAnimated = false,
  isTalking = false,
}: MicIconProps) => {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={
        isNotAnimated
          ? {}
          : isAutoAnimated
          ? {
              scale: [1, 1.2, 1],
              transition: {
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
          : isTalking
          ? {
              scale: [1, 1.2, 1],
              transition: {
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
          : {}
      }
    >
      <path
        d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
        fill="currentColor"
      />
      <path
        d="M5 12C5 15.3137 7.68629 18 11 18H13C16.3137 18 19 15.3137 19 12V11H17V12C17 14.2091 15.2091 16 13 16H11C8.79086 16 7 14.2091 7 12V11H5V12Z"
        fill="currentColor"
      />
      <path
        d="M12 19C12.5523 19 13 19.4477 13 20V23C13 23.5523 12.5523 24 12 24C11.4477 24 11 23.5523 11 23V20C11 19.4477 11.4477 19 12 19Z"
        fill="currentColor"
      />
    </motion.svg>
  );
}; 