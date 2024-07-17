import React from 'react';
import TabComponent from '../components/TabComponent';

const ScrollableDivs = () => {
  return (
    <div className="flex mt-3">
      <div className="flex-1 h-screen overflow-y-scroll bg-stone-50 ">
        {/* Content for first scrollable div */}
        <div className="p-4">
          {/* Replace with your content */}
          <TabComponent/>
          {/* Add more content if needed */}
        </div>
      </div>
      <div className="flex-1 h-screen overflow-y-scroll bg-stone-50 ">
        {/* Content for second scrollable div */}
        <div className="p-4">
          {/* Replace with your content */}
          <p>Conversations</p>
          {/* Add more content if needed */}
        </div>
      </div>
    </div>
  );
};

export default ScrollableDivs;
