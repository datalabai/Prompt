"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from 'lucide-react';
import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { ProfileAvator } from "./profileavator";
import { UserAuth } from "../app/context/AuthContext";
import { addUserToFirestore } from '../app/firebase';
import { useEffect, useState ,useRef} from "react";
import { Nav } from "@/app/prompt/components/nav";
import { Sheet, SheetContent, SheetFooter, SheetTrigger ,SheetClose} from "@/components/ui/sheet";
import { House, List, Images, Palette } from 'lucide-react';
import { useCategory } from "@/app/context/CategoryContext";
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
interface SiteHeaderProps {
  toggleRightPanel: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ toggleRightPanel }) => {
  const { user, googleSignIn } = UserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { category, setCategory } = useCategory();

  // Ref for the SheetTrigger
  const sheetTriggerRef = useRef<HTMLButtonElement | null>(null);

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
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleLinkClick = (category: string) => {
    handleCategoryChange(category);
    setIsMobileMenuOpen(false); // Close the sheet
  };

  // Close the sheet using the ref
  const closeSheet = () => {
    if (sheetTriggerRef.current) {
      sheetTriggerRef.current.click();
    }
  };

  return (
    <header className="top-0 z-50 w-full border-b-2 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-between h-14 max-w-screen-2xl items-center">
        <MainNav />
        {isMobile && (
          <Sheet>
            <SheetTrigger ref={sheetTriggerRef} asChild>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[250px] sm:w-[300px] mx-auto justify-center" side={'left'}>
      <Link href="/" className="flex items-start space-x-2  -ml-3 mt-4">
        <Icons.logo className="h-6 w-6" />
        <span className="font-bold sm:inline-block inline bg-gradient-to-r from-[#16aad3]  to-[#07bc0c] text-transparent bg-clip-text">
          {siteConfig.name}
        </span>
      </Link>
              <SheetFooter className="mt-4">
                <SheetClose asChild>
                  <Nav
                    isCollapsed={isCollapsed}
                    links={[
                      { title: "General", label: "", icon: House, variant: category === "General" ? "default" : "ghost" },
                      { title: "Text", label: "", icon: List, variant: category === "Text" ? "default" : "ghost" },
                      { title: "Images", label: "", icon: Images, variant: category === "Images" ? "default" : "ghost" },
                      { title: "Memes", label: "", icon: Palette, variant: category === "Memes" ? "default" : "ghost" },
                    ]}
                    onLinkClick={(category) => {
                      handleLinkClick(category);
                      closeSheet(); // Close the sheet
                    }}
                  />
                </SheetClose>
              </SheetFooter>
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