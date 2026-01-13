import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
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
import { LinkUrlAutocomplete } from "./LinkUrlAutocomplete";
import {
  Banner,
  BannerInsert,
  useCreateBanner,
  useUpdateBanner,
  uploadBannerImage,
} from "@/hooks/useBanners";
import { validateWebPImage, validateImageSize, ALLOWED_IMAGE_ACCEPT } from "@/lib/imageValidation";
import { toast } from "sonner";

interface BannerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
}

export function BannerForm({ open, onOpenChange, banner }: BannerFormProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("Shop Now");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();

  const isEditing = !!banner;
  const isSubmitting = createBanner.isPending || updateBanner.isPending;

  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setSubtitle(banner.subtitle || "");
      setImageUrl(banner.image_url);
      setLinkUrl(banner.link_url || "");
      setButtonText(banner.button_text || "Shop Now");
      setDisplayOrder(banner.display_order || 0);
      setIsActive(banner.is_active ?? true);
      setImagePreview(banner.image_url);
    } else {
      resetForm();
    }
  }, [banner, open]);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setLinkUrl("");
    setButtonText("Shop Now");
    setDisplayOrder(0);
    setIsActive(true);
    setImagePreview(null);
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
      const url = await uploadBannerImage(file);
      setImageUrl(url);
      setImagePreview(url);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bannerData: BannerInsert = {
      title,
      subtitle: subtitle || null,
      image_url: imageUrl,
      link_url: linkUrl || null,
      button_text: buttonText || "Shop Now",
      display_order: displayOrder,
      is_active: isActive,
    };

    try {
      if (isEditing && banner) {
        await updateBanner.mutateAsync({ id: banner.id, ...bannerData });
      } else {
        await createBanner.mutateAsync(bannerData);
      }
      onOpenChange(false);
      resetForm();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Banner" : "Add Banner"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Banner Image *</Label>
            {imagePreview ? (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border bg-muted">
                <img
                  src={imagePreview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[16/9] border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/50">
                <input
                  type="file"
                  accept={ALLOWED_IMAGE_ACCEPT}
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload banner image
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Recommended: 1920x600px
                    </span>
                  </>
                )}
              </label>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Sale"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g., Up to 50% off on all jewelry"
              rows={2}
            />
          </div>

          {/* Link URL with Autocomplete */}
          <div className="space-y-2">
            <Label>Link URL</Label>
            <LinkUrlAutocomplete
              value={linkUrl}
              onChange={setLinkUrl}
              placeholder="Select a page or type a URL..."
            />
          </div>

          {/* Button Text */}
          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g., Shop Now"
            />
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!imageUrl || !title || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isEditing ? "Update Banner" : "Add Banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
