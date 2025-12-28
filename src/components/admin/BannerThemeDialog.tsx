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
import { Banner, useUpdateBanner } from "@/hooks/useBanners";

export interface BannerTheme {
  content_position: "left" | "center" | "right";
  overlay_opacity: number;
  overlay_color: string;
  edge_fade: boolean;
  button_shape: "rounded" | "box";
  image_fit: "cover" | "contain" | "fill";
  image_zoom: number;
}

const defaultTheme: BannerTheme = {
  content_position: "center",
  overlay_opacity: 40,
  overlay_color: "#000000",
  edge_fade: false,
  button_shape: "rounded",
  image_fit: "cover",
  image_zoom: 100,
};

interface BannerThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
}

export const BannerThemeDialog = ({
  open,
  onOpenChange,
  banner,
}: BannerThemeDialogProps) => {
  const [theme, setTheme] = useState<BannerTheme>(defaultTheme);
  const updateBanner = useUpdateBanner();

  useEffect(() => {
    if (banner?.theme) {
      const bannerTheme = banner.theme as unknown as BannerTheme;
      setTheme({
        content_position: bannerTheme.content_position || "center",
        overlay_opacity: bannerTheme.overlay_opacity ?? 40,
        overlay_color: bannerTheme.overlay_color || "#000000",
        edge_fade: bannerTheme.edge_fade || false,
        button_shape: bannerTheme.button_shape || "rounded",
        image_fit: bannerTheme.image_fit || "cover",
        image_zoom: bannerTheme.image_zoom ?? 100,
      });
    } else {
      setTheme(defaultTheme);
    }
  }, [banner]);

  const handleSave = async () => {
    if (!banner) return;
    await updateBanner.mutateAsync({
      id: banner.id,
      theme: theme as unknown as Record<string, unknown>,
    });
    onOpenChange(false);
  };

  const getContentPositionClasses = () => {
    switch (theme.content_position) {
      case "left":
        return "items-start text-left pl-8";
      case "right":
        return "items-end text-right pr-8";
      default:
        return "items-center text-center";
    }
  };

  // Convert hex to rgba for overlay
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Banner Theme - {banner?.title}
          </DialogTitle>
          <DialogDescription>
            Customize how this banner appears on the homepage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              <ToggleGroupItem value="left" className="flex-1">
                Left
              </ToggleGroupItem>
              <ToggleGroupItem value="center" className="flex-1">
                Center
              </ToggleGroupItem>
              <ToggleGroupItem value="right" className="flex-1">
                Right
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Image Settings Section */}
          <div className="space-y-4 pt-2 border-t">
            <h4 className="font-medium text-sm text-muted-foreground">Image Settings</h4>
            
            {/* Image Fit */}
            <div className="space-y-2">
              <Label>Image Fit</Label>
              <ToggleGroup
                type="single"
                value={theme.image_fit}
                onValueChange={(value) =>
                  value && setTheme({ ...theme, image_fit: value as "cover" | "contain" | "fill" })
                }
                className="justify-start"
              >
                <ToggleGroupItem value="cover" className="flex-1">
                  Cover
                </ToggleGroupItem>
                <ToggleGroupItem value="contain" className="flex-1">
                  Contain
                </ToggleGroupItem>
                <ToggleGroupItem value="fill" className="flex-1">
                  Fill
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Image Zoom */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Image Zoom</Label>
                <span className="text-sm text-muted-foreground">{theme.image_zoom}%</span>
              </div>
              <Slider
                value={[theme.image_zoom]}
                onValueChange={([value]) => setTheme({ ...theme, image_zoom: value })}
                min={100}
                max={150}
                step={5}
              />
            </div>
          </div>

          {/* Overlay Settings Section */}
          <div className="space-y-4 pt-2 border-t">
            <h4 className="font-medium text-sm text-muted-foreground">Overlay Settings</h4>
            
            {/* Overlay Color */}
            <div className="space-y-2">
              <Label>Overlay Color</Label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    type="color"
                    value={theme.overlay_color}
                    onChange={(e) => setTheme({ ...theme, overlay_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={theme.overlay_color}
                  onChange={(e) => setTheme({ ...theme, overlay_color: e.target.value })}
                  className="w-28 font-mono text-sm"
                  placeholder="#000000"
                />
                <div
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: theme.overlay_color }}
                />
              </div>
            </div>

            {/* Overlay Opacity */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Overlay Opacity</Label>
                <span className="text-sm text-muted-foreground">{theme.overlay_opacity}%</span>
              </div>
              <Slider
                value={[theme.overlay_opacity]}
                onValueChange={([value]) => setTheme({ ...theme, overlay_opacity: value })}
                max={100}
                step={5}
              />
            </div>

            {/* Edge Fade */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Edge Fade Effect</Label>
                <p className="text-sm text-muted-foreground">
                  Adds a soft vignette to the edges
                </p>
              </div>
              <Switch
                checked={theme.edge_fade}
                onCheckedChange={(checked) => setTheme({ ...theme, edge_fade: checked })}
              />
            </div>
          </div>

          {/* Button Settings Section */}
          <div className="space-y-4 pt-2 border-t">
            <h4 className="font-medium text-sm text-muted-foreground">Button Settings</h4>
            
            {/* Button Shape */}
            <div className="space-y-2">
              <Label>Button Shape</Label>
              <ToggleGroup
                type="single"
                value={theme.button_shape}
                onValueChange={(value) =>
                  value && setTheme({ ...theme, button_shape: value as "rounded" | "box" })
                }
                className="justify-start"
              >
                <ToggleGroupItem value="rounded" className="flex-1">
                  Rounded
                </ToggleGroupItem>
                <ToggleGroupItem value="box" className="flex-1">
                  Box
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-2 pt-2 border-t">
            <Label>Preview</Label>
            <div
              className="relative h-32 rounded-lg overflow-hidden border"
            >
              {/* Background Image with fit and zoom */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: banner?.image_url
                    ? `url(${banner.image_url})`
                    : "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground)/20) 100%)",
                  backgroundSize: theme.image_fit === "contain" ? "contain" : theme.image_fit === "fill" ? "100% 100%" : "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transform: `scale(${theme.image_zoom / 100})`,
                }}
              />

              {/* Overlay with custom color */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${hexToRgba(theme.overlay_color, theme.overlay_opacity / 100)} 0%, ${hexToRgba(theme.overlay_color, theme.overlay_opacity / 200)} 50%, transparent 100%)`,
                }}
              />

              {/* Edge Fade */}
              {theme.edge_fade && (
                <div
                  className="absolute inset-0"
                  style={{
                    boxShadow: `inset 0 0 60px 30px ${hexToRgba(theme.overlay_color, 0.4)}`,
                  }}
                />
              )}

              {/* Content */}
              <div
                className={`relative h-full flex flex-col justify-center px-4 ${getContentPositionClasses()}`}
              >
                <p className="text-white font-semibold text-sm drop-shadow-md">
                  {banner?.title || "Banner Title"}
                </p>
                {banner?.subtitle && (
                  <p className="text-white/80 text-xs mt-1 drop-shadow-sm">
                    {banner.subtitle}
                  </p>
                )}
                <button
                  className={`mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground ${
                    theme.button_shape === "rounded" ? "rounded-full" : "rounded-md"
                  }`}
                >
                  {banner?.button_text || "Shop Now"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateBanner.isPending}>
            {updateBanner.isPending ? "Saving..." : "Save Theme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};