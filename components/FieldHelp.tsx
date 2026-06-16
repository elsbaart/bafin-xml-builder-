"use client";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export function FieldHelp({ text }: { text: string | ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="inline h-4 w-4 ml-1 text-muted-foreground cursor-help shrink-0" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm text-sm leading-snug">
          {typeof text === "string" ? <p>{text}</p> : text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TooltipSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-2 pt-2 border-t border-white/20">
      <p className="font-semibold text-xs uppercase tracking-wide opacity-70 mb-1">{label}</p>
      {children}
    </div>
  );
}
