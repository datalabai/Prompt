import * as React from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth, listenForReplies, addReply } from "@/app/firebase";
import { useState, useEffect } from 'react';

interface CardsChatProps {
  initialMessage: string;
  currentUser: { name: string; avatar: string; email: string; id: string };
}

export function CardsChat({ initialMessage, currentUser }: CardsChatProps) {
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: initialMessage,
    },
  ]);
  const [input, setInput] = useState("");
  const inputLength = input.trim().length;

  useEffect(() => {
    // Clear previous messages when user ID changes
    setMessages([
      {
        role: "agent",
        content: initialMessage,
      },
    ]);

    const unsubscribe = listenForReplies(currentUser.id, 'General', (newReplies: any[]) => {
      console.log('Received replies:', newReplies); // Debugging line
      setMessages((prevMessages) => {
        // Filter out duplicates based on content if necessary
        const newMessages = newReplies.map((reply) => ({
          role: reply.name === auth.currentUser?.displayName ? "user" : "agent",
          content: reply.text,
        }));
        return [...prevMessages, ...newMessages];
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser.id, initialMessage]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inputLength === 0) return;

    console.log('Sending message:', input); // Debugging line

    // Add the new user message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: input,
      },
    ]);

    setInput("");

    const reply = {
      name: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      text: input,
      date: new Date().getTime(),
      option: 'prompt',
      photo: auth.currentUser?.photoURL,
    };

    await addReply(currentUser.id, 'General', reply, 'chat');
  };

  return (
    <Card className="flex flex-col h-full border-0">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 h-full max-h-full" style={{ maxHeight: 'calc(85vh - 6rem)' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {message.content}
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-4 border-t border-muted bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
