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
import { useEffect, useState } from "react";
import { Menu } from 'lucide-react';
import { Icons } from "@/components/icons"
import { Nav } from "@/app/prompt/components/nav";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { House, GlobeLock, List, Images, Biohazard, Palette, ClipboardList } from 'lucide-react';

interface SiteHeaderProps {
  toggleRightPanel: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ toggleRightPanel }) => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState("General");
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleCategoryChange(title: string): void {
    setActiveCategory(title);
  }

  return (
    <header className="top-0 z-50 w-full border-b-2 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-between h-14 max-w-screen-2xl items-center">
        <MainNav />
        {isMobile && (
          <Sheet key={'left'}>
            <SheetTrigger asChild>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[250px] sm:w-[300px] mx-auto justify-center" side={'left'}>
            <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "General", label: "", icon: House, variant: "default" },
              // { title: "Private", label: "", icon: GlobeLock, variant: "ghost" },
              { title: "Text", label: "", icon: List, variant: "ghost" },
              { title: "Images", label: "", icon: Images, variant: "ghost" },
              // { title: "Logos", label: "", icon: Biohazard, variant: "ghost" },
              { title: "Memes", label: "", icon: Palette, variant: "ghost" },
              // { title: "Resumes", label: "", icon: ClipboardList, variant: "ghost" },
            ]}
            onLinkClick={handleCategoryChange}
          />
            </SheetContent>
          </Sheet>
        )}
        {/* Right-side actions (Mode Toggle, Profile, Login) */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="flex items-center space-x-2 md:space-x-4">
            <ModeToggle />
            {user ? (
              <ProfileAvator enableProfile={() => { toggleRightPanel(); }} />
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
