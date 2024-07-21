import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat } from "@/components/chat/chat";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { auth, sendMessage, listenForMessages, getOrCreateChatRoom, getUid } from "@/app/firebase";
import { Unsubscribe } from "firebase/firestore";

interface MailDisplayProps {
  mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState({
    id: "1",
    avatar: "",
    msgs: [],
    name: ""
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        const msg = {
          name: auth.currentUser?.displayName,
          message: message,
          avatar: auth.currentUser?.photoURL
        };
        sendMessage(mail?.email, msg);
        setMessage(''); // Clear the message input
      }
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!mail?.email) return;
    const uid = await getUid(mail.email);
    const chatId = await getOrCreateChatRoom(auth.currentUser?.uid, uid);
    const unsubscribe = listenForMessages(chatId, (messages: any) => {
      setSelectedUser(prevState => ({
        ...prevState,
        id: uid,
        avatar: mail?.photo,
        msgs: messages,
        name: mail?.name 
      }));
      console.log("Selected user: ", selectedUser); 
    });
    return unsubscribe;
  }, [mail]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    (async () => {
      unsubscribe = await fetchMessages();
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchMessages]);

  return (
    <ScrollArea className="h-screen">
      <div className="flex h-full flex-col">
        <Separator />
        {mail ? (
          <div className="flex flex-1 flex-col">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                <Avatar>
                  <AvatarImage src={mail.photo} alt={mail.name} />
                  <AvatarFallback>
                    {mail.name
                      .split(" ")
                      .map((chunk: any[]) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">{mail.name}</div>
                  <div className="line-clamp-1 text-xs">{mail.text}</div>
                </div>
              </div>
              {mail.date && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(mail.date), "PPpp")}
                </div>
              )}
            </div>
            <Separator />
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              <Chat
                messages={selectedUser.msgs}
                selectedUser={selectedUser}
                isMobile={isMobile}
              />
            </div>
            <Separator className="mt-auto" />
            <div className="p-4">
              <form>
                <div className="grid gap-4">
                  <Textarea
                    className="p-2 h-2"
                    placeholder={`Reply ${mail.name}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {/* <div className="flex items-center mt-2">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                </div> */}
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No message selected
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
