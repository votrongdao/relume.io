"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, GripVertical, Trash2, Copy } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  ScrollArea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SitemapNode, PageSection, SectionType } from "../model";

interface VisualSitemapProps {
  nodes: SitemapNode[];
  selectedNodeId?: string;
  onSelectNode?: (node: SitemapNode) => void;
  onAddNode?: (parentId?: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onAddSection?: (nodeId: string, sectionType: SectionType) => void;
  onDeleteSection?: (nodeId: string, sectionId: string) => void;
  className?: string;
}

const sectionTypeLabels: Record<SectionType, string> = {
  navbar: "Navbar",
  hero: "Hero Header Section",
  features: "Features List Section",
  about: "About Section",
  services: "Services Section",
  testimonials: "Testimonial Section",
  team: "Team Section",
  gallery: "Gallery Section",
  portfolio: "Portfolio List Section",
  pricing: "Pricing Section",
  faq: "FAQ Section",
  contact: "Contact Form Section",
  cta: "CTA Section",
  stats: "Stats Section",
  logos: "Logos Section",
  blog: "Blog Section",
  footer: "Footer",
  custom: "Custom Section",
};

function PageCard({
  node,
  isSelected,
  onSelect,
  onAddSection,
  onDeleteSection,
  onDelete,
  onDuplicate,
}: {
  node: SitemapNode;
  isSelected: boolean;
  onSelect: () => void;
  onAddSection?: (sectionType: SectionType) => void;
  onDeleteSection?: (sectionId: string) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "w-[280px] cursor-pointer transition-all hover:shadow-lg",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">📄</span>
          <span className="font-medium text-sm">{node.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 opacity-0 transition-opacity",
                isHovered && "opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sections */}
      <CardContent className="p-0">
        <div className="divide-y">
          {node.sections.map((section) => (
            <div
              key={section.id}
              className="group flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">
                  {sectionTypeLabels[section.type]}
                </p>
                {section.description && (
                  <p className="text-[10px] text-muted-foreground truncate">
                    {section.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSection?.(section.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Section Button */}
        <div className="p-2 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus className="h-3 w-3 mr-2" />
                Add section
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 max-h-64 overflow-y-auto">
              {(Object.keys(sectionTypeLabels) as SectionType[]).map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSection?.(type);
                  }}
                >
                  {sectionTypeLabels[type]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function PageGroup({
  parentNode,
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  onDuplicateNode,
  onAddSection,
  onDeleteSection,
  level = 0,
}: {
  parentNode?: SitemapNode;
  nodes: SitemapNode[];
  selectedNodeId?: string;
  onSelectNode?: (node: SitemapNode) => void;
  onAddNode?: (parentId?: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onAddSection?: (nodeId: string, sectionType: SectionType) => void;
  onDeleteSection?: (nodeId: string, sectionId: string) => void;
  level?: number;
}) {
  if (nodes.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      {/* Connection line from parent */}
      {parentNode && (
        <div className="w-px h-8 bg-border" />
      )}

      {/* Horizontal connector for multiple children */}
      {nodes.length > 1 && (
        <div className="flex items-start">
          <div className="h-px bg-border" style={{ width: `${(nodes.length - 1) * 320}px` }} />
        </div>
      )}

      {/* Child nodes */}
      <div className="flex gap-10">
        {nodes.map((node) => (
          <div key={node.id} className="flex flex-col items-center">
            {/* Vertical connector */}
            {nodes.length > 1 && <div className="w-px h-4 bg-border" />}

            <PageCard
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={() => onSelectNode?.(node)}
              onAddSection={(type) => onAddSection?.(node.id, type)}
              onDeleteSection={(sectionId) => onDeleteSection?.(node.id, sectionId)}
              onDelete={() => onDeleteNode?.(node.id)}
              onDuplicate={() => onDuplicateNode?.(node.id)}
            />

            {/* Children */}
            {node.children.length > 0 && (
              <PageGroup
                parentNode={node}
                nodes={node.children}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
                onDuplicateNode={onDuplicateNode}
                onAddSection={onAddSection}
                onDeleteSection={onDeleteSection}
                level={level + 1}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function VisualSitemap({
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  onDuplicateNode,
  onAddSection,
  onDeleteSection,
  className,
}: VisualSitemapProps) {
  // Separate root nodes (those without children relationships shown at top)
  const rootNodes = nodes.filter((n) => !n.parentId);

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="p-8 min-w-max">
        {/* Project header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            <span>🏗️</span>
            <span className="font-medium">Project</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onAddNode?.()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Visual tree */}
        {rootNodes.length > 0 ? (
          <PageGroup
            nodes={rootNodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onAddNode={onAddNode}
            onDeleteNode={onDeleteNode}
            onDuplicateNode={onDuplicateNode}
            onAddSection={onAddSection}
            onDeleteSection={onDeleteSection}
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-px h-8 bg-border" />
            <Button variant="outline" onClick={() => onAddNode?.()}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Page
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
