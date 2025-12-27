import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, Search, Calendar } from "lucide-react";
import { useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer, Offer, OfferInsert } from "@/hooks/useOffers";
import { OfferForm } from "@/components/admin/OfferForm";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Offers = () => {
  const { data: offers = [], isLoading } = useOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setEditingOffer(null);
    setFormOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormOpen(true);
  };

  const handleSubmit = async (data: OfferInsert) => {
    if (editingOffer) {
      await updateOffer.mutateAsync({ id: editingOffer.id, ...data });
    } else {
      await createOffer.mutateAsync(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteOffer.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const isOfferActive = (offer: Offer) => {
    if (!offer.is_active) return false;
    const now = new Date();
    if (offer.start_date && new Date(offer.start_date) > now) return false;
    if (offer.end_date && new Date(offer.end_date) < now) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offers</h1>
          <p className="text-muted-foreground">Manage promotional offers and popup banners</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Offer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search offers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Discount Code</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredOffers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No offers found
                </TableCell>
              </TableRow>
            ) : (
              filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="h-12 w-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      {offer.subtitle && (
                        <p className="text-sm text-muted-foreground">{offer.subtitle}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {offer.discount_code ? (
                      <Badge variant="secondary">{offer.discount_code}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {offer.start_date
                        ? format(new Date(offer.start_date), "MMM d")
                        : "—"}
                      {" → "}
                      {offer.end_date
                        ? format(new Date(offer.end_date), "MMM d")
                        : "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isOfferActive(offer) ? "default" : "secondary"}>
                      {isOfferActive(offer) ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(offer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(offer.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OfferForm
        open={formOpen}
        onOpenChange={setFormOpen}
        offer={editingOffer}
        onSubmit={handleSubmit}
        isLoading={createOffer.isPending || updateOffer.isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this offer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Offers;
