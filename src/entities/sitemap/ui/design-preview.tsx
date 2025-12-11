"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut } from "lucide-react";
import { Button, Card, ScrollArea, Badge } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SitemapNode, StyleGuide, PageSection, SectionType } from "../model";

interface DesignPreviewProps {
  nodes: SitemapNode[];
  styleGuide: StyleGuide;
  selectedNodeId?: string;
  onSelectNode?: (node: SitemapNode) => void;
  className?: string;
}

type ViewMode = "desktop" | "tablet" | "mobile";

// Styled section renderers with actual design
function StyledSection({
  section,
  styleGuide,
  viewMode,
}: {
  section: PageSection;
  styleGuide: StyleGuide;
  viewMode: ViewMode;
}) {
  const isMobile = viewMode === "mobile";
  const mainColor = styleGuide.colors.primary.find((c) => c.isMain)?.hex || "#1F4E5F";
  const headingFont = styleGuide.typography.headingFont;
  const bodyFont = styleGuide.typography.bodyFont;

  const sectionRenderers: Record<SectionType, () => React.ReactNode> = {
    navbar: () => (
      <div className="flex items-center justify-between p-4 border-b">
        <div className="font-bold text-lg" style={{ fontFamily: headingFont }}>
          Logo
        </div>
        <div className={cn("flex items-center gap-6", isMobile && "hidden")}>
          {["Portfolio", "About us", "Services"].map((item) => (
            <span
              key={item}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              style={{ fontFamily: bodyFont }}
            >
              {item}
            </span>
          ))}
        </div>
        <Button size="sm" style={{ backgroundColor: mainColor }} className="text-white">
          Contact
        </Button>
      </div>
    ),
    hero: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className={cn("font-bold mb-4", isMobile ? "text-3xl" : "text-5xl")}
            style={{ fontFamily: headingFont }}
          >
            Architecture built for living
          </h1>
          <p
            className="text-muted-foreground mb-8 text-lg"
            style={{ fontFamily: bodyFont }}
          >
            Gretta designs homes and spaces that matter. We build what endures.
          </p>
          <div className="flex justify-center gap-4">
            <Button style={{ backgroundColor: mainColor }} className="text-white">
              Portfolio
            </Button>
            <Button variant="outline">Contact</Button>
          </div>
        </div>
        <div
          className={cn(
            "mt-12 rounded-lg overflow-hidden",
            isMobile ? "aspect-video" : "aspect-[16/7]"
          )}
        >
          <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-100 to-amber-50 flex items-end justify-center">
            <div className="w-2/3 h-3/4 bg-gradient-to-t from-amber-200/50 to-transparent rounded-t-lg" />
          </div>
        </div>
      </div>
    ),
    features: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: bodyFont }}>
            Three disciplines, one vision
          </p>
          <h2
            className={cn("font-bold", isMobile ? "text-2xl" : "text-3xl")}
            style={{ fontFamily: headingFont }}
          >
            What we do
          </h2>
        </div>
        <div className={cn("grid gap-8", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          {[
            { icon: "🏠", title: "Residential architecture", desc: "Custom homes designed for your lifestyle" },
            { icon: "🏢", title: "Commercial projects", desc: "Spaces that inspire productivity" },
            { icon: "🌳", title: "Community work", desc: "Building better neighborhoods" },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: headingFont }}>
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFont }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
    about: () => (
      <div className={cn("py-16 px-8 bg-muted/30", isMobile && "py-8 px-4")}>
        <div className={cn("flex gap-12 items-center", isMobile && "flex-col")}>
          <div className={cn("flex-1", isMobile && "order-2")}>
            <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: bodyFont }}>
              Built on craft and honest intention
            </p>
            <h2
              className={cn("font-bold mb-4", isMobile ? "text-2xl" : "text-3xl")}
              style={{ fontFamily: headingFont }}
            >
              About our firm
            </h2>
            <p className="text-muted-foreground mb-6" style={{ fontFamily: bodyFont }}>
              We believe architecture should serve the people who use it. Our approach combines
              traditional craftsmanship with modern innovation.
            </p>
            <Button variant="outline">Learn more</Button>
          </div>
          <div className={cn("rounded-lg overflow-hidden", isMobile ? "w-full" : "w-1/2")}>
            <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-50" />
          </div>
        </div>
      </div>
    ),
    services: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Our Services
        </h2>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${mainColor}20` }}
              >
                <span style={{ color: mainColor }}>✦</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: headingFont }}>
                Service {i}
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFont }}>
                Description of service {i} goes here.
              </p>
            </Card>
          ))}
        </div>
      </div>
    ),
    testimonials: () => (
      <div className={cn("py-16 px-8 bg-muted/30", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Client voices
        </h2>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4" style={{ fontFamily: bodyFont }}>
                "Working with this team was an incredible experience. They truly understood our vision."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div>
                  <p className="font-medium text-sm" style={{ fontFamily: headingFont }}>
                    Client Name
                  </p>
                  <p className="text-xs text-muted-foreground">Position, Company</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
    team: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Meet our team
        </h2>
        <div className={cn("grid gap-8", isMobile ? "grid-cols-2" : "grid-cols-4")}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
              <h3 className="font-semibold" style={{ fontFamily: headingFont }}>
                Team Member
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFont }}>
                Position
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
    gallery: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Recent work
        </h2>
        <div className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-4")}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    ),
    portfolio: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Our Portfolio
        </h2>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted" />
              <div className="p-4">
                <h3 className="font-semibold" style={{ fontFamily: headingFont }}>
                  Project {i}
                </h3>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFont }}>
                  Brief project description
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
    pricing: () => (
      <div className={cn("py-16 px-8 bg-muted/30", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Pricing
        </h2>
        <div className={cn("grid gap-6 max-w-4xl mx-auto", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          {["Basic", "Pro", "Enterprise"].map((plan) => (
            <Card key={plan} className="p-6 text-center">
              <h3 className="font-semibold mb-2" style={{ fontFamily: headingFont }}>
                {plan}
              </h3>
              <p className="text-3xl font-bold mb-4">$99</p>
              <Button
                className="w-full"
                style={plan === "Pro" ? { backgroundColor: mainColor } : {}}
                variant={plan === "Pro" ? "default" : "outline"}
              >
                Get started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    ),
    faq: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          FAQ
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <h3 className="font-medium" style={{ fontFamily: headingFont }}>
                Question {i}?
              </h3>
            </Card>
          ))}
        </div>
      </div>
    ),
    contact: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <div className={cn("grid gap-12", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <div>
            <h2
              className={cn("font-bold mb-4", isMobile ? "text-2xl" : "text-3xl")}
              style={{ fontFamily: headingFont }}
            >
              Get in touch
            </h2>
            <p className="text-muted-foreground mb-8" style={{ fontFamily: bodyFont }}>
              We'd love to hear from you. Send us a message.
            </p>
            <div className="space-y-4">
              <input className="w-full p-3 border rounded-lg" placeholder="Your name" />
              <input className="w-full p-3 border rounded-lg" placeholder="Email" />
              <textarea className="w-full p-3 border rounded-lg h-32" placeholder="Message" />
              <Button style={{ backgroundColor: mainColor }} className="text-white">
                Send message
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted aspect-square" />
        </div>
      </div>
    ),
    cta: () => (
      <div
        className={cn("py-16 px-8 text-center", isMobile && "py-8 px-4")}
        style={{ backgroundColor: `${mainColor}10` }}
      >
        <h2
          className={cn("font-bold mb-4", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Ready to start something real
        </h2>
        <div className="flex justify-center gap-4">
          <Button style={{ backgroundColor: mainColor }} className="text-white">
            Get started
          </Button>
          <Button variant="outline">Contact us</Button>
        </div>
      </div>
    ),
    stats: () => (
      <div className={cn("py-16 px-8 bg-muted/30", isMobile && "py-8 px-4")}>
        <div className={cn("grid gap-8", isMobile ? "grid-cols-2" : "grid-cols-4")}>
          {[
            { value: "100+", label: "Projects" },
            { value: "50+", label: "Clients" },
            { value: "15", label: "Years" },
            { value: "10", label: "Awards" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={cn("font-bold", isMobile ? "text-3xl" : "text-4xl")}
                style={{ color: mainColor, fontFamily: headingFont }}
              >
                {stat.value}
              </p>
              <p className="text-muted-foreground" style={{ fontFamily: bodyFont }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
    logos: () => (
      <div className="py-8 px-8 border-y">
        <div className={cn("flex items-center justify-center gap-8 flex-wrap", isMobile && "gap-4")}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-24 h-8 bg-muted/50 rounded" />
          ))}
        </div>
      </div>
    ),
    blog: () => (
      <div className={cn("py-16 px-8", isMobile && "py-8 px-4")}>
        <h2
          className={cn("font-bold text-center mb-12", isMobile ? "text-2xl" : "text-3xl")}
          style={{ fontFamily: headingFont }}
        >
          Latest from our blog
        </h2>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted" />
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-2">Category • Date</p>
                <h3 className="font-semibold" style={{ fontFamily: headingFont }}>
                  Blog Post Title
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
    footer: () => (
      <div className="py-12 px-8 bg-muted/50 border-t">
        <div className={cn("grid gap-8 mb-8", isMobile ? "grid-cols-2" : "grid-cols-4")}>
          <div>
            <div className="font-bold text-lg mb-4" style={{ fontFamily: headingFont }}>
              Logo
            </div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFont }}>
              Architecture built for living.
            </p>
          </div>
          {["Company", "Resources", "Legal"].map((col) => (
            <div key={col}>
              <h4 className="font-semibold mb-3" style={{ fontFamily: headingFont }}>
                {col}
              </h4>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <p
                    key={i}
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: bodyFont }}
                  >
                    Link {i}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          © 2024 Company. All rights reserved.
        </div>
      </div>
    ),
    custom: () => (
      <div className="py-16 px-8 text-center">
        <p className="text-muted-foreground">Custom section</p>
      </div>
    ),
  };

  return <>{sectionRenderers[section.type]()}</>;
}

function PageDesign({
  node,
  styleGuide,
  viewMode,
  isSelected,
  onClick,
}: {
  node: SitemapNode;
  styleGuide: StyleGuide;
  viewMode: ViewMode;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const widthClasses = {
    desktop: "w-full max-w-[900px]",
    tablet: "w-[600px]",
    mobile: "w-[320px]",
  };

  return (
    <div
      className={cn(
        "cursor-pointer transition-transform hover:scale-[1.01]",
        isSelected && "ring-2 ring-primary rounded-lg"
      )}
      onClick={onClick}
    >
      <Card className={cn("overflow-hidden", widthClasses[viewMode])}>
        {/* Browser chrome */}
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

        {/* Page content */}
        <div className="bg-background">
          {node.sections.map((section) => (
            <StyledSection
              key={section.id}
              section={section}
              styleGuide={styleGuide}
              viewMode={viewMode}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function DesignPreview({
  nodes,
  styleGuide,
  selectedNodeId,
  onSelectNode,
  className,
}: DesignPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [zoom, setZoom] = useState(100);

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
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {(["desktop", "tablet", "mobile"] as ViewMode[]).map((mode) => {
            const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone };
            const Icon = icons[mode];
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

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Design previews */}
      <ScrollArea className="flex-1 bg-muted/30">
        <div
          className="p-8 min-h-full"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          <div className="flex flex-wrap gap-8 justify-center">
            {allNodes.map((node) => (
              <PageDesign
                key={node.id}
                node={node}
                styleGuide={styleGuide}
                viewMode={viewMode}
                isSelected={selectedNodeId === node.id}
                onClick={() => onSelectNode?.(node)}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
