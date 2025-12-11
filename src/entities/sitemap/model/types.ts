export type PageType =
  | "home"
  | "landing"
  | "dashboard"
  | "list"
  | "detail"
  | "form"
  | "settings"
  | "profile"
  | "auth"
  | "error"
  | "empty"
  | "custom";

export type PageStatus = "draft" | "generating" | "generated" | "error";

export interface SitemapNode {
  id: string;
  name: string;
  path: string;
  description: string;
  pageType: PageType;
  status: PageStatus;
  children: SitemapNode[];
  parentId: string | null;
  meta?: {
    title?: string;
    keywords?: string[];
    components?: string[];
  };
  generatedCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sitemap {
  id: string;
  name: string;
  description: string;
  domain?: string;
  nodes: SitemapNode[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SitemapGeneratorInput {
  projectName: string;
  projectDescription: string;
  industry?: string;
  features?: string[];
  targetAudience?: string;
  style?: "minimal" | "corporate" | "creative" | "dashboard";
}

export interface GeneratedPage {
  nodeId: string;
  name: string;
  path: string;
  code: string;
  components: string[];
  timestamp: Date;
}
