"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles, Loader2 } from "lucide-react";
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
import type { SitemapNode, PageType } from "@/entities/sitemap";

interface NodeEditorProps {
  node: SitemapNode | null;
  onSave: (updates: Partial<SitemapNode>) => void;
  onGenerate: (node: SitemapNode) => Promise<void>;
  isGenerating: boolean;
}

const pageTypes: { value: PageType; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "landing", label: "Landing" },
  { value: "dashboard", label: "Dashboard" },
  { value: "list", label: "List" },
  { value: "detail", label: "Detail" },
  { value: "form", label: "Form" },
  { value: "settings", label: "Settings" },
  { value: "profile", label: "Profile" },
  { value: "auth", label: "Auth" },
  { value: "error", label: "Error" },
  { value: "empty", label: "Empty" },
  { value: "custom", label: "Custom" },
];

export function NodeEditor({ node, onSave, onGenerate, isGenerating }: NodeEditorProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");
  const [pageType, setPageType] = useState<PageType>("custom");

  useEffect(() => {
    if (node) {
      setName(node.name);
      setPath(node.path);
      setDescription(node.description);
      setPageType(node.pageType);
    }
  }, [node]);

  if (!node) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Select a page to edit</p>
        </CardContent>
      </Card>
    );
  }

  const handleSave = () => {
    onSave({ name, path, description, pageType });
  };

  const handleGenerate = async () => {
    await onGenerate({ ...node, name, path, description, pageType });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Page</CardTitle>
        <CardDescription>
          Modify page details and generate code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Page Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="path">URL Path</Label>
          <Input
            id="path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Page Type</Label>
          <div className="flex flex-wrap gap-2">
            {pageTypes.map((type) => (
              <Badge
                key={type.value}
                variant={pageType === type.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setPageType(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
