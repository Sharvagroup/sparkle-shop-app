import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  edge_fade: boolean;
  button_shape: "rounded" | "box";
  height_override?: "small" | "medium" | "large";
}

const defaultTheme: BannerTheme = {
  content_position: "center",
  overlay_opacity: 40,
  edge_fade: false,
  button_shape: "rounded",
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
        edge_fade: bannerTheme.edge_fade || false,
        button_shape: bannerTheme.button_shape || "rounded",
        height_override: bannerTheme.height_override,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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

          {/* Height Override */}
          <div className="space-y-2">
            <Label>Height Override (Optional)</Label>
            <ToggleGroup
              type="single"
              value={theme.height_override || ""}
              onValueChange={(value) =>
                setTheme({
                  ...theme,
                  height_override: value as "small" | "medium" | "large" | undefined,
                })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="" className="flex-1">
                Default
              </ToggleGroupItem>
              <ToggleGroupItem value="small" className="flex-1">
                Small
              </ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1">
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem value="large" className="flex-1">
                Large
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div
              className="relative h-32 rounded-lg overflow-hidden border"
              style={{
                backgroundImage: banner?.image_url
                  ? `url(${banner.image_url})`
                  : "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground)/20) 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,${theme.overlay_opacity / 100}) 0%, rgba(0,0,0,${theme.overlay_opacity / 200}) 50%, transparent 100%)`,
                }}
              />

              {/* Edge Fade */}
              {theme.edge_fade && (
                <div
                  className="absolute inset-0"
                  style={{
                    boxShadow: "inset 0 0 60px 30px rgba(0,0,0,0.4)",
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
