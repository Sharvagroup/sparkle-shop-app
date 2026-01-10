import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Heart, ShoppingBag, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useCollections } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { usePublishedAnnouncements } from "@/hooks/useAnnouncements";
import { useCart } from "@/hooks/useCart";
import { useWishlistCount } from "@/hooks/useWishlist";
import { useSiteSetting, BrandingSettings } from "@/hooks/useSiteSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "@/components/ui/SearchBar";

// Types for dynamic navigation
type NavItemType = 
  | "static" 
  | "category_dropdown" 
  | "collection_dropdown" 
  | "new_in_dropdown" 
  | "best_sellers_dropdown" 
  | "new_arrivals_dropdown" 
  | "celebrity_specials_dropdown" 
  | "announcements_dropdown";

interface NavChild {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  url: string;
  type: NavItemType;
  isExternal?: boolean;
  isActive?: boolean;
  children?: NavChild[];
}

interface NavigationSettings {
  items: NavItem[];
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: categories = [] } = useCategories();
  const { data: collections = [] } = useCollections();
  const { data: cartItems = [] } = useCart();
  const { data: wishlistCount = 0 } = useWishlistCount();
  const { data: branding } = useSiteSetting<BrandingSettings>("branding");
  const { data: navSettings } = useSiteSetting<NavigationSettings>("header_navigation");
  const { data: allProducts = [] } = useProducts();
  const { data: announcements = [] } = usePublishedAnnouncements();

  // Derive dynamic product lists
  const bestSellers = useMemo(() => allProducts.filter(p => p.is_best_seller), [allProducts]);
  const newArrivals = useMemo(() => allProducts.filter(p => p.is_new_arrival), [allProducts]);
  const celebritySpecials = useMemo(() => allProducts.filter(p => p.is_celebrity_special), [allProducts]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const siteName = branding?.siteName || "SHARVA";
  const logoUrl = branding?.logoUrl;

  // Build nav items dynamically from CMS or fallback to hardcoded
  const navItems = useMemo(() => {
    // If we have CMS navigation settings, use them
    if (navSettings?.items && navSettings.items.length > 0) {
      return navSettings.items
        .filter((item) => item.isActive !== false)
        .map((item) => {
          let children: { label: string; href: string; isExternal?: boolean }[] = [];

          // Filter categories/collections that have products
          const categoriesWithProducts = categories.filter(cat => 
            allProducts.some(p => p.category?.slug === cat.slug)
          );
          const collectionsWithProducts = collections.filter(col => 
            allProducts.some(p => p.collection?.slug === col.slug)
          );

          switch (item.type) {
            case "category_dropdown":
              children = [
                { label: "All Products", href: "/products" },
                ...categoriesWithProducts.map((cat) => ({
                  label: cat.name,
                  href: `/products?category=${cat.slug}`,
                })),
              ];
              break;
            case "collection_dropdown":
              children = [
                { label: "All Collections", href: "/products" },
                ...collectionsWithProducts.map((col) => ({
                  label: col.name,
                  href: `/products?collection=${col.slug}`,
                })),
              ];
              break;
            case "new_in_dropdown":
              children = [];
              if (bestSellers.length > 0) {
                children.push({ label: "Best Sellers", href: "/products?bestseller=true" });
              }
              if (newArrivals.length > 0) {
                children.push({ label: "New Arrivals", href: "/products?new=true" });
              }
              if (celebritySpecials.length > 0) {
                children.push({ label: "Celebrity Specials", href: "/products?celebrity=true" });
              }
              if (announcements.length > 0) {
                children.push({ label: "Announcements", href: "/announcements" });
              }
              break;
            case "best_sellers_dropdown":
              children = bestSellers.slice(0, 8).map((p) => ({
                label: p.name,
                href: `/products/${p.slug}`,
              }));
              if (bestSellers.length > 0) {
                children.unshift({ label: "View All Best Sellers", href: "/products?bestseller=true" });
              }
              break;
            case "new_arrivals_dropdown":
              children = newArrivals.slice(0, 8).map((p) => ({
                label: p.name,
                href: `/products/${p.slug}`,
              }));
              if (newArrivals.length > 0) {
                children.unshift({ label: "View All New Arrivals", href: "/products?new=true" });
              }
              break;
            case "celebrity_specials_dropdown":
              children = celebritySpecials.slice(0, 8).map((p) => ({
                label: p.name,
                href: `/products/${p.slug}`,
              }));
              if (celebritySpecials.length > 0) {
                children.unshift({ label: "View All Celebrity Specials", href: "/products?celebrity=true" });
              }
              break;
            case "announcements_dropdown":
              children = announcements.slice(0, 6).map((a) => ({
                label: a.title,
                href: `/announcements/${a.slug}`,
              }));
              if (announcements.length > 0) {
                children.unshift({ label: "View All Announcements", href: "/announcements" });
              }
              break;
            default:
              if (item.children && item.children.length > 0) {
                children = item.children.map((child) => ({
                  label: child.label,
                  href: child.url,
                  isExternal: child.isExternal === true || child.url.startsWith("http"),
                }));
              }
          }

          return {
            label: item.label,
            href: item.url,
            children: children.length > 0 ? children : undefined,
            isExternal: item.isExternal === true || item.url.startsWith("http"),
          };
        });
    }

    // Fallback to empty if no settings (or simple home link if preferred, but user asked to remove redundancy)
    return [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/products" }
    ];
  }, [categories, collections, navSettings, bestSellers, newArrivals, celebritySpecials, announcements]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Mobile Menu */}
          <div className="w-full md:w-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-auto" />
              ) : (
                <span className="text-3xl font-display font-bold text-primary tracking-wide">
                  {siteName}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar className="flex-1 max-w-md w-full" />

          {/* Action Icons */}
          <div className="flex items-center space-x-6 text-sm">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors hidden md:flex">
                    <User size={20} />
                    <span className="max-w-[100px] truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-1 hover:text-primary transition-colors hidden md:flex"
              >
                <User size={20} />
                <span>Sign In</span>
              </Link>
            )}
            <Link
              to="/wishlist"
              className="flex items-center space-x-1 hover:text-primary transition-colors relative"
            >
              <Heart size={20} />
              <span className="hidden md:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 left-2.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-center space-x-1 hover:text-primary transition-colors relative"
            >
              <ShoppingBag size={20} />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 left-2.5 bg-secondary text-secondary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 mt-4 pt-2 border-t border-transparent text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center cursor-pointer py-2"
                >
                  {item.label}
                  {item.children && <ChevronDown size={16} className="ml-1" />}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-primary transition-colors flex items-center cursor-pointer py-2"
                >
                  {item.label}
                  {item.children && <ChevronDown size={16} className="ml-1" />}
                </Link>
              )}
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-0 top-full w-48 bg-card shadow-xl rounded-sm py-2 z-50 border border-border border-t-2 border-t-primary">
                  {item.children.map((child) => {
                    const isChildExternal = child.isExternal === true || child.href.startsWith("http");
                    return isChildExternal ? (
                      <a
                        key={child.label}
                        href={child.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 hover:bg-muted hover:text-primary transition-colors text-xs tracking-wider"
                      >
                        {child.label}
                      </a>
                    ) : (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-3 hover:bg-muted hover:text-primary transition-colors text-xs tracking-wider"
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border">
            <ScrollArea className="h-[calc(100vh-120px)] pb-6">
              {navItems.map((item) => (
                <div key={item.label} className="py-2">
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="block text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.children.map((child) => {
                        const isChildExternal = (child as any).isExternal === true || child.href.startsWith("http");
                        return isChildExternal ? (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile auth link */}
              <div className="pt-4 mt-4 border-t border-border">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-sm text-destructive"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center space-x-2 text-sm hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </ScrollArea>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
