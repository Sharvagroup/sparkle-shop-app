import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, HelpCircle, ShieldCheck, Shield, Loader2, CheckCircle } from "lucide-react";
import { useCart, useClearCart } from "@/hooks/useCart";
import { useCreateOrder, ShippingAddress } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Checkout = () => {
  const { user } = useAuth();
  const { data: cartItems = [], isLoading } = useCart();
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [newsletter, setNewsletter] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("India");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingAddress, setBillingAddress] = useState("same");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || cartItems.length === 0) return;

    const shippingAddr: ShippingAddress = {
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      pinCode,
      country,
      phone,
    };

    const orderItems = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
      total: (item.product?.price || 0) * item.quantity,
      product_snapshot: {
        name: item.product?.name || "",
        image: item.product?.images?.[0] || "",
        slug: item.product?.slug || "",
      },
    }));

    try {
      const order = await createOrder.mutateAsync({
        payment_method: paymentMethod,
        subtotal,
        shipping_amount: shipping,
        tax_amount: 0,
        total_amount: total,
        shipping_address: shippingAddr,
        items: orderItems,
      });

      await clearCart.mutateAsync();
      setOrderNumber(order.order_number);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Sign in to checkout</h2>
            <p className="text-muted-foreground mb-6">Please sign in to complete your order.</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Order Placed!</h2>
            <p className="text-muted-foreground mb-2">
              Thank you for your order. Your order number is:
            </p>
            <p className="text-xl font-mono font-bold text-primary mb-6">{orderNumber}</p>
            <p className="text-sm text-muted-foreground mb-8">
              We've sent a confirmation email to {email}. You can track your order in "My Orders".
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/orders">View Orders</Link>
              </Button>
              <Button asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex gap-12">
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="w-96 h-80" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Your cart is empty</h2>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">&gt;</span>
            <Link to="/cart" className="text-muted-foreground hover:text-primary">Cart</Link>
            <span className="text-muted-foreground">&gt;</span>
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
              <div className="w-full lg:w-3/5 xl:w-2/3">
                {/* Contact */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">Contact</h2>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox id="newsletter" checked={newsletter} onCheckedChange={(c) => setNewsletter(c as boolean)} />
                    <Label htmlFor="newsletter" className="text-sm text-muted-foreground">Email me with news and offers</Label>
                  </div>
                </div>

                {/* Delivery */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-6">Delivery</h2>
                  <div className="space-y-4">
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-4">
                      <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="flex-1" />
                      <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="flex-1" />
                    </div>

                    <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    <Input placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={(e) => setApartment(e.target.value)} />

                    <div className="flex gap-4">
                      <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required className="flex-1" />
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="PIN code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required className="flex-1" />
                    </div>

                    <Input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>

                {/* Shipping */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">Shipping method</h2>
                  <div className="bg-muted border border-border rounded-sm p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{shipping === 0 ? "Free Shipping" : "Standard Shipping"}</span>
                      <span className="font-medium">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                    </div>
                    {shipping === 0 && <p className="text-sm text-muted-foreground mt-1">Orders above ₹5,000 qualify for free shipping</p>}
                  </div>
                </div>

                {/* Payment */}
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-medium text-foreground mb-2">Payment</h2>
                  <p className="text-sm text-muted-foreground mb-4">All transactions are secure and encrypted.</p>

                  <div className="border border-border rounded-sm overflow-hidden">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="p-4 border-b border-border bg-muted">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="font-medium cursor-pointer">Credit/Debit Card</Label>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="font-medium cursor-pointer">UPI / NetBanking</Label>
                        </div>
                      </div>
                      <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="font-medium cursor-pointer">Cash on Delivery</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-6 text-lg font-bold uppercase tracking-widest"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-2/5 xl:w-1/3">
                <div className="bg-card p-6 md:p-8 shadow-sm border border-border rounded-sm sticky top-28">
                  <h3 className="font-display text-xl font-semibold mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6 border-b border-border pb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-background border border-border rounded-sm overflow-hidden">
                          <img src={item.product?.images?.[0] || "/placeholder.svg"} alt={item.product?.name} className="w-full h-full object-cover" />
                          <span className="absolute -top-1 -right-1 bg-muted-foreground text-background text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-display text-sm font-medium leading-tight">{item.product?.name}</h4>
                        </div>
                        <div className="text-sm font-medium">{formatPrice((item.product?.price || 0) * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-border pt-4 mt-4">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
