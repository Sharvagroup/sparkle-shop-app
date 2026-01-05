import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Save, Building2, Phone, Globe, Image, Scale, Palette, FileText, Megaphone, Plus, Trash2, Clock, MapPin, ShoppingCart, Truck, Percent, IndianRupee, Package, SortAsc, Sparkles } from "lucide-react";
import { useSiteSettings, useUpdateSiteSetting, uploadSiteAsset, BrandingSettings, ContactSettings, SocialSettings, SeoSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { validateWebPImage, validateImageSize, ALLOWED_IMAGE_ACCEPT } from "@/lib/imageValidation";
import { toast } from "sonner";

interface ContactPageSettings {
  heroImage: string;
  mapEmbedUrl: string;
}

interface LegalSettings {
  copyrightText: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  darkMode: boolean;
}

interface PromoBannerSettings {
  message: string;
  discountCode: string;
  isVisible: boolean;
}

interface BusinessHour {
  day: string;
  hours: string;
  closed: boolean;
}

interface BusinessHoursSettings {
  hours: BusinessHour[];
}

interface CommerceSettings {
  shippingFlatRate: number;
  freeShippingThreshold: number;
  taxRate: number;
  currencyCode: string;
  currencySymbol: string;
}

const fontOptions = [
  { value: "Playfair Display", label: "Playfair Display (Elegant Serif)" },
  { value: "Lato", label: "Lato (Clean Sans-Serif)" },
  { value: "Georgia", label: "Georgia (Classic Serif)" },
  { value: "Arial", label: "Arial (Standard Sans)" },
  { value: "Roboto", label: "Roboto (Modern Sans)" },
  { value: "Open Sans", label: "Open Sans (Friendly Sans)" },
  { value: "Montserrat", label: "Montserrat (Geometric Sans)" },
  { value: "Merriweather", label: "Merriweather (Readable Serif)" },
];

const Settings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  // Branding
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [footerLogoUrl, setFooterLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [loadingImageUrl, setLoadingImageUrl] = useState("");
  const [authBackgroundImage, setAuthBackgroundImage] = useState("");

  // Contact
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Social
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [pinterest, setPinterest] = useState("");
  const [youtube, setYoutube] = useState("");

  // Legal
  const [copyrightText, setCopyrightText] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState("");

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  // Theme
  const [primaryColor, setPrimaryColor] = useState("#C9A227");
  const [secondaryColor, setSecondaryColor] = useState("#2F5D62");
  const [accentColor, setAccentColor] = useState("#2F5D62");
  const [fontHeading, setFontHeading] = useState("Playfair Display");
  const [fontBody, setFontBody] = useState("Lato");
  const [darkMode, setDarkMode] = useState(false);

  // Promo Banner
  const [promoMessage, setPromoMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoVisible, setPromoVisible] = useState(true);

  // Business Hours
  const defaultBusinessHours: BusinessHour[] = [
    { day: "Monday - Friday", hours: "10:00 AM - 8:00 PM", closed: false },
    { day: "Saturday", hours: "11:00 AM - 7:00 PM", closed: false },
    { day: "Sunday", hours: "Closed", closed: true },
  ];
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(defaultBusinessHours);

  // Contact Page Settings
  const [contactHeroImage, setContactHeroImage] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");

  // Commerce Settings
  const [shippingFlatRate, setShippingFlatRate] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  // Store Settings
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [defaultSort, setDefaultSort] = useState("featured");
  const [newArrivalDays, setNewArrivalDays] = useState(30);


  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const branding = settings.branding as unknown as BrandingSettings & { footerLogoUrl?: string } | undefined;
      const contact = settings.contact as unknown as ContactSettings | undefined;
      const social = settings.social as unknown as SocialSettings | undefined;
      const legal = settings.legal as unknown as LegalSettings | undefined;
      const seo = settings.seo as unknown as SeoSettings | undefined;
      const theme = settings.theme as unknown as ThemeSettings | undefined;
      const promoBanner = settings.promo_banner as unknown as PromoBannerSettings | undefined;

      if (branding) {
        setSiteName(branding.siteName || "");
        setTagline(branding.tagline || "");
        setLogoUrl(branding.logoUrl || "");
        setFooterLogoUrl(branding.footerLogoUrl || "");
        setFaviconUrl(branding.faviconUrl || "");
        setLoadingImageUrl(branding.loadingImageUrl || "");
        setAuthBackgroundImage(branding.authBackgroundImage || "");
      }
      if (contact) {
        setEmail(contact.email || "");
        setPhone(contact.phone || "");
        setAddress(contact.address || "");
        setWhatsapp(contact.whatsapp || "");
      }
      if (social) {
        setFacebook(social.facebook || "");
        setInstagram(social.instagram || "");
        setTwitter(social.twitter || "");
        setPinterest(social.pinterest || "");
        setYoutube(social.youtube || "");
      }
      if (legal) {
        setCopyrightText(legal.copyrightText || "");
        setPrivacyPolicyUrl(legal.privacyPolicyUrl || "");
        setTermsOfServiceUrl(legal.termsOfServiceUrl || "");
      }
      if (seo) {
        setMetaTitle(seo.metaTitle || "");
        setMetaDescription(seo.metaDescription || "");
        setOgImage(seo.ogImage || "");
      }
      if (theme) {
        setPrimaryColor(theme.primaryColor || "#C9A227");
        setSecondaryColor(theme.secondaryColor || "#2F5D62");
        setAccentColor(theme.accentColor || "#2F5D62");
        setFontHeading(theme.fontHeading || "Playfair Display");
        setFontBody(theme.fontBody || "Lato");
        setDarkMode(theme.darkMode || false);
      }
      if (promoBanner) {
        setPromoMessage(promoBanner.message || "");
        setPromoCode(promoBanner.discountCode || "");
        setPromoVisible(promoBanner.isVisible !== false);
      }
      const businessHoursData = settings.business_hours as unknown as BusinessHoursSettings | undefined;
      if (businessHoursData?.hours) {
        setBusinessHours(businessHoursData.hours);
      }
      const contactPageData = settings.contact_page as unknown as ContactPageSettings | undefined;
      if (contactPageData) {
        setContactHeroImage(contactPageData.heroImage || "");
        setMapEmbedUrl(contactPageData.mapEmbedUrl || "");
      }
      const commerceData = settings.commerce as unknown as CommerceSettings | undefined;
      if (commerceData) {
        setShippingFlatRate(commerceData.shippingFlatRate || 0);
        setFreeShippingThreshold(commerceData.freeShippingThreshold || 0);
        setTaxRate(commerceData.taxRate || 0);
        setCurrencyCode(commerceData.currencyCode || "INR");
        setCurrencySymbol(commerceData.currencySymbol || "₹");
        setProductsPerPage((commerceData as any).productsPerPage || 12);
        setDefaultSort((commerceData as any).defaultSort || "featured");
        setNewArrivalDays((commerceData as any).newArrivalDays || 30);
      }

    }
  }, [settings]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formatCheck = validateWebPImage(file);
    if (!formatCheck.valid) {
      toast.error(formatCheck.error);
      return;
    }

    const sizeCheck = validateImageSize(file, 5);
    if (!sizeCheck.valid) {
      toast.error(sizeCheck.error);
      return;
    }

    setUploading(field);
    try {
      const url = await uploadSiteAsset(file, "branding");
      setter(url);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadSiteAsset(file, "legal");
      setter(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(null);
    }
  };

  const saveBranding = async () => {
    await updateSetting.mutateAsync({
      key: "branding",
      value: { siteName, tagline, logoUrl, footerLogoUrl, faviconUrl, loadingImageUrl, authBackgroundImage },
      category: "branding",
    });
  };

  const saveContact = async () => {
    await updateSetting.mutateAsync({
      key: "contact",
      value: { email, phone, address, whatsapp },
      category: "contact",
    });
    // Also save business hours
    await updateSetting.mutateAsync({
      key: "business_hours",
      value: { hours: businessHours },
      category: "contact",
    });
    // Also save contact page settings
    await updateSetting.mutateAsync({
      key: "contact_page",
      value: { heroImage: contactHeroImage, mapEmbedUrl: mapEmbedUrl },
      category: "contact",
    });
  };

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: string | boolean) => {
    setBusinessHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  };

  const addBusinessHour = () => {
    setBusinessHours((prev) => [...prev, { day: "", hours: "", closed: false }]);
  };

  const removeBusinessHour = (index: number) => {
    setBusinessHours((prev) => prev.filter((_, i) => i !== index));
  };

  const saveSocial = async () => {
    await updateSetting.mutateAsync({
      key: "social",
      value: { facebook, instagram, twitter, pinterest, youtube },
      category: "social",
    });
  };

  const saveLegal = async () => {
    await updateSetting.mutateAsync({
      key: "legal",
      value: { copyrightText, privacyPolicyUrl, termsOfServiceUrl },
      category: "legal",
    });
  };

  const saveSeo = async () => {
    await updateSetting.mutateAsync({
      key: "seo",
      value: { metaTitle, metaDescription, ogImage },
      category: "seo",
    });
  };

  const saveTheme = async () => {
    await updateSetting.mutateAsync({
      key: "theme",
      value: { primaryColor, secondaryColor, accentColor, fontHeading, fontBody, darkMode },
      category: "theme",
    });
  };

  const savePromoBanner = async () => {
    await updateSetting.mutateAsync({
      key: "promo_banner",
      value: { message: promoMessage, discountCode: promoCode, isVisible: promoVisible },
      category: "promo",
    });
  };

  const saveCommerce = async () => {
    await updateSetting.mutateAsync({
      key: "commerce",
      value: {
        shippingFlatRate,
        freeShippingThreshold,
        taxRate,
        currencyCode,
        currencySymbol,
        productsPerPage,
        defaultSort,
        newArrivalDays,
      },
      category: "commerce",
    });
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground">Manage your store's branding, contact info, and appearance</p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="branding" className="gap-2"><Building2 className="h-4 w-4" /> Branding</TabsTrigger>
          <TabsTrigger value="contact" className="gap-2"><Phone className="h-4 w-4" /> Contact</TabsTrigger>
          <TabsTrigger value="social" className="gap-2"><Globe className="h-4 w-4" /> Social</TabsTrigger>
          <TabsTrigger value="theme" className="gap-2"><Palette className="h-4 w-4" /> Theme</TabsTrigger>
          <TabsTrigger value="promo" className="gap-2"><Megaphone className="h-4 w-4" /> Promo</TabsTrigger>
          <TabsTrigger value="legal" className="gap-2"><Scale className="h-4 w-4" /> Legal</TabsTrigger>
          <TabsTrigger value="seo" className="gap-2"><Image className="h-4 w-4" /> SEO</TabsTrigger>
          <TabsTrigger value="commerce" className="gap-2"><ShoppingCart className="h-4 w-4" /> Commerce</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Manage your store's identity and logos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Site Name</Label>
                    <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Your Store Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Your store tagline" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base font-medium">Navigation Logo</Label>
                    <p className="text-xs text-muted-foreground">Displayed in the header</p>
                    <div className="flex gap-4 items-center">
                      <div className="w-32 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {logoUrl ? <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">No logo</span>}
                      </div>
                      <div>
                        <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "logo", setLogoUrl)} className="hidden" id="logo-upload" />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("logo-upload")?.click()} disabled={uploading === "logo"}>
                          {uploading === "logo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base font-medium">Footer Logo</Label>
                    <p className="text-xs text-muted-foreground">Displayed in the footer</p>
                    <div className="flex gap-4 items-center">
                      <div className="w-32 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {footerLogoUrl ? <img src={footerLogoUrl} alt="Footer Logo" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">No logo</span>}
                      </div>
                      <div>
                        <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "footerLogo", setFooterLogoUrl)} className="hidden" id="footer-logo-upload" />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("footer-logo-upload")?.click()} disabled={uploading === "footerLogo"}>
                          {uploading === "footerLogo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base font-medium">Favicon</Label>
                    <p className="text-xs text-muted-foreground">Browser tab icon (32x32px)</p>
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {faviconUrl ? <img src={faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" /> : <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                      <div>
                        <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "favicon", setFaviconUrl)} className="hidden" id="favicon-upload" />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("favicon-upload")?.click()} disabled={uploading === "favicon"}>
                          {uploading === "favicon" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base font-medium">Loading Image</Label>
                    <p className="text-xs text-muted-foreground">Shown while page loads</p>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {loadingImageUrl ? <img src={loadingImageUrl} alt="Loading" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                      <div>
                        <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "loading", setLoadingImageUrl)} className="hidden" id="loading-upload" />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("loading-upload")?.click()} disabled={uploading === "loading"}>
                          {uploading === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base font-medium">Auth Background</Label>
                    <p className="text-xs text-muted-foreground">Image for Sign In/Sign Up pages</p>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {authBackgroundImage ? <img src={authBackgroundImage} alt="Auth BG" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">Default</span>}
                      </div>
                      <div>
                        <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "authBg", setAuthBackgroundImage)} className="hidden" id="auth-bg-upload" />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("auth-bg-upload")?.click()} disabled={uploading === "authBg"}>
                          {uploading === "authBg" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={saveBranding} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Branding
                </Button>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How it looks on the site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Header</p>
                  <div className="flex items-center gap-2">
                    {logoUrl ? <img src={logoUrl} alt="Logo" className="h-8 object-contain" /> : <div className="h-8 w-24 bg-border rounded flex items-center justify-center text-xs">Logo</div>}
                    <span className="font-display font-semibold">{siteName || "Store Name"}</span>
                  </div>
                </div>
                <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                  <p className="text-xs opacity-70 mb-2">Footer</p>
                  <div className="flex items-center gap-2">
                    {footerLogoUrl ? <img src={footerLogoUrl} alt="Footer Logo" className="h-6 object-contain" /> : logoUrl ? <img src={logoUrl} alt="Logo" className="h-6 object-contain" /> : <div className="h-6 w-20 bg-white/20 rounded flex items-center justify-center text-xs">Logo</div>}
                  </div>
                  <p className="text-xs mt-2 opacity-80">{tagline || "Your tagline here"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="support@yourstore.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 1234567890" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Your store address" />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91..." />
                  <p className="text-xs text-muted-foreground">Used for WhatsApp chat button. Include country code.</p>
                </div>

                {/* Business Hours */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-base font-medium">Business Hours</Label>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addBusinessHour}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {businessHours.map((hour, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={hour.day}
                          onChange={(e) => updateBusinessHour(index, "day", e.target.value)}
                          placeholder="Day(s)"
                          className="flex-1"
                        />
                        <Input
                          value={hour.hours}
                          onChange={(e) => updateBusinessHour(index, "hours", e.target.value)}
                          placeholder="Hours (e.g., 10AM - 6PM)"
                          className="flex-1"
                          disabled={hour.closed}
                        />
                        <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={hour.closed}
                            onChange={(e) => {
                              updateBusinessHour(index, "closed", e.target.checked);
                              if (e.target.checked) updateBusinessHour(index, "hours", "Closed");
                            }}
                            className="rounded"
                          />
                          Closed
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBusinessHour(index)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Page Settings */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-base font-medium">Contact Page Settings</Label>
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label>Hero Image</Label>
                    <p className="text-xs text-muted-foreground">Background image for the Contact page header</p>
                    <div className="flex gap-4 items-center">
                      <div className="w-32 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {contactHeroImage ? <img src={contactHeroImage} alt="Contact Hero" className="max-h-full max-w-full object-cover" /> : <span className="text-xs text-muted-foreground">No image</span>}
                      </div>
                      <div>
                        <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "contactHero", setContactHeroImage)} className="hidden" id="contact-hero-upload" />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("contact-hero-upload")?.click()} disabled={uploading === "contactHero"}>
                          {uploading === "contactHero" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Google Maps Embed URL</Label>
                    <Input
                      value={mapEmbedUrl}
                      onChange={(e) => setMapEmbedUrl(e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Get embed code from Google Maps: Share → Embed a map → Copy the src URL
                    </p>
                  </div>
                </div>

                <Button onClick={saveContact} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Contact
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Contact details display</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span>{phone || "Not set"}</span></div>
                <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><span>{email || "Not set"}</span></div>
                <div className="flex items-start gap-2"><Building2 className="h-4 w-4 text-primary mt-0.5" /><span className="text-muted-foreground">{address || "Address not set"}</span></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter/X</Label>
                    <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Pinterest</Label>
                    <Input value={pinterest} onChange={(e) => setPinterest(e.target.value)} placeholder="https://pinterest.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/..." />
                  </div>
                </div>
                <Button onClick={saveSocial} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Social
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Social links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="p-2 border rounded hover:bg-muted">FB</a>}
                  {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="p-2 border rounded hover:bg-muted">IG</a>}
                  {twitter && <a href={twitter} target="_blank" rel="noopener noreferrer" className="p-2 border rounded hover:bg-muted">X</a>}
                  {pinterest && <a href={pinterest} target="_blank" rel="noopener noreferrer" className="p-2 border rounded hover:bg-muted">Pin</a>}
                  {youtube && <a href={youtube} target="_blank" rel="noopener noreferrer" className="p-2 border rounded hover:bg-muted">YT</a>}
                  {!facebook && !instagram && !twitter && !pinterest && !youtube && <p className="text-muted-foreground text-sm">No social links set</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="theme">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize colors and fonts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#C9A227" />
                    </div>
                    <p className="text-xs text-muted-foreground">Main brand color (buttons, links)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} placeholder="#2F5D62" />
                    </div>
                    <p className="text-xs text-muted-foreground">Backgrounds, banners</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#2F5D62" />
                    </div>
                    <p className="text-xs text-muted-foreground">Highlights, accents</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heading Font</Label>
                    <Select value={fontHeading} onValueChange={setFontHeading}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Body Font</Label>
                    <Select value={fontBody} onValueChange={setFontBody}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  <div>
                    <Label htmlFor="dark-mode" className="text-base font-medium cursor-pointer">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Enable dark theme for the storefront</p>
                  </div>
                </div>

                <Button onClick={saveTheme} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Theme
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Theme preview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: primaryColor }}>
                  <p className="text-white font-semibold" style={{ fontFamily: fontHeading }}>Primary Color</p>
                  <p className="text-white/80 text-sm" style={{ fontFamily: fontBody }}>Button & Link color</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: secondaryColor }}>
                  <p className="text-white font-semibold" style={{ fontFamily: fontHeading }}>Secondary Color</p>
                  <p className="text-white/80 text-sm" style={{ fontFamily: fontBody }}>Banner background</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: accentColor }}>
                  <p className="font-semibold" style={{ fontFamily: fontHeading, color: accentColor }}>Accent Color</p>
                  <p className="text-muted-foreground text-sm" style={{ fontFamily: fontBody }}>Highlights</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="promo">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Promo Banner</CardTitle>
                <CardDescription>Announcement bar at the top of the site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Switch id="promo-visible" checked={promoVisible} onCheckedChange={setPromoVisible} />
                  <div>
                    <Label htmlFor="promo-visible" className="text-base font-medium cursor-pointer">Show Promo Banner</Label>
                    <p className="text-xs text-muted-foreground">Display announcement bar on all pages</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Input value={promoMessage} onChange={(e) => setPromoMessage(e.target.value)} placeholder="Free Shipping on Orders Over ₹999!" />
                </div>
                <div className="space-y-2">
                  <Label>Discount Code (Optional)</Label>
                  <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="SAVE20" />
                  <p className="text-xs text-muted-foreground">If set, will show "Use code [CODE]"</p>
                </div>
                <Button onClick={savePromoBanner} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Promo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How the banner looks</CardDescription>
              </CardHeader>
              <CardContent>
                {promoVisible ? (
                  <div className="bg-secondary text-secondary-foreground py-2 px-4 text-center text-xs font-medium rounded">
                    {promoMessage || "Your promo message here"}
                    {promoCode && <> Use code <span className="font-bold">{promoCode}</span></>}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">Banner is hidden</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="legal">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Legal Information</CardTitle>
                <CardDescription>Copyright and legal documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} placeholder="© 2024 Your Company. All rights reserved." />
                  <p className="text-xs text-muted-foreground">Displayed in the footer.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base font-medium">Privacy Policy</Label>
                    <p className="text-xs text-muted-foreground">Upload .txt, .pdf, or .docx</p>
                    <div className="flex gap-2 items-center">
                      {privacyPolicyUrl && (
                        <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-[150px]">
                          View File
                        </a>
                      )}
                      <Input type="file" accept=".txt,.pdf,.docx,.doc" onChange={(e) => handleFileUpload(e, "privacy", setPrivacyPolicyUrl)} className="hidden" id="privacy-upload" />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("privacy-upload")?.click()} disabled={uploading === "privacy"}>
                        {uploading === "privacy" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FileText className="h-4 w-4 mr-2" /> Upload</>}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base font-medium">Terms of Service</Label>
                    <p className="text-xs text-muted-foreground">Upload .txt, .pdf, or .docx</p>
                    <div className="flex gap-2 items-center">
                      {termsOfServiceUrl && (
                        <a href={termsOfServiceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-[150px]">
                          View File
                        </a>
                      )}
                      <Input type="file" accept=".txt,.pdf,.docx,.doc" onChange={(e) => handleFileUpload(e, "terms", setTermsOfServiceUrl)} className="hidden" id="terms-upload" />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("terms-upload")?.click()} disabled={uploading === "terms"}>
                        {uploading === "terms" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FileText className="h-4 w-4 mr-2" /> Upload</>}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={saveLegal} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Legal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Footer legal section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{copyrightText || "© 2024 Company Name"}</p>
                <div className="flex gap-4">
                  {privacyPolicyUrl ? <span className="text-primary">Privacy Policy ✓</span> : <span className="text-muted-foreground">No Privacy Policy</span>}
                  {termsOfServiceUrl ? <span className="text-primary">Terms ✓</span> : <span className="text-muted-foreground">No Terms</span>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Search engine optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Your Store - Premium Jewelry Collection" />
                  <p className="text-xs text-muted-foreground">{metaTitle.length}/60 characters recommended</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="Describe your store for search engines..." />
                  <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters recommended</p>
                </div>
                <div className="space-y-2">
                  <Label>OG Image</Label>
                  <p className="text-xs text-muted-foreground mb-2">Image shown when sharing on social media (1200x630px recommended)</p>
                  <div className="flex gap-4 items-center">
                    {ogImage && <img src={ogImage} alt="OG" className="h-20 w-auto rounded border" />}
                    <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "og", setOgImage)} className="hidden" id="og-upload" />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("og-upload")?.click()} disabled={uploading === "og"}>
                      {uploading === "og" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4 mr-2" /> Upload</>}
                    </Button>
                  </div>
                </div>
                <Button onClick={saveSeo} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save SEO
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Search result preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <p className="text-primary text-sm truncate">{metaTitle || "Page Title"}</p>
                  <p className="text-xs text-green-600 truncate">yourstore.com</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{metaDescription || "Page description will appear here..."}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commerce">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Commerce Settings</CardTitle>
                <CardDescription>Configure shipping, tax, and currency for your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><IndianRupee className="h-4 w-4" /> Currency Code</Label>
                    <Input value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())} placeholder="INR" maxLength={3} />
                    <p className="text-xs text-muted-foreground">ISO 4217 currency code (e.g., INR, USD)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency Symbol</Label>
                    <Input value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} placeholder="₹" maxLength={3} />
                    <p className="text-xs text-muted-foreground">Symbol shown in prices</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Shipping</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Flat Rate Shipping ({currencySymbol})</Label>
                      <Input type="number" value={shippingFlatRate} onChange={(e) => setShippingFlatRate(parseFloat(e.target.value) || 0)} min={0} />
                      <p className="text-xs text-muted-foreground">Applied to all orders below threshold</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Free Shipping Threshold ({currencySymbol})</Label>
                      <Input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value) || 0)} min={0} />
                      <p className="text-xs text-muted-foreground">Orders above this get free shipping</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Tax</h4>
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} min={0} max={100} step={0.1} />
                    <p className="text-xs text-muted-foreground">Applied to subtotal (e.g., 18 for GST)</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Store Settings</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1"><SortAsc className="h-3 w-3" /> Default Sort</Label>
                      <Select value={defaultSort} onValueChange={setDefaultSort}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Products Per Page</Label>
                      <Input type="number" value={productsPerPage} onChange={(e) => setProductsPerPage(parseInt(e.target.value) || 12)} min={4} max={48} step={4} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> New Badge (days)</Label>
                      <Input type="number" value={newArrivalDays} onChange={(e) => setNewArrivalDays(parseInt(e.target.value) || 30)} min={1} max={365} />
                      <p className="text-xs text-muted-foreground">Auto-badge products</p>
                    </div>
                  </div>
                </div>

                <Button onClick={saveCommerce} disabled={updateSetting.isPending} className="gap-2">
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Commerce Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How prices will be calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="font-medium">Example Order: {currencySymbol}1,500</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{currencySymbol}1,500</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                      <span>{currencySymbol}{(1500 * taxRate / 100).toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{freeShippingThreshold > 0 && 1500 >= freeShippingThreshold ? "Free" : `${currencySymbol}${shippingFlatRate}`}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{currencySymbol}{(1500 + (1500 * taxRate / 100) + (freeShippingThreshold > 0 && 1500 >= freeShippingThreshold ? 0 : shippingFlatRate)).toFixed(0)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {freeShippingThreshold > 0 && `Free shipping on orders over ${currencySymbol}${freeShippingThreshold}`}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
