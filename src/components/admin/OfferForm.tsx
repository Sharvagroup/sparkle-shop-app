import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Offer, OfferInsert, OfferType, uploadOfferImage } from "@/hooks/useOffers";
import { Loader2, Upload } from "lucide-react";
import { LinkUrlAutocomplete } from "./LinkUrlAutocomplete";
import { validateWebPImage, validateImageSize, ALLOWED_IMAGE_ACCEPT } from "@/lib/imageValidation";
import { toast } from "sonner";

interface OfferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer | null;
  offerType?: OfferType;
  onSubmit: (data: OfferInsert) => void;
  isLoading?: boolean;
}

export function OfferForm({ open, onOpenChange, offer, offerType = "special_offer", onSubmit, isLoading }: OfferFormProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("Shop Now");
  const [discountCode, setDiscountCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minCartValue, setMinCartValue] = useState(0);
  const [termsConditions, setTermsConditions] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const isOfferBanner = offerType === "offer_banner";

  useEffect(() => {
    if (offer) {
      setTitle(offer.title);
      setSubtitle(offer.subtitle || "");
      setDescription(offer.description || "");
      setImageUrl(offer.image_url);
      setLinkUrl(offer.link_url || "");
      setButtonText(offer.button_text || "Shop Now");
      setDiscountCode(offer.discount_code || "");
      setDiscountType(offer.discount_type || "percentage");
      setDiscountValue(offer.discount_value || 0);
      setMinCartValue(offer.min_cart_value || 0);
      setTermsConditions(offer.terms_conditions || "");
      setStartDate(offer.start_date ? offer.start_date.split("T")[0] : "");
      setEndDate(offer.end_date ? offer.end_date.split("T")[0] : "");
      setDisplayOrder(offer.display_order || 0);
      setIsActive(offer.is_active ?? true);
    } else {
      resetForm();
    }
  }, [offer, open]);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setImageUrl("");
    setLinkUrl("");
    setButtonText("Shop Now");
    setDiscountCode("");
    setDiscountType("percentage");
    setDiscountValue(0);
    setMinCartValue(0);
    setTermsConditions("");
    setStartDate("");
    setEndDate("");
    setDisplayOrder(0);
    setIsActive(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formatCheck = validateWebPImage(file);
    if (!formatCheck.valid) {
      toast.error(formatCheck.error);
      return;
    }

    const sizeCheck = validateImageSize(file, 5);
    if (!sizeCheck.valid) {
      toast.error(sizeCheck.error);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadOfferImage(file);
      setImageUrl(url);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      subtitle: subtitle || null,
      description: description || null,
      image_url: imageUrl,
      link_url: linkUrl || null,
      button_text: buttonText || null,
      discount_code: discountCode || null,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      display_order: displayOrder,
      is_active: isActive,
      offer_type: offerType,
      discount_type: discountType,
      discount_value: discountValue,
      min_cart_value: minCartValue,
      terms_conditions: termsConditions || null,
    });
  };

  const dialogTitle = offer 
    ? `Edit ${isOfferBanner ? "Banner" : "Offer"}`
    : `Add New ${isOfferBanner ? "Banner" : "Offer"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isOfferBanner ? "e.g., Summer Sale" : "e.g., 20% Off Everything"}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder={isOfferBanner ? "e.g., Up to 50% off" : "e.g., Limited time only"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder={isOfferBanner ? "Banner description..." : "Offer details and conditions..."}
            />
          </div>

          <div className="space-y-2">
            <Label>Image *</Label>
            <div className="flex gap-4 items-center">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Offer"
                  className="w-32 h-20 object-cover rounded border"
                />
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept={ALLOWED_IMAGE_ACCEPT}
                  onChange={handleImageUpload}
                  className="hidden"
                  id="offer-image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("offer-image")?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload Image
                </Button>
              </div>
            </div>
            {isOfferBanner && (
              <p className="text-xs text-muted-foreground">Recommended: 1920x600px for best display in carousel</p>
            )}
          </div>

          {/* Discount Section - Only show for Special Offers */}
          {!isOfferBanner && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <h4 className="font-medium text-sm">Discount Details</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === "percentage" ? "e.g., 20" : "e.g., 500"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount Code</Label>
                  <Input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="e.g., SAVE20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Minimum Cart Value (₹)</Label>
                <Input
                  type="number"
                  value={minCartValue}
                  onChange={(e) => setMinCartValue(parseFloat(e.target.value) || 0)}
                  placeholder="Minimum order amount for this offer"
                />
              </div>
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  rows={2}
                  placeholder="Enter offer terms and conditions..."
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL</Label>
              <LinkUrlAutocomplete value={linkUrl} onChange={setLinkUrl} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g., Shop Now"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title || !imageUrl}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {offer ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
