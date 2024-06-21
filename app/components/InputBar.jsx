import React, { useState, useEffect, useRef } from 'react';

const InputBar = () => {
  const [mainInput, setMainInput] = useState('');
  const [smallInput, setSmallInput] = useState('');
  const smallInputRef = useRef(null);

  const handleMainInputChange = (e) => {
    setMainInput(e.target.value);
  };

  const handleSmallInputChange = (e) => {
    setSmallInput(e.target.value);
  };

  useEffect(() => {
    const smallInputEl = smallInputRef.current;
    if (smallInputEl) {
      smallInputEl.style.width = 'auto'; // Reset width
      smallInputEl.style.width = `${smallInputEl.scrollWidth}px`; // Set width based on content
      if (smallInput === '') {
        smallInputEl.style.width = '4rem'; // Set minimum width when smallInput is empty
      }
    }
  }, [smallInput]);

  return (
    <div className="flex flex-wrap items-start border border-gray-300 rounded p-2 border-indigo-500 overflow-auto">
      <div className="flex items-center flex-wrap w-full">
        <span className="bg-gray-300 text-black flex-none">prompt</span>
        <input
          ref={smallInputRef}
          id="smallInput"
          type="text"
          className="flex-grow flex-shrink"
          value={smallInput}
          onChange={handleSmallInputChange}
          style={{ minWidth: smallInput === '' ? '4rem' : 'auto', whiteSpace: 'pre-wrap' }}
        />
      </div>
      <input
        id="mainInput"
        type="text"
        className="w-full mt-2 outline-none border border-black flex-grow"
        style={{ wordWrap: 'break-word' }}
        value={mainInput}
        onChange={handleMainInputChange}
      />
    </div>
  );
};

export default InputBar;
