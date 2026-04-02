import * as React from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageWrapper({ children, className, ...props }: PageWrapperProps) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 py-8", className)} {...props}>
      {children}
    </div>
  );
}
