import React from 'react';


const maskText = (text: string): string => {
  const words = text.split(' ');
  
  if (words.length <= 2) {
    return text;
  }

  const visibleLength = Math.floor(text.length * 0.30);

  const firstTwoWords = words.slice(0, 3).join(' ');
  const lastTwoWords = words.slice(-2).join(' ');

  const visibleText = `${firstTwoWords} ... ${lastTwoWords}`;

  // if (visibleLength >= visibleText.length) {
  //   return text;
  // }

  const maskedPartLength = text.length - visibleLength;
  const maskedPart = '* '.repeat(maskedPartLength);

  return `${firstTwoWords} ${maskedPart} ${lastTwoWords}`;
};


const MaskedText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div>
      {maskText(text)}
    </div>
  );
};

export default MaskedText;
