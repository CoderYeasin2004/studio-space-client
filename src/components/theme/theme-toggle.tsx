"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Light/dark toggle. Icon swaps with a subtle rotation so the change reads
 * as intentional rather than abrupt.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className={className}
    >
      <span className="relative block size-4">
        <SunIcon
          className={`absolute inset-0 size-4 transition-all duration-300 ${
            theme === "dark"
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 size-4 transition-all duration-300 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </Button>
  );
}
