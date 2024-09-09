import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Mail } from "../data";
import { useMail } from "../use-mail";
import { MessageSquare } from "lucide-react";
import { addReply, listenForReplies, auth, likeReply, dislikeReply, likePost, dislikePost } from "@/app/firebase";
import { ChatBubbleIcon, MagicWandIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { ThumbsUp, ThumbsDown, ArrowDownToLine, Dot } from "lucide-react";
import { UserAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import Texts from "./text";
import { CopyIcon } from '@radix-ui/react-icons';
import MaskedText from "@/components/MaskedText";
import { Crown } from 'lucide-react';
import styled from 'styled-components';
import ReplyList from "./prompt-reply-list";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react"; // Import Sparkles icon

const IconWrapper = styled.div`
  color: ""; /* Default color */
  transition: color 0.3s;

  &:hover {
    color: #2463eb /* Color on hover */
  }
`;


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
  const { user } = UserAuth();
  const fallbackImageUrl = `/avatars/01.png`; // Replace with your fallback image URL
  const [replyVisible, setReplyVisible] = useState<boolean>(true);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [isSparklesEnabled, setIsSparklesEnabled] = useState(false); // State for Sparkles button

  const toggleTextArea = (itemId: string) => {
    setOpenTextAreaId(openTextAreaId === itemId ? null : itemId);
  };

  const toggleInput = (itemId: string) => {
    setShowInputItemId(showInputItemId === itemId ? null : itemId);
    //setReplyVisible(!replyVisible);

  };

  const handleMagicPrompt = async (message: string, itemId: any) => {
    setPostText("");
    if (!user) {
      toast.error('Please Login to continue');
      return;
    }
    const reply = {
      name: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      text: message,
      date: new Date().getTime(),
      image: `./loading.gif`,
      photo: auth.currentUser?.photoURL,
    };
    setPostText("");
    setReplies((prevReplies) => ({
      ...prevReplies,
      [itemId]: [...(prevReplies[itemId] || []), reply],
    }));
    const count = await addReply(itemId, category, reply, 'prompt');
    if (count !== undefined) {
      toast.info(count);
    }
  }

  const Download = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const blob = await response.blob();
      const a = document.createElement('a');
      const urlObject = URL.createObjectURL(blob);
      a.href = urlObject;
      a.download = url.split('/').pop() || 'downloaded-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlObject);
    } catch (error) {
      console.error('There was an error with the download:', error);
    }
  };

  const handlePostSubmit = async (itemId: any) => {
    setPostText("");
    if (!user) {
      toast.error('Please Login to continue');
      return;
    }
    if (postText.trim() !== "") {
      const reply = {
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        text: postText,
        date: new Date().getTime(),
        option: isSparklesEnabled ? 'prompt' : 'chat',
        photo: auth.currentUser?.photoURL
      };
      setPostText("");
      setReplies((prevReplies) => ({
        ...prevReplies,
        [itemId]: [...(prevReplies[itemId] || []), reply],
      }));
      if (reply.option === 'prompt') {
        toast.info("🎉 Congratulations! You've earned 2 point for your post.");
      }
      await addReply(itemId, category, reply, 'chat');
    }
  };

  const handleLike = async (postId: string, replyId: string) => {
    await likeReply(postId, category, replyId);
  };

  const handlePostLike = async (postId: string) => {
    await likePost(postId, category);
  }

  const handlePostDislike = async (postId: string) => {
    await dislikePost(postId, category);
  }

  const handleDislike = async (postId: string, replyId: string) => {
    await dislikeReply(postId, category, replyId);
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

  const handleCopy = () => {
    console.log('Copy button clicked');
  };

  useEffect(() => {
    if (items.length === 0) {
      setReplies({});
      return () => { };
    }

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

  useEffect(() => {
    // Focus the input field when `showInputItemId` changes
    if (showInputItemId && inputRefs.current[showInputItemId]) {
      inputRefs.current[showInputItemId]?.focus();
    }
  }, [showInputItemId]);

  // const renderSelectedIcon = () => {
  //   switch (selectedOption) {
  //     case 'chat':
  //       return <IconWrapper><ChatBubbleIcon className="text-primary pt-2" style={{ width: '25px', height: '25px' }} /></IconWrapper>;
  //     case 'prompt':
  //       return <IconWrapper><MagicWandIcon className=" pt-2" style={{ width: '25px', height: '25px' }} /></IconWrapper>;
  //     default:
  //       return <IconWrapper><PlusCircledIcon className="pt-2" style={{ width: '30px', height: '30px' }} /></IconWrapper>;
  //   }
  // };

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };


  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-2 p-4 pt-0 lg:w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}

          >

            <div className="flex flex-col w-full gap-1">

              <div className="flex justify-between">

                <div className="flex items-center w-full">
                  <div className="flex items-start p-2 pl-0 py-0">
                    <div className="flex items-start gap-3 text-sm">
                      <Avatar>
                        <AvatarImage src={item.photo || fallbackImageUrl} alt={item.name} />
                        <AvatarFallback>
                          {item.name
                            .split(" ")
                            .map((chunk) => chunk[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid">
                        <div className="font-semibold ">{capitalizeWords(item.name)} <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.date), { addSuffix: false })}</span></div>
                        <div className="flex items-start">
                          <div className="flex-grow line-clamp-2 text-sm mb-2">{item.text}</div>
                          {item.option !== 'chat' && (
                            <img
                              src="/logo.png"
                              alt="Logo"
                              onClick={() => handleMagicPrompt(item.text, item.id)}
                              className="w-8 h-8 cursor-pointer prompt-execute ml-2 flex-shrink-0"
                              data-tour="prompt-execute"
                            />
                          )}
                        </div>
                        <div className="line-clamp-1 text-xs">
                          {item.image && category !== 'Text' && item.option !== 'text' && category !== 'Resumes' && item.option !== 'resumes' && (
                            <>
                              <img src={item.image} alt="Image" width={525} className="mt-4 mb-2 rounded-lg" />
                              <div className="flex gap-20 mt-2 ">
                                <Badge variant="stone">
                                  <button onClick={() => handlePostLike(item.id)}>
                                    <IconWrapper><ThumbsUp strokeWidth={1.5} className="h-4 w-4 cursor-pointer mr-2" /></IconWrapper>
                                  </button>
                                  <span>{item.likes?.length || 0}</span>
                                </Badge>
                                <Badge variant="stone">
                                  <button onClick={() => handlePostDislike(item.id)}>
                                    <IconWrapper><ThumbsDown strokeWidth={1.5} className="h-4 w-4 cursor-pointer mr-2" /></IconWrapper>
                                  </button>
                                  <span>{item.dislikes?.length || 0}</span>
                                </Badge>
                                {/* {item.name !== auth.currentUser?.displayName && (
        <Badge variant="stone">
          <MagicWandIcon className="h-4 w-4 cursor-pointer " onClick={() => handleMagicPrompt(item.text, item.id)} />
        </Badge>
      )} */}
                                {item.image && (
                                  <Badge variant="stone">
                                    <IconWrapper><ArrowDownToLine strokeWidth={1.5} className="h-4 w-4 cursor-pointer " onClick={() => Download(item.image)} /></IconWrapper>
                                  </Badge>
                                )}
                              </div>
                            </>
                          )}

                          {(category === 'Text' || item.option === 'text' || category === 'Resumes' || item.option === 'resumes') && (
                            item.image === './loading.gif' ? (
                              <img src={item.image} alt="Image" width={525} height={550} className="mt-4 mb-2 rounded-lg" />
                            ) : (
                              item.image !== '' && (
                                <div className="gap-2 mb-2">
                                  <Texts generatedText={item.image} post={item} category={category} />
                                </div>
                              )
                            )
                          )}

                          <ReplyList
                            replies={replies}
                            item={item}
                            replyVisible={replyVisible}
                            handleMagicPrompt={handleMagicPrompt}
                            handleLike={handleLike}
                            handleDislike={handleDislike}
                            Download={Download}
                          />
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
                <IconWrapper><MessageSquare className="toggle-reply-input" data-tour="toggle-reply-input" strokeWidth="1.5" size="32" onClick={() => toggleInput(item.id)} /></IconWrapper>
              </div>


              {showInputItemId === item.id && (
                <div className="relative w-full flex items-center mt-2">
                  <div className="relative w-full">
                    <img
                      src="/logo.png" // Path to the image in the public folder
                      alt="Logo"
                      onClick={() => setIsSparklesEnabled((prevState) => !prevState)} // Toggle button state on click
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer" // Position image inside input
                      style={{
                        opacity: isSparklesEnabled ? 1 : 0.5,
                      }}
                    />
                    <input
                      type="text"
                      className="w-full border rounded-lg pl-12 p-2 pr-10" // Adjust padding to make space for the image
                      placeholder="Type your message here..."
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      ref={(el) => {
                        if (el) {
                          inputRefs.current[item.id] = el;
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="w-[200px] h-[200px]"></div>

      </div>
    </div>
  );
}