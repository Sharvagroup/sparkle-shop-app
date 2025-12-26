import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    shop: [
      { label: "New In", href: "#" },
      { label: "Necklaces", href: "#" },
      { label: "Earrings", href: "#" },
      { label: "Bracelets", href: "#" },
      { label: "Watches", href: "#" },
    ],
    support: [
      { label: "Size Guide", href: "#" },
      { label: "Customer Care", href: "#" },
      { label: "Our Story", href: "/about" },
      { label: "Sustainability", href: "#" },
      { label: "Store Locator", href: "#" },
    ],
    connect: [
      { label: "Instagram", href: "#" },
      { label: "Pinterest", href: "#" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="pr-0 md:pr-8">
            <h3 className="text-2xl font-display font-medium mb-6 text-foreground">
              Sharva Jewellery Collection
            </h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Minimalist jewelry crafted for the modern individual
            </p>
            <div className="mb-6">
              <h4 className="font-bold text-sm text-foreground mb-2">Visit Us</h4>
              <p className="text-muted-foreground text-sm">
                123 Madison Avenue
                <br />
                New York, NY 10016
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground mb-2">Contact</h4>
              <p className="text-muted-foreground text-sm">+1 (212) 555-0123</p>
              <p className="text-muted-foreground text-sm">hello@sharvajewellery.com</p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-medium text-lg mb-6 text-foreground">Shop</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display font-medium text-lg mb-6 text-foreground">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="font-display font-medium text-lg mb-6 text-foreground">Connect</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© 2024 Sharva. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
