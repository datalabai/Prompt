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

interface MailListProps {
  items: Mail[];
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();
  
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
              <div className="flex justify-between line-clamp-2 text-xs text-muted-foreground">{item.text.substring(0, 300)} <MessageSquare size="16"/> </div>
              {/* {item.labels.length ? (
                <div className="flex items-center gap-2">
                  {item.labels.map((label) => (
                    <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : null} */}
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
