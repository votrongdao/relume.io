"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { User } from "../model";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {initials || "U"}
      </AvatarFallback>
    </Avatar>
  );
}
