import { ComponentProps, useEffect, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail } from "../data";
import { useMail } from "../use-mail";
import { MessageSquare } from "lucide-react";
import React from "react";
import { addReply, listenForReplies, auth } from "@/app/firebase";

interface MailListProps {
  items: Mail[];
  category: string;
}

export function MailList({ items, category }: MailListProps) {
  const [mail, setMail] = useMail();
  const [openTextAreaId, setOpenTextAreaId] = useState<string | null>(null);
  const [showInputItemId, setShowInputItemId] = useState<string | null>(null);
  const [postText, setPostText] = useState<string>("");
  const [replies, setReplies] = useState<{ [key: string]: any[] }>({});

  const toggleTextArea = (itemId: string) => {
    setOpenTextAreaId(openTextAreaId === itemId ? null : itemId);
  };

  const toggleInput = (itemId: string) => {
    setShowInputItemId(showInputItemId === itemId ? null : itemId);
  };

  const handlePostSubmit = async (itemId: any) => {
    if (postText.trim() !== "") {
      const reply = {
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        text: postText,
        date: new Date().getTime(),
      };
      await addReply(itemId, category, reply);
      setPostText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, itemId: string) => {
    if (e.key === "Enter" && postText.trim() !== "") {
      handlePostSubmit(itemId);
    }
  };

  useEffect(() => {
    const unsubscribes = items.map((item) => {
      return listenForReplies(item.id, category, (newReplies: any) => {
        setReplies((prevReplies) => ({
          ...prevReplies,
          [item.id]: newReplies,
        }));
      });
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [items, category]);

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`/avatars/01.png`} alt="Avatar" />
              <AvatarFallback>{}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full gap-1">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className={cn("text-xs", mail.selected === item.id ? "text-foreground" : "text-muted-foreground")}>
                  {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                </div>
              </div>
              <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground">
                {item.text.substring(0, 300)}
                <div className="flex items-center gap-1">
                  <MessageSquare size="20" onClick={() => toggleInput(item.id)} color="blue" />
                  {replies[item.id] ? replies[item.id].length : 0} replies
                </div>
              </div>
              {showInputItemId === item.id && (
                <>
                  <div className="gap-2 mb-2">
                    {replies[item.id] && replies[item.id].length > 0 && (
                      <>
                        {replies[item.id].map((reply, index) => (
                          <div key={index} className="flex mt-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/avatars/01.png`} alt="Avatar" />
                              <AvatarFallback></AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="font-semibold">{reply.name}</div>
                              <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground">
                                {reply.text}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mt-2"
                    placeholder="Type your message here..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                  />
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
