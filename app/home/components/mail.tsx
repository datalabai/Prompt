"use client";

import * as React from "react";
import {
  House,
  Images,
  List,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailList } from "./mail-list";
import { Nav } from "./nav";
import { useMail } from "../use-mail";
import { useEffect, useState, useCallback } from "react";
import { addMessageToPrivateChannel, addPost, auth,getPosts} from "@/app/firebase";
import { Mail as MailType } from '../data';
import { UserAuth } from "@/app/context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "@/components/ui/spinner";
import { RecentPosts } from "./recent-posts";
import { useCategory } from "@/app/context/CategoryContext";
import debounce from 'lodash/debounce';
import { FaLightbulb } from "react-icons/fa";
import { TypingAnimation } from '@/components/animatedPlaceholder'; 


interface MailProps {
  mails: MailType[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

type MailItem = {
  id: string;
  name: string;
  email: string;
  text: string;
  date: Date;
  photo: string;
  image: string;
  likes: never[];
  dislikes: never[];
  read: boolean;
};

const CACHE_KEY_PREFIX = "posts-cache-";

export function Mail({
  mails: MailType,
  defaultLayout = [200, 600, 200], // Modified layout sizes: left, middle, right
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { category, setCategory } = useCategory();
  const [mail] = useMail();
  const { user } = UserAuth();
  const [inputValue, setInputValue] = useState("");
  const [mails, setMails] = useState<MailType[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<React.ComponentType | null>(null);
  const [selectedIconName, setSelectedIconName] = useState<string>("");
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trails, setTrails] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleResize = debounce(() => {
    setIsMobile(window.matchMedia("(max-width: 700px)").matches);
  }, 300);


  useEffect(() => {
    // This effect runs only on the client side
    setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  const fetchPosts = useCallback(async (category: string) => {
    setIsLoading(true);
  
    const cachedPosts = localStorage.getItem(`${CACHE_KEY_PREFIX}${category}`);
    if (cachedPosts) {
      console.log("Using cached posts for category:", category);
      setMails(JSON.parse(cachedPosts));
      setIsLoading(false);
    } else {
      setMails([]); 
      setIsLoading(false);
    }
  
    const unsubscribe = getPosts(category, (posts: any) => {
      setMails(posts);
      localStorage.setItem(`${CACHE_KEY_PREFIX}${category}`, JSON.stringify(posts));
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    fetchPosts(category);
  }, [category, fetchPosts]);

  const enableProfile = () => {
    setShowProfile(true);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
    fetchPosts(category); // Ensure posts are fetched immediately on category change
  };


  const handleSendMessage = async (message: string) => {
    setInputValue("");
    if(!user)
      {
        toast.error('Please Login to continue');
        return;
      }
    if (message.trim() === "") return;
  
    const newPost = {
      id: `temp-${Date.now()}`,  // Temporary ID for the new post
      name: auth.currentUser?.displayName || "",
      email: auth.currentUser?.email || "",
      text: message,
      date: new Date().getTime(),
      read: true,
      photo: auth.currentUser?.photoURL || "",
      image: selectedIconName === "chat" || selectedIconName === "" ? "" : "./loading.gif",
      likes: [],
      dislikes: [],
      option: selectedIconName,
    };
    
    setInputValue("");
    // Update the local state immediately
    setMails((prevMails) => [newPost, ...prevMails]);
  
    // Clear cache for the active category to ensure it will be refetched
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${category}`);
  
    try {
      if (category === "Private") {
        await addMessageToPrivateChannel(newPost, selectedIconName);
      } else {
        const trailsCount = await addPost(newPost, category, selectedIconName);
        if (trailsCount !== undefined) {
          toast.info(trailsCount);
        }
      }
      // Re-fetch posts to update with the latest data
      fetchPosts(category);
    } catch (error) {
      console.error("Error adding post:", error);
      // Optionally, handle the error by removing the temporary post or showing an error message
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleIconSelect = (icon: React.ComponentType, name: string) => {
    setSelectedIcon(icon);
    setSelectedIconName(name);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        }}
        className="min-h-screen container relative pr-0"
      >
      {!isMobile &&
        <ResizablePanel
          defaultSize={defaultLayout[200]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={18}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
          }}
          className={cn(isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out ¯")}
        >
         
          <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "General", label: "", icon: House, variant: "default" },
              // { title: "Private", label: "", icon: GlobeLock, variant: "ghost" },
              { title: "Text", label: "", icon: List, variant: "ghost" },
              { title: "Images", label: "", icon: Images, variant: "ghost" },
              // { title: "Logos", label: "", icon: Biohazard, variant: "ghost" },
              { title: "Memes", label: "", icon: Palette, variant: "ghost" },
              // { title: "Resumes", label: "", icon: ClipboardList, variant: "ghost" },
            ]}
            onLinkClick={handleCategoryChange}
          />
        </ResizablePanel>
        }
        <ResizableHandle  />
        <ResizablePanel defaultSize={defaultLayout[1600]} minSize={30}>
              <Tabs defaultValue="all" className="border-r-2">
                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <form>
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="w-full border rounded-lg pl-12 p-2 mt-2"
                        
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown} 
                        onFocus={() => setIsTyping(true)} // Set typing to true when input is focused
                        onBlur={() => setIsTyping(false)}  // Set typing to false when input is blurred
    
                        />
                        {/* <AnimatedPlaceholder /> */}
                        {!isTyping && inputValue.length === 0 && (
                        <TypingAnimation text="Create image of a flying Unicorn..." speed={300} loop={true} isPaused={isTyping} />
                        )}
                      {/* <PromptModeToggle onIconSelect={handleIconSelect} category={category} /> */}
                      <div className="absolute top-2  my-1 bg-gray">
                      
                      {/* <Lightbulb size={40} className="text-gray-500"/> */}
                      <FaLightbulb color="#2463eb" size={32} className=" ml-2"/>
                      </div>
                      
                    </div>
                  </form>
                </div>
                <TabsContent value="all" className="m-0 h-screen ">
                  {isLoading ? (
                    <div className="flex items-center justify-center mt-72 gap-12">
                      <Spinner size="medium">Loading...</Spinner>
                    </div>
                  ) : (
                    <MailList items={mails} category={category} />
                  )}
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                  <MailList items={mails.filter((item) => !item.read)} category={category} />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            {!isMobile &&
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={25} maxSize={30}>
            <Tabs defaultValue="all" className="">
              <TabsContent value="all" className="m-0 h-screen">
                <RecentPosts />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
            }
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

