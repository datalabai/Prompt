import Image from "next/image"




import MailPage from "./home/page"
import { siteConfig } from "@/config/site";
import { Metadata, Viewport } from "next";
import { Landing } from "@/components/landing";

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
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  manifest: `${siteConfig.url}`,
};

export default function IndexPage() {
  return (
    <div className="container relative pr-0 overflow-y-auto ">
       <section >
        <Landing />
      </section>
    </div>
  )
}
