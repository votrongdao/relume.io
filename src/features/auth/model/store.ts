"use client";

import { create } from "zustand";
import { useUserStore } from "@/entities/user";
import { mockUser } from "@/shared/api";

interface AuthState {
  isLoggingIn: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isLoggingIn: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ isLoggingIn: true, error: null });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (email === "demo@relume.io" && password === "demo123") {
      useUserStore.getState().setUser(mockUser);
      set({ isLoggingIn: false });
      return true;
    }

    set({
      isLoggingIn: false,
      error: "Invalid email or password",
    });
    return false;
  },
  logout: () => {
    useUserStore.getState().logout();
    set({ error: null });
  },
  clearError: () => set({ error: null }),
}));
