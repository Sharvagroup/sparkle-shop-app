import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowLeft, Lock, CreditCard, Building2, ShieldCheck, Loader2, X, Tag } from "lucide-react";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useValidateDiscountCode, AppliedDiscount } from "@/hooks/useDiscountCodes";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
  const { user } = useAuth();
  const { data: cartItems = [], isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const validateDiscount = useValidateDiscountCode();

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart.mutate(id);
    } else {
      updateCartItem.mutate({ id, quantity: newQuantity });
    }
  };

  const removeItem = (id: string) => {
    removeFromCart.mutate(id);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const discountAmount = appliedDiscount?.discountAmount || 0;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast({ title: "Please enter a promo code", variant: "destructive" });
      return;
    }

    try {
      const discount = await validateDiscount.mutateAsync({
        code: promoCode,
        cartTotal: subtotal,
        userId: user?.id,
      });
      setAppliedDiscount(discount);
      toast({ title: "Promo code applied!", description: `You saved ${formatPrice(discount.discountAmount)}` });
    } catch (error) {
      toast({ title: "Invalid promo code", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setPromoCode("");
    toast({ title: "Promo code removed" });
  };

  const handleProceedToCheckout = () => {
    const params = new URLSearchParams();
    if (appliedDiscount) {
      params.set("discountCodeId", appliedDiscount.id);
      params.set("discountCode", appliedDiscount.code);
      params.set("discountAmount", appliedDiscount.discountAmount.toString());
    }
    navigate(`/checkout${params.toString() ? `?${params.toString()}` : ""}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-6">Please sign in to add items to your cart and checkout.</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
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
        <div className="container mx-auto px-4 md:px-8 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Your Cart</h1>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
              <Skeleton className="h-80" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
              <Button asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-5 flex gap-4">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.product?.images?.[0] || "/placeholder.svg"}
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <Link
                              to={`/product/${item.product?.slug}`}
                              className="font-display font-semibold text-foreground hover:text-primary"
                            >
                              {item.product?.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-2 text-center">
                          <span className="font-medium text-foreground">
                            {formatPrice(item.product?.price || 0)}
                          </span>
                        </div>

                        <div className="md:col-span-3 flex justify-center">
                          <div className="flex items-center border border-border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-muted"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-muted"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-2 text-right">
                          <span className="font-semibold text-foreground">
                            {formatPrice((item.product?.price || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button variant="outline" asChild className="gap-2">
                    <Link to="/products">
                      <ArrowLeft className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedDiscount.code})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-lg text-foreground">{formatPrice(subtotal - discountAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Promo Code
                    </label>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between p-3 mt-2 bg-green-500/10 border border-green-500/30 rounded-md">
                        <div>
                          <span className="font-mono font-bold text-green-600">{appliedDiscount.code}</span>
                          <p className="text-sm text-green-600">
                            {appliedDiscount.type === "percentage"
                              ? `${appliedDiscount.value}% off`
                              : `${formatPrice(appliedDiscount.value)} off`}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleRemovePromo}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="text"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="flex-1"
                        />
                        <Button
                          variant="secondary"
                          onClick={handleApplyPromo}
                          disabled={validateDiscount.isPending}
                        >
                          {validateDiscount.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "APPLY"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-6 gap-2 py-6"
                  >
                    PROCEED TO CHECKOUT
                    <Lock className="w-4 h-4" />
                  </Button>

                  <div className="flex justify-center gap-4 mt-4 text-muted-foreground">
                    <CreditCard className="w-6 h-6" />
                    <Building2 className="w-6 h-6" />
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
