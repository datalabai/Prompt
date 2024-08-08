"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Crown } from 'lucide-react';
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { ProfileAvator } from "./profileavator";
import { UserAuth } from "../app/context/AuthContext";
import { addUserToFirestore } from '../app/firebase';
import { useEffect } from "react";

interface SiteHeaderProps {
  toggleRightPanel: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ toggleRightPanel }) => {
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
    <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-between h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="flex items-center space-x-2 md:space-x-4">
            {/* <Crown
              strokeWidth={1.25}
              className="h-6 w-6 text-primary cursor-pointer"
              onClick={toggleRightPanel}
            /> */}
            <ModeToggle />
            {user ? (
              <ProfileAvator enableProfile={function (): void {
                throw new Error("Function not implemented.");
              } } />
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
  );
};
