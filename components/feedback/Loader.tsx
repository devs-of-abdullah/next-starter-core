import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export function Loader({
  size = "md",
  className,
  text,
  fullScreen,
  ...props
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center gap-4 text-zinc-500 dark:text-zinc-400",
        className,
      )}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin text-zinc-900 dark:text-white",
          sizeClasses[size],
        )}
      />
      {text && <p className="font-medium text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        {content}
      </div>
    );
  }

  return content;
}
