"use client";

import {
  Home,
  LayoutDashboard,
  List,
  FileText,
  FormInput,
  Settings,
  User,
  Lock,
  AlertCircle,
  FileQuestion,
  Sparkles,
  ChevronRight,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, Badge } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SitemapNode, PageType, PageStatus } from "../model";

const pageTypeIcons: Record<PageType, React.ComponentType<{ className?: string }>> = {
  home: Home,
  landing: Sparkles,
  dashboard: LayoutDashboard,
  list: List,
  detail: FileText,
  form: FormInput,
  settings: Settings,
  profile: User,
  auth: Lock,
  error: AlertCircle,
  empty: FileQuestion,
  custom: FileText,
};

const pageTypeLabels: Record<PageType, string> = {
  home: "Home",
  landing: "Landing",
  dashboard: "Dashboard",
  list: "List",
  detail: "Detail",
  form: "Form",
  settings: "Settings",
  profile: "Profile",
  auth: "Auth",
  error: "Error",
  empty: "Empty",
  custom: "Custom",
};

const statusConfig: Record<PageStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: FileText },
  generating: { label: "Generating", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", icon: Loader2 },
  generated: { label: "Generated", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", icon: Check },
  error: { label: "Error", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", icon: X },
};

interface SitemapNodeCardProps {
  node: SitemapNode;
  isSelected?: boolean;
  onClick?: () => void;
  onGenerate?: () => void;
  compact?: boolean;
}

export function SitemapNodeCard({
  node,
  isSelected,
  onClick,
  compact = false,
}: SitemapNodeCardProps) {
  const Icon = pageTypeIcons[node.pageType];
  const statusInfo = statusConfig[node.status];
  const StatusIcon = statusInfo.icon;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )}
        onClick={onClick}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium truncate">{node.name}</span>
        <span className="text-xs opacity-60 truncate">{node.path}</span>
        {node.children.length > 0 && (
          <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
        )}
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">{node.name}</h4>
              <Badge variant="outline" className="text-xs shrink-0">
                {pageTypeLabels[node.pageType]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {node.path}
            </p>
            {node.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {node.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge className={cn("text-xs", statusInfo.color)}>
                <StatusIcon className={cn("h-3 w-3 mr-1", node.status === "generating" && "animate-spin")} />
                {statusInfo.label}
              </Badge>
              {node.children.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {node.children.length} sub-page{node.children.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
