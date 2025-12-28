import { Link } from "react-router-dom";
import { useActiveFooterLinks, FooterLink } from "@/hooks/useFooterLinks";
import { useSiteSetting, ContactSettings, BrandingSettings } from "@/hooks/useSiteSettings";

interface LegalSettings {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

const Footer = () => {
  const { data: footerLinks = [] } = useActiveFooterLinks();
  const { data: contact } = useSiteSetting<ContactSettings>("contact");
  const { data: branding } = useSiteSetting<BrandingSettings>("branding");
  const { data: legal } = useSiteSetting<LegalSettings>("legal");

  const groupedLinks = footerLinks.reduce((acc, link) => {
    const section = link.section.toLowerCase();
    if (!acc[section]) acc[section] = [];
    acc[section].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  const siteName = branding?.siteName || "Sharva Jewellery Collection";
  const tagline = branding?.tagline || "Minimalist jewelry crafted for the modern individual";
  const logoUrl = branding?.logoUrl;
  const email = contact?.email || "hello@sharvajewellery.com";
  const phone = contact?.phone || "+1 (212) 555-0123";
  const address = contact?.address || "123 Madison Avenue\nNew York, NY 10016";

  const renderLinkItem = (link: FooterLink) => {
    if (link.is_external) {
      return (
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
          {link.label}
        </a>
      );
    }
    return <Link to={link.url} className="hover:text-primary transition-colors">{link.label}</Link>;
  };

  const renderLegalLink = (url: string | undefined, label: string, fallbackPath: string) => {
    if (!url) {
      return <Link to={fallbackPath} className="hover:text-primary transition-colors">{label}</Link>;
    }
    if (url.startsWith("http")) {
      return <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{label}</a>;
    }
    return <Link to={url} className="hover:text-primary transition-colors">{label}</Link>;
  };

  const sectionTitles: Record<string, string> = { shop: "Shop", support: "Support", connect: "Connect" };
  const orderedSections = ["shop", "support", "connect"];
  const allSections = [...new Set([...orderedSections, ...Object.keys(groupedLinks)])];
  const displaySections = allSections.filter((s) => groupedLinks[s]?.length > 0).slice(0, 3);

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="pr-0 md:pr-8">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-12 w-auto mb-6" />
            ) : (
              <h3 className="text-2xl font-display font-medium mb-6 text-foreground">{siteName}</h3>
            )}
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{tagline}</p>
            <div className="mb-6">
              <h4 className="font-bold text-sm text-foreground mb-2">Visit Us</h4>
              <p className="text-muted-foreground text-sm whitespace-pre-line">{address}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground mb-2">Contact</h4>
              <p className="text-muted-foreground text-sm">{phone}</p>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          </div>

          {displaySections.map((section) => (
            <div key={section}>
              <h4 className="font-display font-medium text-lg mb-6 text-foreground capitalize">{sectionTitles[section] || section}</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {groupedLinks[section]?.map((link) => <li key={link.id}>{renderLinkItem(link)}</li>)}
              </ul>
            </div>
          ))}

          {displaySections.length === 0 && (
            <>
              <div>
                <h4 className="font-display font-medium text-lg mb-6 text-foreground">Shop</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                  <li><Link to="/products?new=true" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-display font-medium text-lg mb-6 text-foreground">Support</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
                  <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-display font-medium text-lg mb-6 text-foreground">Connect</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pinterest</a></li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteName.split(" ")[0]}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            {renderLegalLink(legal?.privacyPolicyUrl, "Privacy Policy", "/privacy-policy")}
            {renderLegalLink(legal?.termsOfServiceUrl, "Terms of Service", "/terms-of-service")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
