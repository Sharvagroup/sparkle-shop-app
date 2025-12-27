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
import { Loader2, Upload, Save, Building2, Phone, Palette, Globe, Image } from "lucide-react";
import { useSiteSettings, useUpdateSiteSetting, uploadSiteAsset, BrandingSettings, ContactSettings, SocialSettings, ThemeSettings, SeoSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  // Branding
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
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

  // Theme
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [fontHeading, setFontHeading] = useState("");
  const [fontBody, setFontBody] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const branding = settings.branding as BrandingSettings | undefined;
      const contact = settings.contact as ContactSettings | undefined;
      const social = settings.social as SocialSettings | undefined;
      const theme = settings.theme as ThemeSettings | undefined;
      const seo = settings.seo as SeoSettings | undefined;

      if (branding) {
        setSiteName(branding.siteName || "");
        setTagline(branding.tagline || "");
        setLogoUrl(branding.logoUrl || "");
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
      if (theme) {
        setPrimaryColor(theme.primaryColor || "");
        setSecondaryColor(theme.secondaryColor || "");
        setAccentColor(theme.accentColor || "");
        setFontHeading(theme.fontHeading || "");
        setFontBody(theme.fontBody || "");
        setDarkMode(theme.darkMode || false);
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
      value: { siteName, tagline, logoUrl, faviconUrl, loadingImageUrl },
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

  const saveTheme = async () => {
    await updateSetting.mutateAsync({
      key: "theme",
      value: { primaryColor, secondaryColor, accentColor, fontHeading, fontBody, darkMode },
      category: "theme",
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
          <TabsTrigger value="theme" className="gap-2"><Palette className="h-4 w-4" /> Theme</TabsTrigger>
          <TabsTrigger value="seo" className="gap-2"><Image className="h-4 w-4" /> SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Manage your store's identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex gap-2 items-center">
                    {logoUrl && <img src={logoUrl} alt="Logo" className="h-10 w-auto" />}
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo", setLogoUrl)} className="hidden" id="logo-upload" />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("logo-upload")?.click()} disabled={uploading === "logo"}>
                      {uploading === "logo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex gap-2 items-center">
                    {faviconUrl && <img src={faviconUrl} alt="Favicon" className="h-8 w-8" />}
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "favicon", setFaviconUrl)} className="hidden" id="favicon-upload" />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("favicon-upload")?.click()} disabled={uploading === "favicon"}>
                      {uploading === "favicon" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Loading Image</Label>
                  <div className="flex gap-2 items-center">
                    {loadingImageUrl && <img src={loadingImageUrl} alt="Loading" className="h-10 w-auto" />}
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "loading", setLoadingImageUrl)} className="hidden" id="loading-upload" />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("loading-upload")?.click()} disabled={uploading === "loading"}>
                      {uploading === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
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
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91..." />
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

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize colors and fonts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color (HSL)</Label>
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="45 93% 47%" />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color (HSL)</Label>
                  <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} placeholder="0 0% 9%" />
                </div>
                <div className="space-y-2">
                  <Label>Accent Color (HSL)</Label>
                  <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="45 93% 47%" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Select value={fontHeading} onValueChange={setFontHeading}>
                    <SelectTrigger><SelectValue placeholder="Select font" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cormorant Garamond">Cormorant Garamond</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Lora">Lora</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select value={fontBody} onValueChange={setFontBody}>
                    <SelectTrigger><SelectValue placeholder="Select font" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
                <Label htmlFor="darkMode">Enable Dark Mode</Label>
              </div>
              <Button onClick={saveTheme} disabled={updateSetting.isPending} className="gap-2">
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Theme
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
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>OG Image</Label>
                <div className="flex gap-2 items-center">
                  {ogImage && <img src={ogImage} alt="OG" className="h-16 w-auto rounded" />}
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "og", setOgImage)} className="hidden" id="og-upload" />
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("og-upload")?.click()} disabled={uploading === "og"}>
                    {uploading === "og" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
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
