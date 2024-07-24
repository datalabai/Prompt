import React, { useState, useRef } from 'react';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';

interface TextsProps {
  generatedText: string;
  onCopy: () => void; 
}

const Texts: React.FC<TextsProps> = ({ generatedText, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const textContentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (textContentRef.current) {
      const textContent = textContentRef.current.innerText;
      navigator.clipboard.writeText(textContent)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); 
          onCopy(); 
        })
        .catch((error) => console.error('Failed to copy: ', error));
    }
  };

  return (
    <div className="pt-4 relative">
      <div ref={textContentRef} className="w-fit  text-content whitespace-pre-wrap text-left">
        {generatedText}
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-45 right-52 p-1 rounded"
      >
        <CopyIcon className="h-6 w-6" />
      </button>
      {copied && (
        <div className="text-green-500 absolute top-45 right-60">
          <CheckIcon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

export default Texts;
