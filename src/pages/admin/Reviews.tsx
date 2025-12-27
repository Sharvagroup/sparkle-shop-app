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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { Search, Star, Eye, Trash2, Check, X, MessageSquare, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useAllReviews, useUpdateReview, useDeleteReview, Review } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const sentimentIcons = {
  positive: <ThumbsUp className="h-4 w-4 text-green-600" />,
  negative: <ThumbsDown className="h-4 w-4 text-red-600" />,
  neutral: <Minus className="h-4 w-4 text-gray-500" />,
};

const Reviews = () => {
  const { data: reviews = [], isLoading } = useAllReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [sentimentTag, setSentimentTag] = useState<"positive" | "negative" | "neutral" | null>(null);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.review_text.toLowerCase().includes(search.toLowerCase()) ||
      review.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      review.profile?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && review.is_approved) ||
      (statusFilter === "pending" && !review.is_approved);
    const matchesSentiment =
      sentimentFilter === "all" || review.sentiment_tag === sentimentFilter;
    return matchesSearch && matchesStatus && matchesSentiment;
  });

  const handleOpenDetails = (review: Review) => {
    setSelectedReview(review);
    setAdminNotes(review.admin_notes || "");
    setShowOnHomepage(review.show_on_homepage || false);
    setSentimentTag(review.sentiment_tag);
  };

  const handleApprove = async (id: string, approve: boolean) => {
    await updateReview.mutateAsync({ id, is_approved: approve });
  };

  const handleSaveDetails = async () => {
    if (!selectedReview) return;
    await updateReview.mutateAsync({
      id: selectedReview.id,
      admin_notes: adminNotes,
      show_on_homepage: showOnHomepage,
      sentiment_tag: sentimentTag,
    });
    setSelectedReview(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteReview.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted-foreground">Manage customer reviews and testimonials</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Homepage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(8).fill(0).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {review.product?.images?.[0] && (
                        <img
                          src={review.product.images[0]}
                          alt={review.product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span className="text-sm font-medium max-w-[150px] truncate">
                        {review.product?.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{review.profile?.full_name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm max-w-[200px] truncate">{review.review_text}</p>
                  </TableCell>
                  <TableCell>
                    {review.sentiment_tag ? (
                      <div className="flex items-center gap-1">
                        {sentimentIcons[review.sentiment_tag]}
                        <span className="text-xs capitalize">{review.sentiment_tag}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Untagged</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {review.show_on_homepage ? (
                      <Badge variant="default" className="bg-primary">Visible</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.is_approved ? "default" : "secondary"}>
                      {review.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!review.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(review.id, true)}
                          title="Approve"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {review.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(review.id, false)}
                          title="Unapprove"
                        >
                          <X className="h-4 w-4 text-orange-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDetails(review)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(review.id)}
                        title="Delete"
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

      {/* Review Details Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="font-medium">{selectedReview.product?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedReview.profile?.full_name || "Anonymous"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rating</p>
                <div className="flex">{renderStars(selectedReview.rating)}</div>
              </div>
              {selectedReview.title && (
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{selectedReview.title}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Review</p>
                <p className="text-sm">{selectedReview.review_text}</p>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Sentiment Tag</Label>
                  <Select value={sentimentTag || ""} onValueChange={(v) => setSentimentTag(v as typeof sentimentTag)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="homepage"
                    checked={showOnHomepage}
                    onCheckedChange={setShowOnHomepage}
                  />
                  <Label htmlFor="homepage">Show on Homepage (Testimonials)</Label>
                </div>

                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes about this review..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDetails} disabled={updateReview.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
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

export default Reviews;
