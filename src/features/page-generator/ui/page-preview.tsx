"use client";

import { useState } from "react";
import { Code, Eye, Copy, Check, Download } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SitemapNode } from "@/entities/sitemap";

interface PagePreviewProps {
  node: SitemapNode;
  code: string;
  onExport?: () => void;
}

export function PagePreview({ node, code, onExport }: PagePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{node.name}</CardTitle>
            <CardDescription>{node.path}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="code" className="w-full">
          <TabsList>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-sm">
                <code className="text-foreground">{code}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="rounded-lg border bg-background p-4 min-h-[300px]">
              <div className="text-center text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Preview will be available here</p>
                <p className="text-xs mt-2">
                  Components: {node.meta?.components?.join(", ")}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {node.meta?.components && node.meta.components.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Components used:</p>
            <div className="flex flex-wrap gap-2">
              {node.meta.components.map((component) => (
                <Badge key={component} variant="secondary">
                  {component}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
