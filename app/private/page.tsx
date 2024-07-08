"use client"
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Heart } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"

// Define types for reply messages
type ReplyMessage = {
  user: string;
  message: string;
};

type ReplyMessagesState = {
  [postId: number]: ReplyMessage[];
};

const Home: React.FC = () => {
  const [replyMessages, setReplyMessages] = useState<ReplyMessagesState>({});

  const handleReply = (postId: number, message: string) => {
    const newMessages = {
      ...replyMessages,
      [postId]: [
        ...(replyMessages[postId] || []),
        { user: 'Current User', message }
      ]
    };
    setReplyMessages(newMessages);
  };

  const toggleTextArea = (postId: number) => {
    setReplyMessages(prevState => ({
      ...prevState,
      [postId]: prevState[postId] ? [] : [{ user: '', message: '' }]
    }));
  };

  return (
    <div className="flex ">
      <Card x-chunk="dashboard-01-chunk-5 border-0">
        <ScrollArea className="min-h-[555px] max-h-[555px] rounded-md p-4 overflow-y-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((postId) => (
            <CardContent key={postId} className="grid gap-8">
              <div className="flex gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={`/avatars/0${postId}.png`} alt="Avatar" />
                  <AvatarFallback>{postId}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    User {postId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                  this is about layout ,this is about layout ,this is about layout ,this is about layout ,this is about layout , {postId}
                  </p>
                  {replyMessages[postId] && replyMessages[postId].map((reply, index) => (
                    reply.message && reply.message.length > 0 && (
                      <div key={index} className="flex items-center gap-2">
                        <Avatar className="hidden h-7 w-7 sm:flex">
                          <AvatarImage src={`/avatars/0${postId + 1}.png`} alt="Avatar" />
                          <AvatarFallback>{postId + 1}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">{reply.user}: {reply.message}</p>
                      </div>
                    )
                  ))}
                  {replyMessages[postId] && replyMessages[postId].length > 0 && (
                    <div>
                      <textarea
                        className="w-full border rounded pl-2 h-8"
                        placeholder={`Reply to post ${postId}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim() !== '') {
                            handleReply(postId, e.target.value.trim());
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="ml-auto font-medium flex gap-1">
                  <MessageSquare onClick={() => toggleTextArea(postId)} />
                  <Heart />
                </div>
              </div>
            </CardContent>
          ))}
        </ScrollArea>
        <CardFooter>
          <input type="text" placeholder="Comment..." className="w-full border rounded p-2" />
        </CardFooter>
      </Card>
    </div>
  );
}

export default Home;
