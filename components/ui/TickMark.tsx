import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react'; // Assume we're using lucide-react for icons

const TickMark: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const tickMarkRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (tickMarkRef.current && !tickMarkRef.current.contains(event.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={tickMarkRef} className="relative flex flex-col items-center justify-center w-96 h-96 bg-white border border-gray-300 rounded shadow-lg">
      <button onClick={() => setVisible(false)} className="absolute top-2 right-2">
        <XCircle className="text-red-500 w-6 h-6" />
      </button>
      <CheckCircle className="text-green-500 w-24 h-24" />
      <p className="text-green-500 mt-2">Payment confirmed</p>
    </div>
  );
};

export default TickMark;
