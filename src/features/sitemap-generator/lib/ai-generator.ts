import type {
  SitemapNode,
  SitemapGeneratorInput,
  PageType,
  Sitemap,
  PageSection,
  SectionType,
  StyleGuide,
  defaultSectionsForPageType,
} from "@/entities/sitemap";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const sectionDescriptions: Record<SectionType, string> = {
  navbar: "Navigation bar with logo and menu items",
  hero: "Hero header section with headline and CTA",
  features: "Features list showcasing key benefits",
  about: "About section with company/personal info",
  services: "Services offered with descriptions",
  testimonials: "Client testimonials and reviews",
  team: "Team members showcase",
  gallery: "Image gallery or portfolio showcase",
  portfolio: "Portfolio list with project cards",
  pricing: "Pricing plans comparison",
  faq: "Frequently asked questions",
  contact: "Contact form and information",
  cta: "Call-to-action section",
  stats: "Statistics and metrics display",
  logos: "Partner/client logos section",
  blog: "Blog posts list",
  footer: "Footer with links and info",
  custom: "Custom content section",
};

function createSections(pageType: PageType, description: string): PageSection[] {
  const defaultSections: Record<PageType, SectionType[]> = {
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

  const sectionTypes = defaultSections[pageType] || defaultSections.custom;

  return sectionTypes.map((type, index) => ({
    id: generateId(),
    type,
    name: sectionDescriptions[type].split(" ")[0],
    description: `${sectionDescriptions[type]} - ${description}`,
    order: index,
  }));
}

function createNode(
  name: string,
  path: string,
  pageType: PageType,
  description: string,
  children: SitemapNode[] = [],
  parentId: string | null = null
): SitemapNode {
  return {
    id: generateId(),
    name,
    path,
    description,
    pageType,
    status: "draft",
    children,
    parentId,
    sections: createSections(pageType, description),
    meta: {
      components: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Template sitemaps for different industries/styles
const templateSitemaps: Record<string, (input: SitemapGeneratorInput) => SitemapNode[]> = {
  saas: (input) => [
    createNode("Home", "/", "home", `Welcome to ${input.projectName}`, [
      createNode("Features", "/features", "landing", "Explore our features"),
      createNode("Pricing", "/pricing", "landing", "Choose your plan"),
      createNode("About", "/about", "landing", "Learn about us"),
      createNode("Contact", "/contact", "form", "Get in touch"),
    ]),
  ],

  ecommerce: (input) => [
    createNode("Home", "/", "home", `Welcome to ${input.projectName}`, [
      createNode("Shop", "/shop", "list", "Browse all products"),
      createNode("Categories", "/categories", "list", "Browse categories"),
    ]),
    createNode("Cart", "/cart", "list", "Shopping cart"),
    createNode("Account", "/account", "profile", "Your account"),
  ],

  blog: (input) => [
    createNode("Home", "/", "home", `Welcome to ${input.projectName}`),
    createNode("Blog", "/blog", "list", "All blog posts"),
    createNode("About", "/about", "landing", "About the author"),
    createNode("Contact", "/contact", "form", "Get in touch"),
  ],

  dashboard: (input) => [
    createNode("Dashboard", "/", "dashboard", `${input.projectName} Dashboard`),
    createNode("Users", "/users", "list", "User management"),
    createNode("Settings", "/settings", "settings", "System settings"),
  ],

  portfolio: (input) => [
    createNode("Home", "/", "home", `${input.projectName} Portfolio`),
    createNode("Portfolio", "/portfolio", "list", "My projects", [
      createNode("Project", "/portfolio/[slug]", "detail", "Project case study"),
    ]),
    createNode("About Us", "/about", "landing", "About our firm"),
    createNode("Contact", "/contact", "form", "Get in touch"),
  ],

  architecture: (input) => [
    createNode("Home", "/", "home", `${input.projectName} - Architecture built for living`, [
      createNode("Portfolio", "/portfolio", "list", "Featured projects"),
      createNode("About Us", "/about", "landing", "About our firm"),
      createNode("Contact", "/contact", "form", "Get in touch"),
    ]),
  ],
};

function detectTemplate(input: SitemapGeneratorInput): string {
  const description = input.projectDescription.toLowerCase();
  const features = input.features?.join(" ").toLowerCase() || "";
  const combined = `${description} ${features} ${input.industry || ""}`.toLowerCase();

  if (combined.includes("architect") || combined.includes("boutique") || combined.includes("firm") || combined.includes("design studio")) {
    return "architecture";
  }
  if (combined.includes("shop") || combined.includes("ecommerce") || combined.includes("store") || combined.includes("product")) {
    return "ecommerce";
  }
  if (combined.includes("blog") || combined.includes("article") || combined.includes("post") || combined.includes("content")) {
    return "blog";
  }
  if (combined.includes("dashboard") || combined.includes("admin") || combined.includes("management")) {
    return "dashboard";
  }
  if (combined.includes("portfolio") || combined.includes("personal") || combined.includes("showcase")) {
    return "portfolio";
  }
  return "saas";
}

function createDefaultStyleGuide(): StyleGuide {
  return {
    id: generateId(),
    colors: {
      neutrals: [
        { id: generateId(), name: "White", hex: "#FFFFFF" },
        { id: generateId(), name: "Light Gray", hex: "#F5F5F5" },
        { id: generateId(), name: "Gray", hex: "#A3A3A3" },
        { id: generateId(), name: "Dark Gray", hex: "#525252" },
        { id: generateId(), name: "Black", hex: "#1A1A1A" },
      ],
      primary: [
        { id: generateId(), name: "Cello", hex: "#1F4E5F", isMain: true },
        { id: generateId(), name: "Copper", hex: "#C76E3E" },
        { id: generateId(), name: "Tacha", hex: "#D9C166" },
        { id: generateId(), name: "Bay Leaf", hex: "#7BB583" },
      ],
      accent: [
        { id: generateId(), name: "Accent", hex: "#3B82F6" },
      ],
    },
    typography: {
      headingFont: "Fraunces",
      bodyFont: "Inter",
      scale: "large",
    },
    uiStyle: {
      borderRadius: "medium",
      buttonStyle: "solid",
      cardStyle: "elevated",
      spacing: "comfortable",
    },
  };
}

export async function generateSitemap(input: SitemapGeneratorInput): Promise<Sitemap> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const template = detectTemplate(input);
  const nodes = templateSitemaps[template](input);

  // Process nodes to add IDs and parent references
  function processNodes(nodes: SitemapNode[], parentId: string | null = null): SitemapNode[] {
    return nodes.map((node) => {
      const newId = generateId();
      return {
        ...node,
        id: newId,
        parentId,
        children: processNodes(node.children, newId),
      };
    });
  }

  const processedNodes = processNodes(nodes);

  return {
    id: generateId(),
    name: input.projectName,
    description: input.projectDescription,
    nodes: processedNodes,
    styleGuide: createDefaultStyleGuide(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function generatePageCode(node: SitemapNode): Promise<string> {
  // Simulate AI code generation delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const sectionImports = node.sections.map((s) =>
    `import { ${s.type.charAt(0).toUpperCase() + s.type.slice(1)}Section } from "@/components/sections/${s.type}";`
  ).join("\n");

  const sectionUsage = node.sections.map((s) =>
    `      <${s.type.charAt(0).toUpperCase() + s.type.slice(1)}Section />`
  ).join("\n");

  const code = `"use client";

${sectionImports}

export default function ${node.name.replace(/\s+/g, "")}Page() {
  return (
    <div className="min-h-screen">
      {/* ${node.name} - ${node.description} */}
${sectionUsage}
    </div>
  );
}
`;

  return code;
}
