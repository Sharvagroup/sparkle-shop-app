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
  useAdminCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  Collection,
  CollectionInput,
} from '@/hooks/useCollections';
import CollectionForm from '@/components/admin/CollectionForm';
import { CollectionItemThemeDialog } from '@/components/admin/CollectionItemThemeDialog';

const Collections = () => {
  const { data: collections = [], isLoading } = useAdminCollections();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [itemThemeCollection, setItemThemeCollection] = useState<Collection | null>(null);

  const handleAdd = () => {
    setEditingCollection(null);
    setFormOpen(true);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormOpen(true);
  };

  const handleDelete = (collection: Collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!collectionToDelete) return;

    try {
      await deleteCollection.mutateAsync(collectionToDelete.id);
      toast.success('Collection deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete collection');
    } finally {
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };

  const handleSubmit = async (data: CollectionInput & { id?: string }) => {
    try {
      if (data.id) {
        await updateCollection.mutateAsync(data as CollectionInput & { id: string });
        toast.success('Collection updated successfully');
      } else {
        await createCollection.mutateAsync(data);
        toast.success('Collection created successfully');
      }
      setFormOpen(false);
      setEditingCollection(null);
    } catch (error: any) {
      console.error('Submit error:', error);
      if (error?.message?.includes('duplicate key')) {
        toast.error('A collection with this slug already exists');
      } else {
        toast.error('Failed to save collection');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Collections</h1>
          <p className="text-muted-foreground">Curate themed product groupings</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Collection
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 border rounded-lg p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Collections vs Categories</p>
          <p className="text-muted-foreground">
            Collections are thematic or seasonal groupings (e.g., "Bridal Collection", "Temple Collection"). 
            They differ from Categories which are product types like "Necklaces" or "Earrings".
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
              <TableHead className="w-20">Order</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : collections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No collections found</p>
                  <Button variant="link" onClick={handleAdd} className="mt-2">
                    Add your first collection
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    {collection.image_url ? (
                      <img
                        src={collection.image_url}
                        alt={collection.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{collection.name}</p>
                      {collection.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {collection.slug}
                  </TableCell>
                  <TableCell>{collection.display_order}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        collection.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {collection.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItemThemeCollection(collection)}
                        title="Theme"
                      >
                        <Paintbrush className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(collection)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(collection)}
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

      {/* Collection Form Dialog */}
      <CollectionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        collection={editingCollection}
        onSubmit={handleSubmit}
        isLoading={createCollection.isPending || updateCollection.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{collectionToDelete?.name}"? This
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

      {/* Collection Item Theme Dialog */}
      <CollectionItemThemeDialog
        open={!!itemThemeCollection}
        onOpenChange={(open) => !open && setItemThemeCollection(null)}
        collection={itemThemeCollection}
      />
    </div>
  );
};

export default Collections;
