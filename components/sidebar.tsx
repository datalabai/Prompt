"use client"
import React, { useState } from 'react';
import { LayoutDashboard, House, GlobeLock, BookOpenText, Images, Biohazard, List, Palette, ClipboardList } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('');

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  return (
    <div className="border-r h-screen w-56 flex-shrink-0">
      <div className="pl-8 mt-20">
        <ul>
          <li className={`flex my-2 py-2 ${activeItem === 'Dashboard' ? 'bg-gray-200' : ''}`}>
            <LayoutDashboard />
            <a href="#" className="block pl-2 rounded" onClick={() => handleItemClick('Dashboard')}>
              Dashboard
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'General' ? 'bg-gray-200' : ''}`}>
            <House />
            <a href="/general" className="block pl-2 rounded" onClick={() => handleItemClick('General')}>
              General
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'Private' ? 'bg-gray-200' : ''}`}>
            <GlobeLock />
            <a href="/private" className="block pl-2 rounded" onClick={() => handleItemClick('Private')}>
              Private
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'Expert' ? 'bg-gray-200' : ''}`}>
            <BookOpenText />
            <a href="/expert" className="block pl-2 rounded" onClick={() => handleItemClick('Expert')}>
              Expert
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'Memes' ? 'bg-gray-200' : ''}`}>
            <Palette />
            <a href="#" className="block pl-2 rounded" onClick={() => handleItemClick('Memes')}>
              Memes
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'Logos' ? 'bg-gray-200' : ''}`}>
            <Biohazard />
            <a href="#" className="block pl-2 rounded" onClick={() => handleItemClick('Logos')}>
              Logos
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'Images' ? 'bg-gray-200' : ''}`}>
            <Images />
            <a href="#" className="block pl-2 rounded" onClick={() => handleItemClick('Images')}>
              Images
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'Resumes' ? 'bg-gray-200' : ''}`}>
            <ClipboardList />
            <a href="#" className="block pl-2 rounded" onClick={() => handleItemClick('Resumes')}>
              Resumes
            </a>
          </li>
          <li className={`flex my-2 py-2 ${activeItem === 'Texts' ? 'bg-gray-200' : ''}`}>
            <List />
            <a href="#" className="block pl-2 rounded" onClick={() => handleItemClick('Texts')}>
              Texts
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
