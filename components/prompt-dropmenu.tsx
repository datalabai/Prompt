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
  category: string;
}

export function PromptModeToggle({ onIconSelect, category }: PromptModeToggleProps) {
  const { setTheme } = useTheme();
  const [selectedIcon, setSelectedIcon] = React.useState<React.ComponentType | null>(null);

  const handleMenuItemClick = (icon: React.ComponentType, name: string) => {
    setSelectedIcon(icon);
    onIconSelect(icon, name);
  };

  const renderIcon = () => {
    if (selectedIcon) {
      if(selectedIcon === ChatBubbleIcon) {
        return <ChatBubbleIcon className="h-6 w-6 text-muted-foreground cursor-pointer" />; 
      }
      if(selectedIcon === MagicWandIcon) {
        return <MagicWandIcon className="h-6 w-6 text-muted-foreground cursor-pointer" />;
      }
      if(selectedIcon === Palette) {
        return <Palette className="h-6 w-6 text-muted-foreground cursor-pointer" />;
      }
      if(selectedIcon === Biohazard) {
        return <Biohazard className="h-6 w-6 text-muted-foreground cursor-pointer" />;
      }
      if(selectedIcon === Images) {
        return <Images className="h-6 w-6 text-muted-foreground cursor-pointer" />;
      }
      if(selectedIcon === ClipboardList) {
        return <ClipboardList className="h-6 w-6 text-muted-foreground cursor-pointer" />;
      }
      if(selectedIcon === List) {
        return <List className="h-6 w-6 text-muted-foreground cursor-pointer" />;
      }
    }
    return <PlusCircledIcon className="h-6 w-6 text-muted-foreground cursor-pointer" />;
  };

  const renderDropdownItems = () => {
    switch (category) {
      case "General":
      case "Private":
        return (
          <>
            <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
              <ChatBubbleIcon className="mr-2 h-4 w-4" />
              Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(MagicWandIcon, 'prompt')}>
              <MagicWandIcon className="mr-2 h-4 w-4" />
              Prompt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(List, 'text')}>
              <List className="mr-2 h-4 w-4" />
              Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(Images, 'images')}>
              <Images className="mr-2 h-4 w-4" />
              Images
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(Biohazard, 'logos')}>
              <Biohazard className="mr-2 h-4 w-4" />
              Logos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(Palette, 'memes')}>
              <Palette className="mr-2 h-4 w-4" />
              Memes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(ClipboardList, 'resumes')}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Resumes
            </DropdownMenuItem>
           
          </>
        );
      case "Expert":
        return (
          <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
            <ChatBubbleIcon className="mr-2 h-4 w-4" />
            Chat
          </DropdownMenuItem>
        );
      case "Memes":
        return (
          <>
            <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
              <ChatBubbleIcon className="mr-2 h-4 w-4" />
              Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(Palette, 'memes')}>
              <Palette className="mr-2 h-4 w-4" />
              Memes
            </DropdownMenuItem>
          </>
        );
      case "Logos":
        return (
          <>
          <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
              <ChatBubbleIcon className="mr-2 h-4 w-4" />
              Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(Biohazard, 'logos')}>
              <Biohazard className="mr-2 h-4 w-4" />
              Logos
            </DropdownMenuItem>
            
          </>
        );
      case "Images":
        return (
          <>
           <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
              <ChatBubbleIcon className="mr-2 h-4 w-4" />
              Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(Images, 'images')}>
              <Images className="mr-2 h-4 w-4" />
              Images
            </DropdownMenuItem>
           
          </>
        );
      case "Resumes":
        return (
          <>
           <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
              <ChatBubbleIcon className="mr-2 h-4 w-4" />
              Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(ClipboardList, 'resumes')}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Resumes
            </DropdownMenuItem>
           
          </>
        );
      case "Text":
        return (
          <>
           <DropdownMenuItem onClick={() => handleMenuItemClick(ChatBubbleIcon, 'chat')}>
              <ChatBubbleIcon className="mr-2 h-4 w-4" />
              Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick(List, 'text')}>
              <List className="mr-2 h-4 w-4" />
              Text
            </DropdownMenuItem>
           
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-2 left-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-9 px-0 mr-2">
            {renderIcon()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {renderDropdownItems()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
