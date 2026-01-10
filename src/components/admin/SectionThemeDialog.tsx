import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
  columns?: number;
  auto_slide?: boolean;
  auto_slide_speed?: number;
  // Scroll settings for horizontal scroll sections (categories)
  scroll_snap?: boolean;
  scroll_smooth?: boolean;
  visible_items_at_once?: number;
  // Title to items padding (for categories)
  title_to_items_padding?: number;
}

const defaultTheme: SectionTheme = {
  section_padding: "medium",
  items_to_show: 8,
  columns: 4,
  auto_slide: false,
  auto_slide_speed: 5,
  scroll_snap: true,
  scroll_smooth: true,
  visible_items_at_once: 4,
  title_to_items_padding: 48,
};

interface SectionConfig {
  title: string;
  description: string;
  settingKey: string;
  titleKey?: string;
  defaultTitle?: string;
  showColumns?: boolean;
  showAutoSlide?: boolean;
  showScrollSettings?: boolean;
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
    visible_items_at_once: config.showScrollSettings ? 4 : undefined,
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
        scroll_snap: savedTheme.scroll_snap ?? true,
        scroll_smooth: savedTheme.scroll_smooth ?? true,
        visible_items_at_once: savedTheme.visible_items_at_once ?? 4,
        title_to_items_padding: savedTheme.title_to_items_padding ?? 48,
      });
    }
  }, [savedTheme, config.defaultItems, config.defaultColumns]);

  useEffect(() => {
    if (config.titleKey && titles[config.titleKey as keyof typeof titles]) {
      setSectionTitle(titles[config.titleKey as keyof typeof titles]);
    }
  }, [titles, config.titleKey]);

  const handleSave = async () => {
    // Prepare theme value - exclude columns if showColumns is false
    const themeValue = { ...theme };
    if (config.showColumns === false) {
      delete themeValue.columns;
    }
    // Exclude scroll settings and title padding if not applicable
    if (!config.showScrollSettings) {
      delete themeValue.scroll_snap;
      delete themeValue.scroll_smooth;
      delete themeValue.visible_items_at_once;
      delete themeValue.title_to_items_padding;
    }
    
    // Save theme settings
    await updateSetting.mutateAsync({
      key: config.settingKey,
      value: themeValue as unknown as Record<string, unknown>,
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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

          {/* Title to Items Padding (for categories) */}
          {config.showScrollSettings && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <Label>Title to Items Padding</Label>
                <span className="text-sm text-muted-foreground">
                  {theme.title_to_items_padding ?? 48}px
                </span>
              </div>
              <Slider
                value={[theme.title_to_items_padding ?? 48]}
                onValueChange={([value]) => setTheme({ ...theme, title_to_items_padding: value })}
                min={24}
                max={96}
                step={4}
              />
              <p className="text-xs text-muted-foreground">
                Spacing between section title and category items
              </p>
            </div>
          )}

          {/* Scroll Settings (for horizontal scroll sections like categories) */}
          {config.showScrollSettings && (
            <>
              <div className="space-y-4 border-t pt-4">
                <Label>Scroll Behavior</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scroll-snap" className="text-sm font-normal">Scroll Snap</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable snap-to-item scrolling for better navigation
                      </p>
                    </div>
                    <Switch
                      id="scroll-snap"
                      checked={theme.scroll_snap ?? true}
                      onCheckedChange={(checked) => setTheme({ ...theme, scroll_snap: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scroll-smooth" className="text-sm font-normal">Smooth Scrolling</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable smooth scrolling animations
                      </p>
                    </div>
                    <Switch
                      id="scroll-smooth"
                      checked={theme.scroll_smooth ?? true}
                      onCheckedChange={(checked) => setTheme({ ...theme, scroll_smooth: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <Label>Visible Items at Once</Label>
                    <span className="text-sm text-muted-foreground">
                      {theme.visible_items_at_once ?? 4} items
                    </span>
                  </div>
                  <Slider
                    value={[theme.visible_items_at_once ?? 4]}
                    onValueChange={([value]) => setTheme({ ...theme, visible_items_at_once: value })}
                    min={2}
                    max={6}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of items visible in the viewport before scrolling
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Preview - Horizontal Scroll for categories, Grid for others */}
          <div className="space-y-2 border-t pt-4">
            <Label>Preview</Label>
            {config.showScrollSettings ? (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="relative max-w-full">
                  <div 
                    className="flex gap-3 overflow-x-auto scrollbar-hide max-h-28"
                    style={{ 
                      scrollBehavior: theme.scroll_smooth !== false ? 'smooth' : 'auto',
                      scrollSnapType: theme.scroll_snap !== false ? 'x mandatory' : 'none'
                    }}
                  >
                    {Array.from({ length: Math.min(theme.items_to_show, 12) }).map((_, i) => (
                      <div 
                        key={i}
                        className="flex-shrink-0 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary border-2 border-primary/40 shadow-sm"
                        style={{ 
                          scrollSnapAlign: theme.scroll_snap !== false ? 'start' : 'none',
                          minWidth: '4rem'
                        }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-center">
                    {theme.items_to_show} total items
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/40"></span>
                      {theme.visible_items_at_once ?? 4} visible at once
                    </span>
                    <span>•</span>
                    <span>Horizontal scroll</span>
                  </div>
                  {theme.scroll_snap !== false && (
                    <p className="text-xs text-muted-foreground text-center italic">
                      Snap scrolling enabled
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div 
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${Math.min(theme.columns || 4, 6)}, 1fr)` }}
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
                  {theme.items_to_show} items in {theme.columns || 4} columns
                </p>
              </div>
            )}
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
    description: "Configure the categories horizontal scroll layout",
    settingKey: "categories_theme",
    titleKey: "categories",
    defaultTitle: "Shop By Category",
    showColumns: false,
    showScrollSettings: true,
    minItems: 4,
    maxItems: 12,
    defaultItems: 8,
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
