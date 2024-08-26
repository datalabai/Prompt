import React from 'react';

interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  return (
    <div className="relative inline-block">
      <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
        {count}
      </span>
    </div>
  );
};

export default NotificationBadge;
