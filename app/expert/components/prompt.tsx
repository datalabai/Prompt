"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { Mail as MailType } from '../data';
import { getPosts } from "@/app/firebase";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "./prompt-display";
import { MailList } from "./prompt-list";
import Link from "next/link";
import { useMail } from "../use-mail";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

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
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [mail] = useMail();
  const [isLoading, setIsLoading] = useState(false);
  const [mails, setMails] = useState<MailType[]>([]);
  const [category, setCategory] = useState("General");
  const searchParams = useSearchParams(); // Get search params

  // Ref to store the previous mail IDs
  const previousMailIds = useRef(new Set<string>());

  const fetchPosts = useCallback(async (category: string) => {
    setIsLoading(true);

    const unsubscribe = getPosts("Expert", async (posts: MailType[]) => {
      const cachedPosts = localStorage.getItem(`${CACHE_KEY_PREFIX}${category}`);
      let cachedPostsArray: MailType[] = [];
      if (cachedPosts) {
        cachedPostsArray = JSON.parse(cachedPosts);
      }

      const latestPostIds = new Set(posts.map(post => post.id));
      const cachedPostIds = new Set(cachedPostsArray.map(post => post.id));

      const postsToRemove = cachedPostsArray.filter(post => !latestPostIds.has(post.id));

      const updatedCachedPosts = cachedPostsArray.filter(post => latestPostIds.has(post.id));

      const newPosts = posts.filter(post => !cachedPostIds.has(post.id));

      newPosts.forEach(post => previousMailIds.current.add(post.id));

      const allPosts = [...newPosts, ...updatedCachedPosts];

      const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      localStorage.setItem(`${CACHE_KEY_PREFIX}${category}`, JSON.stringify(sortedPosts));
      setMails(sortedPosts);
      previousMailIds.current = new Set(sortedPosts.map(post => post.id));

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts(category);
  }, [category, fetchPosts]);

  const selectedItemId = searchParams.get('id');
  const selectedItem = mails.find((item) => item.id === selectedItemId) || null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen overflow-hidden -mt-2">
        {/* Left Panel */}
        <div
          className={cn(
            "flex-shrink-0 ",
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
        </div>

        {/* Main Content Panel */}
        <div className="flex flex-1 flex-col overflow-hidden border-r">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1  overflow-hidden mt-0">
              <Tabs defaultValue="all" className="h-full flex flex-col">
                <div className="flex items-center px-4 py-3 ">
                  <h1 className="text-xl font-bold">Notifications</h1>
                </div>
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
                mail={mails.find((item) => item.id === mail.selected) || selectedItem || null}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Remove Audio element for notification sound */}
    </TooltipProvider>
  );
}
