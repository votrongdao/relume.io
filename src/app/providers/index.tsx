"use client";

import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/shared/ui";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </ThemeProvider>
  );
}

export { ThemeProvider };
