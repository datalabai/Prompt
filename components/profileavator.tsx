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
import { auth } from "@/app/firebase"
import { UserAuth } from "../app/context/AuthContext"

export function ProfileAvator() {
  const { setTheme } = useTheme()
  const { user, logOut } = UserAuth();
  const image=auth.currentUser?.photoURL;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Avatar >
                        <AvatarImage src={image || "KS"} />
                        <AvatarFallback>SR</AvatarFallback>
                    </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
        {user?.displayName || "User"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
