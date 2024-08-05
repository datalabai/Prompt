import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { RightNotifications } from './rightpanel-notification'; 



export default function RightPanel() {
  const [isMaximized, setIsMaximized] = useState(false);

  const togglePanel = () => {
    setIsMaximized(prevState => !prevState);
  };

  return (
    <div className={`relative m-2 px-3 transition-all ${isMaximized ? 'w-full' : 'w-1/2'} max-w-xl`}>
      <div className={`transition-all ${isMaximized ? 'h-screen' : ''} overflow-auto`}>
        <RightNotifications />
      </div>
    </div>
  );
}
