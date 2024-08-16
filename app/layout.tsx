"use client";

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
import Script from 'next/script'; // Import Script component

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
        <head>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6Q5GBJNP0V"></Script>
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID});`}
          </Script>

          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID});`}
          </Script>
        </head>
        <body
          className={cn(
            "bg-background font-sans antialiased overflow-hidden",
            fontSans.variable
          )}
        >
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          
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
      </html>
    </>
  );
}
