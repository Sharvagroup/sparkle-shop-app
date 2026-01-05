import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Link as LinkIcon, ExternalLink, Loader2, GripVertical } from "lucide-react";
import { useFooterLinks, useCreateFooterLink, useUpdateFooterLink, useDeleteFooterLink, FooterLink, FooterLinkInsert } from "@/hooks/useFooterLinks";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkUrlAutocomplete } from "@/components/admin/LinkUrlAutocomplete";

const sectionLabels: Record<string, string> = {
  shop: "Shop",
  support: "Support",
  connect: "Connect",
};

const FooterLinks = () => {
  const { data: links = [], isLoading } = useFooterLinks();
  const createLink = useCreateFooterLink();
  const updateLink = useUpdateFooterLink();
  const deleteLink = useDeleteFooterLink();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FooterLink | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [section, setSection] = useState("shop");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [isExternal, setIsExternal] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const groupedLinks = links.reduce((acc, link) => {
    const sec = link.section || "other";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  const resetForm = () => {
    setSection("shop");
    setLabel("");
    setUrl("");
    setIcon("");
    setIsExternal(false);
    setDisplayOrder(0);
    setIsActive(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    resetForm();
    setFormOpen(true);
  };

  const handleEdit = (item: FooterLink) => {
    setEditingItem(item);
    setSection(item.section);
    setLabel(item.label);
    setUrl(item.url);
    setIcon(item.icon || "");
    setIsExternal(item.is_external || false);
    setDisplayOrder(item.display_order || 0);
    setIsActive(item.is_active ?? true);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: FooterLinkInsert = {
      section,
      label,
      url,
      icon: icon || null,
      is_external: isExternal,
      display_order: displayOrder,
      is_active: isActive,
    };

    if (editingItem) {
      await updateLink.mutateAsync({ id: editingItem.id, ...data });
    } else {
      await createLink.mutateAsync(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteLink.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Footer Links</h1>
          <p className="text-muted-foreground">Manage footer navigation links</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(sectionLabels).map(([key, sectionLabel]) => {
            const sectionLinks = groupedLinks[key] || [];
            return (
              <div key={key} className="border rounded-lg">
                <div className="bg-muted px-4 py-3 border-b">
                  <h3 className="font-semibold">{sectionLabel}</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionLinks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No links in this section
                        </TableCell>
                      </TableRow>
                    ) : (
                      sectionLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          </TableCell>
                          <TableCell className="font-medium">{link.label}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {link.url}
                          </TableCell>
                          <TableCell>
                            {link.is_external ? (
                              <Badge variant="outline" className="gap-1">
                                <ExternalLink className="h-3 w-3" />
                                External
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <LinkIcon className="h-3 w-3 mr-1" />
                                Internal
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={link.is_active ? "default" : "secondary"}>
                              {link.is_active ? "Active" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(link)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId(link.id)}>
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
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Link" : "Add Link"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Section *</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="connect">Connect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>URL *</Label>
                <LinkUrlAutocomplete value={url} onChange={setUrl} placeholder="Select a page or type a URL..." />
              </div>
            </div>

            {section === "connect" && (
              <div className="space-y-2">
                <Label>Icon Name</Label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g., facebook, instagram" />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch id="external" checked={isExternal} onCheckedChange={setIsExternal} />
                <Label htmlFor="external">External</Label>
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createLink.isPending || updateLink.isPending}>
                {(createLink.isPending || updateLink.isPending) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FooterLinks;
