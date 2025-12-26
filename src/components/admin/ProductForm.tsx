import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminCategories } from '@/hooks/useCategories';
import { useAdminCollections } from '@/hooks/useCollections';
import { Product, uploadProductImages, deleteProductImage } from '@/hooks/useProducts';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  sku: z.string().max(50).optional().nullable(),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().max(500).optional().nullable(),
  long_description: z.string().max(5000).optional().nullable(),
  category_id: z.string().optional().nullable(),
  collection_id: z.string().optional().nullable(),
  is_new_arrival: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
  is_celebrity_special: z.boolean().default(false),
  price: z.coerce.number().min(0, 'Price must be positive'),
  original_price: z.coerce.number().min(0).optional().nullable(),
  material: z.string().max(100).optional().nullable(),
  care_instructions: z.string().max(1000).optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  low_stock_threshold: z.coerce.number().int().min(0).default(5),
  badge: z.enum(['new', 'sale', 'trending']).optional().nullable(),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData & { images: string[] }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const { data: categories = [] } = useAdminCategories();
  const { data: collections = [] } = useAdminCollections();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      slug: product?.slug || '',
      description: product?.description || '',
      long_description: product?.long_description || '',
      category_id: product?.category_id || '',
      collection_id: product?.collection_id || '',
      is_new_arrival: product?.is_new_arrival || false,
      is_best_seller: product?.is_best_seller || false,
      is_celebrity_special: product?.is_celebrity_special || false,
      price: product?.price || 0,
      original_price: product?.original_price || null,
      material: product?.material || '',
      care_instructions: product?.care_instructions || '',
      stock_quantity: product?.stock_quantity || 0,
      low_stock_threshold: product?.low_stock_threshold || 5,
      badge: product?.badge || null,
      display_order: product?.display_order || 0,
      is_active: product?.is_active ?? true,
    },
  });

  // Auto-generate slug from name
  const name = form.watch('name');
  useEffect(() => {
    if (!product && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      form.setValue('slug', slug);
    }
  }, [name, product, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImages(true);
    try {
      const newUrls = await uploadProductImages(Array.from(files));
      setImages((prev) => [...prev, ...newUrls]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error(error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      await deleteProductImage(imageUrl);
      setImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success('Image removed');
    } catch (error) {
      toast.error('Failed to remove image');
      console.error(error);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit({
      ...data,
      images,
      category_id: data.category_id || null,
      collection_id: data.collection_id || null,
      original_price: data.original_price || null,
      badge: data.badge || null,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Gold Plated Necklace" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-001" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input placeholder="gold-plated-necklace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief product description..."
                      rows={2}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="long_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed product description..."
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "_none" ? "" : val)}
                      value={field.value || "_none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_none">None</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collection_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "_none" ? "" : val)}
                      value={field.value || "_none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_none">None</SelectItem>
                        {collections.map((col) => (
                          <SelectItem key={col.id} value={col.id}>
                            {col.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Special Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Special Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="is_new_arrival"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Arrival</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show in New Arrivals section
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_best_seller"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Best Seller</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show in Best Sellers section
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_celebrity_special"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Celebrity Special</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show in Celebrity Specials section
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="original_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="For showing discount"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product Images</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  {uploadingImages ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Brass, Gold Plated"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="care_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Care Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How to care for this product..."
                      rows={2}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="low_stock_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Display & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="badge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "_none" ? null : val)}
                      value={field.value || "_none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="No badge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_none">None</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <p className="text-sm text-muted-foreground">Show on storefront</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
