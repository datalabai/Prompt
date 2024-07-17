"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ProfileAvator() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Avatar >
                        <AvatarImage src="/avatars/02.png" />
                        <AvatarFallback>SR</AvatarFallback>
                    </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Shiva Sankara Rao
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Logout
        </DropdownMenuItem>
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
