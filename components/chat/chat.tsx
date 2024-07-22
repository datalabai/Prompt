import React, { useEffect, useState } from "react";
import { Message, UserData } from './data';
import { ChatList } from "./chat-list";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
}

export function Chat({ messages = [], selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = useState<Message[]>(messages);

  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      {/* <ChatTopbar selectedUser={selectedUser} /> */}
      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
