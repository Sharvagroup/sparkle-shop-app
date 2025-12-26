import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Wishlist = () => {
  // For now, show the sign-in state (no auth yet)
  const isSignedIn = false;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20">
        {!isSignedIn ? (
          <div className="text-center px-4 max-w-2xl mx-auto">
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
              <Button 
                size="lg"
                className="bg-accent-brass hover:bg-primary-dark text-white font-medium py-3 px-12 rounded-sm shadow-md transition-all duration-300 tracking-wide uppercase text-sm"
              >
                Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-display text-foreground mb-8">Your Wishlist</h1>
            <p className="text-muted-foreground">Your wishlist is empty.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
