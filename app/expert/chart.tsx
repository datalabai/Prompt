import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { RecentPrompts } from "./recent-prompts";

export default function ExpertChat() {
  return (
    <div className="grid min-h-screen w-full grid-cols-[1fr_minmax(0,_250px)_1fr]">
      {/* Recent Prompts */}
      <div className="flex flex-col border-r">
        <RecentPrompts />
      </div>
      {/* Chats Sidebar */}
      <div className="flex flex-col bg-background border-r">
        <div className="flex items-center h-16 px-4 border-b">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* List of Chats */}
          {/* Example Chat Item */}
          <Link
            href="#"
            className="flex items-center gap-2 py-2 rounded-md hover:bg-muted transition-colors"
            prefetch={false}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">John Doe</h4>
              <p className="text-sm text-muted-foreground truncate">Hey, hows it going?</p>
            </div>
            <div className="text-xs text-muted-foreground">2:34 PM</div>
          </Link>
          {/* Add more chat items here */}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col h-screen">
        <div className="flex items-center h-16 px-4 border-b bg-muted">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1 min-w-0">
            <h4 className="font-medium truncate">John Doe</h4>
            <p className="text-sm text-muted-foreground truncate">Online</p>
          </div>
          {/* <Button variant="ghost" size="icon">
            <PhoneIcon className="w-5 h-5" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <VideoIcon className="w-5 h-5" />
            <span className="sr-only">Video Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoveHorizontalIcon className="w-5 h-5" />
            <span className="sr-only">More</span>
          </Button> */}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="grid gap-4">
            {/* Chat messages */}
            {/* Example message */}
            <div className="flex items-start gap-3">
  <Avatar className="w-10 h-10">
    <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <div className="flex flex-col gap-2">
    <div className="bg-muted rounded-lg p-3 max-w-[75%]">
      <p>Hey, how&apos;s it going?</p>
    </div>
    <div className="text-xs text-muted-foreground">2:34 PM</div>
  </div>
</div>

            {/* Add more messages here */}
          </div>

          <div className="flex items-center h-16 px-4 border-t bg-muted">
            <div className="relative flex-1">
              <Textarea placeholder="Type your message..." className="min-h-[44px] resize-none pr-16" />
              <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                <SendIcon className="w-5 h-5" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="ml-2">
              <PaperclipIcon className="w-5 h-5" />
              <span className="sr-only">Attach File</span>
            </Button>
            <Button variant="ghost" size="icon" className="ml-2">
              <SmileIcon className="w-5 h-5" />
              <span className="sr-only">Add Emoji</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const MoveHorizontalIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 8 22 12 18 16" />
    <polyline points="6 8 2 12 6 16" />
    <line x1="2" x2="22" y1="12" y2="12" />
  </svg>
);

const PaperclipIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const PhoneIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PlusIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const SendIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const SmileIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" x2="9.01" y1="9" y2="9" />
    <line x1="15" x2="15.01" y1="9" y2="9" />
  </svg>
);

const VideoIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
    <rect x="2" y="6" width="14" height="12" rx="2" />
  </svg>
);
