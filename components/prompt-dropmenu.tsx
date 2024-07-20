"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  GlobeLock,
  Images,
  Biohazard,
  List,
  Palette,
  ClipboardList,
  CirclePlus,
} from "lucide-react";
import { ChatBubbleIcon, MagicWandIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PromptModeToggleProps {
  onIconSelect: (icon: React.ComponentType, name: string) => void;
}

export function PromptModeToggle({ onIconSelect }: PromptModeToggleProps) {
  const { setTheme } = useTheme();
  const [selectedIcon, setSelectedIcon] = React.useState<React.ComponentType | null>(null);

  const handleMenuItemClick = (icon: React.ComponentType, name: string) => {
    setSelectedIcon(icon);
    onIconSelect(icon, name);
  };

  const renderIcon = () => {
    if (selectedIcon) {
      return React.createElement(selectedIcon, { className: "h-6 w-6 text-muted-foreground cursor-pointer" });
    }
    return <PlusCircledIcon className="h-6 w-6 text-muted-foreground cursor-pointer" />;
  };

  return (
    <div className="absolute top-2 left-2"> 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-9 px-0 mr-2">
            {renderIcon()}
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
            <ChatBubbleIcon className="mr-2 h-4 w-4" />
            Chat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick(MagicWandIcon, 'prompt')}>
            <MagicWandIcon className="mr-2 h-4 w-4" />
            Prompt
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick(Palette, 'memes')}>
            <Palette className="mr-2 h-4 w-4" />
            Memes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick(Biohazard, 'logos')}>
            <Biohazard className="mr-2 h-4 w-4" />
            Logos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick(Images, 'images')}>
            <Images className="mr-2 h-4 w-4" />
            Images
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick(ClipboardList, 'resumes')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Resumes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick(List, 'texts')}>
            <List className="mr-2 h-4 w-4" />
            Texts
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
