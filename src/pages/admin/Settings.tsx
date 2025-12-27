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
import { Loader2, Upload, Save, Building2, Phone, Globe, Image, Scale } from "lucide-react";
import { useSiteSettings, useUpdateSiteSetting, uploadSiteAsset, BrandingSettings, ContactSettings, SocialSettings, SeoSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

interface LegalSettings {
  copyrightText: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}

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

  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const branding = settings.branding as unknown as BrandingSettings & { footerLogoUrl?: string } | undefined;
      const contact = settings.contact as unknown as ContactSettings | undefined;
      const social = settings.social as unknown as SocialSettings | undefined;
      const legal = settings.legal as unknown as LegalSettings | undefined;
      const seo = settings.seo as unknown as SeoSettings | undefined;

      if (branding) {
        setSiteName(branding.siteName || "");
        setTagline(branding.tagline || "");
        setLogoUrl(branding.logoUrl || "");
        setFooterLogoUrl(branding.footerLogoUrl || "");
        setFaviconUrl(branding.faviconUrl || "");
        setLoadingImageUrl(branding.loadingImageUrl || "");
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
    }
  }, [settings]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadSiteAsset(file, "branding");
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
      value: { siteName, tagline, logoUrl, footerLogoUrl, faviconUrl, loadingImageUrl },
      category: "branding",
    });
  };

  const saveContact = async () => {
    await updateSetting.mutateAsync({
      key: "contact",
      value: { email, phone, address, whatsapp },
      category: "contact",
    });
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding" className="gap-2"><Building2 className="h-4 w-4" /> Branding</TabsTrigger>
          <TabsTrigger value="contact" className="gap-2"><Phone className="h-4 w-4" /> Contact</TabsTrigger>
          <TabsTrigger value="social" className="gap-2"><Globe className="h-4 w-4" /> Social</TabsTrigger>
          <TabsTrigger value="legal" className="gap-2"><Scale className="h-4 w-4" /> Legal</TabsTrigger>
          <TabsTrigger value="seo" className="gap-2"><Image className="h-4 w-4" /> SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card>
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

              {/* Logo Section */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 p-4 border rounded-lg">
                  <Label className="text-base font-medium">Navigation Logo</Label>
                  <p className="text-xs text-muted-foreground">Displayed in the header navigation</p>
                  <div className="flex gap-4 items-center">
                    <div className="w-32 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No logo</span>
                      )}
                    </div>
                    <div>
                      <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo", setLogoUrl)} className="hidden" id="logo-upload" />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("logo-upload")?.click()} disabled={uploading === "logo"}>
                        {uploading === "logo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 border rounded-lg">
                  <Label className="text-base font-medium">Footer Logo</Label>
                  <p className="text-xs text-muted-foreground">Displayed in the footer (optional)</p>
                  <div className="flex gap-4 items-center">
                    <div className="w-32 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {footerLogoUrl ? (
                        <img src={footerLogoUrl} alt="Footer Logo" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No logo</span>
                      )}
                    </div>
                    <div>
                      <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "footerLogo", setFooterLogoUrl)} className="hidden" id="footer-logo-upload" />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("footer-logo-upload")?.click()} disabled={uploading === "footerLogo"}>
                        {uploading === "footerLogo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 p-4 border rounded-lg">
                  <Label className="text-base font-medium">Favicon</Label>
                  <p className="text-xs text-muted-foreground">Browser tab icon (32x32px recommended)</p>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {faviconUrl ? (
                        <img src={faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                    <div>
                      <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "favicon", setFaviconUrl)} className="hidden" id="favicon-upload" />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("favicon-upload")?.click()} disabled={uploading === "favicon"}>
                        {uploading === "favicon" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 border rounded-lg">
                  <Label className="text-base font-medium">Loading Image</Label>
                  <p className="text-xs text-muted-foreground">Shown while page is loading</p>
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {loadingImageUrl ? (
                        <img src={loadingImageUrl} alt="Loading" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                    <div>
                      <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "loading", setLoadingImageUrl)} className="hidden" id="loading-upload" />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("loading-upload")?.click()} disabled={uploading === "loading"}>
                        {uploading === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={saveBranding} disabled={updateSetting.isPending} className="gap-2">
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
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
              <Button onClick={saveContact} disabled={updateSetting.isPending} className="gap-2">
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Contact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
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
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Social
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>Copyright and legal page links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Copyright Text</Label>
                <Input 
                  value={copyrightText} 
                  onChange={(e) => setCopyrightText(e.target.value)} 
                  placeholder="© 2024 Your Company. All rights reserved."
                />
                <p className="text-xs text-muted-foreground">Displayed in the footer. Leave empty to use default.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Privacy Policy URL</Label>
                  <Input 
                    value={privacyPolicyUrl} 
                    onChange={(e) => setPrivacyPolicyUrl(e.target.value)} 
                    placeholder="/privacy-policy or https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Terms of Service URL</Label>
                  <Input 
                    value={termsOfServiceUrl} 
                    onChange={(e) => setTermsOfServiceUrl(e.target.value)} 
                    placeholder="/terms-of-service or https://..."
                  />
                </div>
              </div>
              <Button onClick={saveLegal} disabled={updateSetting.isPending} className="gap-2">
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Legal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
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
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "og", setOgImage)} className="hidden" id="og-upload" />
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("og-upload")?.click()} disabled={uploading === "og"}>
                    {uploading === "og" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload
                  </Button>
                </div>
              </div>
              <Button onClick={saveSeo} disabled={updateSetting.isPending} className="gap-2">
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save SEO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
