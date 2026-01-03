import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category, CategoryInput, uploadCategoryImage } from '@/hooks/useCategories';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { validateWebPImage, validateImageSize, ALLOWED_IMAGE_ACCEPT } from '@/lib/imageValidation';

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
  onSubmit: (data: CategoryInput & { id?: string }) => void;
  isLoading?: boolean;
}

const CategoryForm = ({
  open,
  onOpenChange,
  category,
  categories,
  onSubmit,
  isLoading,
}: CategoryFormProps) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setImageUrl(category.image_url);
      setParentId(category.parent_id);
      setDisplayOrder(category.display_order);
      setIsActive(category.is_active);
    } else {
      setName('');
      setSlug('');
      setImageUrl(null);
      setParentId(null);
      setDisplayOrder(0);
      setIsActive(true);
    }
  }, [category, open]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!category) {
      setSlug(generateSlug(value));
    }
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
      const url = await uploadCategoryImage(file);
      setImageUrl(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    onSubmit({
      id: category?.id,
      name: name.trim(),
      slug: slug.trim(),
      image_url: imageUrl,
      parent_id: parentId,
      display_order: displayOrder,
      is_active: isActive,
    });
  };

  // Filter out current category from parent options to prevent self-reference
  const parentOptions = categories.filter((c) => c.id !== category?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Necklaces"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., necklaces"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier. Auto-generated from name.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              {imageUrl ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <img
                    src={imageUrl}
                    alt="Category"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">
                    {uploading ? 'Uploading...' : 'Upload'}
                  </span>
                  <input
                    type="file"
                    accept={ALLOWED_IMAGE_ACCEPT}
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Parent Category</Label>
            <Select
              value={parentId || 'none'}
              onValueChange={(value) =>
                setParentId(value === 'none' ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top-level)</SelectItem>
                {parentOptions.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;