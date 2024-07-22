"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/app/firebase";
import { UserAuth } from "../app/context/AuthContext";
import Link from "next/link";

interface ProfileAvatorProps {
  enableProfile: () => void;
}

export function ProfileAvator({ enableProfile }: ProfileAvatorProps) {
  const { setTheme } = useTheme();
  const { user, logOut } = UserAuth();
  const image = auth.currentUser?.photoURL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={image || "KS"} />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem >
        <Link href="/profile">
          {user?.displayName || "User"}
         </Link> 
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
