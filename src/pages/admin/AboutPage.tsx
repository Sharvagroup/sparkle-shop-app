import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { useSiteSetting, useUpdateSiteSetting, uploadSiteAsset } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Artisan {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface AboutSettings {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  missionTitle: string;
  missionText: string;
  missionImage: string;
  artisans: Artisan[];
  values: Value[];
  ctaTitle: string;
  ctaText: string;
  ctaButtonText: string;
}

const defaultAboutSettings: AboutSettings = {
  heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop",
  heroTitle: "Our Story",
  heroSubtitle: "Crafting timeless elegance rooted in Indian heritage",
  missionTitle: "Redefining traditional luxury for the modern soul.",
  missionText: "At Sharva, we believe that jewelry is more than just an accessory; it is a repository of memories, a symbol of heritage, and a work of art.",
  missionImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop",
  artisans: [
    {
      id: "1",
      name: "Aanya Kapoor",
      role: "Founder & Creative Director",
      quote: "I wanted to create pieces that don't just adorn the body, but also touch the soul.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: "2",
      name: "Rajesh Verma",
      role: "Head Goldsmith",
      quote: "Thirty years of shaping gold has taught me that patience is the true secret to beauty.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    }
  ],
  values: [
    { id: "1", icon: "Hammer", title: "Our Craftsmanship", description: "Every curve and contour is meticulously shaped by master artisans who have inherited their skills through generations." },
    { id: "2", icon: "BookOpen", title: "Our Heritage", description: "Rooted in the royal traditions of India, our designs pay homage to the grandeur of the past while embracing today." },
    { id: "3", icon: "Diamond", title: "Our Values", description: "We are committed to ethical sourcing and sustainability, ensuring the beauty of our jewelry is matched by its integrity." }
  ],
  ctaTitle: "Experience the Legacy",
  ctaText: "Explore our curated collections and find the piece that speaks to your unique story.",
  ctaButtonText: "Shop Our Collections"
};

const iconOptions = ["Hammer", "BookOpen", "Diamond", "Heart", "Star", "Award", "Shield", "Gem"];

const AboutPage = () => {
  const { data: aboutData, isLoading } = useSiteSetting<AboutSettings>("about");
  const updateSetting = useUpdateSiteSetting();
  const [settings, setSettings] = useState<AboutSettings>(defaultAboutSettings);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (aboutData) {
      setSettings({ ...defaultAboutSettings, ...aboutData });
    }
  }, [aboutData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadSiteAsset(file, "about");
      setSettings((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(null);
    }
  };

  const handleArtisanImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, artisanId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(`artisan-${artisanId}`);
    try {
      const url = await uploadSiteAsset(file, "about/artisans");
      setSettings((prev) => ({
        ...prev,
        artisans: prev.artisans.map((a) => (a.id === artisanId ? { ...a, image: url } : a))
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(null);
    }
  };

  const updateArtisan = (id: string, field: keyof Artisan, value: string) => {
    setSettings((prev) => ({
      ...prev,
      artisans: prev.artisans.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    }));
  };

  const addArtisan = () => {
    setSettings((prev) => ({
      ...prev,
      artisans: [...prev.artisans, { id: crypto.randomUUID(), name: "", role: "", quote: "", image: "" }]
    }));
  };

  const removeArtisan = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      artisans: prev.artisans.filter((a) => a.id !== id)
    }));
  };

  const updateValue = (id: string, field: keyof Value, value: string) => {
    setSettings((prev) => ({
      ...prev,
      values: prev.values.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    }));
  };

  const addValue = () => {
    setSettings((prev) => ({
      ...prev,
      values: [...prev.values, { id: crypto.randomUUID(), icon: "Star", title: "", description: "" }]
    }));
  };

  const removeValue = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      values: prev.values.filter((v) => v.id !== id)
    }));
  };

  const saveSettings = async () => {
    await updateSetting.mutateAsync({
      key: "about",
      value: settings as unknown as Record<string, unknown>,
      category: "content"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">About Page</h1>
          <p className="text-muted-foreground">Manage your About page content</p>
        </div>
        <Button onClick={saveSettings} disabled={updateSetting.isPending} className="gap-2">
          {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Changes
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["hero", "mission"]} className="space-y-4">
        {/* Hero Section */}
        <AccordionItem value="hero" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold">Hero Section</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input value={settings.heroTitle} onChange={(e) => setSettings((p) => ({ ...p, heroTitle: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Input value={settings.heroSubtitle} onChange={(e) => setSettings((p) => ({ ...p, heroSubtitle: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hero Background Image</Label>
              <div className="flex gap-4 items-center">
                <div className="w-48 h-24 bg-muted rounded overflow-hidden">
                  {settings.heroImage && <img src={settings.heroImage} alt="Hero" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} className="hidden" id="hero-upload" />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("hero-upload")?.click()} disabled={uploading === "heroImage"}>
                    {uploading === "heroImage" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Mission Section */}
        <AccordionItem value="mission" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold">Mission Section</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label>Mission Headline</Label>
              <Input value={settings.missionTitle} onChange={(e) => setSettings((p) => ({ ...p, missionTitle: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Mission Text</Label>
              <Textarea rows={4} value={settings.missionText} onChange={(e) => setSettings((p) => ({ ...p, missionText: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Mission Image</Label>
              <div className="flex gap-4 items-center">
                <div className="w-48 h-24 bg-muted rounded overflow-hidden">
                  {settings.missionImage && <img src={settings.missionImage} alt="Mission" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "missionImage")} className="hidden" id="mission-upload" />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("mission-upload")?.click()} disabled={uploading === "missionImage"}>
                    {uploading === "missionImage" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Values Section */}
        <AccordionItem value="values" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold">Values Section ({settings.values.length})</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {settings.values.map((value, index) => (
              <Card key={value.id}>
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Value {index + 1}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeValue(value.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="py-3 px-4 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Icon</Label>
                      <select
                        value={value.icon}
                        onChange={(e) => updateValue(value.id, "icon", e.target.value)}
                        className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                      >
                        {iconOptions.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input value={value.title} onChange={(e) => updateValue(value.id, "title", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea rows={2} value={value.description} onChange={(e) => updateValue(value.id, "description", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addValue} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Add Value
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Artisans Section */}
        <AccordionItem value="artisans" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold">Artisans / Team ({settings.artisans.length})</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {settings.artisans.map((artisan, index) => (
              <Card key={artisan.id}>
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Artisan {index + 1}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeArtisan(artisan.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="py-3 px-4 space-y-3">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted overflow-hidden shrink-0">
                      {artisan.image ? (
                        <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Name</Label>
                          <Input value={artisan.name} onChange={(e) => updateArtisan(artisan.id, "name", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Role</Label>
                          <Input value={artisan.role} onChange={(e) => updateArtisan(artisan.id, "role", e.target.value)} />
                        </div>
                      </div>
                      <Input type="file" accept="image/*" onChange={(e) => handleArtisanImageUpload(e, artisan.id)} className="hidden" id={`artisan-${artisan.id}`} />
                      <Button variant="outline" size="sm" onClick={() => document.getElementById(`artisan-${artisan.id}`)?.click()} disabled={uploading === `artisan-${artisan.id}`}>
                        {uploading === `artisan-${artisan.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload Photo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Quote</Label>
                    <Textarea rows={2} value={artisan.quote} onChange={(e) => updateArtisan(artisan.id, "quote", e.target.value)} placeholder="A quote from this person..." />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addArtisan} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Add Artisan
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* CTA Section */}
        <AccordionItem value="cta" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold">Call to Action</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Title</Label>
                <Input value={settings.ctaTitle} onChange={(e) => setSettings((p) => ({ ...p, ctaTitle: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input value={settings.ctaButtonText} onChange={(e) => setSettings((p) => ({ ...p, ctaButtonText: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>CTA Text</Label>
              <Textarea rows={2} value={settings.ctaText} onChange={(e) => setSettings((p) => ({ ...p, ctaText: e.target.value }))} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutPage;
