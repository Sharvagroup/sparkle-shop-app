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
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/constants";

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
                    <Badge className={PAYMENT_STATUS_COLORS[order.payment_status] || ""}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                    >
                      <SelectTrigger className={`w-[130px] h-8 text-xs ${ORDER_STATUS_COLORS[order.status] || ""}`}>
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
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => {
                    const snapshot = item.product_snapshot;
                    const selectedOptions = snapshot?.selected_options;
                    const addons = snapshot?.addons;
                    
                    return (
                      <div key={item.id} className="p-3 bg-muted rounded space-y-2">
                        <div className="flex items-center gap-3">
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
                            {/* Selected Options */}
                            {selectedOptions && Object.keys(selectedOptions).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(selectedOptions).map(([key, value]) => (
                                  <Badge key={key} variant="outline" className="text-xs">
                                    {key}: {value}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="font-medium">{formatPrice(item.total)}</p>
                        </div>
                        
                        {/* Addons */}
                        {addons && addons.length > 0 && (
                          <div className="ml-6 pl-3 border-l-2 border-primary/20 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Add-ons:</p>
                            {addons.map((addon, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                {addon.image && (
                                  <img
                                    src={addon.image}
                                    alt={addon.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <span>{addon.name}</span>
                                  <span className="text-muted-foreground ml-1">× {addon.quantity}</span>
                                  {addon.selected_options && Object.keys(addon.selected_options).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {Object.entries(addon.selected_options).map(([key, value]) => (
                                        <Badge key={key} variant="outline" className="text-xs py-0">
                                          {key}: {value}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <span className="text-muted-foreground">{formatPrice(addon.total)}</span>
                              </div>
                            ))}
                          </div>
                        )}
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
