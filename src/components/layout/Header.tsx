import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    { label: "Home", href: "/" },
    {
      label: "Shop",
      href: "/products",
      children: [
        { label: "All Products", href: "/products" },
        { label: "Necklaces", href: "/products" },
        { label: "Earrings", href: "/products" },
        { label: "Bracelets", href: "/products" },
        { label: "Rings", href: "/products" }
      ],
    },
    {
      label: "New In",
      href: "#",
      children: [
        { label: "New Arrivals", href: "#" },
        { label: "Collections", href: "#" },
        { label: "Best Sellers", href: "#" },
        { label: "Celebrity Specials", href: "#" }
      ],
    },
    {
      label: "About",
      href: "/about",
      children: [
        { label: "Our Story", href: "/about" },
        { label: "Size Guide", href: "#" },
        { label: "Customer Care", href: "#" },
        { label: "Store Locator", href: "#" }
      ],
    },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Mobile Menu */}
          <div className="w-full md:w-auto flex justify-between items-center">
            <a href="#" className="text-3xl font-display font-bold text-primary tracking-wide">
              SHARVA
            </a>
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md w-full relative">
            <input
              type="text"
              placeholder="Search for jewellery..."
              className="w-full bg-muted border border-border rounded-full py-2 px-4 pl-4 pr-10 focus:outline-none focus:border-primary text-sm transition-colors"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
              <Search size={18} />
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="#"
              className="flex items-center space-x-1 hover:text-primary transition-colors hidden md:flex"
            >
              <User size={20} />
              <span>Sign In</span>
            </a>
            <Link
              to="/wishlist"
              className="flex items-center space-x-1 hover:text-primary transition-colors relative"
            >
              <Heart size={20} />
              <span className="hidden md:inline">Wishlist</span>
              <span className="absolute -top-1 left-2.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center space-x-1 hover:text-primary transition-colors relative"
            >
              <ShoppingBag size={20} />
              <span className="hidden md:inline">Cart</span>
              <span className="absolute -top-1 left-2.5 bg-secondary text-secondary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                2
              </span>
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
              <a
                href={item.href}
                className="hover:text-primary transition-colors flex items-center cursor-pointer py-2"
              >
                {item.label}
                {item.children && <ChevronDown size={16} className="ml-1" />}
              </a>
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
            {navItems.map((item) => (
              <div key={item.label} className="py-2">
                <a
                  href={item.href}
                  className="block text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
