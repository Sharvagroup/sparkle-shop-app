import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Wishlist = () => {
  const { user, loading } = useAuth();
  const { data: wishlistItems = [], isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleAddToCart = async (productId: string) => {
    await addToCart.mutateAsync({ productId, quantity: 1 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow py-12">
        {!user ? (
          <div className="text-center px-4 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
            <div className="mb-8 flex justify-center">
              <Heart 
                size={80} 
                className="text-muted-foreground/80" 
                strokeWidth={1.5}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4 tracking-wide">
              Sign in to view your wishlist
            </h1>
            <p className="text-lg text-muted-foreground mb-10 font-light">
              Save your favorite items and access them anytime.
            </p>
            <Link to="/auth">
              <Button size="lg" className="font-medium py-3 px-12 rounded-sm shadow-md tracking-wide uppercase text-sm">
                Sign In
              </Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center px-4 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
            <Heart size={80} className="text-muted-foreground/80 mb-8" strokeWidth={1.5} />
            <h1 className="text-3xl font-display text-foreground mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">Start adding items you love!</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-display text-foreground mb-8 flex items-center gap-3">
              <Heart className="h-8 w-8" />
              My Wishlist ({wishlistItems.length} items)
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative">
                    <Link to={`/product/${item.product?.slug}`}>
                      <img 
                        src={item.product?.images?.[0] || "/placeholder.svg"} 
                        alt={item.product?.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    {item.product?.badge && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        {item.product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => removeFromWishlist.mutate(item.product_id)}
                      className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      disabled={removeFromWishlist.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <Link to={`/product/${item.product?.slug}`}>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                        {item.product?.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-primary">
                        ₹{item.product?.price.toLocaleString("en-IN")}
                      </span>
                      {item.product?.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.product.original_price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(item.product_id)}
                      disabled={addToCart.isPending}
                      className="w-full mt-4 gap-2"
                      size="sm"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
