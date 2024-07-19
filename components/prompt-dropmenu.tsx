"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import {
  House,
  GlobeLock,
  BookOpenText,
  Images,
  Biohazard,
  List,
  Palette,
  ClipboardList,
  CirclePlus,
} from "lucide-react";
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PromptModeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="absolute top-2 left-2"> 
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0 mr-2">
          <PlusCircledIcon className="h-6 w-6 text-muted-foreground cursor-pointer" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        
        <DropdownMenuItem onClick={() => setTheme("Chat")}>
        <House className="mr-2 h-4 w-4" />
        Chat
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BookOpenText className="mr-2 h-4 w-4" />
        Prompt
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Palette className="mr-2 h-4 w-4" />
        Memes
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Biohazard className="mr-2 h-4 w-4" />
        Logos
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Images className="mr-2 h-4 w-4" />
        Images
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ClipboardList className="mr-2 h-4 w-4" />
        Resumes
      </DropdownMenuItem>
      <DropdownMenuItem>
        <List className="mr-2 h-4 w-4" />
        Texts
      </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
