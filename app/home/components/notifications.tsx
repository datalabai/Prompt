import { BellIcon, EyeNoneIcon, PersonIcon } from "@radix-ui/react-icons"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Notifications() {
  return (
    <Card className="border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Recent Prompts</CardTitle>
        <CardDescription>
          Recent prompts which happening around you.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <PersonIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Shiva Sankara Rao</p>
            <p className="text-sm text-muted-foreground">
              Sky will full of crypto.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
          <PersonIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Kishore</p>
            <p className="text-sm text-muted-foreground">
              Good Morning.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <PersonIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Kishore</p>
            <p className="text-sm text-muted-foreground">
              Good Evening.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <PersonIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Shiva Sankara Rao</p>
            <p className="text-sm text-muted-foreground">
              Sky will full of crypto.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
          <PersonIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Kishore</p>
            <p className="text-sm text-muted-foreground">
              Good Morning.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
