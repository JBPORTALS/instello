"use client";

import React from "react";
import { SpinnerIcon } from "@phosphor-icons/react";

import { cn } from "../lib/utils";

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof SpinnerIcon>) {
  return (
    <SpinnerIcon
      className={cn(
        "animation-duration-[0.58s] animate-spin",
        "mask-conic-25 mask-conic-from-current/0 mask-conic-to-current/100 mask-contain mask-bottom-right mask-no-repeat",
        className,
      )}
      {...props}
    />
  );
}
