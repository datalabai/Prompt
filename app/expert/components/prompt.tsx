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

  // Ref to store the previous mail IDs
  const previousMailIds = useRef(new Set<string>());

  const fetchPosts = useCallback(async (category: string) => {
    setIsLoading(true);

    // Fetch the latest posts from the database
    const unsubscribe = getPosts("Expert", async (posts: MailType[]) => {
      // Fetch the cached posts
      const cachedPosts = localStorage.getItem(`${CACHE_KEY_PREFIX}${category}`);
      let cachedPostsArray: MailType[] = [];
      if (cachedPosts) {
        cachedPostsArray = JSON.parse(cachedPosts);
      }

      // Create a set of IDs from the latest posts and cached posts
      const latestPostIds = new Set(posts.map(post => post.id));
      const cachedPostIds = new Set(cachedPostsArray.map(post => post.id));

      // Determine which cached posts are no longer in the latest posts
      const postsToRemove = cachedPostsArray.filter(post => !latestPostIds.has(post.id));

      // Remove outdated cached posts
      const updatedCachedPosts = cachedPostsArray.filter(post => latestPostIds.has(post.id));

      // Determine new posts that are not in the cache
      const newPosts = posts.filter(post => !cachedPostIds.has(post.id));

      // Update the ref with the new post IDs
      newPosts.forEach(post => previousMailIds.current.add(post.id));

      // Combine the new posts with the existing ones, removing outdated posts
      const allPosts = [...newPosts, ...updatedCachedPosts];

      // Sort posts by date in descending order
      const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Update local storage and state
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
                mail={mails.find((item) => item.id === mail.selected) || null}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Remove Audio element for notification sound */}
    </TooltipProvider>
  );
}
