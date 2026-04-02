"use client";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toast({ dir, ...props }: ToasterProps) {
  return <Sonner richColors position="top-right" dir={dir} {...props} />;
}
