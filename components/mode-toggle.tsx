import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size="sm"
      variant="ghost"
      className="rounded-full justify-start"
    >
      <div className="flex gap-2 dark:hidden">
        <Moon className="size-6" />
        
      </div>

      <div className="dark:flex gap-2 hidden">
        <Sun className="size-6" />
        
      </div>

    </Button>
  );
};