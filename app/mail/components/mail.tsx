"use client";

import * as React from "react";
import {
  House,
  GlobeLock,
  BookOpenText,
  Images,
  Biohazard,
  List,
  Palette,
  ClipboardList,
} from "lucide-react";
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "./account-switcher";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
import { Nav } from "./nav";
import { useMail } from "../use-mail";
import { useEffect, useState, useCallback } from "react";
import { addMessageToPrivateChannel, addPost, auth, getPosts } from "@/app/firebase";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PromptModeToggle } from "@/components/prompt-dropmenu";
import Profile from "./profile";
import { Notifications } from "./notifications";
import { Mail as MailType } from '../data';
import { UserAuth } from "@/app/context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "@/components/ui/spinner";
import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { encodeURL, createQR } from '@solana/pay';
import BigNumber from 'bignumber.js';

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
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeCategory, setActiveCategory] = useState("General");
  const [mail] = useMail();
  const { user } = UserAuth();
  const [inputValue, setInputValue] = useState("");
  const [mails, setMails] = useState<MailType[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<React.ComponentType | null>(null);
  const [selectedIconName, setSelectedIconName] = useState<string>("");
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trails, setTrails] = useState<number | null>(null);
  
  const fetchPosts = useCallback(async (category: string) => {
    setIsLoading(true);
  
    const cachedPosts = localStorage.getItem(`${CACHE_KEY_PREFIX}${category}`);
    if (cachedPosts) {
      setMails(JSON.parse(cachedPosts));
    } else {
      setMails([]); // Optional: clear existing mails if no cache
    }
  
    // Fetch latest posts from server
    const unsubscribe = getPosts(category, (posts: any) => {
      setMails(posts);
      localStorage.setItem(`${CACHE_KEY_PREFIX}${category}`, JSON.stringify(posts));
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    fetchPosts(activeCategory);
  }, [activeCategory, fetchPosts]);

  const enableProfile = () => {
    setShowProfile(true);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
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
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${activeCategory}`);
  
    try {
      if (activeCategory === "Private") {
        await addMessageToPrivateChannel(newPost, selectedIconName);
      } else {
        const trailsCount = await addPost(newPost, activeCategory, selectedIconName);
        if (trailsCount !== undefined) {
          toast.info(trailsCount);
        }
      }
      // Re-fetch posts to update with the latest data
      fetchPosts(activeCategory);
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
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
          }}
          className={cn(isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out")}
        >
         
          <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "General", label: "", icon: House, variant: "default" },
              { title: "Private", label: "", icon: GlobeLock, variant: "ghost" },
              { title: "Text", label: "", icon: List, variant: "ghost" },
              { title: "Images", label: "", icon: Images, variant: "ghost" },
              { title: "Logos", label: "", icon: Biohazard, variant: "ghost" },
              { title: "Memes", label: "", icon: Palette, variant: "ghost" },
              { title: "Resumes", label: "", icon: ClipboardList, variant: "ghost" },
            ]}
            onLinkClick={handleCategoryChange}
          />
        </ResizablePanel>
        <ResizableHandle  />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative w-full">
                  <input
                    type="text"
                    className="w-full border rounded-lg pl-12 p-2 mt-2"
                    placeholder="I would like to..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <PromptModeToggle onIconSelect={handleIconSelect} category={activeCategory} />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0 h-[600px]">
              {isLoading ? (
                <div className="flex items-center justify-center mt-72 gap-12">
                  <Spinner size="medium">Loading...</Spinner>
                </div>
              ) : (
                <MailList items={mails} category={activeCategory} />
              )}
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} category={activeCategory} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        {/* <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          {activeCategory === "Expert" && (
            <MailDisplay mail={mails.find((item) => item.id === mail.selected) || null} />
          )}
        </ResizablePanel> */}
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
