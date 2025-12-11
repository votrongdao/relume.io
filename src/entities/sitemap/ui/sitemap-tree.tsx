"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button, ScrollArea } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SitemapNode } from "../model";
import { SitemapNodeCard } from "./sitemap-node-card";

interface SitemapTreeProps {
  nodes: SitemapNode[];
  selectedNodeId?: string;
  onSelectNode?: (node: SitemapNode) => void;
  onAddNode?: (parentId?: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  className?: string;
}

interface TreeNodeProps {
  node: SitemapNode;
  level: number;
  selectedNodeId?: string;
  onSelectNode?: (node: SitemapNode) => void;
  onAddNode?: (parentId?: string) => void;
  onDeleteNode?: (nodeId: string) => void;
}

function TreeNode({
  node,
  level,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md transition-colors",
          "hover:bg-muted/50",
          isSelected && "bg-primary/10"
        )}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="h-4 w-4" />
          )}
        </Button>

        {/* Node Content */}
        <div
          className="flex-1 cursor-pointer py-1"
          onClick={() => onSelectNode?.(node)}
        >
          <SitemapNodeCard node={node} isSelected={isSelected} compact />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onAddNode?.(node.id);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode?.(node.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="border-l border-border ml-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onAddNode={onAddNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SitemapTree({
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  className,
}: SitemapTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <p className="text-muted-foreground text-sm">No pages in sitemap</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => onAddNode?.()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Root Page
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="space-y-1 p-2">
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onAddNode={onAddNode}
            onDeleteNode={onDeleteNode}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
