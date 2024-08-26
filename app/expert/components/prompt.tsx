"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "./prompt-display";
import { MailList } from "./prompt-list";
import { useMail } from "../use-mail";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { Mail as MailType } from '../data';
import { getPosts } from "@/app/firebase";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: MailType[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

const CACHE_KEY_PREFIX = "expert-posts-cache-";

export function Mail({
  accounts,
  mails: MailType,
  defaultLayout = [200, 1, 1],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();
  const [isLoading, setIsLoading] = useState(false);
  const [mails, setMails] = useState<MailType[]>([]);
  const [category, setCategory] = useState("General");  

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
  
    const unsubscribe = getPosts("Expert", (posts: any) => {
      setMails(posts);
      localStorage.setItem(`${CACHE_KEY_PREFIX}${category}`, JSON.stringify(posts));
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    fetchPosts(category);
  }, [category, fetchPosts]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen overflow-hidden">
        {/* Left Panel */}
        <div
          className={cn(
            "flex-shrink-0 border-r",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
          style={{ width: 200 }}
        >
          <div
            className={cn(
              "flex h-[52px] items-center ",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <Link href="/home" className="">
              <ArrowLeft />
            </Link>   
          </div>
          <Separator />
        </div>

        {/* Main Content Panel */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 border-r overflow-hidden">
              <Tabs defaultValue="all" className="h-full flex flex-col">
                <div className="flex items-center px-4 py-3">
                  <h1 className="text-xl font-bold">Notifications</h1>
                </div>
                <Separator />
                <TabsContent value="all" className="m-0 flex-1 overflow-auto">
                  <MailList items={mails} />
                </TabsContent>
                <TabsContent value="unread" className="m-0 flex-1 overflow-auto">
                  <MailList items={mails.filter((item) => !item.read)} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex-1 overflow-hidden">
              <MailDisplay
                mail={mails.find((item) => item.id === mail.selected) || null}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
