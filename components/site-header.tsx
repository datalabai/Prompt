"use client";

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { CommandMenu } from "@/components/command-menu"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "@/components/ui/button"
import { ProfileAvator } from "./profileavator"
import { UserAuth } from "../app/context/AuthContext"
import { addUserToFirestore } from '../app/firebase'
import { useEffect } from "react"

export function SiteHeader() {
  const { user, googleSignIn, logOut } = UserAuth();

  useEffect(() => {
      if (user) {
          addUserToFirestore(user);
      }
  }, [user]);

  const handleSignIn = async () => {
    console.log("Signing in...");
    try {
        await googleSignIn();
        console.log("User signed in successfully.");
    } catch (error) {
        console.log(error);
    }
};
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <ModeToggle />
            {user ? (
              <ProfileAvator/>
            ) : (
              <button
                onClick={handleSignIn}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9"
                )}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
