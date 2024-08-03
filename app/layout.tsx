import "@/config/globals.css";
import { Metadata, Viewport } from "next";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthContextProvider } from "./context/AuthContext";
import GoogleAnalytics from "./GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "Uber for Prompts",
    "AI Content Creation",
    "Chatbot Assistance",
    "Creative Writing Prompts",
    "Image Generation",
    "Logo Design",
    "Meme Maker",
    "Resume Builder",
    "Hyper-Realistic Art",
    "Digital Art Platform",
    "AI-Powered Design Tools",
    "Graphic Design Assistance",
    "AI Writing Assistant",
    "Visual Content Creation",
    "Image Editing Tools",
    "Online Design Platform",
    "AI Chat Support",
    "Custom Logo Creation",
    "Meme Generation Tool",
    "Resume Template Creator",
    "AI Art Generator",
    "prompt",
    "expert",
    "image",
    "resume",
    "text",
    "logo",
    "design",
    "writing",
    "writing prompt",
    "memes",
    "meme generator",
    "generator",
    "text generator",
  ],
  authors: [
    {
      name: "prompt",
      url: "https://prompt.fun/",
    },
  ],
  creator: "prompt",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@prompt",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}`,
};

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
              <div vaul-drawer-wrapper="">
                <SiteHeader />
                <div className="relative flex min-h-screen flex-col bg-background mt-2">
                  {children}
                </div>
                <SiteFooter />
              </div>
              <TailwindIndicator />
              <ThemeSwitcher />
            </ThemeProvider>
          </AuthContextProvider>
        </body>
      </html>
    </>
  );
}
