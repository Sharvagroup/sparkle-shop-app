import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, FileSpreadsheet, Image, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCategories } from '@/hooks/useCategories';
import { useAdminCollections } from '@/hooks/useCollections';
import { useAdminProductOptions } from '@/hooks/useProductOptions';
import { validateWebPImage, validateImageSize } from '@/lib/imageValidation';

interface BulkProductUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ParsedProduct {
  row: number;
  name: string;
  sku: string;
  slug: string;
  description: string;
  long_description: string;
  category_slug: string;
  collection_slug: string;
  price: number;
  original_price: number | null;
  material: string;
  care_instructions: string;
  stock_quantity: number;
  low_stock_threshold: number;
  badge: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_celebrity_special: boolean;
  is_active: boolean;
  display_order: number;
  enabled_options: string;
  video_url: string;
  errors: string[];
  images: string[];
}

interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'uploading' | 'complete' | 'error';
}

const CSV_HEADERS = [
  'name',
  'sku',
  'slug',
  'description',
  'long_description',
  'category_slug',
  'collection_slug',
  'price',
  'original_price',
  'material',
  'care_instructions',
  'stock_quantity',
  'low_stock_threshold',
  'badge',
  'is_new_arrival',
  'is_best_seller',
  'is_celebrity_special',
  'is_active',
  'display_order',
  'enabled_options',
  'video_url',
];

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const BulkProductUpload = ({ open, onOpenChange, onSuccess }: BulkProductUploadProps) => {
  const { data: categories = [] } = useAdminCategories();
  const { data: collections = [] } = useAdminCollections();
  const { data: productOptions = [] } = useAdminProductOptions();

  const [step, setStep] = useState<'template' | 'upload' | 'images' | 'review' | 'progress'>('template');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ current: 0, total: 0, status: 'idle' });
  const [productImages, setProductImages] = useState<Record<string, File[]>>({});

  const csvInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    // Create CSV content with headers and example row
    const exampleRow = [
      'Example Product Name',
      'SKU-001',
      'example-product-name',
      'Short description of the product',
      'Detailed long description with all product information',
      categories[0]?.slug || 'category-slug',
      collections[0]?.slug || 'collection-slug',
      '1999',
      '2499',
      'Cotton',
      'Hand wash only',
      '100',
      '10',
      'new',
      'true',
      'false',
      'false',
      'true',
      '1',
      productOptions.map(o => o.id).join(';') || '',
      '',
    ];

    const csvContent = [
      CSV_HEADERS.join(','),
      exampleRow.map(v => `"${v}"`).join(','),
    ].join('\n');

    // Add reference data as comments
    const referenceData = [
      '',
      '# REFERENCE DATA (Delete these lines before uploading)',
      '# Categories: ' + categories.map(c => `${c.slug}`).join(', '),
      '# Collections: ' + collections.map(c => `${c.slug}`).join(', '),
      '# Product Options (IDs): ' + productOptions.map(o => `${o.name}: ${o.id}`).join(', '),
      '# Badge values: new, sale, trending (or leave empty)',
      '# Boolean values: true or false',
      '# enabled_options: semicolon-separated option IDs',
    ].join('\n');

    const blob = new Blob([csvContent + '\n' + referenceData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'product_bulk_upload_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success('Template downloaded successfully');
  };

  const parseCSV = (content: string): string[][] => {
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentLine.push(currentField.trim());
          currentField = '';
        } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
          if (char === '\r') i++;
          currentLine.push(currentField.trim());
          if (currentLine.some(field => field !== '')) {
            lines.push(currentLine);
          }
          currentLine = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }
    }

    // Handle last line
    if (currentField || currentLine.length > 0) {
      currentLine.push(currentField.trim());
      if (currentLine.some(field => field !== '')) {
        lines.push(currentLine);
      }
    }

    return lines;
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    try {
      const content = await file.text();
      const lines = parseCSV(content);

      // Skip comment lines and empty lines
      const dataLines = lines.filter(line => !line[0]?.startsWith('#'));

      if (dataLines.length < 2) {
        toast.error('CSV must have at least one data row');
        return;
      }

      const headers = dataLines[0].map(h => h.toLowerCase().trim());
      const products: ParsedProduct[] = [];

      // Validate headers
      const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        toast.error(`Missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }

      for (let i = 1; i < dataLines.length; i++) {
        const row = dataLines[i];
        const errors: string[] = [];

        const getValue = (header: string): string => {
          const idx = headers.indexOf(header);
          return idx >= 0 ? (row[idx] || '').trim() : '';
        };

        const name = getValue('name');
        const price = parseFloat(getValue('price'));
        const slug = getValue('slug') || generateSlug(name);

        // Validate required fields
        if (!name) errors.push('Name is required');
        if (isNaN(price) || price <= 0) errors.push('Valid price is required');

        // Validate category
        const categorySlug = getValue('category_slug');
        const category = categories.find(c => c.slug === categorySlug);
        if (categorySlug && !category) {
          errors.push(`Category "${categorySlug}" not found`);
        }

        // Validate collection
        const collectionSlug = getValue('collection_slug');
        const collection = collections.find(c => c.slug === collectionSlug);
        if (collectionSlug && !collection) {
          errors.push(`Collection "${collectionSlug}" not found`);
        }

        // Validate badge
        const badge = getValue('badge').toLowerCase();
        if (badge && !['new', 'sale', 'trending', ''].includes(badge)) {
          errors.push('Badge must be: new, sale, trending, or empty');
        }

        const originalPrice = getValue('original_price');

        products.push({
          row: i + 1,
          name,
          sku: getValue('sku'),
          slug,
          description: getValue('description'),
          long_description: getValue('long_description'),
          category_slug: categorySlug,
          collection_slug: collectionSlug,
          price,
          original_price: originalPrice ? parseFloat(originalPrice) : null,
          material: getValue('material'),
          care_instructions: getValue('care_instructions'),
          stock_quantity: parseInt(getValue('stock_quantity')) || 0,
          low_stock_threshold: parseInt(getValue('low_stock_threshold')) || 5,
          badge,
          is_new_arrival: getValue('is_new_arrival').toLowerCase() === 'true',
          is_best_seller: getValue('is_best_seller').toLowerCase() === 'true',
          is_celebrity_special: getValue('is_celebrity_special').toLowerCase() === 'true',
          is_active: getValue('is_active').toLowerCase() !== 'false',
          display_order: parseInt(getValue('display_order')) || 0,
          enabled_options: getValue('enabled_options'),
          video_url: getValue('video_url'),
          errors,
          images: [],
        });
      }

      setParsedProducts(products);
      setStep('images');
      toast.success(`Parsed ${products.length} products from CSV`);
    } catch (error) {
      console.error('CSV parsing error:', error);
      toast.error('Failed to parse CSV file');
    }

    // Reset input
    if (csvInputRef.current) {
      csvInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: Record<string, File[]> = { ...productImages };
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      // Validate WebP format
      const formatCheck = validateWebPImage(file);
      if (!formatCheck.valid) {
        invalidFiles.push(file.name);
        return;
      }

      // Validate size
      const sizeCheck = validateImageSize(file, 5);
      if (!sizeCheck.valid) {
        invalidFiles.push(`${file.name} (too large)`);
        return;
      }

      // Extract product identifier from filename
      // Expected format: slug_1.webp, slug_2.webp, etc.
      // Or: sku_1.webp, sku_2.webp, etc.
      const nameWithoutExt = file.name.replace(/\.webp$/i, '');
      const parts = nameWithoutExt.split('_');
      const identifier = parts.slice(0, -1).join('_') || nameWithoutExt;

      // Try to match with product slug or SKU
      const product = parsedProducts.find(
        p => p.slug.toLowerCase() === identifier.toLowerCase() ||
             p.sku.toLowerCase() === identifier.toLowerCase()
      );

      if (product) {
        const key = product.slug;
        if (!newImages[key]) {
          newImages[key] = [];
        }
        newImages[key].push(file);
      } else {
        // If no match, try partial matching
        const partialMatch = parsedProducts.find(
          p => identifier.toLowerCase().includes(p.slug.toLowerCase()) ||
               (p.sku && identifier.toLowerCase().includes(p.sku.toLowerCase()))
        );
        if (partialMatch) {
          const key = partialMatch.slug;
          if (!newImages[key]) {
            newImages[key] = [];
          }
          newImages[key].push(file);
        }
      }
    });

    setProductImages(newImages);

    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} files skipped (not WebP or too large)`);
    }

    const totalMatched = Object.values(newImages).reduce((sum, arr) => sum + arr.length, 0);
    toast.success(`${totalMatched} images matched to products`);

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeProductImage = (slug: string, index: number) => {
    setProductImages(prev => {
      const newImages = { ...prev };
      if (newImages[slug]) {
        newImages[slug] = newImages[slug].filter((_, i) => i !== index);
        if (newImages[slug].length === 0) {
          delete newImages[slug];
        }
      }
      return newImages;
    });
  };

  const uploadProducts = async () => {
    const validProducts = parsedProducts.filter(p => p.errors.length === 0);
    if (validProducts.length === 0) {
      toast.error('No valid products to upload');
      return;
    }

    setStep('progress');
    setUploadProgress({ current: 0, total: validProducts.length, status: 'uploading' });

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < validProducts.length; i++) {
      const product = validProducts[i];

      try {
        // Upload images first
        const imageUrls: string[] = [];
        const images = productImages[product.slug] || [];

        for (const imageFile of images) {
          const fileName = `${crypto.randomUUID()}.webp`;
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, imageFile);

          if (!uploadError) {
            const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
            imageUrls.push(data.publicUrl);
          }
        }

        // Find category and collection IDs
        const category = categories.find(c => c.slug === product.category_slug);
        const collection = collections.find(c => c.slug === product.collection_slug);

        // Parse enabled options
        const enabledOptions = product.enabled_options
          ? product.enabled_options.split(';').filter(Boolean)
          : [];

        // Insert product
        const { error: insertError } = await supabase.from('products').insert({
          name: product.name,
          sku: product.sku || null,
          slug: product.slug,
          description: product.description || null,
          long_description: product.long_description || null,
          category_id: category?.id || null,
          collection_id: collection?.id || null,
          price: product.price,
          original_price: product.original_price,
          material: product.material || null,
          care_instructions: product.care_instructions || null,
          stock_quantity: product.stock_quantity,
          low_stock_threshold: product.low_stock_threshold,
          badge: product.badge || null,
          is_new_arrival: product.is_new_arrival,
          is_best_seller: product.is_best_seller,
          is_celebrity_special: product.is_celebrity_special,
          is_active: product.is_active,
          display_order: product.display_order,
          enabled_options: enabledOptions,
          video_url: product.video_url || null,
          images: imageUrls,
          has_addons: false,
        });

        if (insertError) throw insertError;
        successCount++;
      } catch (error) {
        console.error(`Failed to upload product: ${product.name}`, error);
        errorCount++;
      }

      setUploadProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setUploadProgress(prev => ({ ...prev, status: 'complete' }));

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} products`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} products`);
    }

    onSuccess();
  };

  const handleClose = () => {
    setStep('template');
    setParsedProducts([]);
    setProductImages({});
    setUploadProgress({ current: 0, total: 0, status: 'idle' });
    onOpenChange(false);
  };

  const validProductCount = parsedProducts.filter(p => p.errors.length === 0).length;
  const errorProductCount = parsedProducts.filter(p => p.errors.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Product Upload</DialogTitle>
          <DialogDescription>
            Upload multiple products at once using a CSV file
          </DialogDescription>
        </DialogHeader>

        {step === 'template' && (
          <div className="space-y-6 py-4">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Step 1: Download Template
              </h3>
              <p className="text-sm text-muted-foreground">
                Download the CSV template with all product fields. The template includes reference data for categories, collections, and product options.
              </p>
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Step 2: Upload Filled CSV
              </h3>
              <p className="text-sm text-muted-foreground">
                Fill in your product data and upload the CSV file. Products without addons - you can add addons later by editing individual products.
              </p>
              <div>
                <Input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Available Reference Data:</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-medium text-foreground mb-1">Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {categories.slice(0, 10).map(c => (
                      <Badge key={c.id} variant="outline" className="text-xs">{c.slug}</Badge>
                    ))}
                    {categories.length > 10 && <Badge variant="outline">+{categories.length - 10} more</Badge>}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Collections:</p>
                  <div className="flex flex-wrap gap-1">
                    {collections.slice(0, 10).map(c => (
                      <Badge key={c.id} variant="outline" className="text-xs">{c.slug}</Badge>
                    ))}
                    {collections.length > 10 && <Badge variant="outline">+{collections.length - 10} more</Badge>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'images' && (
          <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Image className="w-5 h-5" />
                Step 3: Upload Product Images (Optional)
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload WebP images. Name them using: <code className="bg-background px-1 rounded">slug_1.webp</code>, <code className="bg-background px-1 rounded">slug_2.webp</code> or <code className="bg-background px-1 rounded">sku_1.webp</code>
              </p>
              <Input
                ref={imageInputRef}
                type="file"
                accept="image/webp,.webp"
                multiple
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="default">{validProductCount}</Badge>
                <span className="text-muted-foreground">Valid products</span>
              </div>
              {errorProductCount > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{errorProductCount}</Badge>
                  <span className="text-muted-foreground">With errors</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{Object.values(productImages).reduce((sum, arr) => sum + arr.length, 0)}</Badge>
                <span className="text-muted-foreground">Images uploaded</span>
              </div>
            </div>

            <ScrollArea className="flex-1 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">Row</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedProducts.map((product) => (
                    <TableRow key={product.row}>
                      <TableCell className="text-muted-foreground">{product.row}</TableCell>
                      <TableCell className="font-medium">{product.name || '-'}</TableCell>
                      <TableCell>{product.sku || '-'}</TableCell>
                      <TableCell>₹{product.price || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {(productImages[product.slug] || []).map((file, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="w-8 h-8 object-cover rounded"
                              />
                              <button
                                onClick={() => removeProductImage(product.slug, idx)}
                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 m-0.5" />
                              </button>
                            </div>
                          ))}
                          {(!productImages[product.slug] || productImages[product.slug].length === 0) && (
                            <span className="text-muted-foreground text-xs">No images</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.errors.length > 0 ? (
                          <div className="flex items-start gap-1">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                            <span className="text-destructive text-xs">{product.errors.join(', ')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 text-xs">Valid</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('template')}>
                Back
              </Button>
              <Button 
                onClick={uploadProducts} 
                disabled={validProductCount === 0}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {validProductCount} Products
              </Button>
            </div>
          </div>
        )}

        {step === 'progress' && (
          <div className="py-8 space-y-6">
            <div className="text-center space-y-2">
              {uploadProgress.status === 'uploading' ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="font-medium">Uploading products...</p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                  <p className="font-medium">Upload complete!</p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{uploadProgress.current} / {uploadProgress.total}</span>
              </div>
              <Progress value={(uploadProgress.current / uploadProgress.total) * 100} />
            </div>

            {uploadProgress.status === 'complete' && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can now add addons to individual products by editing them.
                </p>
                <Button onClick={handleClose}>
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
