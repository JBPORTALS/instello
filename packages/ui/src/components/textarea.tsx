import * as React from "react";
import { cn } from "@instello/ui/lib/utils";

function Textarea({
  className,
  maxLength,
  value,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <div className="relative">
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content shadow-xs flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      {maxLength && (
        <span className="text-muted-foreground absolute bottom-3 right-3.5 text-xs">
          {value?.toString().length ?? 0}/{maxLength}
        </span>
      )}
    </div>
  );
}

export { Textarea };
