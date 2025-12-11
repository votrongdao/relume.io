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

// Section types for page structure
export type SectionType =
  | "navbar"
  | "hero"
  | "features"
  | "about"
  | "services"
  | "testimonials"
  | "team"
  | "gallery"
  | "portfolio"
  | "pricing"
  | "faq"
  | "contact"
  | "cta"
  | "stats"
  | "logos"
  | "blog"
  | "footer"
  | "custom";

export interface PageSection {
  id: string;
  type: SectionType;
  name: string;
  description: string;
  order: number;
  config?: Record<string, unknown>;
}

export interface SitemapNode {
  id: string;
  name: string;
  path: string;
  description: string;
  pageType: PageType;
  status: PageStatus;
  children: SitemapNode[];
  parentId: string | null;
  sections: PageSection[];
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
  styleGuide?: StyleGuide;
  createdAt: Date;
  updatedAt: Date;
}

// Style Guide types
export interface ColorPalette {
  id: string;
  name: string;
  hex: string;
  isMain?: boolean;
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  scale: "small" | "medium" | "large";
}

export interface UIStyleConfig {
  borderRadius: "none" | "small" | "medium" | "large" | "full";
  buttonStyle: "solid" | "outline" | "ghost";
  cardStyle: "flat" | "elevated" | "bordered";
  spacing: "compact" | "comfortable" | "spacious";
}

export interface StyleGuide {
  id: string;
  colors: {
    neutrals: ColorPalette[];
    primary: ColorPalette[];
    accent: ColorPalette[];
  };
  typography: TypographyConfig;
  uiStyle: UIStyleConfig;
}

export interface SitemapGeneratorInput {
  projectName: string;
  projectDescription: string;
  industry?: string;
  features?: string[];
  targetAudience?: string;
  pageCount?: string;
  language?: string;
}

export interface GeneratedPage {
  nodeId: string;
  name: string;
  path: string;
  code: string;
  components: string[];
  timestamp: Date;
}

// Default section templates per page type
export const defaultSectionsForPageType: Record<PageType, SectionType[]> = {
  home: ["navbar", "hero", "features", "about", "testimonials", "gallery", "cta", "footer"],
  landing: ["navbar", "hero", "features", "pricing", "testimonials", "faq", "cta", "footer"],
  dashboard: ["navbar", "stats", "features", "cta"],
  list: ["navbar", "hero", "features", "footer"],
  detail: ["navbar", "hero", "about", "gallery", "cta", "footer"],
  form: ["navbar", "hero", "contact", "footer"],
  settings: ["navbar", "features", "footer"],
  profile: ["navbar", "hero", "about", "gallery", "footer"],
  auth: ["navbar", "hero", "footer"],
  error: ["navbar", "hero", "cta", "footer"],
  empty: ["navbar", "hero", "cta", "footer"],
  custom: ["navbar", "hero", "footer"],
};
