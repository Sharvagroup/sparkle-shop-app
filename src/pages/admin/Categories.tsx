import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Info, ImageIcon, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  Category,
  CategoryInput,
} from '@/hooks/useCategories';
import CategoryForm from '@/components/admin/CategoryForm';
import { CategoryItemThemeDialog } from '@/components/admin/CategoryItemThemeDialog';

const Categories = () => {
  const { data: categories = [], isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [itemThemeCategory, setItemThemeCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete category');
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = async (data: CategoryInput & { id?: string }) => {
    try {
      if (data.id) {
        await updateCategory.mutateAsync(data as CategoryInput & { id: string });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync(data);
        toast.success('Category created successfully');
      }
      setFormOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error('Submit error:', error);
      if (error?.message?.includes('duplicate key')) {
        toast.error('A category with this slug already exists');
      } else {
        toast.error('Failed to save category');
      }
    }
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '–';
    const parent = categories.find((c) => c.id === parentId);
    return parent?.name || '–';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground">Organize your product catalog</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 border rounded-lg p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Categories vs Collections</p>
          <p className="text-muted-foreground">
            Categories are product types (e.g., "Rings", "Necklaces", "Earrings")
            used for navigation and filtering products. Collections are thematic
            or seasonal groupings managed separately in the Collections section.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="w-20">Order</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No categories found</p>
                  <Button variant="link" onClick={handleAdd} className="mt-2">
                    Add your first category
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getParentName(category.parent_id)}
                  </TableCell>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItemThemeCategory(category)}
                        title="Theme"
                      >
                        <Paintbrush className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Category Form Dialog */}
      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={createCategory.isPending || updateCategory.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Item Theme Dialog */}
      <CategoryItemThemeDialog
        open={!!itemThemeCategory}
        onOpenChange={(open) => !open && setItemThemeCategory(null)}
        category={itemThemeCategory}
      />
    </div>
  );
};

export default Categories;