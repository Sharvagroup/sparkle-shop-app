import { useState } from "react";
import { Star, Loader2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateReview, uploadReviewImage } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { validateWebPImage, ALLOWED_IMAGE_ACCEPT } from "@/lib/imageValidation";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const { user } = useAuth();
  const createReview = useCreateReview();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 3) {
      toast({ title: "Maximum 3 images allowed", variant: "destructive" });
      return;
    }
    
    // Validate WebP format for all files
    const validFiles: File[] = [];
    for (const file of files) {
      const formatCheck = validateWebPImage(file);
      if (!formatCheck.valid) {
        toast({ title: formatCheck.error, variant: "destructive" });
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    const newImages = [...images, ...validFiles].slice(0, 3);
    setImages(newImages);
    
    // Create previews
    const previews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Please sign in to write a review", variant: "destructive" });
      return;
    }
    
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    
    if (!reviewText.trim()) {
      toast({ title: "Please write your review", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images first
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        const uploadPromises = images.map((file) => uploadReviewImage(file, user.id));
        uploadedImageUrls = await Promise.all(uploadPromises);
      }
      
      await createReview.mutateAsync({
        product_id: productId,
        rating,
        title: title.trim() || undefined,
        review_text: reviewText.trim(),
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
      });
      
      // Reset form
      setRating(0);
      setTitle("");
      setReviewText("");
      setImages([]);
      setImagePreviews([]);
      onSuccess?.();
    } catch {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-muted/50 rounded-lg p-6 text-center border border-border">
        <p className="text-muted-foreground mb-4">Sign in to write a review</p>
        <Button variant="outline" asChild>
          <a href="/auth">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <Label className="text-sm font-bold uppercase tracking-wide mb-3 block">
          Your Rating *
        </Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-primary text-primary"
                    : "text-border hover:text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="review-title" className="text-sm font-bold uppercase tracking-wide mb-2 block">
          Review Title (Optional)
        </Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
          className="bg-background"
        />
      </div>

      {/* Review Text */}
      <div>
        <Label htmlFor="review-text" className="text-sm font-bold uppercase tracking-wide mb-2 block">
          Your Review *
        </Label>
        <Textarea
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          maxLength={1000}
          className="bg-background resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {reviewText.length}/1000 characters
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <Label className="text-sm font-bold uppercase tracking-wide mb-2 block">
          Add Photos (Optional)
        </Label>
        <div className="flex flex-wrap gap-3">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative w-20 h-20">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          
          {images.length < 3 && (
            <label className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
              <ImagePlus size={24} className="text-muted-foreground" />
              <input
                type="file"
                accept={ALLOWED_IMAGE_ACCEPT}
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Up to 3 images (WebP only)
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full py-6 font-bold uppercase tracking-wider"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Your review will be visible after moderation
      </p>
    </form>
  );
};

export default ReviewForm;
