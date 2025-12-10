"use client";

import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, Sparkles } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui";
import { siteConfig } from "@/shared/config";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Next.js 14 and optimized for speed. Get blazing fast performance out of the box.",
  },
  {
    icon: Shield,
    title: "Type Safe",
    description: "Full TypeScript support with strict type checking. Catch errors before they reach production.",
  },
  {
    icon: Globe,
    title: "Modern Stack",
    description: "Tailwind CSS, Radix UI, and Zustand for a modern, maintainable codebase.",
  },
  {
    icon: Sparkles,
    title: "FSD Architecture",
    description: "Feature-Sliced Design for scalable and maintainable code organization.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Built with FSD Architecture
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Build Modern Apps with{" "}
              <span className="text-primary">{siteConfig.name}</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              A professional frontend application built with Next.js, TypeScript, and
              Feature-Sliced Design. Production-ready with beautiful UI components.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with best practices and modern tools for a great developer experience.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-0 bg-background shadow-sm">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: "99%", label: "Performance Score" },
              { value: "100%", label: "TypeScript Coverage" },
              { value: "A+", label: "Accessibility Rating" },
              { value: "0", label: "Runtime Errors" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Experience the power of modern frontend development with {siteConfig.name}.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
