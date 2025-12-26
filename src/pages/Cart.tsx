import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowLeft, Lock, CreditCard, Building2, ShieldCheck } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Royal Kundan Pearl Choker Set",
      description: "Handcrafted with semi-precious stones and pearls.",
      price: 4500,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Antique Gold Finish Bangle Set",
      description: "Intricate craftsmanship with matte finish.",
      price: 2800,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop",
    },
  ]);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">&gt;</span>
            <span className="text-foreground font-medium">Cart</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                {/* Table Header - Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-border">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="md:col-span-5 flex gap-4">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="font-display font-semibold text-foreground">
                              {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="md:col-span-2 text-center">
                          <span className="md:hidden text-sm text-muted-foreground mr-2">Price:</span>
                          <span className="font-medium text-foreground">{formatPrice(item.price)}</span>
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-3 flex justify-center">
                          <div className="flex items-center border border-border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-muted transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-muted transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="md:col-span-2 text-right">
                          <span className="md:hidden text-sm text-muted-foreground mr-2">Total:</span>
                          <span className="font-semibold text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Button variant="outline" asChild className="gap-2">
                    <Link to="/products">
                      <ArrowLeft className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-sm text-muted-foreground italic">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-sm text-muted-foreground italic">Inclusive</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-lg text-foreground">{formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Promo Code
                    </label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="text"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="secondary" className="bg-foreground text-background hover:bg-foreground/90">
                        APPLY
                      </Button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 py-6">
                    PROCEED TO CHECKOUT
                    <Lock className="w-4 h-4" />
                  </Button>

                  {/* Payment Icons */}
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
