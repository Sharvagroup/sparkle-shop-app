import { Link } from "react-router-dom";
import { useActiveFooterLinks, FooterLink } from "@/hooks/useFooterLinks";
import { useSiteSetting, ContactSettings, BrandingSettings } from "@/hooks/useSiteSettings";
import { Instagram, Youtube, Facebook, Twitter, Linkedin, Github, Mail, Globe } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface LegalSettings {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

// Icon mapping for social media and common icons
const iconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
  email: Mail,
  globe: Globe,
};

const Footer = () => {
  const { data: footerLinks = [] } = useActiveFooterLinks();
  const { data: contact } = useSiteSetting<ContactSettings>("contact");
  const { data: branding } = useSiteSetting<BrandingSettings>("branding");
  const { data: legal } = useSiteSetting<LegalSettings>("legal");

  // Group links by section and sort by display_order within each section
  const groupedLinks = footerLinks.reduce((acc, link) => {
    const section = link.section.toLowerCase();
    if (!acc[section]) acc[section] = [];
    acc[section].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  // Sort links within each section by display_order
  Object.keys(groupedLinks).forEach((section) => {
    groupedLinks[section].sort((a, b) => {
      const orderA = a.display_order ?? 0;
      const orderB = b.display_order ?? 0;
      return orderA - orderB;
    });
  });

  const siteName = branding?.siteName;
  const tagline = branding?.tagline;
  const logoUrl = branding?.logoUrl;
  const email = contact?.email;
  const phone = contact?.phone;
  const address = contact?.address;

  const renderLinkItem = (link: FooterLink, section: string) => {
    const IconComponent = link.icon ? iconMap[link.icon.toLowerCase()] : null;
    const isConnectSection = section === "connect";
    const linkContent = (
      <>
        {IconComponent && isConnectSection && (
          <IconComponent className="h-4 w-4 mr-2 inline-block" />
        )}
        {link.label}
      </>
    );

    if (link.is_external) {
      return (
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
          {linkContent}
        </a>
      );
    }
    return (
      <Link to={link.url} className="hover:text-primary transition-colors flex items-center gap-2">
        {linkContent}
      </Link>
    );
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
              <img src={logoUrl} alt={siteName || "Site Logo"} className="h-12 w-auto mb-6" />
            ) : siteName ? (
              <h3 className="text-2xl font-display font-medium mb-6 text-foreground">{siteName}</h3>
            ) : null}
            {tagline && (
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{tagline}</p>
            )}
            {address && (
              <div className="mb-6">
                <h4 className="font-bold text-sm text-foreground mb-2">Visit Us</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-line">{address}</p>
              </div>
            )}
            {(phone || email) && (
              <div>
                <h4 className="font-bold text-sm text-foreground mb-2">Contact</h4>
                {phone && <p className="text-muted-foreground text-sm">{phone}</p>}
                {email && <p className="text-muted-foreground text-sm">{email}</p>}
              </div>
            )}
          </div>

          {displaySections.map((section) => (
            <div key={section}>
              <h4 className="font-display font-medium text-lg mb-6 text-foreground capitalize">{sectionTitles[section] || section}</h4>
              <ul className={`space-y-4 text-sm text-muted-foreground ${section === "connect" ? "flex flex-wrap gap-4" : ""}`}>
                {groupedLinks[section]?.map((link) => (
                  <li key={link.id} className={section === "connect" ? "inline-block" : ""}>
                    {renderLinkItem(link, section)}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {displaySections.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground border-dashed border rounded">
              <p>Footer sections are not configured in settings.</p>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteName ? siteName.split(" ")[0] : "Site"}. All rights reserved.</p>
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
