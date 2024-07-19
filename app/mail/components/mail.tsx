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
import { useEffect, useState } from "react";
import { addPost, auth, getPosts } from "@/app/firebase";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [activeCategory, setActiveCategory] = React.useState("General");
  const [mail] = useMail();
  const [inputValue, setInputValue] = useState("");
  const [mails, setMails] = useState<Mail[]>([]);

  useEffect(() => {
    const unsubscribe = getPosts(activeCategory, (posts:any) => {
      setMails(posts);
    });

    // Cleanup the listener on component unmount or when activeCategory changes
    return () => unsubscribe();
  }, [activeCategory]); // <-- Trigger useEffect whenever activeCategory changes
// <-- Trigger fetchPosts whenever activeCategory changes

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSendMessage = async (message: string) => {
    alert(auth.currentUser?.photoURL);
    console.log(auth.currentUser?.photoURL);
    if (message.trim() !== "") {
      const newPost = {
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        text: "I would like to, " + message,
        date: new Date().getTime(),
        read: true,
        photo: auth.currentUser?.photoURL,
      };
      try {
        await addPost(newPost, activeCategory);
        setInputValue("");
        // After adding the post, you may optionally refetch the posts for the active category
      } catch (error) {
        console.error("Error adding post:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
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
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
          )}
        >
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "General",
                label: "",
                icon: House,
                variant: "default",
              },
              {
                title: "Private",
                label: "",
                icon: GlobeLock,
                variant: "ghost",
              },
              {
                title: "Expert",
                label: "",
                icon: BookOpenText,
                variant: "ghost",
              },
              {
                title: "Memes",
                label: "",
                icon: Palette,
                variant: "ghost",
              },
              {
                title: "Logos",
                label: "",
                icon: Biohazard,
                variant: "ghost",
              },
              {
                title: "Images",
                label: "",
                icon: Images,
                variant: "ghost",
              },
              {
                title: "Resumes",
                label: "",
                icon: ClipboardList,
                variant: "ghost",
              },
              {
                title: "Texts",
                label: "",
                icon: List,
                variant: "ghost",
              },
            ]}
            onLinkClick={handleCategoryChange}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Input
                    placeholder="I would like to Prompt..."
                    className="pl-8"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} category={activeCategory} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} category={activeCategory} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          {activeCategory === "Expert" && (
            <MailDisplay
              mail={mails.find((item) => item.id === mail.selected) || null}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
