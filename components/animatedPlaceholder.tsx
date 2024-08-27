// TypingAnimation.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
  speed?: number; // speed of typing animation in milliseconds
  loop?: boolean; // whether to loop the animation
  isPaused?: boolean; // whether the animation is paused
}

const typingTexts = [
  "Create image of a flying Unicorn...",
  "Create 3D NFT marketplace",
  "Generate image of Metaverse city",
  "Illustrate AI-powered robot assistant",
  "Visualize quantum computing lab",
  "Design autonomous drone delivery",
  "Generate image of Ethereum summit",
  "Create digital art gallery",
  "Render decentralized social network",
  "Design crypto hardware wallet",
  "Visualize DAO governance meeting",
  "Generate image of Web3 hackathon",
  "Create blockchain voting system",
  "Illustrate futuristic biotech lab"
];

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  speed = 100,
  loop = true,
  isPaused = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (isPaused) return; // Pause animation if isPaused is true

    const typingInterval = setInterval(() => {
      if (charIndex < typingTexts[textIndex].length) {
        setDisplayedText((prev) => prev + typingTexts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        // Clear the interval and prepare for the next text
        clearInterval(typingInterval);
        setTimeout(() => {
          setDisplayedText('');
          setCharIndex(0);
          setTextIndex((prevIndex) => (prevIndex + 1) % typingTexts.length);
        }, 1500); // Delay before showing the next text
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [charIndex, textIndex, speed, loop, isPaused]);

  return (
    <motion.div
      className="absolute top-2 left-4 text-gray-500 my-2 ml-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {displayedText}
      <span className="animate-pulse">|</span> {/* Blinking cursor */}
    </motion.div>
  );
};
