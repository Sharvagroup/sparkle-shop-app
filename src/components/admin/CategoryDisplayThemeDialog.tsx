import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

export interface CategoryDisplayTheme {
  display_shape: "circle" | "square" | "rounded";
  image_size: number;
  font_size: "small" | "medium" | "large";
  text_transform: "none" | "uppercase" | "capitalize";
  hover_border_color: string;
  hover_border_width: number;
  show_hover_scale: boolean;
}

const defaultTheme: CategoryDisplayTheme = {
  display_shape: "circle",
  image_size: 160,
  font_size: "small",
  text_transform: "uppercase",
  hover_border_color: "hsl(var(--primary))",
  hover_border_width: 4,
  show_hover_scale: true,
};

interface CategoryDisplayThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryDisplayThemeDialog = ({
  open,
  onOpenChange,
}: CategoryDisplayThemeDialogProps) => {
  const [theme, setTheme] = useState<CategoryDisplayTheme>(defaultTheme);
  const { data: savedTheme } = useSiteSetting<CategoryDisplayTheme>("category_display_theme");
  const updateSetting = useUpdateSiteSetting();

  useEffect(() => {
    if (savedTheme) {
      setTheme({
        display_shape: savedTheme.display_shape || "circle",
        image_size: savedTheme.image_size ?? 160,
        font_size: savedTheme.font_size || "small",
        text_transform: savedTheme.text_transform || "uppercase",
        hover_border_color: savedTheme.hover_border_color || "hsl(var(--primary))",
        hover_border_width: savedTheme.hover_border_width ?? 4,
        show_hover_scale: savedTheme.show_hover_scale ?? true,
      });
    }
  }, [savedTheme]);

  const handleSave = async () => {
    await updateSetting.mutateAsync({
      key: "category_display_theme",
      value: theme as unknown as Record<string, unknown>,
      category: "theme",
    });
    onOpenChange(false);
  };

  const getShapeClass = () => {
    switch (theme.display_shape) {
      case "square": return "rounded-none";
      case "rounded": return "rounded-xl";
      default: return "rounded-full";
    }
  };

  const getFontSizeClass = () => {
    switch (theme.font_size) {
      case "medium": return "text-sm";
      case "large": return "text-base";
      default: return "text-xs";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Category Display Theme
          </DialogTitle>
          <DialogDescription>
            Customize how categories appear on the homepage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Display Shape */}
          <div className="space-y-2">
            <Label>Display Shape</Label>
            <ToggleGroup
              type="single"
              value={theme.display_shape}
              onValueChange={(value) =>
                value && setTheme({ ...theme, display_shape: value as "circle" | "square" | "rounded" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="circle" className="flex-1">Circle</ToggleGroupItem>
              <ToggleGroupItem value="rounded" className="flex-1">Rounded</ToggleGroupItem>
              <ToggleGroupItem value="square" className="flex-1">Square</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Image Size */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Image Size</Label>
              <span className="text-sm text-muted-foreground">{theme.image_size}px</span>
            </div>
            <Slider
              value={[theme.image_size]}
              onValueChange={([value]) => setTheme({ ...theme, image_size: value })}
              min={100}
              max={200}
              step={10}
            />
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Label Font Size</Label>
            <ToggleGroup
              type="single"
              value={theme.font_size}
              onValueChange={(value) =>
                value && setTheme({ ...theme, font_size: value as "small" | "medium" | "large" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="small" className="flex-1">Small</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1">Medium</ToggleGroupItem>
              <ToggleGroupItem value="large" className="flex-1">Large</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Text Transform */}
          <div className="space-y-2">
            <Label>Text Style</Label>
            <ToggleGroup
              type="single"
              value={theme.text_transform}
              onValueChange={(value) =>
                value && setTheme({ ...theme, text_transform: value as "none" | "uppercase" | "capitalize" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="none" className="flex-1">Normal</ToggleGroupItem>
              <ToggleGroupItem value="capitalize" className="flex-1">Capitalize</ToggleGroupItem>
              <ToggleGroupItem value="uppercase" className="flex-1">UPPERCASE</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Hover Border */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <Label>Hover Effects</Label>
            
            <div className="space-y-2">
              <Label className="text-sm">Border Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.hover_border_color.startsWith("hsl") ? "#d4a574" : theme.hover_border_color}
                  onChange={(e) => setTheme({ ...theme, hover_border_color: e.target.value })}
                  className="w-12 h-9 p-1 cursor-pointer"
                />
                <Input
                  value={theme.hover_border_color}
                  onChange={(e) => setTheme({ ...theme, hover_border_color: e.target.value })}
                  className="flex-1"
                  placeholder="hsl(var(--primary)) or #hex"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-sm">Border Width</Label>
                <span className="text-sm text-muted-foreground">{theme.hover_border_width}px</span>
              </div>
              <Slider
                value={[theme.hover_border_width]}
                onValueChange={([value]) => setTheme({ ...theme, hover_border_width: value })}
                min={0}
                max={8}
                step={1}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg p-6 bg-muted/30 flex flex-col items-center gap-4">
              <div 
                className={`bg-primary/20 overflow-hidden border-4 border-card flex items-center justify-center transition-all hover:scale-105 ${getShapeClass()}`}
                style={{ 
                  width: `${Math.min(theme.image_size, 120)}px`, 
                  height: `${Math.min(theme.image_size, 120)}px`,
                  borderColor: 'var(--card)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.hover_border_color.startsWith("hsl") ? "hsl(var(--primary))" : theme.hover_border_color;
                  e.currentTarget.style.borderWidth = `${theme.hover_border_width}px`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--card)';
                  e.currentTarget.style.borderWidth = '4px';
                }}
              >
                <span className="text-xs text-muted-foreground">Image</span>
              </div>
              <span 
                className={`font-medium tracking-wider text-muted-foreground ${getFontSizeClass()}`}
                style={{ textTransform: theme.text_transform }}
              >
                Category Name
              </span>
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
