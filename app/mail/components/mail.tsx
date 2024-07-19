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
  CirclePlus,
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
import { useEffect, useState } from "react";
import { addPost, auth, getPosts } from "@/app/firebase";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
    const unsubscribe = getPosts(activeCategory, (posts: any) => {
      setMails(posts);
    });

    return () => unsubscribe();
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSendMessage = async (message: string) => {
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
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "General", label: "", icon: House, variant: "default" },
              { title: "Private", label: "", icon: GlobeLock, variant: "ghost" },
              { title: "Expert", label: "", icon: BookOpenText, variant: "ghost" },
              { title: "Memes", label: "", icon: Palette, variant: "ghost" },
              { title: "Logos", label: "", icon: Biohazard, variant: "ghost" },
              { title: "Images", label: "", icon: Images, variant: "ghost" },
              { title: "Resumes", label: "", icon: ClipboardList, variant: "ghost" },
              { title: "Texts", label: "", icon: List, variant: "ghost" },
            ]}
            onLinkClick={handleCategoryChange}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
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
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div className="absolute top-4 left-2"> {/* Adjust positioning */}
        <PlusCircledIcon className="h-6 w-6 text-muted-foreground cursor-pointer" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="absolute top-4 right-2">
      {/* Adjust positioning of the dropdown menu */}
      <DropdownMenuItem>
        <House className="mr-2 h-4 w-4" />
        Chat
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BookOpenText className="mr-2 h-4 w-4" />
        Prompt
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Palette className="mr-2 h-4 w-4" />
        Memes
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Biohazard className="mr-2 h-4 w-4" />
        Logos
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Images className="mr-2 h-4 w-4" />
        Images
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ClipboardList className="mr-2 h-4 w-4" />
        Resumes
      </DropdownMenuItem>
      <DropdownMenuItem>
        <List className="mr-2 h-4 w-4" />
        Texts
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
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
