"use client";
import React, { useState } from 'react';

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, title: 'Notification', content: 'Content for Tab 1' },
    { id: 2, title: 'Activities', content: 'Content for Tab 2' },
    // { id: 3, title: 'Tab 3', content: 'Content for Tab 3' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            } py-2 px-4 mr-2 rounded`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div>
        {tabs.map((tab) =>
          activeTab === tab.id ? (
            <div key={tab.id} className="p-4 bg-gray-100">
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default TabComponent;
