"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
} from "@/shared/ui";
import type { SitemapGeneratorInput } from "@/entities/sitemap";

interface GeneratorFormProps {
  onGenerate: (input: SitemapGeneratorInput) => Promise<void>;
  isGenerating: boolean;
}

const industryOptions = [
  "SaaS",
  "E-commerce",
  "Blog",
  "Portfolio",
  "Dashboard",
  "Marketing",
  "Education",
  "Healthcare",
];

const featureOptions = [
  "Authentication",
  "Dashboard",
  "User Management",
  "Analytics",
  "E-commerce",
  "Blog",
  "Contact Form",
  "Search",
  "Notifications",
  "File Upload",
  "Chat",
  "Payments",
];

export function GeneratorForm({ onGenerate, isGenerating }: GeneratorFormProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate({
      projectName,
      projectDescription,
      industry: selectedIndustry,
      features: selectedFeatures,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Sitemap Generator
        </CardTitle>
        <CardDescription>
          Describe your project and let AI generate a complete sitemap structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              placeholder="My Awesome App"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description *</Label>
            <textarea
              id="projectDescription"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="A modern SaaS platform for project management with team collaboration features..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Industry (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {industryOptions.map((industry) => (
                <Badge
                  key={industry}
                  variant={selectedIndustry === industry ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedIndustry(
                      selectedIndustry === industry ? "" : industry
                    )
                  }
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {featureOptions.map((feature) => (
                <Badge
                  key={feature}
                  variant={
                    selectedFeatures.includes(feature) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isGenerating || !projectName || !projectDescription}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Sitemap...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Sitemap
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
