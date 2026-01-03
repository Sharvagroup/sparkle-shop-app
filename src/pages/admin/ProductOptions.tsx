import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminProductOptions,
  useCreateProductOption,
  useUpdateProductOption,
  useDeleteProductOption,
  ProductOption,
  ProductOptionInput,
} from "@/hooks/useProductOptions";
import ProductOptionForm from "@/components/admin/ProductOptionForm";

const ProductOptions = () => {
  const { data: options = [], isLoading } = useAdminProductOptions();
  const createOption = useCreateProductOption();
  const updateOption = useUpdateProductOption();
  const deleteOption = useDeleteProductOption();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ProductOption | null>(null);
  const [deletingOption, setDeletingOption] = useState<ProductOption | null>(null);

  const handleCreate = async (data: ProductOptionInput) => {
    await createOption.mutateAsync(data);
    setIsFormOpen(false);
  };

  const handleUpdate = async (data: ProductOptionInput) => {
    if (!editingOption) return;
    await updateOption.mutateAsync({ id: editingOption.id, ...data });
    setEditingOption(null);
  };

  const handleDelete = async () => {
    if (!deletingOption) return;
    await deleteOption.mutateAsync(deletingOption.id);
    setDeletingOption(null);
  };

  const toggleEnabled = async (option: ProductOption) => {
    await updateOption.mutateAsync({
      id: option.id,
      name: option.name,
      type: option.type,
      is_enabled: !option.is_enabled,
    });
  };

  const toggleMandatory = async (option: ProductOption) => {
    await updateOption.mutateAsync({
      id: option.id,
      name: option.name,
      type: option.type,
      is_mandatory: !option.is_mandatory,
    });
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      number: "bg-blue-100 text-blue-800",
      select: "bg-purple-100 text-purple-800",
      text: "bg-green-100 text-green-800",
      boolean: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge variant="outline" className={colors[type] || ""}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-display">Product Options</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure global options like quantity, weight, size, color that can be enabled per product.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Option
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Options</CardTitle>
          <CardDescription>
            These options can be selectively enabled for each product. Mandatory options will always show for enabled products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : options.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No product options configured yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Range/Options</TableHead>
                  <TableHead className="text-center">Mandatory</TableHead>
                  <TableHead className="text-center">Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {options.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell className="font-medium">{option.name}</TableCell>
                    <TableCell>{getTypeBadge(option.type)}</TableCell>
                    <TableCell>{option.unit || "-"}</TableCell>
                    <TableCell>
                      {option.type === "number" ? (
                        <span className="text-sm text-muted-foreground">
                          {option.min_value ?? 0} - {option.max_value ?? "∞"} (step: {option.step_value ?? 1})
                        </span>
                      ) : option.type === "select" ? (
                        <span className="text-sm text-muted-foreground">
                          {option.select_options?.slice(0, 3).join(", ")}
                          {(option.select_options?.length || 0) > 3 && "..."}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={option.is_mandatory}
                        onCheckedChange={() => toggleMandatory(option)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={option.is_enabled}
                        onCheckedChange={() => toggleEnabled(option)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingOption(option)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingOption(option)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen || !!editingOption} onOpenChange={(open) => {
        if (!open) {
          setIsFormOpen(false);
          setEditingOption(null);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingOption ? "Edit Option" : "Add Product Option"}
            </DialogTitle>
          </DialogHeader>
          <ProductOptionForm
            option={editingOption}
            onSubmit={editingOption ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingOption(null);
            }}
            isLoading={createOption.isPending || updateOption.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingOption} onOpenChange={(open) => !open && setDeletingOption(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Option</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingOption?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductOptions;
