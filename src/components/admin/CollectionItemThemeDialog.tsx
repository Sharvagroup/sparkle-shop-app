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
import { Collection, CollectionTheme, useUpdateCollection } from "@/hooks/useCollections";

const defaultTheme: CollectionTheme = {
  card_style: "shadow",
  image_aspect: "4:3",
  overlay_color: "#000000",
  overlay_opacity: 40,
  content_position: "bottom",
  font_size: "base",
  font_weight: "medium",
  hover_effect: "zoom",
};

interface CollectionItemThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection | null;
}

export const CollectionItemThemeDialog = ({
  open,
  onOpenChange,
  collection,
}: CollectionItemThemeDialogProps) => {
  const [theme, setTheme] = useState<CollectionTheme>(defaultTheme);
  const updateCollection = useUpdateCollection();

  useEffect(() => {
    if (collection?.theme) {
      setTheme({ ...defaultTheme, ...collection.theme });
    } else {
      setTheme(defaultTheme);
    }
  }, [collection]);

  const handleSave = async () => {
    if (!collection) return;
    await updateCollection.mutateAsync({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
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
            Theme - {collection?.name}
          </DialogTitle>
          <DialogDescription>
            Customize the appearance of this collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Card Style */}
          <div className="space-y-2">
            <Label>Card Style</Label>
            <ToggleGroup
              type="single"
              value={theme.card_style}
              onValueChange={(value) =>
                value && setTheme({ ...theme, card_style: value as CollectionTheme['card_style'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="minimal" className="flex-1">Minimal</ToggleGroupItem>
              <ToggleGroupItem value="bordered" className="flex-1">Bordered</ToggleGroupItem>
              <ToggleGroupItem value="shadow" className="flex-1">Shadow</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Image Aspect Ratio */}
          <div className="space-y-2">
            <Label>Image Aspect Ratio</Label>
            <ToggleGroup
              type="single"
              value={theme.image_aspect}
              onValueChange={(value) =>
                value && setTheme({ ...theme, image_aspect: value as CollectionTheme['image_aspect'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="square" className="flex-1">Square</ToggleGroupItem>
              <ToggleGroupItem value="4:3" className="flex-1">4:3</ToggleGroupItem>
              <ToggleGroupItem value="16:9" className="flex-1">16:9</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Content Position */}
          <div className="space-y-2">
            <Label>Content Position</Label>
            <ToggleGroup
              type="single"
              value={theme.content_position}
              onValueChange={(value) =>
                value && setTheme({ ...theme, content_position: value as CollectionTheme['content_position'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="bottom" className="flex-1">Bottom</ToggleGroupItem>
              <ToggleGroupItem value="center" className="flex-1">Center</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size</Label>
            <ToggleGroup
              type="single"
              value={theme.font_size}
              onValueChange={(value) =>
                value && setTheme({ ...theme, font_size: value as CollectionTheme['font_size'] })
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
                value && setTheme({ ...theme, font_weight: value as CollectionTheme['font_weight'] })
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
                value && setTheme({ ...theme, hover_effect: value as CollectionTheme['hover_effect'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="none" className="flex-1">None</ToggleGroupItem>
              <ToggleGroupItem value="lift" className="flex-1">Lift</ToggleGroupItem>
              <ToggleGroupItem value="glow" className="flex-1">Glow</ToggleGroupItem>
              <ToggleGroupItem value="zoom" className="flex-1">Zoom</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Overlay Color */}
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

          {/* Overlay Opacity */}
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

          {/* Preview */}
          <div className="space-y-2 pt-2 border-t">
            <Label>Preview</Label>
            <div
              className={`relative overflow-hidden rounded-lg ${
                theme.card_style === 'bordered' ? 'border-2' :
                theme.card_style === 'shadow' ? 'shadow-lg' : ''
              } ${
                theme.image_aspect === 'square' ? 'aspect-square' :
                theme.image_aspect === '16:9' ? 'aspect-video' : 'aspect-[4/3]'
              }`}
            >
              {collection?.image_url ? (
                <img 
                  src={collection.image_url} 
                  alt={collection.name} 
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    theme.hover_effect === 'zoom' ? 'hover:scale-110' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
              )}
              <div 
                className={`absolute inset-0 flex ${
                  theme.content_position === 'center' ? 'items-center justify-center' : 'items-end'
                }`}
                style={{ backgroundColor: `${theme.overlay_color}${Math.round((theme.overlay_opacity || 0) * 2.55).toString(16).padStart(2, '0')}` }}
              >
                <div className={`p-4 ${theme.content_position === 'center' ? 'text-center' : ''}`}>
                  <h3 className={`text-white ${
                    theme.font_size === 'small' ? 'text-sm' :
                    theme.font_size === 'large' ? 'text-xl' : 'text-base'
                  } ${
                    theme.font_weight === 'bold' ? 'font-bold' :
                    theme.font_weight === 'medium' ? 'font-medium' : 'font-normal'
                  }`}>
                    {collection?.name || 'Collection'}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateCollection.isPending}>
            {updateCollection.isPending ? "Saving..." : "Save Theme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};