"use client";

import {
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from "@/shared/ui";
import { useUserStore } from "@/entities/user";
import { mockStats, mockRecentActivity } from "@/shared/api";
import { cn } from "@/shared/lib";

const stats = [
  {
    title: "Total Users",
    value: mockStats.totalUsers.toLocaleString(),
    change: "+12%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Active Projects",
    value: mockStats.activeProjects.toString(),
    change: "+8%",
    trend: "up" as const,
    icon: FolderKanban,
  },
  {
    title: "Revenue",
    value: `$${mockStats.revenue.toLocaleString()}`,
    change: "+23%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Growth Rate",
    value: `${mockStats.growth}%`,
    change: "-2%",
    trend: "down" as const,
    icon: TrendingUp,
  },
];

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function DashboardPage() {
  const { user } = useUserStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name?.split(" ")[0]}! Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon
                    className={cn(
                      "mr-1 h-3 w-3",
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    )}
                  />
                  <span
                    className={cn(
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Activity Chart Placeholder */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your activity over the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Activity chart placeholder
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Create Project
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Invite Team Member
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Generate Report
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              View Analytics
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Export Data
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
