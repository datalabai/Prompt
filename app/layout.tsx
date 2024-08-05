"use client";
import { ReactNode, use } from "react";
import "@/config/globals.css";
import { Viewport } from "next";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthContextProvider } from "./context/AuthContext";
import GoogleAnalytics from "./GoogleAnalytics";
import RightPanel from "@/components/rightPanel";
import { useState } from "react";
import { usePathname } from 'next/navigation'



export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

  const [showRightPanel, setShowRightPanel] = useState(true);
  const currentPath = usePathname();


  const toggleRightPanel = () => {
    setShowRightPanel(prev => !prev);
  };
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <GoogleAnalytics />
          <AuthContextProvider>
            <ToastContainer />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
               <SiteHeader toggleRightPanel={toggleRightPanel} />
             <div vaul-drawer-wrapper="" className="flex justify-between mt-2">
             
                <div className="relative flex min-h-screen flex-col bg-background mt-2 w-full">
                  {children}
                </div>
                {currentPath !== '/profile' && showRightPanel && <RightPanel />}                
              </div>
              {/* <SiteFooter /> */}
              <TailwindIndicator />
              <ThemeSwitcher />
            </ThemeProvider>
          </AuthContextProvider>
        </body>
      </html>
    </>
  );
}
