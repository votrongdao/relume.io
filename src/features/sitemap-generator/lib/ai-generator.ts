import type { SitemapNode, SitemapGeneratorInput, PageType, Sitemap } from "@/entities/sitemap";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
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
    meta: {
      components: getDefaultComponents(pageType),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function getDefaultComponents(pageType: PageType): string[] {
  const componentMap: Record<PageType, string[]> = {
    home: ["Hero", "Features", "Testimonials", "CTA", "Footer"],
    landing: ["Hero", "Benefits", "Features", "Pricing", "FAQ", "CTA"],
    dashboard: ["StatsCards", "Charts", "RecentActivity", "QuickActions"],
    list: ["SearchBar", "FilterSidebar", "DataTable", "Pagination"],
    detail: ["Breadcrumb", "Header", "Content", "RelatedItems"],
    form: ["FormHeader", "FormFields", "FormActions", "ValidationMessages"],
    settings: ["SettingsSidebar", "SettingsSection", "ToggleOptions"],
    profile: ["Avatar", "ProfileHeader", "ProfileTabs", "ActivityFeed"],
    auth: ["AuthCard", "SocialLogin", "FormFields", "Links"],
    error: ["ErrorIcon", "ErrorMessage", "ActionButtons"],
    empty: ["EmptyIcon", "EmptyMessage", "ActionButton"],
    custom: ["Header", "Content", "Footer"],
  };
  return componentMap[pageType] || componentMap.custom;
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
    createNode("Auth", "/auth", "auth", "Authentication pages", [
      createNode("Login", "/auth/login", "auth", "Sign in to your account"),
      createNode("Register", "/auth/register", "auth", "Create new account"),
      createNode("Forgot Password", "/auth/forgot-password", "auth", "Reset your password"),
    ]),
    createNode("Dashboard", "/dashboard", "dashboard", "Main dashboard", [
      createNode("Overview", "/dashboard/overview", "dashboard", "Dashboard overview"),
      createNode("Analytics", "/dashboard/analytics", "dashboard", "View analytics"),
      createNode("Reports", "/dashboard/reports", "list", "View all reports"),
    ]),
    createNode("Settings", "/settings", "settings", "App settings", [
      createNode("Profile", "/settings/profile", "profile", "Edit your profile"),
      createNode("Account", "/settings/account", "settings", "Account settings"),
      createNode("Notifications", "/settings/notifications", "settings", "Notification preferences"),
    ]),
  ],

  ecommerce: (input) => [
    createNode("Home", "/", "home", `Welcome to ${input.projectName}`, [
      createNode("Shop", "/shop", "list", "Browse all products"),
      createNode("Categories", "/categories", "list", "Browse categories"),
      createNode("Deals", "/deals", "landing", "Special offers"),
    ]),
    createNode("Product", "/product", "detail", "Product pages", [
      createNode("Product Detail", "/product/[id]", "detail", "View product details"),
      createNode("Reviews", "/product/[id]/reviews", "list", "Product reviews"),
    ]),
    createNode("Cart", "/cart", "list", "Shopping cart"),
    createNode("Checkout", "/checkout", "form", "Complete purchase", [
      createNode("Shipping", "/checkout/shipping", "form", "Shipping information"),
      createNode("Payment", "/checkout/payment", "form", "Payment details"),
      createNode("Confirmation", "/checkout/confirmation", "detail", "Order confirmation"),
    ]),
    createNode("Account", "/account", "profile", "Your account", [
      createNode("Orders", "/account/orders", "list", "Order history"),
      createNode("Wishlist", "/account/wishlist", "list", "Saved items"),
      createNode("Settings", "/account/settings", "settings", "Account settings"),
    ]),
  ],

  blog: (input) => [
    createNode("Home", "/", "home", `Welcome to ${input.projectName}`),
    createNode("Blog", "/blog", "list", "All blog posts", [
      createNode("Post Detail", "/blog/[slug]", "detail", "Read blog post"),
      createNode("Categories", "/blog/category/[cat]", "list", "Posts by category"),
      createNode("Tags", "/blog/tag/[tag]", "list", "Posts by tag"),
    ]),
    createNode("About", "/about", "landing", "About the author"),
    createNode("Contact", "/contact", "form", "Get in touch"),
    createNode("Subscribe", "/subscribe", "form", "Subscribe to newsletter"),
  ],

  dashboard: (input) => [
    createNode("Dashboard", "/", "dashboard", `${input.projectName} Dashboard`, [
      createNode("Overview", "/overview", "dashboard", "Dashboard overview"),
      createNode("Analytics", "/analytics", "dashboard", "Detailed analytics"),
    ]),
    createNode("Users", "/users", "list", "User management", [
      createNode("User List", "/users/list", "list", "All users"),
      createNode("User Detail", "/users/[id]", "detail", "User profile"),
      createNode("Add User", "/users/new", "form", "Create new user"),
    ]),
    createNode("Projects", "/projects", "list", "Project management", [
      createNode("Project List", "/projects/list", "list", "All projects"),
      createNode("Project Detail", "/projects/[id]", "detail", "Project details"),
      createNode("Create Project", "/projects/new", "form", "New project"),
    ]),
    createNode("Settings", "/settings", "settings", "System settings", [
      createNode("General", "/settings/general", "settings", "General settings"),
      createNode("Security", "/settings/security", "settings", "Security settings"),
      createNode("Integrations", "/settings/integrations", "settings", "Third-party integrations"),
    ]),
  ],

  portfolio: (input) => [
    createNode("Home", "/", "home", `${input.projectName} Portfolio`),
    createNode("Work", "/work", "list", "My projects", [
      createNode("Project Detail", "/work/[slug]", "detail", "Project case study"),
    ]),
    createNode("About", "/about", "landing", "About me"),
    createNode("Services", "/services", "landing", "What I offer"),
    createNode("Contact", "/contact", "form", "Get in touch"),
    createNode("Blog", "/blog", "list", "My thoughts", [
      createNode("Post", "/blog/[slug]", "detail", "Blog post"),
    ]),
  ],
};

function detectTemplate(input: SitemapGeneratorInput): string {
  const description = input.projectDescription.toLowerCase();
  const features = input.features?.join(" ").toLowerCase() || "";
  const combined = `${description} ${features}`;

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

export async function generateSitemap(input: SitemapGeneratorInput): Promise<Sitemap> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const template = detectTemplate(input);
  const nodes = templateSitemaps[template](input);

  // Add IDs and parent references
  function processNodes(nodes: SitemapNode[], parentId: string | null = null): SitemapNode[] {
    return nodes.map((node) => ({
      ...node,
      id: generateId(),
      parentId,
      children: processNodes(node.children, node.id),
    }));
  }

  const processedNodes = processNodes(nodes);

  return {
    id: generateId(),
    name: input.projectName,
    description: input.projectDescription,
    nodes: processedNodes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function generatePageCode(node: SitemapNode): Promise<string> {
  // Simulate AI code generation delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const componentImports = node.meta?.components?.map((c) => `import { ${c} } from "@/components/${c.toLowerCase()}";`).join("\n") || "";

  const componentUsage = node.meta?.components?.map((c) => `      <${c} />`).join("\n") || "";

  const code = `"use client";

${componentImports}

export default function ${node.name.replace(/\s+/g, "")}Page() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">${node.name}</h1>
      <p className="text-muted-foreground mb-8">${node.description}</p>

      <div className="space-y-8">
${componentUsage}
      </div>
    </div>
  );
}
`;

  return code;
}
