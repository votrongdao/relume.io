"use client";

import { useState, useCallback } from "react";
import { Plus, Download, Trash2, FolderTree, Sparkles } from "lucide-react";
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
  Separator,
  Badge,
} from "@/shared/ui";
import {
  useSitemapStore,
  SitemapTree,
  type SitemapNode,
  type SitemapGeneratorInput,
} from "@/entities/sitemap";
import { GeneratorForm, generateSitemap, generatePageCode } from "@/features/sitemap-generator";
import { NodeEditor, PagePreview } from "@/features/page-generator";

export default function SitemapGeneratorPage() {
  const {
    currentSitemap,
    generatedPages,
    isGenerating,
    addSitemap,
    setCurrentSitemap,
    updateNode,
    deleteNode,
    updateNodeStatus,
    addGeneratedPage,
    setGenerating,
  } = useSitemapStore();

  const [selectedNode, setSelectedNode] = useState<SitemapNode | null>(null);
  const [activeTab, setActiveTab] = useState<"generator" | "editor">("generator");

  const handleGenerateSitemap = async (input: SitemapGeneratorInput) => {
    setGenerating(true);
    try {
      const sitemap = await generateSitemap(input);
      addSitemap(sitemap);
      setActiveTab("editor");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectNode = useCallback((node: SitemapNode) => {
    setSelectedNode(node);
  }, []);

  const handleSaveNode = (updates: Partial<SitemapNode>) => {
    if (selectedNode && currentSitemap) {
      updateNode(currentSitemap.id, selectedNode.id, updates);
      setSelectedNode({ ...selectedNode, ...updates });
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    if (currentSitemap) {
      deleteNode(currentSitemap.id, nodeId);
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    }
  };

  const handleGeneratePage = async (node: SitemapNode) => {
    if (!currentSitemap) return;

    setGenerating(true);
    updateNodeStatus(currentSitemap.id, node.id, "generating");

    try {
      const code = await generatePageCode(node);
      updateNodeStatus(currentSitemap.id, node.id, "generated");
      updateNode(currentSitemap.id, node.id, { generatedCode: code });
      addGeneratedPage({
        nodeId: node.id,
        name: node.name,
        path: node.path,
        code,
        components: node.meta?.components || [],
        timestamp: new Date(),
      });
      setSelectedNode({ ...node, generatedCode: code, status: "generated" });
    } catch {
      updateNodeStatus(currentSitemap.id, node.id, "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!currentSitemap) return;

    const flattenNodes = (nodes: SitemapNode[]): SitemapNode[] => {
      return nodes.reduce<SitemapNode[]>((acc, node) => {
        acc.push(node);
        if (node.children.length > 0) {
          acc.push(...flattenNodes(node.children));
        }
        return acc;
      }, []);
    };

    const allNodes = flattenNodes(currentSitemap.nodes);
    for (const node of allNodes) {
      if (node.status !== "generated") {
        await handleGeneratePage(node);
      }
    }
  };

  const handleExportAll = () => {
    if (generatedPages.length === 0) return;

    const exportData = generatedPages.map((page) => ({
      path: page.path,
      name: page.name,
      code: page.code,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSitemap?.name || "sitemap"}-pages.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const countNodes = (nodes: SitemapNode[]): number => {
    return nodes.reduce((count, node) => {
      return count + 1 + countNodes(node.children);
    }, 0);
  };

  const countGeneratedNodes = (nodes: SitemapNode[]): number => {
    return nodes.reduce((count, node) => {
      const nodeCount = node.status === "generated" ? 1 : 0;
      return count + nodeCount + countGeneratedNodes(node.children);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderTree className="h-8 w-8" />
            AI Sitemap Generator
          </h1>
          <p className="text-muted-foreground">
            Generate complete sitemap and pages with AI
          </p>
        </div>
        {currentSitemap && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {countGeneratedNodes(currentSitemap.nodes)} / {countNodes(currentSitemap.nodes)} pages
            </Badge>
            <Button variant="outline" size="sm" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button size="sm" onClick={handleGenerateAll} disabled={isGenerating}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate All Pages
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generator" | "editor")}>
        <TabsList>
          <TabsTrigger value="generator">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Sitemap
          </TabsTrigger>
          <TabsTrigger value="editor" disabled={!currentSitemap}>
            <FolderTree className="h-4 w-4 mr-2" />
            Edit & Generate Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <GeneratorForm onGenerate={handleGenerateSitemap} isGenerating={isGenerating} />

            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  AI-powered sitemap and page generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Describe Your Project</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter your project details and select features
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Sitemap</h4>
                    <p className="text-sm text-muted-foreground">
                      AI analyzes your input and creates a complete sitemap
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Customize Structure</h4>
                    <p className="text-sm text-muted-foreground">
                      Edit, add, or remove pages as needed
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Page Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate React code for each page with components
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          {currentSitemap ? (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Sitemap Tree */}
              <div className="lg:col-span-4">
                <Card className="h-[600px]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{currentSitemap.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentSitemap(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{currentSitemap.description}</CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0 h-[calc(100%-100px)]">
                    <SitemapTree
                      nodes={currentSitemap.nodes}
                      selectedNodeId={selectedNode?.id}
                      onSelectNode={handleSelectNode}
                      onDeleteNode={handleDeleteNode}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Editor & Preview */}
              <div className="lg:col-span-8 space-y-6">
                <NodeEditor
                  node={selectedNode}
                  onSave={handleSaveNode}
                  onGenerate={handleGeneratePage}
                  isGenerating={isGenerating}
                />

                {selectedNode?.generatedCode && (
                  <PagePreview
                    node={selectedNode}
                    code={selectedNode.generatedCode}
                    onExport={() => {
                      const blob = new Blob([selectedNode.generatedCode || ""], {
                        type: "text/plain",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${selectedNode.name.toLowerCase().replace(/\s+/g, "-")}.tsx`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderTree className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No sitemap generated yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab("generator")}
                >
                  Generate Sitemap
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Generated Pages Summary */}
      {generatedPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Pages ({generatedPages.length})</CardTitle>
            <CardDescription>
              Pages that have been generated with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {generatedPages.map((page) => (
                <div
                  key={page.nodeId}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{page.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {page.path}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {page.components.length} components
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
