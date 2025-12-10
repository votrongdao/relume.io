import { cn } from "@/shared/lib";
import type { User } from "../model";

interface UserInfoProps {
  user: User | null;
  showEmail?: boolean;
  className?: string;
}

export function UserInfo({ user, showEmail = true, className }: UserInfoProps) {
  if (!user) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-sm font-medium leading-none">{user.name}</span>
      {showEmail && (
        <span className="text-xs text-muted-foreground leading-none mt-1">
          {user.email}
        </span>
      )}
    </div>
  );
}
