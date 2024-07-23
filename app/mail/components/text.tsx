import React, { useState, useRef } from 'react';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons'


const Texts = () => {
  const [copyVisible, setCopyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const resumeContentRef = useRef(null);

  const handleCopy = () => {
    if (resumeContentRef.current) {
      const resumeContent = resumeContentRef.current.innerText;
      navigator.clipboard.writeText(resumeContent)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        })
        .catch((error) => console.error('Failed to copy: ', error));
    }
  };

  return (
    <div className="mx-auto pt-4 relative " onMouseEnter={() => setCopyVisible(true)} onMouseLeave={() => setCopyVisible(false)}>
      {!copied && copyVisible && (
        <button
          className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={handleCopy}
        >
          <CopyIcon className="h-6 w-6" />
        </button>
      )}
      {copied && (
        <div className="absolute top-0 right-0 p-2 text-green-500">
          <CheckIcon className="h-6 w-6" />
        </div>
      )}
      <div ref={resumeContentRef}>

        <h2 className="text-xl font-semibold mb-4">Day 1: Discover Local Neighborhoods</h2>
        <p className="mb-4">Start your day with breakfast at a local café in the Hongdae area, known for its youthful vibe and indie culture.</p>
        <p className="mb-4">Take a leisurely stroll through the streets of Ikseon-dong, a charming neighborhood filled with traditional hanok houses converted into trendy shops, cafes, and galleries.</p>
        <p className="mb-4">Enjoy a traditional Korean meal at a local restaurant in the Seochon area, known for its cozy atmosphere and hidden gems.</p>
        <p className="mb-4">Explore the artistic district of Mullae-dong, where you can find vibrant street art and visit local artist studios.</p>
        <p>Head to Yeonnam-dong for dinner, a trendy neighborhood popular among locals for its unique dining options and lively atmosphere.</p>



      </div>
    </div>
  );
};

export default Texts;