"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button, Card, ScrollArea } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SitemapNode, PageSection, SectionType } from "../model";

interface WireframeViewerProps {
  nodes: SitemapNode[];
  selectedNodeId?: string;
  onSelectNode?: (node: SitemapNode) => void;
  className?: string;
}

type ViewMode = "desktop" | "tablet" | "mobile";

const viewModeConfig: Record<ViewMode, { icon: typeof Monitor; width: string }> = {
  desktop: { icon: Monitor, width: "w-full max-w-4xl" },
  tablet: { icon: Tablet, width: "w-[768px]" },
  mobile: { icon: Smartphone, width: "w-[375px]" },
};

// Wireframe section renderers
function WireframeSection({ section, viewMode }: { section: PageSection; viewMode: ViewMode }) {
  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";

  const sectionRenderers: Record<SectionType, () => React.ReactNode> = {
    navbar: () => (
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="w-20 h-6 bg-muted rounded" />
        <div className={cn("flex gap-4", isMobile && "hidden")}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-4 bg-muted rounded" />
          ))}
        </div>
        <div className="w-20 h-8 bg-primary/20 rounded" />
      </div>
    ),
    hero: () => (
      <div className={cn("p-8 text-center", isMobile && "p-4")}>
        <div className={cn("mx-auto mb-4", isMobile ? "w-3/4 h-8" : "w-1/2 h-12", "bg-muted rounded")} />
        <div className={cn("mx-auto mb-6", isMobile ? "w-full h-4" : "w-2/3 h-6", "bg-muted/60 rounded")} />
        <div className="flex justify-center gap-3">
          <div className="w-24 h-10 bg-primary/30 rounded" />
          <div className="w-24 h-10 bg-muted rounded" />
        </div>
        <div className={cn("mt-8 mx-auto aspect-video bg-muted rounded-lg", isMobile ? "w-full" : "w-3/4")} />
      </div>
    ),
    features: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className="text-center mb-8">
          <div className="w-48 h-4 bg-muted/60 rounded mx-auto mb-2" />
          <div className={cn("h-8 bg-muted rounded mx-auto", isMobile ? "w-full" : "w-96")} />
        </div>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3")}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-lg mb-4" />
              <div className="w-3/4 h-5 bg-muted rounded mb-2" />
              <div className="w-full h-3 bg-muted/60 rounded mb-1" />
              <div className="w-2/3 h-3 bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    ),
    about: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className={cn("flex gap-8", isMobile && "flex-col")}>
          <div className="flex-1">
            <div className="w-32 h-4 bg-muted/60 rounded mb-2" />
            <div className="w-3/4 h-8 bg-muted rounded mb-4" />
            <div className="space-y-2">
              <div className="w-full h-3 bg-muted/60 rounded" />
              <div className="w-full h-3 bg-muted/60 rounded" />
              <div className="w-2/3 h-3 bg-muted/60 rounded" />
            </div>
          </div>
          <div className={cn("aspect-square bg-muted rounded-lg", isMobile ? "w-full" : "w-1/3")} />
        </div>
      </div>
    ),
    services: () => (
      <div className={cn("p-8 bg-muted/10", isMobile && "p-4")}>
        <div className="text-center mb-8">
          <div className="w-64 h-8 bg-muted rounded mx-auto" />
        </div>
        <div className={cn("flex gap-4", isMobile && "flex-col")}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 p-4 bg-background rounded-lg border">
              <div className="w-8 h-8 bg-primary/20 rounded mb-3" />
              <div className="w-3/4 h-5 bg-muted rounded mb-2" />
              <div className="w-full h-3 bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    ),
    testimonials: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className="text-center mb-6">
          <div className="w-48 h-6 bg-muted rounded mx-auto" />
        </div>
        <div className={cn("flex gap-4", isMobile && "flex-col")}>
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 p-6 border rounded-lg">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-4 h-4 bg-yellow-200 rounded" />
                ))}
              </div>
              <div className="space-y-1 mb-4">
                <div className="w-full h-3 bg-muted/60 rounded" />
                <div className="w-3/4 h-3 bg-muted/60 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div>
                  <div className="w-24 h-4 bg-muted rounded" />
                  <div className="w-16 h-3 bg-muted/60 rounded mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    team: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className="text-center mb-8">
          <div className="w-32 h-6 bg-muted rounded mx-auto" />
        </div>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-2" : "grid-cols-4")}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-3" />
              <div className="w-3/4 h-4 bg-muted rounded mx-auto mb-1" />
              <div className="w-1/2 h-3 bg-muted/60 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    ),
    gallery: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-3")}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    ),
    portfolio: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className="text-center mb-6">
          <div className="w-48 h-6 bg-muted rounded mx-auto" />
        </div>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted" />
              <div className="p-4">
                <div className="w-3/4 h-5 bg-muted rounded mb-2" />
                <div className="w-full h-3 bg-muted/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    pricing: () => (
      <div className={cn("p-8 bg-muted/10", isMobile && "p-4")}>
        <div className="text-center mb-8">
          <div className="w-32 h-6 bg-muted rounded mx-auto" />
        </div>
        <div className={cn("flex gap-4 justify-center", isMobile && "flex-col")}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={cn("p-6 bg-background border rounded-lg", isMobile ? "w-full" : "w-64")}>
              <div className="w-24 h-5 bg-muted rounded mb-2" />
              <div className="w-16 h-8 bg-muted rounded mb-4" />
              <div className="space-y-2 mb-4">
                {[1, 2, 3, 4].map((f) => (
                  <div key={f} className="flex gap-2 items-center">
                    <div className="w-4 h-4 bg-primary/20 rounded" />
                    <div className="flex-1 h-3 bg-muted/60 rounded" />
                  </div>
                ))}
              </div>
              <div className="w-full h-10 bg-primary/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    ),
    faq: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className="text-center mb-8">
          <div className="w-24 h-6 bg-muted rounded mx-auto" />
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="w-3/4 h-4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    ),
    contact: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className={cn("flex gap-8", isMobile && "flex-col")}>
          <div className="flex-1">
            <div className="w-32 h-6 bg-muted rounded mb-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="w-16 h-3 bg-muted/60 rounded" />
                <div className="w-full h-10 bg-muted/30 border rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-16 h-3 bg-muted/60 rounded" />
                <div className="w-full h-10 bg-muted/30 border rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-16 h-3 bg-muted/60 rounded" />
                <div className="w-full h-24 bg-muted/30 border rounded" />
              </div>
              <div className="w-32 h-10 bg-primary/20 rounded" />
            </div>
          </div>
          <div className={cn("bg-muted rounded-lg", isMobile ? "w-full h-48" : "w-1/3")} />
        </div>
      </div>
    ),
    cta: () => (
      <div className="p-8 bg-primary/5 text-center">
        <div className={cn("h-8 bg-muted rounded mx-auto mb-4", isMobile ? "w-full" : "w-96")} />
        <div className="flex justify-center gap-3">
          <div className="w-28 h-10 bg-primary/30 rounded" />
          <div className="w-28 h-10 bg-muted rounded" />
        </div>
      </div>
    ),
    stats: () => (
      <div className={cn("p-8 bg-muted/10", isMobile && "p-4")}>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-2" : "grid-cols-4")}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-10 bg-primary/20 rounded mx-auto mb-2" />
              <div className="w-20 h-3 bg-muted/60 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    ),
    logos: () => (
      <div className="p-8 border-y">
        <div className={cn("flex items-center justify-center gap-8 flex-wrap", isMobile && "gap-4")}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-24 h-8 bg-muted rounded" />
          ))}
        </div>
      </div>
    ),
    blog: () => (
      <div className={cn("p-8", isMobile && "p-4")}>
        <div className="text-center mb-6">
          <div className="w-32 h-6 bg-muted rounded mx-auto" />
        </div>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted" />
              <div className="p-4">
                <div className="w-20 h-3 bg-muted/60 rounded mb-2" />
                <div className="w-full h-5 bg-muted rounded mb-2" />
                <div className="w-3/4 h-3 bg-muted/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    footer: () => (
      <div className={cn("p-8 bg-muted/20 border-t", isMobile && "p-4")}>
        <div className={cn("flex gap-8", isMobile ? "flex-col" : "justify-between")}>
          <div className="space-y-3">
            <div className="w-24 h-6 bg-muted rounded" />
            <div className="w-48 h-3 bg-muted/60 rounded" />
          </div>
          {!isMobile && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="w-16 h-4 bg-muted rounded" />
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-20 h-3 bg-muted/60 rounded" />
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
        <div className="mt-8 pt-4 border-t text-center">
          <div className="w-48 h-3 bg-muted/60 rounded mx-auto" />
        </div>
      </div>
    ),
    custom: () => (
      <div className="p-8 text-center">
        <div className="w-full h-32 bg-muted/30 rounded-lg border-2 border-dashed flex items-center justify-center">
          <div className="w-32 h-4 bg-muted rounded" />
        </div>
      </div>
    ),
  };

  return (
    <div className="border-b last:border-b-0">
      {sectionRenderers[section.type]()}
    </div>
  );
}

