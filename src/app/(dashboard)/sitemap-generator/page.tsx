"use client";

import { useState, useCallback } from "react";
import {
  Download,
  Share2,
  FolderTree,
  Sparkles,
  Layout,
  Palette,
  Eye,
  Globe,
  ChevronDown,
  Plus,
  Loader2,
} from "lucide-react";
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
  Input,
  Label,
  ScrollArea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import {
  useSitemapStore,
  VisualSitemap,
  WireframeViewer,
  StyleGuideEditor,
  DesignPreview,
  type SitemapNode,
  type SitemapGeneratorInput,
  type SectionType,
  type StyleGuide,
} from "@/entities/sitemap";
import { GeneratorForm, generateSitemap, generatePageCode } from "@/features/sitemap-generator";

const languages = [
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
];

type TabValue = "sitemap" | "wireframe" | "styleguide" | "design";

function generateSectionId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export default function SitemapGeneratorPage() {
  const {
    currentSitemap,
    generatedPages,
    isGenerating,
    addSitemap,
    setCurrentSitemap,
    updateNode,
    deleteNode,
    updateSitemap,
    setGenerating,
  } = useSitemapStore();

  const [selectedNode, setSelectedNode] = useState<SitemapNode | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("sitemap");
  const [language, setLanguage] = useState("en");
  const [showGenerator, setShowGenerator] = useState(!currentSitemap);

  const handleGenerateSitemap = async (input: SitemapGeneratorInput) => {
    setGenerating(true);
    try {
      const sitemap = await generateSitemap(input);
      addSitemap(sitemap);
      setShowGenerator(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectNode = useCallback((node: SitemapNode) => {
    setSelectedNode(node);
  }, []);

  const handleDeleteNode = (nodeId: string) => {
    if (currentSitemap) {
      deleteNode(currentSitemap.id, nodeId);
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    }
  };

  const handleDuplicateNode = (nodeId: string) => {
    if (!currentSitemap) return;

    const findNode = (nodes: SitemapNode[]): SitemapNode | null => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };

    const nodeToDuplicate = findNode(currentSitemap.nodes);
    if (nodeToDuplicate) {
      const duplicated: SitemapNode = {
        ...nodeToDuplicate,
        id: generateSectionId(),
        name: `${nodeToDuplicate.name} (Copy)`,
        path: `${nodeToDuplicate.path}-copy`,
        children: [],
        sections: nodeToDuplicate.sections.map((s) => ({
          ...s,
          id: generateSectionId(),
        })),
      };

      const updatedNodes = [...currentSitemap.nodes, duplicated];
      updateSitemap(currentSitemap.id, { nodes: updatedNodes });
    }
  };

  const handleAddNode = (parentId?: string) => {
    if (!currentSitemap) return;

    const newNode: SitemapNode = {
      id: generateSectionId(),
      name: "New Page",
      path: "/new-page",
      description: "A new page",
      pageType: "custom",
      status: "draft",
      children: [],
      parentId: parentId || null,
      sections: [
        { id: generateSectionId(), type: "navbar", name: "Navbar", description: "Navigation bar", order: 0 },
        { id: generateSectionId(), type: "hero", name: "Hero", description: "Hero section", order: 1 },
        { id: generateSectionId(), type: "footer", name: "Footer", description: "Footer section", order: 2 },
      ],
      meta: { components: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      const addToParent = (nodes: SitemapNode[]): SitemapNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, { ...newNode, parentId }] };
          }
          return { ...node, children: addToParent(node.children) };
        });
      };
      updateSitemap(currentSitemap.id, { nodes: addToParent(currentSitemap.nodes) });
    } else {
      updateSitemap(currentSitemap.id, { nodes: [...currentSitemap.nodes, newNode] });
    }
  };

  const handleAddSection = (nodeId: string, sectionType: SectionType) => {
    if (!currentSitemap) return;

    const addSectionToNode = (nodes: SitemapNode[]): SitemapNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          const newSection = {
            id: generateSectionId(),
            type: sectionType,
            name: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
            description: `${sectionType} section`,
            order: node.sections.length,
          };
          return { ...node, sections: [...node.sections, newSection] };
        }
        return { ...node, children: addSectionToNode(node.children) };
      });
    };

    updateSitemap(currentSitemap.id, { nodes: addSectionToNode(currentSitemap.nodes) });
  };

  const handleDeleteSection = (nodeId: string, sectionId: string) => {
    if (!currentSitemap) return;

    const deleteSectionFromNode = (nodes: SitemapNode[]): SitemapNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            sections: node.sections.filter((s) => s.id !== sectionId),
          };
        }
        return { ...node, children: deleteSectionFromNode(node.children) };
      });
    };

    updateSitemap(currentSitemap.id, { nodes: deleteSectionFromNode(currentSitemap.nodes) });
  };

  const handleStyleGuideChange = (updates: Partial<StyleGuide>) => {
    if (currentSitemap && currentSitemap.styleGuide) {
      const updatedStyleGuide = { ...currentSitemap.styleGuide, ...updates };
      updateSitemap(currentSitemap.id, { styleGuide: updatedStyleGuide });
    }
  };

  const countNodes = (nodes: SitemapNode[]): number => {
    return nodes.reduce((count, node) => {
      return count + 1 + countNodes(node.children);
    }, 0);
  };

  const handleExport = () => {
    if (!currentSitemap) return;

    const exportData = {
      sitemap: currentSitemap,
      generatedPages,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSitemap.name.toLowerCase().replace(/\s+/g, "-")}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Show generator form if no sitemap exists
  if (showGenerator || !currentSitemap) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FolderTree className="h-8 w-8" />
              AI Sitemap Generator
            </h1>
            <p className="text-muted-foreground">
              Generate a complete sitemap with AI
            </p>
          </div>
          {currentSitemap && (
            <Button variant="outline" onClick={() => setShowGenerator(false)}>
              Back to Editor
            </Button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GeneratorForm onGenerate={handleGenerateSitemap} isGenerating={isGenerating} />

          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>AI-powered sitemap and page generation</CardDescription>
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
                  <h4 className="font-medium">Edit & Customize</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the visual editor to customize pages, sections, and styles
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Export & Build</h4>
                  <p className="text-sm text-muted-foreground">
                    Export your sitemap and generate production-ready code
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pageCount = countNodes(currentSitemap.nodes);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Panel - Project Info */}
      <div className="w-72 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">{currentSitemap.name}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {currentSitemap.description}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Page Count */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Pages
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {pageCount}
                </Badge>
                <span className="text-sm text-muted-foreground">pages total</span>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Language
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {languages.find((l) => l.code === language)?.name || "English"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleAddNode()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowGenerator(true)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate Sitemap
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="p-4 border-t space-y-2">
          <Button variant="outline" className="w-full" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Project
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Tabs */}
        <div className="border-b px-4 py-2 flex items-center justify-between bg-background">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <TabsList className="h-10">
              <TabsTrigger value="sitemap" className="gap-2">
                <FolderTree className="h-4 w-4" />
                Sitemap
              </TabsTrigger>
              <TabsTrigger value="wireframe" className="gap-2">
                <Layout className="h-4 w-4" />
                Wireframe
              </TabsTrigger>
              <TabsTrigger value="styleguide" className="gap-2">
                <Palette className="h-4 w-4" />
                Style Guide
              </TabsTrigger>
              <TabsTrigger value="design" className="gap-2">
                <Eye className="h-4 w-4" />
                Design
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "sitemap" && (
            <VisualSitemap
              nodes={currentSitemap.nodes}
              selectedNodeId={selectedNode?.id}
              onSelectNode={handleSelectNode}
              onAddNode={handleAddNode}
              onDeleteNode={handleDeleteNode}
              onDuplicateNode={handleDuplicateNode}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
              className="h-full"
            />
          )}

          {activeTab === "wireframe" && (
            <WireframeViewer
              nodes={currentSitemap.nodes}
              selectedNodeId={selectedNode?.id}
              onSelectNode={handleSelectNode}
              className="h-full"
            />
          )}

          {activeTab === "styleguide" && currentSitemap.styleGuide && (
            <StyleGuideEditor
              styleGuide={currentSitemap.styleGuide}
              onUpdate={handleStyleGuideChange}
              className="h-full"
            />
          )}

          {activeTab === "design" && currentSitemap.styleGuide && (
            <DesignPreview
              nodes={currentSitemap.nodes}
              styleGuide={currentSitemap.styleGuide}
              selectedNodeId={selectedNode?.id}
              onSelectNode={handleSelectNode}
              className="h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
