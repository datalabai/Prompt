"use client";

import * as React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { FaLink, FaProductHunt } from "react-icons/fa"; // Import icons for Twitter and Linktree
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
  onLinkClick: (title: string) => void;
}

export function Nav({ links: initialLinks, isCollapsed, onLinkClick }: NavProps) {
  const [activeLink, setActiveLink] = React.useState(initialLinks[0].title); // Initialize active link state
  const [links, setLinks] = React.useState(initialLinks); // State to manage links

  const handleLinkClick = (title: string) => {
    setActiveLink(title); // Update active link state
    onLinkClick(title); // Trigger callback to update data in parent component

    // Update links state to set the clicked link as default and others as ghost
    const updatedLinks = links.map(link => ({
      ...link,
      variant: link.title === title ? "default" : "ghost"
    })) as NavProps['links']; // Explicitly set the type

    // Update the links state
    setLinks(updatedLinks);
  };

  // Add Twitter and Linktree links
  const additionalLinks = [
    {
      title: 'Linktree',
      icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
      <path fill="currentColor" d="m13.736 5.853l4.005-4.117l2.325 2.38l-4.2 4.005h5.908v3.305h-5.937l4.229 4.108l-2.325 2.334l-5.74-5.769l-5.741 5.769l-2.325-2.325l4.229-4.108H2.226V8.121h5.909l-4.2-4.004l2.324-2.381l4.005 4.117V0h3.472zm-3.472 10.306h3.472V24h-3.472z"></path>
    </svg>,
      variant: 'ghost',
      href: 'https://links.prompt.fun/',
      iconSize: 'h-4 w-4'
    },
    {
      title: 'Twitter',
      icon: () => <FontAwesomeIcon icon={faXTwitter} />,
      variant: 'ghost',
      href: 'https://x.com/promptdotfun',
      iconSize: 'h-5 w-5'
    },
    {
      title: 'ProductHunt',
      icon: FaProductHunt,
      variant: 'ghost',
      href: 'https://www.producthunt.com/posts/prompt-fun?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-prompt&#0045;fun',
      iconSize: 'h-5 w-5'
    },
  ];

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col justify-between h-full py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                  onClick={() => handleLinkClick(link.title)}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <a
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
              onClick={() => handleLinkClick(link.title)}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </a>
          )
        )}
         <div className="flex  gap-2 px-2 mt-96">
        {additionalLinks.map((link, index) => (
          <Tooltip key={index} delayDuration={0}>
            <TooltipTrigger asChild>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: link.variant as "default" | "ghost" | "link" | "outline" | "secondary", size: "icon" }),
                  link.title === 'ProductHunt' ? "h-9 w-9" : "h-9 w-9",
                  "rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800",
                  link.variant === "default" &&
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                )}
              >
                <link.icon className={link.iconSize} />
                <span className="sr-only">{link.title}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" className="flex items-center gap-4">
              {link.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      </nav>

     
    </div>
  );
}
