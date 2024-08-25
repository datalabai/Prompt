"use client";
import * as React from "react";
import {
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "./prompt-display";
import { MailList } from "./prompt-list";
import { type Mail } from "../data";
import { useMail } from "../use-mail";
import Link from "next/link";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [200, 1, 1],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full max-h-[800px]">
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
            {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
            <Link href="/home" className="">
          <ArrowLeft />
        </Link>   
          </div>
          <Separator />
          {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "Notifications", label: "128", icon: Bell, variant: "default" },
             
            ]}
          /> */}
          
        </div>

        {/* Main Content Panel */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 flex">
            <div className="flex-1 border-r">
              <Tabs defaultValue="all" className="h-full flex flex-col">
                <div className="flex items-center px-4 py-3">
                  <h1 className="text-xl font-bold">Notifications</h1>
                 
                </div>
                <Separator />
                <div className="bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  {/* <form>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-8" />
                    </div>
                  </form> */}
                </div>
                <TabsContent value="all" className="m-0 flex-1 overflow-auto">
                  <MailList items={mails} />
                </TabsContent>
                <TabsContent value="unread" className="m-0 flex-1 overflow-auto">
                  <MailList items={mails.filter((item) => !item.read)} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex-1">
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