function PageWireframe({ node, viewMode }: { node: SitemapNode; viewMode: ViewMode }) {
  return (
    <Card className={cn("overflow-hidden", viewModeConfig[viewMode].width)}>
      <div className="p-2 border-b bg-muted/30 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">{node.name}</span>
        </div>
      </div>
      <div className="bg-background">
        {node.sections.map((section) => (
          <WireframeSection key={section.id} section={section} viewMode={viewMode} />
        ))}
      </div>
    </Card>
  );
}

export function WireframeViewer({
  nodes,
  selectedNodeId,
  onSelectNode,
  className,
}: WireframeViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");

  // Flatten all nodes for display
  const flattenNodes = (nodes: SitemapNode[]): SitemapNode[] => {
    return nodes.reduce<SitemapNode[]>((acc, node) => {
      acc.push(node);
      if (node.children.length > 0) {
        acc.push(...flattenNodes(node.children));
      }
      return acc;
    }, []);
  };

  const allNodes = flattenNodes(nodes);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-center gap-2 p-4 border-b">
        {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
          const Icon = viewModeConfig[mode].icon;
          return (
            <Button
              key={mode}
              variant={viewMode === mode ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode(mode)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Wireframes Grid */}
      <ScrollArea className="flex-1">
        <div className="p-8">
          <div className="flex flex-wrap gap-8 justify-center">
            {allNodes.map((node) => (
              <div
                key={node.id}
                className={cn(
                  "cursor-pointer transition-transform hover:scale-[1.02]",
                  selectedNodeId === node.id && "ring-2 ring-primary rounded-lg"
                )}
                onClick={() => onSelectNode?.(node)}
              >
                <PageWireframe node={node} viewMode={viewMode} />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
