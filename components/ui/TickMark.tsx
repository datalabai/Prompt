import React from 'react';
import { CheckCircle } from 'lucide-react'; // Assume we're using lucide-react for icons

const TickMark: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <CheckCircle className="text-green-500 w-12 h-12" />
    </div>
  );
};

export default TickMark;
