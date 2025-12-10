import type { User } from "@/entities/user";

export const mockUser: User = {
  id: "1",
  email: "john.doe@relume.io",
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  role: "admin",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-12-01"),
};

export const mockStats = {
  totalUsers: 12847,
  activeProjects: 284,
  revenue: 45231,
  growth: 12.5,
};

export const mockRecentActivity = [
  {
    id: "1",
    type: "project_created",
    title: "New Project Created",
    description: "Marketing Campaign Q1 2025",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    type: "user_joined",
    title: "New Team Member",
    description: "Sarah joined the design team",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    type: "task_completed",
    title: "Task Completed",
    description: "Homepage redesign finished",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "4",
    type: "milestone_reached",
    title: "Milestone Reached",
    description: "100 active users achieved",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];
