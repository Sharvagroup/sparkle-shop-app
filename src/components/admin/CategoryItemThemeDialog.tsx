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
import { Category, CategoryTheme, useUpdateCategory } from "@/hooks/useCategories";

const defaultTheme: CategoryTheme = {
  display_shape: "rounded",
  image_size: "medium",
  font_size: "base",
  font_weight: "medium",
  hover_effect: "lift",
  hover_border_color: "#d4af37",
  overlay_opacity: 0,
  overlay_color: "#000000",
  text_position: "below",
};

interface CategoryItemThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export const CategoryItemThemeDialog = ({
  open,
  onOpenChange,
  category,
}: CategoryItemThemeDialogProps) => {
  const [theme, setTheme] = useState<CategoryTheme>(defaultTheme);
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (category?.theme) {
      setTheme({ ...defaultTheme, ...category.theme });
    } else {
      setTheme(defaultTheme);
    }
  }, [category]);

  const handleSave = async () => {
    if (!category) return;
    await updateCategory.mutateAsync({
      id: category.id,
      name: category.name,
      slug: category.slug,
      theme,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Theme - {category?.name}
          </DialogTitle>
          <DialogDescription>
            Customize the appearance of this category
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
                value && setTheme({ ...theme, display_shape: value as CategoryTheme['display_shape'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="circle" className="flex-1">Circle</ToggleGroupItem>
              <ToggleGroupItem value="square" className="flex-1">Square</ToggleGroupItem>
              <ToggleGroupItem value="rounded" className="flex-1">Rounded</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Image Size */}
          <div className="space-y-2">
            <Label>Image Size</Label>
            <ToggleGroup
              type="single"
              value={theme.image_size}
              onValueChange={(value) =>
                value && setTheme({ ...theme, image_size: value as CategoryTheme['image_size'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="small" className="flex-1">Small</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1">Medium</ToggleGroupItem>
              <ToggleGroupItem value="large" className="flex-1">Large</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size</Label>
            <ToggleGroup
              type="single"
              value={theme.font_size}
              onValueChange={(value) =>
                value && setTheme({ ...theme, font_size: value as CategoryTheme['font_size'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="small" className="flex-1">Small</ToggleGroupItem>
              <ToggleGroupItem value="base" className="flex-1">Base</ToggleGroupItem>
              <ToggleGroupItem value="large" className="flex-1">Large</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <Label>Font Weight</Label>
            <ToggleGroup
              type="single"
              value={theme.font_weight}
              onValueChange={(value) =>
                value && setTheme({ ...theme, font_weight: value as CategoryTheme['font_weight'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="normal" className="flex-1">Normal</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1">Medium</ToggleGroupItem>
              <ToggleGroupItem value="bold" className="flex-1">Bold</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Hover Effect */}
          <div className="space-y-2">
            <Label>Hover Effect</Label>
            <ToggleGroup
              type="single"
              value={theme.hover_effect}
              onValueChange={(value) =>
                value && setTheme({ ...theme, hover_effect: value as CategoryTheme['hover_effect'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="none" className="flex-1">None</ToggleGroupItem>
              <ToggleGroupItem value="lift" className="flex-1">Lift</ToggleGroupItem>
              <ToggleGroupItem value="glow" className="flex-1">Glow</ToggleGroupItem>
              <ToggleGroupItem value="border" className="flex-1">Border</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Hover Border Color */}
          {theme.hover_effect === 'border' && (
            <div className="space-y-2">
              <Label>Hover Border Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={theme.hover_border_color}
                  onChange={(e) => setTheme({ ...theme, hover_border_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={theme.hover_border_color}
                  onChange={(e) => setTheme({ ...theme, hover_border_color: e.target.value })}
                  className="w-28 font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Text Position */}
          <div className="space-y-2">
            <Label>Text Position</Label>
            <ToggleGroup
              type="single"
              value={theme.text_position}
              onValueChange={(value) =>
                value && setTheme({ ...theme, text_position: value as CategoryTheme['text_position'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="below" className="flex-1">Below</ToggleGroupItem>
              <ToggleGroupItem value="overlay" className="flex-1">Overlay</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Overlay Settings (only when text position is overlay) */}
          {theme.text_position === 'overlay' && (
            <>
              <div className="space-y-2">
                <Label>Overlay Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={theme.overlay_color}
                    onChange={(e) => setTheme({ ...theme, overlay_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={theme.overlay_color}
                    onChange={(e) => setTheme({ ...theme, overlay_color: e.target.value })}
                    className="w-28 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Overlay Opacity</Label>
                  <span className="text-sm text-muted-foreground">{theme.overlay_opacity}%</span>
                </div>
                <Slider
                  value={[theme.overlay_opacity || 0]}
                  onValueChange={([value]) => setTheme({ ...theme, overlay_opacity: value })}
                  max={100}
                  step={5}
                />
              </div>
            </>
          )}

          {/* Preview */}
          <div className="space-y-2 pt-2 border-t">
            <Label>Preview</Label>
            <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative overflow-hidden transition-all duration-300 ${
                    theme.display_shape === 'circle' ? 'rounded-full' :
                    theme.display_shape === 'square' ? 'rounded-none' : 'rounded-xl'
                  } ${
                    theme.image_size === 'small' ? 'w-16 h-16' :
                    theme.image_size === 'large' ? 'w-28 h-28' : 'w-20 h-20'
                  }`}
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                  }}
                >
                  {category?.image_url ? (
                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                  )}
                  {theme.text_position === 'overlay' && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: `${theme.overlay_color}${Math.round((theme.overlay_opacity || 0) * 2.55).toString(16).padStart(2, '0')}` }}
                    >
                      <span className={`text-white ${
                        theme.font_size === 'small' ? 'text-xs' :
                        theme.font_size === 'large' ? 'text-base' : 'text-sm'
                      } ${
                        theme.font_weight === 'bold' ? 'font-bold' :
                        theme.font_weight === 'medium' ? 'font-medium' : 'font-normal'
                      }`}>
                        {category?.name || 'Category'}
                      </span>
                    </div>
                  )}
                </div>
                {theme.text_position === 'below' && (
                  <span className={`${
                    theme.font_size === 'small' ? 'text-xs' :
                    theme.font_size === 'large' ? 'text-base' : 'text-sm'
                  } ${
                    theme.font_weight === 'bold' ? 'font-bold' :
                    theme.font_weight === 'medium' ? 'font-medium' : 'font-normal'
                  }`}>
                    {category?.name || 'Category'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateCategory.isPending}>
            {updateCategory.isPending ? "Saving..." : "Save Theme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};