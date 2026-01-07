import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useUpdateSiteSetting, useSiteSetting } from "@/hooks/useSiteSettings";
import { useSectionTitles } from "@/hooks/useSectionTitles";

export interface SectionTheme {
  section_padding: "small" | "medium" | "large";
  items_to_show: number;
  columns: number;
  auto_slide: boolean;
  auto_slide_speed: number;
}

const defaultTheme: SectionTheme = {
  section_padding: "medium",
  items_to_show: 8,
  columns: 4,
  auto_slide: false,
  auto_slide_speed: 5,
};

interface SectionConfig {
  title: string;
  description: string;
  settingKey: string;
  titleKey?: string;
  defaultTitle?: string;
  showColumns?: boolean;
  showAutoSlide?: boolean;
  minItems?: number;
  maxItems?: number;
  maxColumns?: number;
  defaultItems?: number;
  defaultColumns?: number;
}

interface SectionThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SectionConfig;
}

export const SectionThemeDialog = ({
  open,
  onOpenChange,
  config,
}: SectionThemeDialogProps) => {
  const [theme, setTheme] = useState<SectionTheme>({
    ...defaultTheme,
    items_to_show: config.defaultItems || 8,
    columns: config.defaultColumns || 4,
  });
  const [sectionTitle, setSectionTitle] = useState(config.defaultTitle || "");
  const { data: savedTheme } = useSiteSetting<SectionTheme>(config.settingKey);
  const { titles, updateTitle } = useSectionTitles();
  const updateSetting = useUpdateSiteSetting();

  useEffect(() => {
    if (savedTheme) {
      setTheme({
        section_padding: savedTheme.section_padding || "medium",
        items_to_show: savedTheme.items_to_show ?? config.defaultItems ?? 8,
        columns: savedTheme.columns ?? config.defaultColumns ?? 4,
        auto_slide: savedTheme.auto_slide ?? false,
        auto_slide_speed: savedTheme.auto_slide_speed ?? 5,
      });
    }
  }, [savedTheme, config.defaultItems, config.defaultColumns]);

  useEffect(() => {
    if (config.titleKey && titles[config.titleKey as keyof typeof titles]) {
      setSectionTitle(titles[config.titleKey as keyof typeof titles]);
    }
  }, [titles, config.titleKey]);

  const handleSave = async () => {
    // Save theme settings
    await updateSetting.mutateAsync({
      key: config.settingKey,
      value: theme as unknown as Record<string, unknown>,
      category: "homepage",
    });
    // Save section title if titleKey is provided
    if (config.titleKey) {
      await updateTitle(config.titleKey, sectionTitle);
    }
    onOpenChange(false);
  };

  const getPaddingLabel = (padding: string) => {
    switch (padding) {
      case "small": return "32px";
      case "medium": return "48px";
      case "large": return "64px";
      default: return "48px";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section Title */}
          {config.titleKey && (
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder={config.defaultTitle || "Section Title"}
              />
              <p className="text-xs text-muted-foreground">
                The heading displayed for this section on the homepage
              </p>
            </div>
          )}
          {/* Section Padding */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Section Padding</Label>
              <span className="text-sm text-muted-foreground">
                {getPaddingLabel(theme.section_padding)}
              </span>
            </div>
            <ToggleGroup
              type="single"
              value={theme.section_padding}
              onValueChange={(value) =>
                value && setTheme({ ...theme, section_padding: value as "small" | "medium" | "large" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="small" className="flex-1">Small</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1">Medium</ToggleGroupItem>
              <ToggleGroupItem value="large" className="flex-1">Large</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Items to Show */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Items to Display</Label>
              <span className="text-sm text-muted-foreground">
                {theme.items_to_show} items
              </span>
            </div>
            <Slider
              value={[theme.items_to_show]}
              onValueChange={([value]) => setTheme({ ...theme, items_to_show: value })}
              min={config.minItems || 4}
              max={config.maxItems || 16}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Number of items visible at once (remaining accessible via navigation)
            </p>
          </div>

          {/* Columns */}
          {config.showColumns !== false && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Grid Columns</Label>
                <span className="text-sm text-muted-foreground">
                  {theme.columns} columns
                </span>
              </div>
              <Slider
                value={[theme.columns]}
                onValueChange={([value]) => setTheme({ ...theme, columns: value })}
                min={2}
                max={config.maxColumns || 6}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Number of columns on desktop (auto-adjusts for mobile)
              </p>
            </div>
          )}

          {/* Auto Slide (for carousel sections) */}
          {config.showAutoSlide && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Auto-Slide Speed</Label>
                <span className="text-sm text-muted-foreground">
                  {theme.auto_slide_speed} seconds
                </span>
              </div>
              <Slider
                value={[theme.auto_slide_speed]}
                onValueChange={([value]) => setTheme({ ...theme, auto_slide_speed: value })}
                min={3}
                max={15}
                step={1}
              />
            </div>
          )}

          {/* Preview Grid */}
          <div className="space-y-2">
            <Label>Preview Grid</Label>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(theme.columns, 6)}, 1fr)` }}
              >
                {Array.from({ length: Math.min(theme.items_to_show, 12) }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-primary/20 rounded flex items-center justify-center text-xs text-muted-foreground"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {theme.items_to_show} items in {theme.columns} columns
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateSetting.isPending}>
            {updateSetting.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Predefined section configurations
export const sectionConfigs: Record<string, SectionConfig> = {
  categories: {
    title: "Categories Section Theme",
    description: "Configure the categories grid layout",
    settingKey: "categories_theme",
    titleKey: "categories",
    defaultTitle: "Shop By Category",
    showColumns: true,
    minItems: 4,
    maxItems: 12,
    maxColumns: 6,
    defaultItems: 8,
    defaultColumns: 4,
  },
  offers: {
    title: "Special Offers Section Theme",
    description: "Configure the special offers grid layout",
    settingKey: "offers_theme",
    titleKey: "offers",
    defaultTitle: "Special Offers",
    showColumns: true,
    minItems: 2,
    maxItems: 8,
    maxColumns: 4,
    defaultItems: 4,
    defaultColumns: 2,
  },
  new_arrivals: {
    title: "New Arrivals Section Theme",
    description: "Configure the new arrivals product grid",
    settingKey: "new_arrivals_theme",
    titleKey: "newArrivals",
    defaultTitle: "New Arrivals",
    showColumns: true,
    minItems: 4,
    maxItems: 16,
    maxColumns: 5,
    defaultItems: 8,
    defaultColumns: 4,
  },
  best_sellers: {
    title: "Best Sellers Section Theme",
    description: "Configure the best sellers product grid",
    settingKey: "best_sellers_theme",
    titleKey: "bestSellers",
    defaultTitle: "Best Sellers",
    showColumns: true,
    minItems: 4,
    maxItems: 16,
    maxColumns: 5,
    defaultItems: 8,
    defaultColumns: 4,
  },
  celebrity_specials: {
    title: "Celebrity Specials Section Theme",
    description: "Configure the celebrity specials product grid",
    settingKey: "celebrity_specials_theme",
    titleKey: "celebritySpecials",
    defaultTitle: "Celebrity Specials",
    showColumns: true,
    minItems: 4,
    maxItems: 16,
    maxColumns: 5,
    defaultItems: 8,
    defaultColumns: 4,
  },
  testimonials: {
    title: "Testimonials Section Theme",
    description: "Configure the testimonials carousel",
    settingKey: "testimonials_theme",
    titleKey: "testimonials",
    defaultTitle: "Our Happy Customers",
    showColumns: true,
    showAutoSlide: true,
    minItems: 3,
    maxItems: 10,
    maxColumns: 3,
    defaultItems: 6,
    defaultColumns: 3,
  },
};
