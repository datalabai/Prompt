import { ComponentProps } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail } from "../data";
import { useMail } from "../use-mail";
import { MessageSquare } from "lucide-react";
import React from "react";

interface MailListProps {
  items: Mail[];
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();
  const [openTextAreaId, setOpenTextAreaId] = React.useState<string | null>(null); // State to manage which textarea is open
  const [showInputItemId, setShowInputItemId] = React.useState<string | null>(null); // State to manage which input is shown
  const [postText, setPostText] = React.useState<string>(""); // State to manage the text entered in the input

  const toggleTextArea = (itemId: string) => {
    setOpenTextAreaId(openTextAreaId === itemId ? null : itemId); // Toggle open/close state of textarea
  };

  const toggleInput = (itemId: string) => {
    setShowInputItemId(showInputItemId === itemId ? null : itemId); // Toggle open/close state of input
  };

  const handlePostSubmit = () => {
    // Handle post submission logic, e.g., send to server, update state, etc.
    // For demonstration, let's update the state with the posted text and clear input
    // You can extend this logic based on your application's needs
    console.log("Posted:", postText);
    setPostText(""); // Clear the input field after posting
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && postText.trim() !== "") {
      handlePostSubmit();
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`/avatars/01.png`} alt="Avatar" />
              <AvatarFallback>{}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full gap-1">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className={cn("text-xs", mail.selected === item.id ? "text-foreground" : "text-muted-foreground")}>
                  {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                </div>
              </div>
              {/* <div className="text-xs font-medium">{item.subject}</div> */}
              <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground">{item.text.substring(0, 300)} <MessageSquare size="16"  onClick={() => toggleInput(item.id)}/> </div>
             {/* Render input field if showInputItemId matches current item id */}
             {showInputItemId === item.id && (
              <><div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/avatars/01.png`} alt="Avatar" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div className="font-semibold">{item.name}</div>
                  <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground">{item.text.substring(0, 300)}</div>
                </div><input
                    type="text"
                    className="w-full border rounded-lg p-2 mt-2"
                    placeholder="Type your message here..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    /></>
                  
                )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(label: string): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }
  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }
  return "secondary";
}
