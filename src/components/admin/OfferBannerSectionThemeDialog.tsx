import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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

export interface OfferBannerSectionTheme {
  section_height: "small" | "medium" | "large";
  auto_slide_speed: number;
  section_padding: "small" | "medium" | "large";
  overlay_enabled: boolean;
  overlay_color: string;
  overlay_opacity: number;
  content_position: "left" | "center" | "right";
}

const defaultTheme: OfferBannerSectionTheme = {
  section_height: "medium",
  auto_slide_speed: 5,
  section_padding: "medium",
  overlay_enabled: true,
  overlay_color: "#000000",
  overlay_opacity: 50,
  content_position: "left",
};

interface OfferBannerSectionThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OfferBannerSectionThemeDialog = ({
  open,
  onOpenChange,
}: OfferBannerSectionThemeDialogProps) => {
  const [theme, setTheme] = useState<OfferBannerSectionTheme>(defaultTheme);
  const [sectionTitle, setSectionTitle] = useState("Featured Offer");
  const { data: savedTheme } = useSiteSetting<OfferBannerSectionTheme>("offer_banner_theme");
  const { titles, updateTitle } = useSectionTitles();
  const updateSetting = useUpdateSiteSetting();

  useEffect(() => {
    if (savedTheme) {
      setTheme({
        section_height: savedTheme.section_height || "medium",
        auto_slide_speed: savedTheme.auto_slide_speed ?? 5,
        section_padding: savedTheme.section_padding || "medium",
        overlay_enabled: savedTheme.overlay_enabled ?? true,
        overlay_color: savedTheme.overlay_color || "#000000",
        overlay_opacity: savedTheme.overlay_opacity ?? 50,
        content_position: savedTheme.content_position || "left",
      });
    }
  }, [savedTheme]);

  useEffect(() => {
    if (titles.offersBanner) {
      setSectionTitle(titles.offersBanner);
    }
  }, [titles]);

  const handleSave = async () => {
    await updateSetting.mutateAsync({
      key: "offer_banner_theme",
      value: theme as unknown as Record<string, unknown>,
      category: "homepage",
    });
    await updateTitle("offersBanner", sectionTitle);
    onOpenChange(false);
  };

  const getHeightLabel = (height: string) => {
    switch (height) {
      case "small": return "250px";
      case "medium": return "350px";
      case "large": return "450px";
      default: return "350px";
    }
  };

  const getPaddingLabel = (padding: string) => {
    switch (padding) {
      case "small": return "py-4";
      case "medium": return "py-8";
      case "large": return "py-12";
      default: return "py-8";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Offers Banner Theme
          </DialogTitle>
          <DialogDescription>
            Configure the Offers Banner carousel section settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section Title */}
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Featured Offer"
            />
            <p className="text-xs text-muted-foreground">
              The heading displayed for this section on the homepage
            </p>
          </div>
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

          {/* Section Height */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Banner Height</Label>
              <span className="text-sm text-muted-foreground">
                {getHeightLabel(theme.section_height)}
              </span>
            </div>
            <ToggleGroup
              type="single"
              value={theme.section_height}
              onValueChange={(value) =>
                value && setTheme({ ...theme, section_height: value as "small" | "medium" | "large" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="small" className="flex-1">Small</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1">Medium</ToggleGroupItem>
              <ToggleGroupItem value="large" className="flex-1">Large</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Auto Slide Speed */}
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

          {/* Content Position */}
          <div className="space-y-2">
            <Label>Content Position</Label>
            <ToggleGroup
              type="single"
              value={theme.content_position}
              onValueChange={(value) =>
                value && setTheme({ ...theme, content_position: value as "left" | "center" | "right" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="left" className="flex-1">Left</ToggleGroupItem>
              <ToggleGroupItem value="center" className="flex-1">Center</ToggleGroupItem>
              <ToggleGroupItem value="right" className="flex-1">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Overlay Settings */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <Label>Gradient Overlay</Label>
              <Switch
                checked={theme.overlay_enabled}
                onCheckedChange={(checked) => setTheme({ ...theme, overlay_enabled: checked })}
              />
            </div>
            
            {theme.overlay_enabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm">Overlay Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.overlay_color}
                      onChange={(e) => setTheme({ ...theme, overlay_color: e.target.value })}
                      className="w-12 h-9 p-1 cursor-pointer"
                    />
                    <Input
                      value={theme.overlay_color}
                      onChange={(e) => setTheme({ ...theme, overlay_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-sm">Overlay Opacity</Label>
                    <span className="text-sm text-muted-foreground">{theme.overlay_opacity}%</span>
                  </div>
                  <Slider
                    value={[theme.overlay_opacity]}
                    onValueChange={([value]) => setTheme({ ...theme, overlay_opacity: value })}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg overflow-hidden">
              <div 
                className="relative bg-gradient-to-r from-primary/20 to-secondary/20"
                style={{ height: theme.section_height === "small" ? "80px" : theme.section_height === "large" ? "120px" : "100px" }}
              >
                {theme.overlay_enabled && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to ${theme.content_position === "right" ? "left" : "right"}, ${theme.overlay_color}${Math.round(theme.overlay_opacity * 2.55).toString(16).padStart(2, '0')}, transparent)`
                    }}
                  />
                )}
                <div 
                  className={`absolute inset-0 flex items-center ${
                    theme.content_position === "center" ? "justify-center text-center" : 
                    theme.content_position === "right" ? "justify-end text-right" : "justify-start"
                  }`}
                >
                  <div className="px-4">
                    <div className="text-xs font-semibold text-foreground">Sample Title</div>
                    <div className="text-[10px] text-muted-foreground">Subtitle text</div>
                  </div>
                </div>
              </div>
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
