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
import { ChatBubbleIcon, MagicWandIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { ThumbsUp, ThumbsDown} from "lucide-react";



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
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const fallbackImageUrl =`/avatars/01.png`; // Replace with your fallback image URL
  const toggleTextArea = (itemId: string) => {
    setOpenTextAreaId(openTextAreaId === itemId ? null : itemId);
  };

  const toggleInput = (itemId: string) => {
    setShowInputItemId(showInputItemId === itemId ? null : itemId);
  };

  const handleMagicPrompt = async (message:string,itemId:any) => {
    alert(message);
      const reply = {
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        text: message,
        date: new Date().getTime(),
        image: `./load-32_128.gif`,
      };
      setPostText("");
      await addReply(itemId, category, reply, 'prompt');
  }

  const handlePostSubmit = async (itemId: any) => {
    if (postText.trim() !== "") {
      const reply = {
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        text: postText,
        date: new Date().getTime(),
        image: selectedOption === 'prompt' ? `./load-32_128.gif` : null,
        photo:auth.currentUser?.photoURL
      };
      setPostText("");
      await addReply(itemId, category, reply, selectedOption);
    }
  };

  const handleIconClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuOptionClick = (option: string) => {
    setSelectedOption(option);
    setMenuVisible(false);
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

  const renderSelectedIcon = () => {
    switch (selectedOption) {
      case 'chat':
        return <ChatBubbleIcon className="text-primary pt-2" style={{ width: '25px', height: '25px' }} />;
      case 'prompt':
        return <MagicWandIcon className="text-primary pt-2" style={{ width: '25px', height: '25px' }} />;
      default:
        return <PlusCircledIcon className="text-gray-400 pt-2" style={{ width: '30px', height: '30px' }} />;
    }
  };

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
              <AvatarImage src={item.photo || fallbackImageUrl} alt="Avatar" />
              <AvatarFallback>KS</AvatarFallback>
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
                  <MessageSquare strokeWidth="1.5" size="30" onClick={() => toggleInput(item.id)}  />
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {replies[item.id] ? replies[item.id].length : 0} 
                </Badge>
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
                              <AvatarImage src={reply.photo} alt="Avatar" />
                              <AvatarFallback></AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col ml-2">
                              <div className="font-semibold">{reply.name}</div>
                              <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground">
                                {reply.text}
                              </div>
                              {reply.image && (
                                <img src={reply.image} alt="Image" width={300} height={550} className="mt-2 mb-2 rounded lg"/>
                              )}
                              <div className="flex gap-9 mt-1">
                                <ThumbsUp strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-blue-500" />
                                <ThumbsDown strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-red-500" />
                                {item.name !== reply.name && reply.name !== auth.currentUser?.displayName && (
                                  <MagicWandIcon className="h-4 w-4 cursor-pointer hover:text-purple-500" onClick={()=>handleMagicPrompt(reply.text,item.id)}/>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="w-full border rounded-lg pl-12 p-2 mt-2"
                      placeholder="Type your message here..."
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                    />
                    <div
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={handleIconClick}
                    >
                      {renderSelectedIcon()}
                    </div>
                    {menuVisible && (
                      <div className="absolute  bottom-full  bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleMenuOptionClick('chat')}
                        >
                          <ChatBubbleIcon className="text-primary" style={{ width: '15px', height: '15px' }} /> <span className="ml-2">Chat</span>
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleMenuOptionClick('prompt')}
                        >
                          <MagicWandIcon className="text-primary" style={{ width: '15px', height: '15px' }} /> <span className="ml-2">Prompt</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}