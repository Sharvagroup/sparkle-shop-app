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
} from "@/components/ui/dialog";
import { Search, Eye, Package } from "lucide-react";
import { useAllOrders, useUpdateOrderStatus, Order } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  refunded: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const paymentStatusColors: Record<Order["payment_status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  paid: "bg-green-500/10 text-green-600",
  failed: "bg-red-500/10 text-red-600",
  refunded: "bg-gray-500/10 text-gray-600",
};

const Orders = () => {
  const { data: orders = [], isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.profile?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    await updateStatus.mutateAsync({ id: orderId, status });
  };

  const getShippingAddress = (order: Order) => {
    if (!order.shipping_address) return null;
    const addr = order.shipping_address as Record<string, string>;
    return addr;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
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
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.profile?.full_name || "Guest"}</p>
                      <p className="text-xs text-muted-foreground">{order.profile?.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{order.items?.length || 0} items</TableCell>
                  <TableCell className="font-medium">{formatPrice(order.total_amount)}</TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[order.payment_status]}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                    >
                      <SelectTrigger className={`w-[130px] h-8 text-xs ${statusColors[order.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Customer</h4>
                  <p className="text-sm">{selectedOrder.profile?.full_name || "Guest"}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.profile?.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Order Info</h4>
                  <p className="text-sm">Date: {format(new Date(selectedOrder.created_at), "PPP")}</p>
                  <p className="text-sm">Payment: {selectedOrder.payment_method}</p>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  {(() => {
                    const addr = getShippingAddress(selectedOrder);
                    return addr ? (
                      <p className="text-sm text-muted-foreground">
                        {addr.firstName} {addr.lastName}<br />
                        {addr.address}{addr.apartment ? `, ${addr.apartment}` : ""}<br />
                        {addr.city}, {addr.state} {addr.pinCode}<br />
                        {addr.country}<br />
                        Phone: {addr.phone}
                      </p>
                    ) : null;
                  })()}
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => {
                    const snapshot = item.product_snapshot as Record<string, string> | null;
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-muted rounded">
                        {snapshot?.image && (
                          <img
                            src={snapshot.image}
                            alt={snapshot.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{snapshot?.name || "Product"}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.total)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping_amount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(selectedOrder.tax_amount || 0)}</span>
                </div>
                {(selectedOrder.discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.discount_amount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
