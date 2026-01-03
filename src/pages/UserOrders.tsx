import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, ChevronRight, Loader2, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrders, Order } from "@/hooks/useOrders";
import { format } from "date-fns";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const OrderItemDetails = ({ order }: { order: Order }) => {
  return (
    <div className="space-y-3 mt-4 pt-4 border-t">
      {order.items?.map((item) => {
        const snapshot = item.product_snapshot;
        const selectedOptions = snapshot?.selected_options;
        const addons = snapshot?.addons;

        return (
          <div key={item.id} className="space-y-2">
            <div className="flex items-start gap-3">
              {snapshot?.image && (
                <img
                  src={snapshot.image}
                  alt={snapshot.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
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
              <p className="font-medium text-sm">{formatPrice(item.total)}</p>
            </div>

            {/* Addons */}
            {addons && addons.length > 0 && (
              <div className="ml-6 pl-3 border-l-2 border-primary/20 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Add-ons:</p>
                {addons.map((addon, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {addon.image && (
                      <img
                        src={addon.image}
                        alt={addon.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
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
                    <span className="text-sm text-muted-foreground">{formatPrice(addon.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const UserOrders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useMyOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-medium text-foreground mb-8 flex items-center gap-3">
            <Package className="h-8 w-8" />
            My Orders
          </h1>
          
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-medium text-sm">{order.order_number}</span>
                          <Badge className={statusColors[order.status] || "bg-muted"}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          {formatPrice(order.total_amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => toggleOrder(order.id)}
                      >
                        {expandedOrder === order.id ? (
                          <>Hide Details <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>View Details <ChevronDown className="h-4 w-4" /></>
                        )}
                      </Button>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <OrderItemDetails order={order} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserOrders;
