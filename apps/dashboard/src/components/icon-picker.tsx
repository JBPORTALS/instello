"use client";

import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Button } from "@instello/ui/components/button";
import { Input } from "@instello/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@instello/ui/components/popover";
import { icons } from "@tabler/icons-react";
import { cva } from "class-variance-authority";

// List of filled icon component names you want to allow
type TablerIcon = keyof typeof icons;

const iconNames: TablerIcon[] = [
  "IconCircleFilled",
  "IconPackage",
  "IconAirBalloonFilled",
  "IconAccessibleFilled",
  "IconSettingsFilled",
  "IconCompassFilled",
  "IconFileNeutralFilled",
  "IconBowFilled",
  "IconMugFilled",
  "IconCloudComputingFilled",
  "IconOctagonFilled",
  "IconKeyFilled",
  "IconManFilled",
  "IconCarFilled",
  "IconPawFilled",
  "IconAdFilled",
  "IconPigFilled",
  "IconTagFilled",
  "IconUfoFilled",
  "IconBathFilled",
  "IconBulbFilled",
  "IconBoxAlignTopFilled",
  "IconBookFilled",
  "IconBongFilled",
  "IconMilkFilled",
  "IconConeFilled",
  "IconLegoFilled",
  "IconEggFilled",
] as const;

const tablerIconVariants = cva("size-7", {
  variants: {
    colorScheme: {
      indigo: "[&_svg]:text-indigo-600 dark:[&_svg]:text-indigo-400",
    },
    isActive: {
      true: "bg-indigo-600/10 hover:bg-indigo-600/10 dark:bg-indigo-400/20 dark:hover:bg-indigo-400/20",
    },
  },
  defaultVariants: {
    colorScheme: "indigo",
    isActive: false,
  },
});

export type IconPickerIcon = (typeof iconNames)[number];

interface TablerReactIconProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof tablerIconVariants> {
  name: IconPickerIcon;
  isActive?: boolean;
}

export function TablerReactIcon({
  name = "IconCircleFilled",
  colorScheme,
  className,
  isActive,
  ...props
}: TablerReactIconProps) {
  const TablerIcon = icons[name];
  return (
    <Button
      className={tablerIconVariants({ className, colorScheme, isActive })}
      size={"icon"}
      variant={"ghost"}
      {...props}
    >
      <TablerIcon size={16} />
    </Button>
  );
}

export default function IconPicker({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-h-max min-h-64 max-w-[300px] space-y-2 p-2.5">
        <Input placeholder="Search..." className="h-7 text-xs" />
        <div className="grid grid-cols-8 gap-1">
          {iconNames.map((name) => {
            return (
              <TablerReactIcon
                key={name}
                onClick={() => onChange(name)}
                isActive={name === value}
                name={name}
              />
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
