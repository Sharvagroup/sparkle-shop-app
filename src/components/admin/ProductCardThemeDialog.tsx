import { useState, useEffect } from "react";
import { Paintbrush, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

export interface ProductCardTheme {
  card_style: "default" | "minimal" | "bordered";
  image_aspect_ratio: "square" | "portrait" | "landscape";
  show_description: boolean;
  show_rating: boolean;
  show_wishlist: boolean;
  button_style: "full" | "outline" | "minimal";
  hover_effect: "shadow" | "scale" | "border" | "none";
  image_fit: "contain" | "cover";
}

const defaultTheme: ProductCardTheme = {
  card_style: "default",
  image_aspect_ratio: "square",
  show_description: true,
  show_rating: true,
  show_wishlist: true,
  button_style: "full",
  hover_effect: "shadow",
  image_fit: "contain",
};

interface ProductCardThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductCardThemeDialog = ({
  open,
  onOpenChange,
}: ProductCardThemeDialogProps) => {
  const [theme, setTheme] = useState<ProductCardTheme>(defaultTheme);
  const { data: savedTheme } = useSiteSetting<ProductCardTheme>("product_card_theme");
  const updateSetting = useUpdateSiteSetting();

  useEffect(() => {
    if (savedTheme) {
      setTheme({
        card_style: savedTheme.card_style || "default",
        image_aspect_ratio: savedTheme.image_aspect_ratio || "square",
        show_description: savedTheme.show_description ?? true,
        show_rating: savedTheme.show_rating ?? true,
        show_wishlist: savedTheme.show_wishlist ?? true,
        button_style: savedTheme.button_style || "full",
        hover_effect: savedTheme.hover_effect || "shadow",
        image_fit: savedTheme.image_fit || "contain",
      });
    }
  }, [savedTheme]);

  const handleSave = async () => {
    await updateSetting.mutateAsync({
      key: "product_card_theme",
      value: theme as unknown as Record<string, unknown>,
      category: "theme",
    });
    onOpenChange(false);
  };

  const getCardStyleClass = () => {
    switch (theme.card_style) {
      case "minimal": return "border-0 shadow-none";
      case "bordered": return "border-2";
      default: return "border shadow-sm";
    }
  };

  const getAspectClass = () => {
    switch (theme.image_aspect_ratio) {
      case "portrait": return "aspect-[3/4]";
      case "landscape": return "aspect-[4/3]";
      default: return "aspect-square";
    }
  };

  const getButtonClass = () => {
    switch (theme.button_style) {
      case "outline": return "bg-transparent border-2 border-primary text-primary";
      case "minimal": return "bg-transparent text-primary underline";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const getHoverClass = () => {
    switch (theme.hover_effect) {
      case "scale": return "hover:scale-[1.02]";
      case "border": return "hover:border-primary";
      case "none": return "";
      default: return "hover:shadow-lg";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Product Card Theme
          </DialogTitle>
          <DialogDescription>
            Customize how product cards appear across the site
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column - Settings */}
          <div className="space-y-5">
            {/* Card Style */}
            <div className="space-y-2">
              <Label>Card Style</Label>
              <ToggleGroup
                type="single"
                value={theme.card_style}
                onValueChange={(value) =>
                  value && setTheme({ ...theme, card_style: value as ProductCardTheme["card_style"] })
                }
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="default">Default</ToggleGroupItem>
                <ToggleGroupItem value="minimal">Minimal</ToggleGroupItem>
                <ToggleGroupItem value="bordered">Bordered</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Image Aspect Ratio */}
            <div className="space-y-2">
              <Label>Image Aspect</Label>
              <ToggleGroup
                type="single"
                value={theme.image_aspect_ratio}
                onValueChange={(value) =>
                  value && setTheme({ ...theme, image_aspect_ratio: value as ProductCardTheme["image_aspect_ratio"] })
                }
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="square">Square</ToggleGroupItem>
                <ToggleGroupItem value="portrait">Portrait</ToggleGroupItem>
                <ToggleGroupItem value="landscape">Landscape</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Image Fit */}
            <div className="space-y-2">
              <Label>Image Fit</Label>
              <ToggleGroup
                type="single"
                value={theme.image_fit}
                onValueChange={(value) =>
                  value && setTheme({ ...theme, image_fit: value as "contain" | "cover" })
                }
                className="justify-start"
              >
                <ToggleGroupItem value="contain">Contain</ToggleGroupItem>
                <ToggleGroupItem value="cover">Cover</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Button Style */}
            <div className="space-y-2">
              <Label>Button Style</Label>
              <ToggleGroup
                type="single"
                value={theme.button_style}
                onValueChange={(value) =>
                  value && setTheme({ ...theme, button_style: value as ProductCardTheme["button_style"] })
                }
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="full">Full</ToggleGroupItem>
                <ToggleGroupItem value="outline">Outline</ToggleGroupItem>
                <ToggleGroupItem value="minimal">Minimal</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Hover Effect */}
            <div className="space-y-2">
              <Label>Hover Effect</Label>
              <ToggleGroup
                type="single"
                value={theme.hover_effect}
                onValueChange={(value) =>
                  value && setTheme({ ...theme, hover_effect: value as ProductCardTheme["hover_effect"] })
                }
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="shadow">Shadow</ToggleGroupItem>
                <ToggleGroupItem value="scale">Scale</ToggleGroupItem>
                <ToggleGroupItem value="border">Border</ToggleGroupItem>
                <ToggleGroupItem value="none">None</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
              <Label>Visibility Options</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Description</span>
                <Switch
                  checked={theme.show_description}
                  onCheckedChange={(checked) => setTheme({ ...theme, show_description: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Rating</span>
                <Switch
                  checked={theme.show_rating}
                  onCheckedChange={(checked) => setTheme({ ...theme, show_rating: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Wishlist Icon</span>
                <Switch
                  checked={theme.show_wishlist}
                  onCheckedChange={(checked) => setTheme({ ...theme, show_wishlist: checked })}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div 
              className={`bg-card rounded-lg overflow-hidden transition-all ${getCardStyleClass()} ${getHoverClass()}`}
            >
              <div className={`relative bg-muted ${getAspectClass()} flex items-center justify-center`}>
                <span className="text-xs text-muted-foreground">
                  {theme.image_fit === "cover" ? "Cover" : "Contain"}
                </span>
                {theme.show_wishlist && (
                  <div className="absolute top-2 right-2 bg-card rounded-full p-1 shadow-sm">
                    <Heart className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-4">
                {theme.show_rating && (
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= 4 ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(24)</span>
                  </div>
                )}
                <h3 className="font-medium text-sm mb-1 truncate">Product Name</h3>
                {theme.show_description && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    Product description text
                  </p>
                )}
                <p className="font-bold text-sm mb-3">₹1,999</p>
                <button className={`w-full py-2 text-xs font-bold uppercase tracking-wider rounded ${getButtonClass()}`}>
                  Add to Cart
                </button>
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
