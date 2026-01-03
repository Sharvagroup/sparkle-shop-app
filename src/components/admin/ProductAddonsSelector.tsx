import { useState } from "react";
import { X, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/hooks/useProducts";

export interface SelectedAddon {
  addon_product_id: string;
  addon_type: "addon" | "suggestion" | "bundle";
  price_override: number | null;
  display_order: number;
}

interface ProductAddonsSelectorProps {
  products: Product[];
  currentProductId?: string;
  selectedAddons: SelectedAddon[];
  onChange: (addons: SelectedAddon[]) => void;
}

const ProductAddonsSelector = ({
  products,
  currentProductId,
  selectedAddons,
  onChange,
}: ProductAddonsSelectorProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // Filter out current product and already selected products
  const availableProducts = products.filter(
    (p) =>
      p.id !== currentProductId &&
      !selectedAddons.some((a) => a.addon_product_id === p.id)
  );

  const handleAddAddon = () => {
    if (!selectedProductId) return;

    const newAddon: SelectedAddon = {
      addon_product_id: selectedProductId,
      addon_type: "suggestion",
      price_override: null,
      display_order: selectedAddons.length,
    };

    onChange([...selectedAddons, newAddon]);
    setSelectedProductId("");
  };

  const handleRemoveAddon = (productId: string) => {
    onChange(selectedAddons.filter((a) => a.addon_product_id !== productId));
  };

  const handleUpdateAddon = (productId: string, updates: Partial<SelectedAddon>) => {
    onChange(
      selectedAddons.map((a) =>
        a.addon_product_id === productId ? { ...a, ...updates } : a
      )
    );
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add-ons & Suggestions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add complementary products that customers can add to their cart along with this product.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Addon */}
        <div className="flex gap-2">
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a product to add as add-on" />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {formatPrice(product.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddAddon}
            disabled={!selectedProductId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Selected Addons List */}
        {selectedAddons.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Selected Add-ons</Label>
            {selectedAddons.map((addon) => {
              const product = getProductById(addon.addon_product_id);
              if (!product) return null;

              return (
                <div
                  key={addon.addon_product_id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
                  
                  {/* Product Image */}
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Original: {formatPrice(product.price)}
                    </p>
                  </div>

                  {/* Type Selector */}
                  <Select
                    value={addon.addon_type}
                    onValueChange={(value: "addon" | "suggestion" | "bundle") =>
                      handleUpdateAddon(addon.addon_product_id, { addon_type: value })
                    }
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addon">Add-on</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Price Override */}
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={addon.price_override ?? ""}
                      onChange={(e) =>
                        handleUpdateAddon(addon.addon_product_id, {
                          price_override: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="h-9"
                    />
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAddon(addon.addon_product_id)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {selectedAddons.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
            No add-ons selected. Add products that complement this item.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAddonsSelector;
