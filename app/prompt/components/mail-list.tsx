import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Mail } from "../data";
import { useMail } from "../use-mail";
import { MessageSquare } from "lucide-react";
import { addReply, listenForReplies, auth, likeReply, dislikeReply, likePost, dislikePost } from "@/app/firebase";
import { ChatBubbleIcon, MagicWandIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { ThumbsUp, ThumbsDown, ArrowDownToLine,Dot } from "lucide-react";
import { UserAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import Texts from "./text";
import { CopyIcon } from '@radix-ui/react-icons';
import MaskedText from "@/components/MaskedText";
import { Crown } from 'lucide-react';

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

  const toggleTextArea = (itemId: string) => {
    setOpenTextAreaId(openTextAreaId === itemId ? null : itemId);
  };

  const toggleInput = (itemId: string) => {
    setShowInputItemId(showInputItemId === itemId ? null : itemId);
    //setReplyVisible(!replyVisible);
  };

  const handleMagicPrompt = async (message: string, itemId: any) => {
    setPostText("");
    if(!user)
    {
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
    const count= await addReply(itemId, category, reply, 'prompt');
    if(count!==undefined){
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
    if(!user)
    {
      toast.error('Please Login to continue');
      return;
    }
    if (postText.trim() !== "") {
      const reply = {
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        text: postText,
        date: new Date().getTime(),
        option: selectedOption === 'prompt' ? 'prompt' : 'chat',
        photo: auth.currentUser?.photoURL
      };
      setPostText("");
      setReplies((prevReplies) => ({
        ...prevReplies,
        [itemId]: [...(prevReplies[itemId] || []), reply],
      }));
      await addReply(itemId, category, reply,'chat');
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
      return () => {};
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

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-2 p-4 pt-0 lg:w-full">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            // onClick={() =>
            //   setMail({
            //     ...mail,
            //     selected: item.id,
            //   })

            // }
            //onClick={() => toggleInput(item.id)}
          >
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={item.photo || fallbackImageUrl} alt="Avatar" />
              <AvatarFallback>KS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full gap-1">
            <div className="flex justify-between">
              <div className="flex items-center w-full">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{capitalizeWords(item.name)} </div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <Dot/>
                <div className={cn("text-xs", mail.selected === item.id ? "text-foreground" : "text-muted-foreground")}>
                   {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                </div>
                
              </div>
              <div className="flex items-center gap-1">
                  <MessageSquare strokeWidth="1.5" size="32" onClick={() => toggleInput(item.id)} />
                  {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {replies[item.id] ? replies[item.id].length : 0}
                  </Badge> */}
                </div>
            </div>  
              <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground -m-2 ml-1">
                {item.text.substring(0, 300)}
                
              </div>
              {item.image && category !== 'Text' && item.option !== 'text' && category !== 'Resumes' && item.option !== 'resumes' && (
                <>
                  <img src={item.image} alt="Image" width={300} height={550} className="mt-4 mb-2 rounded-lg" />
                  <div className="flex gap-20 mt-2 ">
                    <Badge variant="stone">
                      <button onClick={() => handlePostLike(item.id)}>
                        <ThumbsUp strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-blue-500 mr-2" />
                      </button>
                      <span>{item.likes?.length || 0}</span>
                    </Badge>
                    <Badge variant="stone">
                      <button onClick={() => handlePostDislike(item.id)}>
                        <ThumbsDown strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-red-500 mr-2" />
                      </button>
                      <span>{item.dislikes?.length || 0}</span>
                    </Badge>
                    {/* {item.name !== auth.currentUser?.displayName && (
        <Badge variant="stone">
          <MagicWandIcon className="h-4 w-4 cursor-pointer hover:text-purple-500" onClick={() => handleMagicPrompt(item.text, item.id)} />
        </Badge>
      )} */}
                    {item.image && (
                      <Badge variant="stone">
                        <ArrowDownToLine strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-purple-500" onClick={() => Download(item.image)} />
                      </Badge>
                    )}
                  </div>
                </>
              )}

              {(category === 'Text' || item.option === 'text' || category === 'Resumes' || item.option === 'resumes') && (
                item.image === './loading.gif' ? (
                  <img src={item.image} alt="Image" width={300} height={550} className="mt-4 mb-2 rounded-lg" />
                ) : (
                  item.image !== '' && (
                    <div className="gap-2 mb-2">
                      <Texts generatedText={item.image} post={item} category={category} />
                    </div>
                  )
                )
              )}

              {replyVisible && (
                <>
                  <div className="gap-2 mb-2">
                    {replies[item.id] && replies[item.id].length > 0 && (
                      <>
                        {replies[item.id].map((reply, index) => (
                          <div key={index} className="flex mt-2">
                           {reply.image  ? (
                            <div className="flex-col -space-y-3">
                            {/* <Crown  strokeWidth={1.25} className="h-6 w-6 pb-2 pl-2 icon-red" color="orange" /> */}
                            {/* <Avatar className="h-8 w-8">
                              <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocKFM9tQaWu56LVff7pMGiAp9WmIpAbfO34DdO2zKf1R_wH5SPfM7Q=s96-c" alt="Avatar" />
                              <AvatarFallback>N R</AvatarFallback>
                            </Avatar> */}
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.photo} alt="Avatar" />
                              <AvatarFallback>N R</AvatarFallback>
                            </Avatar>
                            </div>
                             ):(
                              <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.photo} alt="Avatar" />
                              <AvatarFallback>N R</AvatarFallback>
                            </Avatar>
                             )}
                            <div className="flex flex-col ml-2">
                            {/* {reply.image  ? (
                              <div className="flex"><div className="font-text-sm text-muted-foreground"><span className="font-semibold">Obulapathi N Challa</span> authored the prompt and <span className="font-semibold">{capitalizeWords(reply.name)}</span> generated the content below</div></div>
                            ):(
                              <div className="font-semibold">{capitalizeWords(reply.name)}</div>
                            )} */}
                            <div className="font-semibold">{capitalizeWords(reply.name)}</div>
                              <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground">
                                
                                {reply.option === 'prompt' ? (
                                  // <MaskedText key={index} text={reply.text} />
                                  <div>{reply.text}</div>
                                ) : (
                                  <span>{reply.text}</span>
                                )}
                                {reply.option === 'prompt' && (
                                  <Badge variant="stone">
                                    <MagicWandIcon className="h-8 w-8 cursor-pointer hover:text-purple-500" onClick={() => handleMagicPrompt(reply.text, item.id)} />
                                  </Badge>
                                )}
                              </div>
                              {reply.image && (
                                <>
                                  <img src={reply.image} alt="Image" width={300} height={550} className="mt-2 mb-2 rounded lg" />
                                  <div className="flex gap-9 mt-2">
                                    <Badge variant="stone">
                                      <button onClick={() => handleLike(item.id, reply.id)}>
                                        <ThumbsUp strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-blue-500 mr-2" />
                                      </button>
                                      <span>{reply.likes?.length || 0}</span>
                                    </Badge>
                                    <Badge variant="stone">
                                      <button onClick={() => handleDislike(item.id, reply.id)}>
                                        <ThumbsDown strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-red-500 mr-2" />
                                      </button>
                                      <span>{reply.dislikes?.length || 0}</span>
                                    </Badge>
                                    <Badge variant="stone">
                                      <ArrowDownToLine strokeWidth={1.5} className="h-4 w-4 cursor-pointer hover:text-purple-500" onClick={() => Download(reply.image)} />
                                    </Badge>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </>
              )}
              {showInputItemId === item.id && (
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
                    <div className="absolute bottom-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleMenuOptionClick('chat')}
                      >
                        <ChatBubbleIcon style={{ width: '15px', height: '15px' }} /> <span className="ml-2">Chat</span>
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleMenuOptionClick('prompt')}
                      >
                        <MagicWandIcon style={{ width: '15px', height: '15px' }} /> <span className="ml-2">Prompt</span>
                      </button>
                    </div>
                  )}
                </div>

              )}
            </div>
          </button>
        ))}
                      <div className="w-[200px] h-[200px]"></div>

      </div>
    </div>
  );
}
