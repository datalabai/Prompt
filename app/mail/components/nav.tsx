"use client";

import * as React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

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

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
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
      </nav>
    </div>
  );
}
