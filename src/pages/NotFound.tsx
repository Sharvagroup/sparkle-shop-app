import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useSiteSetting, BrandingSettings } from "@/hooks/useSiteSettings";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

interface NotFoundSettings {
  notFoundTitle?: string;
  notFoundMessage?: string;
  notFoundImage?: string;
}

const NotFound = () => {
  const location = useLocation();
  const { data: branding } = useSiteSetting<BrandingSettings & NotFoundSettings>("branding");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const title = branding?.notFoundTitle || "Page Not Found";
  const message = branding?.notFoundMessage || "Sorry, the page you're looking for doesn't exist or has been moved.";
  const image = branding?.notFoundImage;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="text-center max-w-lg mx-auto px-4">
          {image && (
            <img src={image} alt="404" className="w-48 h-48 mx-auto mb-8 object-contain opacity-80" />
          )}
          <h1 className="text-8xl font-bold text-primary/20 mb-2">404</h1>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground mb-8">
            {message}
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">
                <Search className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

