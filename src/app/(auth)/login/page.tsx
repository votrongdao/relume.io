"use client";

import Link from "next/link";
import { LoginForm } from "@/features/auth";
import { ThemeToggle } from "@/features/theme-toggle";
import { siteConfig } from "@/shared/config";

export default function LoginPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              R
            </div>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to {siteConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials below to access your account
          </p>
        </div>

        <LoginForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
