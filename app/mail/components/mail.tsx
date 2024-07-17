"use client"
import * as React from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"
import { LayoutDashboard, House, GlobeLock, BookOpenText, Images, Biohazard, List, Palette, ClipboardList } from 'lucide-react';

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcher } from "./account-switcher"
import { MailDisplay } from "./mail-display"
import { MailList } from "./mail-list"
import { Nav } from "./nav"
import { type Mail } from "../data"
import { useMail } from "../use-mail"

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [activeCategory, setActiveCategory] = React.useState("General");
  const [mail] = useMail()
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category); // Update active category based on link click
    // Perform data fetching or manipulation based on category change
    // For example, update 'mails' state or fetch new data from API
  };
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`
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
            isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
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
            
            {/* <Separator /> */}
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                  <Input placeholder="I would like to" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
        {activeCategory === "Expert" &&  <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
