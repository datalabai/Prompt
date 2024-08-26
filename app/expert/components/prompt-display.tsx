import { format } from 'date-fns';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Mail } from "../data"
import { CardsChat } from "./chat"

interface MailDisplayProps {
  mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date()

  return (
    <div className="flex h-full max-h-full flex-col">
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-2">
            <div className="flex items-start gap-4 text-sm">
            <Avatar>
                        <AvatarImage src={mail.photo} alt={mail.name} />
                        <AvatarFallback>
                          {mail.name
                            .split(" ")
                            .map((chunk) => chunk[0])
                            .join("")}
                        </AvatarFallback>
               </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.text}</div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
          <CardsChat
              initialMessage={mail.text} currentUser={{ name: mail.name, avatar: mail.photo,email: mail.email,id: mail.id}}
            />
          </div>
          <Separator className="mt-auto" />
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  )
}
