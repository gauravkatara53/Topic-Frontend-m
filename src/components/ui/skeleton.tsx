import React from "react";
import { cn } from "@/lib/utils"; // If you're using clsx/twMerge

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-300",
        className
      )}
      {...props}
    />
  );
};

export { Skeleton };
