import { AlertCircle, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProductOption } from "@/hooks/useProductOptions";

interface ExistingCartItem {
  id: string;
  quantity: number;
  selected_options: Record<string, any> | null;
}

interface CartCollisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productImage?: string;
  existingItem: ExistingCartItem;
  newQuantity: number;
  newOptions: Record<string, any>;
  productOptions: ProductOption[];
  onReplace: () => void;
  onAddSeparate: () => void;
  isLoading?: boolean;
}

const CartCollisionDialog = ({
  open,
  onOpenChange,
  productName,
  productImage,
  existingItem,
  newQuantity,
  newOptions,
  productOptions,
  onReplace,
  onAddSeparate,
  isLoading,
}: CartCollisionDialogProps) => {
  // Helper to format options for display
  const formatOptions = (options: Record<string, any> | null) => {
    if (!options || Object.keys(options).length === 0) return "No options selected";
    
    return Object.entries(options)
      .map(([optionId, value]) => {
        const option = productOptions.find((o) => o.id === optionId);
        const optionName = option?.name || optionId;
        const unit = option?.unit || "";
        return `${optionName}: ${value}${unit}`;
      })
      .join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <DialogTitle>Product Already in Cart</DialogTitle>
          </div>
          <DialogDescription>
            This product is already in your cart. Would you like to replace the existing item or add this as a separate entry?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Info */}
          <div className="flex gap-3 items-center">
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={productImage || "/placeholder.svg"}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{productName}</p>
            </div>
          </div>

          {/* Existing vs New Comparison */}
          <div className="space-y-3">
            {/* Existing Item */}
            <div className="bg-muted/50 p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Currently in cart
              </p>
              <p className="text-sm font-medium">
                Qty: {existingItem.quantity}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatOptions(existingItem.selected_options)}
              </p>
            </div>

            {/* New Selection */}
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-xs text-primary uppercase tracking-wider mb-1">
                New selection
              </p>
              <p className="text-sm font-medium">
                Qty: {newQuantity}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatOptions(newOptions)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={onReplace}
            disabled={isLoading}
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Replace Existing
          </Button>
          <Button
            onClick={onAddSeparate}
            disabled={isLoading}
            className="w-full sm:w-auto gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Separate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartCollisionDialog;
