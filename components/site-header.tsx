import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from 'lucide-react';
import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { ProfileAvator } from "./profileavator";
import { UserAuth } from "../app/context/AuthContext";
import { addUserToFirestore } from '../app/firebase';
import { Nav } from "@/app/home/components/nav";
import { Sheet, SheetContent, SheetFooter, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { House, List, Images, Palette } from 'lucide-react';
import { useCategory } from "@/app/context/CategoryContext";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import debounce from 'lodash/debounce';
import NotificationBadge from "./notificationBadge";
import { BellIcon } from "@radix-ui/react-icons"
import { RiSparkling2Line } from "react-icons/ri";


export const SiteHeader = () => {
  const { user, googleSignIn } = UserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { category, setCategory } = useCategory();

  // Ref for the SheetTrigger
  const sheetTriggerRef = useRef<HTMLButtonElement | null>(null);
  const notifications = 5;

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

  const handleResize = debounce(() => {
    // Adjust the media query to fit mobile and tablet sizes
    const mobileOrTablet = window.matchMedia("(max-width: 1024px)").matches;
    setIsMobile(mobileOrTablet);
  }, 300);

  useEffect(() => {
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

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
              <Link href="/home" className="flex items-start space-x-2 -ml-3 mt-4">
                {/* <RiSparkling2Line className="h-8 w-8 ml-6 text-blue-500"/> */}
                  <img src="./logo.png " className="h-9 w-9 ml-6"/>
                  <span className="font-bold ml-0 mt-1 pl-0">
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
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <ModeToggle />
            <Link href="/expert">
              <div className="relative group">
                <BellIcon className="h-10 w-10 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" />
                <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full dark:bg-red-400"></div>
              </div>
            </Link>
            {user ? (
              <ProfileAvator enableProfile={() => { }} />
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
