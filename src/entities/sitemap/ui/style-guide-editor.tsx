"use client";

import { useState } from "react";
import { Sun, Moon, Shuffle, Plus, Check } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Badge,
  Separator,
  ScrollArea,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { StyleGuide, ColorPalette, TypographyConfig, UIStyleConfig } from "../model";

interface StyleGuideEditorProps {
  styleGuide: StyleGuide;
  onUpdate: (updates: Partial<StyleGuide>) => void;
  className?: string;
}

// Predefined color palettes
const colorPresets = {
  neutrals: [
    { id: "n1", name: "Neutrals", hex: "#1a1a1a", shades: ["#fafafa", "#e5e5e5", "#a3a3a3", "#525252", "#1a1a1a"] },
  ],
  primary: [
    { id: "p1", name: "Cello", hex: "#1F4E5F", isMain: true },
    { id: "p2", name: "Copper", hex: "#C76E3E", isMain: false },
    { id: "p3", name: "Tacha", hex: "#D9C166", isMain: false },
    { id: "p4", name: "Bay Leaf", hex: "#7BB583", isMain: false },
  ],
};

const fontOptions = {
  heading: ["Fraunces", "Playfair Display", "Inter", "Poppins", "Montserrat", "Roboto Slab"],
  body: ["Inter", "Open Sans", "Roboto", "Lato", "Source Sans Pro", "Nunito"],
};

const scaleOptions: { value: TypographyConfig["scale"]; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large - medium" },
];

function ColorSwatch({
  color,
  isSelected,
  onClick,
  size = "md",
}: {
  color: ColorPalette;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-full h-24",
  };

  return (
    <div
      className={cn(
        "rounded-lg cursor-pointer transition-all relative overflow-hidden",
        sizeClasses[size],
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      style={{ backgroundColor: color.hex }}
      onClick={onClick}
    >
      {color.isMain && (
        <div className="absolute bottom-1 right-1 bg-white/90 text-[10px] px-1 rounded">
          Main
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1">
        <div className="font-medium">{color.name}</div>
        <div className="opacity-70">{color.hex.toUpperCase()}</div>
      </div>
    </div>
  );
}

function ColorPaletteSection({
  title,
  colors,
  onShuffle,
  themeMode,
  onToggleTheme,
}: {
  title: string;
  colors: ColorPalette[];
  onShuffle?: () => void;
  themeMode?: "light" | "dark";
  onToggleTheme?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {themeMode !== undefined && (
            <>
              <Button
                variant={themeMode === "light" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onToggleTheme?.()}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={themeMode === "dark" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onToggleTheme?.()}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={onShuffle}>
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {colors.map((color) => (
          <ColorSwatch key={color.id} color={color} size="lg" />
        ))}
        <button className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

function TypographySection({
  typography,
  onUpdate,
}: {
  typography: TypographyConfig;
  onUpdate: (updates: Partial<TypographyConfig>) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Typography</h3>
        <div className="flex items-center gap-2">
          <select
            className="h-8 px-3 rounded-md border text-sm"
            value={typography.scale}
            onChange={(e) => onUpdate({ scale: e.target.value as TypographyConfig["scale"] })}
          >
            {scaleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Heading Font */}
        <Card>
          <CardContent className="pt-4">
            <Label className="text-xs text-muted-foreground">Heading</Label>
            <div
              className="text-3xl mt-2"
              style={{ fontFamily: typography.headingFont }}
            >
              {typography.headingFont}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-blue-500">G</span> Google
              </span>
              <span>Free</span>
            </div>
          </CardContent>
        </Card>

        {/* Body Font */}
        <Card>
          <CardContent className="pt-4">
            <Label className="text-xs text-muted-foreground">Body</Label>
            <div
              className="text-3xl mt-2"
              style={{ fontFamily: typography.bodyFont }}
            >
              {typography.bodyFont}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-blue-500">G</span> Google
              </span>
              <span>Free</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UIStylingSection({
  uiStyle,
  onUpdate,
}: {
  uiStyle: UIStyleConfig;
  onUpdate: (updates: Partial<UIStyleConfig>) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">UI Styling</h3>
        <Button variant="outline" size="sm">
          <Shuffle className="h-4 w-4 mr-2" />
          Shuffle
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Buttons & Forms */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Buttons & Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm">Button</Button>
              <Button size="sm" variant="outline">Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards & Images */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cards & Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="w-16 h-12 bg-muted rounded" />
              <div className="w-16 h-12 bg-muted rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LivePreview({ styleGuide }: { styleGuide: StyleGuide }) {
  const mainColor = styleGuide.colors.primary.find((c) => c.isMain)?.hex || "#1F4E5F";

  return (
    <Card className="sticky top-4">
      <div className="bg-muted/30 p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Portfolio</span>
            <span className="text-sm text-muted-foreground">About us</span>
            <span className="text-sm text-muted-foreground">Services</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Logo</span>
            <Button
              size="sm"
              style={{ backgroundColor: mainColor }}
              className="text-white"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: styleGuide.typography.headingFont }}
          >
            Architecture built
            <br />
            for living
          </h1>
          <p
            className="text-muted-foreground mb-6"
            style={{ fontFamily: styleGuide.typography.bodyFont }}
          >
            Gretta designs homes and spaces that matter. We build what endures.
          </p>
          <div className="flex justify-center gap-3">
            <Button style={{ backgroundColor: mainColor }} className="text-white">
              Portfolio
            </Button>
            <Button variant="outline">Contact</Button>
          </div>
        </div>

        <div className="mt-8 aspect-video bg-gradient-to-br from-orange-200 to-orange-100 rounded-lg" />
      </CardContent>

      <div className="p-3 border-t flex items-center justify-between">
        <Button variant="ghost" size="sm">
          <Shuffle className="h-4 w-4 mr-2" />
          Scheme shuffle
        </Button>
        <span className="text-xs text-muted-foreground">SPACE</span>
      </div>
    </Card>
  );
}

export function StyleGuideEditor({
  styleGuide,
  onUpdate,
  className,
}: StyleGuideEditorProps) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const handleColorsShuffle = () => {
    // Shuffle colors logic here
    console.log("Shuffle colors");
  };

  const handleTypographyUpdate = (updates: Partial<TypographyConfig>) => {
    onUpdate({
      typography: { ...styleGuide.typography, ...updates },
    });
  };

  const handleUIStyleUpdate = (updates: Partial<UIStyleConfig>) => {
    onUpdate({
      uiStyle: { ...styleGuide.uiStyle, ...updates },
    });
  };

  return (
    <div className={cn("grid grid-cols-12 gap-6 h-full", className)}>
      {/* Left Panel - Style Options */}
      <div className="col-span-7 overflow-auto">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-8 pb-8">
            {/* Colors */}
            <ColorPaletteSection
              title="Colors"
              colors={styleGuide.colors.primary}
              onShuffle={handleColorsShuffle}
              themeMode={themeMode}
              onToggleTheme={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
            />

            <Separator />

            {/* Typography */}
            <TypographySection
              typography={styleGuide.typography}
              onUpdate={handleTypographyUpdate}
            />

            <Separator />

            {/* UI Styling */}
            <UIStylingSection
              uiStyle={styleGuide.uiStyle}
              onUpdate={handleUIStyleUpdate}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="col-span-5">
        <LivePreview styleGuide={styleGuide} />
      </div>
    </div>
  );
}
