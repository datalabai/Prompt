// TypingAnimation.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
  text: string;
  speed?: number; // speed of typing animation in milliseconds
  loop?: boolean; // whether to loop the animation
  isPaused?: boolean; // whether the animation is paused
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 100,
  loop = true,
  isPaused = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isPaused) return; // Pause animation if isPaused is true

    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      setIndex((prev) => {
        const newIndex = prev + 1;
        if (newIndex >= text.length) {
          if (loop) {
            // Reset index for looping
            setDisplayedText('');
            return 0;
          } else {
            // Stop when finished if not looping
            clearInterval(typingInterval);
          }
        }
        return newIndex;
      });
    }, speed);

    return () => clearInterval(typingInterval);
  }, [index, text, speed, loop, isPaused]);

  return (
    <motion.div
      className="absolute top-2 left-4 text-gray-500 my-2 ml-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {displayedText}
      <span className="animate-pulse">|</span> {/* Blinking cursor */}
    </motion.div>
  );
};
