import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Calendar, Image, Tag, Type, Paintbrush, Save } from "lucide-react";
import { useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer, Offer, OfferInsert, OfferType } from "@/hooks/useOffers";
import { OfferForm } from "@/components/admin/OfferForm";
import { OfferItemThemeDialog } from "@/components/admin/OfferItemThemeDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useSiteSetting, useUpdateSiteSetting } from "@/hooks/useSiteSettings";

const Offers = () => {
  const { data: offers = [], isLoading } = useOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const updateSetting = useUpdateSiteSetting();

  const { data: scrollEnabledData } = useSiteSetting<{ enabled: boolean } | undefined>("scroll_offer_enabled");
  const { data: scrollSpeedData } = useSiteSetting<{ seconds: number } | undefined>("scroll_offer_speed");
  const { data: scrollSeparatorData } = useSiteSetting<{ separator: string } | undefined>("scroll_offer_separator");
  const { data: scrollDismissData } = useSiteSetting<{ showDismiss: boolean } | undefined>("scroll_offer_dismiss");

  // No fallbacks - require explicit admin configuration
  const dbScrollEnabled = scrollEnabledData?.enabled;
  const dbScrollSpeed = scrollSpeedData?.seconds ?? 25;
  const dbScrollSeparator = scrollSeparatorData?.separator ?? "•";
  const dbScrollShowDismiss = scrollDismissData?.showDismiss ?? true;

  // Local state for manual saving
  const [localScrollEnabled, setLocalScrollEnabled] = useState<boolean | undefined>(undefined);
  const [localScrollSpeed, setLocalScrollSpeed] = useState<number>(25);
  const [localScrollSeparator, setLocalScrollSeparator] = useState<string>("•");
  const [localScrollDismiss, setLocalScrollDismiss] = useState<boolean>(true);

  // Initialize local state from DB data
  useEffect(() => {
    if (scrollEnabledData) setLocalScrollEnabled(scrollEnabledData.enabled);
    if (scrollSpeedData) setLocalScrollSpeed(scrollSpeedData.seconds);
    if (scrollSeparatorData) setLocalScrollSeparator(scrollSeparatorData.separator);
    if (scrollDismissData) setLocalScrollDismiss(scrollDismissData.showDismiss);
  }, [scrollEnabledData, scrollSpeedData, scrollSeparatorData, scrollDismissData]);

  const [activeTab, setActiveTab] = useState<string>("offer_banner");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [itemThemeOffer, setItemThemeOffer] = useState<Offer | null>(null);

  // Filter offers by type and search
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = offer.offer_type === activeTab || (!offer.offer_type && activeTab === "special_offer");
    return matchesSearch && matchesType;
  });

  // Get scroll preview text
  const scrollPreviewText = offers
    .filter(o => o.is_active)
    .map(o => o.discount_code ? `${o.title} - Use code: ${o.discount_code}` : o.title)
    .join(` ${localScrollSeparator} `);

  const handleCreate = () => {
    setEditingOffer(null);
    setFormOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormOpen(true);
  };

  const handleSubmit = async (data: OfferInsert) => {
    // Set offer_type based on active tab
    const offerData = { ...data, offer_type: activeTab as OfferType };

    if (editingOffer) {
      await updateOffer.mutateAsync({ id: editingOffer.id, ...offerData });
    } else {
      await createOffer.mutateAsync(offerData);
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

  const handleScrollEnabledChange = (enabled: string) => {
    setLocalScrollEnabled(enabled === "enabled");
  };

  const handleScrollSpeedChange = (seconds: number) => {
    setLocalScrollSpeed(seconds);
  };

  const handleScrollSeparatorChange = (separator: string) => {
    setLocalScrollSeparator(separator);
  };

  const handleScrollDismissChange = (showDismiss: boolean) => {
    setLocalScrollDismiss(showDismiss);
  };

  const handleSaveScrollSettings = async () => {
    try {
      if (localScrollEnabled !== undefined) {
        await updateSetting.mutateAsync({ key: "scroll_offer_enabled", value: { enabled: localScrollEnabled }, category: "offers" });
      }
      await updateSetting.mutateAsync({ key: "scroll_offer_speed", value: { seconds: localScrollSpeed }, category: "offers" });
      await updateSetting.mutateAsync({ key: "scroll_offer_separator", value: { separator: localScrollSeparator }, category: "offers" });
      await updateSetting.mutateAsync({ key: "scroll_offer_dismiss", value: { showDismiss: localScrollDismiss }, category: "offers" });

      toast.success("Scroll offer settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const renderOfferTable = () => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Title</TableHead>
            {activeTab === "special_offer" && <TableHead>Discount Code</TableHead>}
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
                {activeTab === "special_offer" && <TableCell><Skeleton className="h-4 w-20" /></TableCell>}
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : filteredOffers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={activeTab === "special_offer" ? 6 : 5} className="text-center py-8 text-muted-foreground">
                No {activeTab === "offer_banner" ? "banners" : "offers"} found
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
                {activeTab === "special_offer" && (
                  <TableCell>
                    {offer.discount_code ? (
                      <Badge variant="secondary">{offer.discount_code}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
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
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setItemThemeOffer(offer)}
                      title="Theme"
                    >
                      <Paintbrush className="h-4 w-4" />
                    </Button>
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
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Offers</h1>
        <p className="text-muted-foreground">Manage promotional offers across your store</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="offer_banner" className="gap-2">
            <Image className="h-4 w-4" />
            Offer Banner
          </TabsTrigger>
          <TabsTrigger value="special_offer" className="gap-2">
            <Tag className="h-4 w-4" />
            Special Offer
          </TabsTrigger>
          <TabsTrigger value="scroll_offer" className="gap-2">
            <Type className="h-4 w-4" />
            Scroll Offer
          </TabsTrigger>
        </TabsList>

        {/* Offer Banner Tab */}
        <TabsContent value="offer_banner" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Offer Banners</CardTitle>
              <CardDescription>
                Auto-rotating image banners displayed below the hero section. Add promotional images with links to products or collections.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search banners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </div>

          {renderOfferTable()}
        </TabsContent>

        {/* Special Offer Tab */}
        <TabsContent value="special_offer" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Special Offers</CardTitle>
              <CardDescription>
                Coupon code offers shown as a grid in the Special Offers section. Customers can click to view details and copy discount codes.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Offer
            </Button>
          </div>

          {renderOfferTable()}
        </TabsContent>

        {/* Scroll Offer Tab */}
        <TabsContent value="scroll_offer" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Scroll Offers</CardTitle>
              <CardDescription>
                Text announcements that scroll continuously on the top bar. Titles from both Offer Banners and Special Offers are automatically combined.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable Dropdown */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="scroll-enabled">Enable Scroll Bar</Label>
                  <p className="text-sm text-muted-foreground">Show scrolling offers on the top of the page</p>
                </div>
                <Select
                  value={localScrollEnabled === undefined ? "" : localScrollEnabled ? "enabled" : "disabled"}
                  onValueChange={handleScrollEnabledChange}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Not Set" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Speed Input (seconds) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Scroll Speed (seconds)</Label>
                  <span className="text-sm text-muted-foreground">{localScrollSpeed}s per cycle</span>
                </div>
                <Input
                  type="number"
                  min={5}
                  max={120}
                  value={localScrollSpeed}
                  onChange={(e) => handleScrollSpeedChange(parseInt(e.target.value) || 25)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Duration for one complete scroll cycle (5-120 seconds)
                </p>
              </div>

              {/* Separator Dropdown */}
              <div className="space-y-2">
                <Label>Text Separator</Label>
                <Select value={localScrollSeparator} onValueChange={handleScrollSeparatorChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="•">• (Bullet)</SelectItem>
                    <SelectItem value="|">| (Pipe)</SelectItem>
                    <SelectItem value="—">— (Dash)</SelectItem>
                    <SelectItem value="★">★ (Star)</SelectItem>
                    <SelectItem value="⬥">⬥ (Diamond)</SelectItem>
                    <SelectItem value="✦">✦ (Sparkle)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Character used to separate offer texts
                </p>
              </div>

              {/* Dismiss Button Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="scroll-dismiss">Show Dismiss Button</Label>
                  <p className="text-sm text-muted-foreground">Allow users to close the scroll bar with an X button</p>
                </div>
                <Switch
                  id="scroll-dismiss"
                  checked={localScrollDismiss}
                  onCheckedChange={handleScrollDismissChange}
                />
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview of Scrolling Text</Label>
                <div className="bg-secondary text-secondary-foreground py-3 px-4 rounded-lg overflow-hidden">
                  {scrollPreviewText ? (
                    <p className="text-sm font-medium truncate">{scrollPreviewText}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No active offers to display</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  This text is auto-generated from all active Offer Banners and Special Offers. The separator shown here is a preview.
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleSaveScrollSettings}
                  className="gap-2"
                  disabled={updateSetting.isPending}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <OfferForm
        open={formOpen}
        onOpenChange={setFormOpen}
        offer={editingOffer}
        offerType={activeTab as OfferType}
        onSubmit={handleSubmit}
        isLoading={createOffer.isPending || updateOffer.isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {activeTab === "offer_banner" ? "Banner" : "Offer"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {activeTab === "offer_banner" ? "banner" : "offer"}? This action cannot be undone.
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

      {/* Offer Item Theme Dialog */}
      <OfferItemThemeDialog
        open={!!itemThemeOffer}
        onOpenChange={(open) => !open && setItemThemeOffer(null)}
        offer={itemThemeOffer}
      />
    </div>
  );
};

export default Offers;
