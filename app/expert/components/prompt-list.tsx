import { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail } from "../data"
import { useMail } from "../use-mail"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface MailListProps {
  items: Mail[]
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail()

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
            
              <div className="flex items-center">
              <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={item.name} src="https://lh3.googleusercontent.com/a/ACg8ocIO-Qjn7Gox9YVx7ZXJRATk3PkPL0dpnDU689PAhBXbQQu1ag=s96-c" />
                <AvatarFallback>
                  {item.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold flex">{item.name} {!item.read && (
                    <span className="flex h-2 w-2 mt-1 ml-1 rounded-full bg-blue-600" />
                  )}</div>
                
                <div className="line-clamp-1 text-xs">{item.subject}</div>
                <div className="line-clamp-1 text-xs">
               
                  {item.text.substring(0, 300)}
                
                </div>
              </div>
            </div>
               
                
              </div>
              
            </div>
            
            
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["Images"].includes(label)) {
    return "default"
  }

  if (["Memes"].includes(label)) {
    return "outline"
  }

  return "secondary"
}
