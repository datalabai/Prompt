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
import HotjarSnippet from "./Hotjar";
import RightPanel from "@/components/rightPanel";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { CategoryProvider } from './context/CategoryContext';
import { GoogleTagManager } from '@next/third-parties/google';
import { GoogleAnalytics } from '@next/third-parties/google';

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
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ""} />
        <body
          className={cn(
            "bg-background font-sans antialiased overflow-hidden",
            fontSans.variable
          )}
        >
          <AuthContextProvider>
            <CategoryProvider>
              <ToastContainer />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <SiteHeader toggleRightPanel={toggleRightPanel} />
                <div vaul-drawer-wrapper="" className="flex justify-between mt-2 h-dvh max-w-screen">
                  <div className="relative flex min-h-screen flex-col bg-background mt-2 w-full">
                    {children}
                  </div>
                </div>
                <TailwindIndicator />
                <ThemeSwitcher />
              </ThemeProvider>
              <HotjarSnippet />
            </CategoryProvider>
          </AuthContextProvider>
        </body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
      </html>
    </>
  );
}
