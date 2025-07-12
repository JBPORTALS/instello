import React from "react";
import { cn } from "@instello/ui/lib/utils";

export default function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-4 py-4 md:gap-6 md:py-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
