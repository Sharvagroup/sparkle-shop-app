import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useCollections } from "@/hooks/useCollections";
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

// Types for dynamic navigation
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
  type: "static" | "category_dropdown" | "collection_dropdown";
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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: categories = [] } = useCategories();
  const { data: collections = [] } = useCollections();
  const { data: cartItems = [] } = useCart();
  const { data: wishlistCount = 0 } = useWishlistCount();
  const { data: branding } = useSiteSetting<BrandingSettings>("branding");
  const { data: navSettings } = useSiteSetting<NavigationSettings>("header_navigation");

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
          let children: { label: string; href: string }[] = [];

          if (item.type === "category_dropdown") {
            children = [
              { label: "All Products", href: "/products" },
              ...categories.map((cat) => ({
                label: cat.name,
                href: `/products?category=${cat.slug}`,
              })),
            ];
          } else if (item.type === "collection_dropdown") {
            children = [
              { label: "All Collections", href: "/products" },
              ...collections.map((col) => ({
                label: col.name,
                href: `/products?collection=${col.slug}`,
              })),
            ];
          } else if (item.children && item.children.length > 0) {
            children = item.children.map((child) => ({
              label: child.label,
              href: child.url,
            }));
          }

          return {
            label: item.label,
            href: item.url,
            children: children.length > 0 ? children : undefined,
            isExternal: item.isExternal,
          };
        });
    }

    // Fallback to hardcoded navigation
    const shopChildren = [
      { label: "All Products", href: "/products" },
      ...categories.map((cat) => ({
        label: cat.name,
        href: `/products?category=${cat.slug}`,
      })),
    ];

    return [
      { label: "Home", href: "/" },
      {
        label: "Shop",
        href: "/products",
        children: shopChildren,
      },
      {
        label: "Collections",
        href: "/products",
        children: [
          { label: "All Collections", href: "/products" },
          ...collections.map((col) => ({
            label: col.name,
            href: `/products?collection=${col.slug}`,
          })),
        ],
      },
      {
        label: "New In",
        href: "/products?new=true",
        children: [
          { label: "New Arrivals", href: "/products?new=true" },
          { label: "Best Sellers", href: "/products?bestseller=true" },
          { label: "Celebrity Specials", href: "/products?celebrity=true" },
          { label: "Announcements", href: "/announcements" },
        ],
      },
      {
        label: "About",
        href: "/about",
        children: [
          { label: "Our Story", href: "/about" },
          { label: "Size Guide", href: "/size-guide" },
          { label: "FAQ", href: "/faq" },
        ],
      },
      { label: "Contact", href: "/contact" },
    ];
  }, [categories, collections, navSettings]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
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
          <form onSubmit={handleSearch} className="flex-1 max-w-md w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jewellery..."
              className="w-full bg-muted border border-border rounded-full py-2 px-4 pl-4 pr-10 focus:outline-none focus:border-primary text-sm transition-colors"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
              <Search size={18} />
            </button>
          </form>

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
              <Link
                to={item.href}
                className="hover:text-primary transition-colors flex items-center cursor-pointer py-2"
              >
                {item.label}
                {item.children && <ChevronDown size={16} className="ml-1" />}
              </Link>
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-0 top-full w-48 bg-card shadow-xl rounded-sm py-2 z-50 border border-border border-t-2 border-t-primary">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="block px-4 py-3 hover:bg-muted hover:text-primary transition-colors text-xs tracking-wider"
                    >
                      {child.label}
                    </Link>
                  ))}
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
                  <Link
                    to={item.href}
                    className="block text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
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
