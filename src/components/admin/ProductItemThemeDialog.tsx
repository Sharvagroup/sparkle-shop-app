import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Product, ProductTheme, useUpdateProduct } from "@/hooks/useProducts";

const defaultTheme: ProductTheme = {
  badge_style: "default",
  badge_color: "",
  image_fit: "cover",
  highlight_color: "",
  featured_border: false,
  hover_effect: "lift",
  card_style: "shadow",
};

interface ProductItemThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export const ProductItemThemeDialog = ({
  open,
  onOpenChange,
  product,
}: ProductItemThemeDialogProps) => {
  const [theme, setTheme] = useState<ProductTheme>(defaultTheme);
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product?.theme) {
      setTheme({ ...defaultTheme, ...product.theme });
    } else {
      setTheme(defaultTheme);
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    await updateProduct.mutateAsync({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
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
            Theme - {product?.name}
          </DialogTitle>
          <DialogDescription>
            Customize the appearance of this product card
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
                value && setTheme({ ...theme, card_style: value as ProductTheme['card_style'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="minimal" className="flex-1">Minimal</ToggleGroupItem>
              <ToggleGroupItem value="bordered" className="flex-1">Bordered</ToggleGroupItem>
              <ToggleGroupItem value="shadow" className="flex-1">Shadow</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Badge Style */}
          <div className="space-y-2">
            <Label>Badge Style</Label>
            <ToggleGroup
              type="single"
              value={theme.badge_style}
              onValueChange={(value) =>
                value && setTheme({ ...theme, badge_style: value as ProductTheme['badge_style'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="default" className="flex-1">Default</ToggleGroupItem>
              <ToggleGroupItem value="rounded" className="flex-1">Rounded</ToggleGroupItem>
              <ToggleGroupItem value="pill" className="flex-1">Pill</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Badge Color Override */}
          <div className="space-y-2">
            <Label>Badge Color (Leave empty for default)</Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={theme.badge_color || "#d4af37"}
                onChange={(e) => setTheme({ ...theme, badge_color: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={theme.badge_color}
                onChange={(e) => setTheme({ ...theme, badge_color: e.target.value })}
                className="w-28 font-mono text-sm"
                placeholder="Default"
              />
              {theme.badge_color && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme({ ...theme, badge_color: "" })}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Image Fit */}
          <div className="space-y-2">
            <Label>Image Fit</Label>
            <ToggleGroup
              type="single"
              value={theme.image_fit}
              onValueChange={(value) =>
                value && setTheme({ ...theme, image_fit: value as ProductTheme['image_fit'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="cover" className="flex-1">Cover</ToggleGroupItem>
              <ToggleGroupItem value="contain" className="flex-1">Contain</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Hover Effect */}
          <div className="space-y-2">
            <Label>Hover Effect</Label>
            <ToggleGroup
              type="single"
              value={theme.hover_effect}
              onValueChange={(value) =>
                value && setTheme({ ...theme, hover_effect: value as ProductTheme['hover_effect'] })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="none" className="flex-1">None</ToggleGroupItem>
              <ToggleGroupItem value="lift" className="flex-1">Lift</ToggleGroupItem>
              <ToggleGroupItem value="glow" className="flex-1">Glow</ToggleGroupItem>
              <ToggleGroupItem value="zoom" className="flex-1">Zoom</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Featured Border */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Featured Border</Label>
              <p className="text-sm text-muted-foreground">
                Highlight this product with a special border
              </p>
            </div>
            <Switch
              checked={theme.featured_border}
              onCheckedChange={(checked) => setTheme({ ...theme, featured_border: checked })}
            />
          </div>

          {/* Highlight Color (when featured border is on) */}
          {theme.featured_border && (
            <div className="space-y-2">
              <Label>Highlight Border Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={theme.highlight_color || "#d4af37"}
                  onChange={(e) => setTheme({ ...theme, highlight_color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={theme.highlight_color}
                  onChange={(e) => setTheme({ ...theme, highlight_color: e.target.value })}
                  className="w-28 font-mono text-sm"
                  placeholder="#d4af37"
                />
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="space-y-2 pt-2 border-t">
            <Label>Preview</Label>
            <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
              <div
                className={`w-48 rounded-lg overflow-hidden bg-card transition-all duration-300 ${
                  theme.card_style === 'bordered' ? 'border-2' :
                  theme.card_style === 'shadow' ? 'shadow-lg' : ''
                } ${
                  theme.featured_border ? 'ring-2' : ''
                }`}
                style={{
                  ...(theme.featured_border && theme.highlight_color ? { '--tw-ring-color': theme.highlight_color } as React.CSSProperties : {})
                }}
              >
                <div className="relative aspect-square bg-muted">
                  {product?.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className={`w-full h-full ${
                        theme.image_fit === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                  )}
                  {product?.badge && (
                    <span
                      className={`absolute top-2 left-2 px-2 py-1 text-xs text-white ${
                        theme.badge_style === 'pill' ? 'rounded-full' :
                        theme.badge_style === 'rounded' ? 'rounded-lg' : 'rounded'
                      }`}
                      style={{ backgroundColor: theme.badge_color || 'hsl(var(--primary))' }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{product?.name || 'Product Name'}</h3>
                  <p className="text-primary font-semibold">₹{product?.price?.toLocaleString() || '1,999'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateProduct.isPending}>
            {updateProduct.isPending ? "Saving..." : "Save Theme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};