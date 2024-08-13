import { ChatBubbleIcon, MagicWandIcon } from '@radix-ui/react-icons';
import React, { useRef } from 'react';


interface InputWithMenuProps {
  showInputItemId: string | null;
  itemId: string;
  postText: string;
  setPostText: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, itemId: string) => void;
  handleIconClick: () => void;
  renderSelectedIcon: () => React.ReactNode;
  menuVisible: boolean;
  handleMenuOptionClick: (option: string) => void;
}

const InputWithMenu: React.FC<InputWithMenuProps> = ({
  showInputItemId,
  itemId,
  postText,
  setPostText,
  handleKeyDown,
  handleIconClick,
  renderSelectedIcon,
  menuVisible,
  handleMenuOptionClick
}) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    showInputItemId === itemId && (
      <div className="relative w-full">
        <input
          type="text"
          className="w-full border rounded-lg pl-12 p-2 mt-2"
          placeholder="Type your message here..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, itemId)}
          ref={(el) => {
            if (el) {
              inputRefs.current[itemId] = el;
            }
          }}
        />
        <div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={handleIconClick}
        >
          {renderSelectedIcon()}
        </div>
        {menuVisible && (
          <div className="absolute bottom-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              onClick={() => handleMenuOptionClick('chat')}
            >
              <ChatBubbleIcon style={{ width: '15px', height: '15px' }} />
              <span className="ml-2">Chat</span>
            </button>
            <button
              className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              onClick={() => handleMenuOptionClick('prompt')}
            >
              <MagicWandIcon style={{ width: '15px', height: '15px' }} />
              <span className="ml-2">Prompt</span>
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default InputWithMenu;
