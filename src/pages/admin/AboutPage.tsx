import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Upload, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { useSiteSetting, useUpdateSiteSetting, uploadSiteAsset } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validateWebPImage, validateImageSize, ALLOWED_IMAGE_ACCEPT } from "@/lib/imageValidation";
import { toast } from "sonner";

// ========== Our Story Types ==========
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

// ========== Size Guide Types ==========
interface SizeCategory {
  id: string;
  name: string;
  instructions: string;
  columns: string[];
  rows: Record<string, string>[];
}

interface SizeGuideSettings {
  pageTitle: string;
  pageSubtitle: string;
  categories: SizeCategory[];
  footerText: string;
}

// ========== FAQ Types ==========
interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  questions: FAQQuestion[];
}

interface FAQSettings {
  pageTitle: string;
  pageSubtitle: string;
  categories: FAQCategory[];
  ctaTitle: string;
  ctaText: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

// ========== Defaults ==========
const defaultAboutSettings: AboutSettings = {
  heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop",
  heroTitle: "Our Story",
  heroSubtitle: "Crafting timeless elegance rooted in Indian heritage",
  missionTitle: "Redefining traditional luxury for the modern soul.",
  missionText: "At Sharva, we believe that jewelry is more than just an accessory; it is a repository of memories, a symbol of heritage, and a work of art.",
  missionImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop",
  artisans: [
    { id: "1", name: "Aanya Kapoor", role: "Founder & Creative Director", quote: "I wanted to create pieces that don't just adorn the body, but also touch the soul.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face" },
    { id: "2", name: "Rajesh Verma", role: "Head Goldsmith", quote: "Thirty years of shaping gold has taught me that patience is the true secret to beauty.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" }
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

const defaultSizeGuideSettings: SizeGuideSettings = {
  pageTitle: "Size Guide",
  pageSubtitle: "Find your perfect fit with our comprehensive sizing charts",
  categories: [
    {
      id: "rings",
      name: "Rings",
      instructions: "Wrap a piece of string or paper around your finger, mark where it overlaps, measure the length in millimeters, and use the circumference column to find your size.",
      columns: ["Indian Size", "US Size", "UK Size", "Diameter (mm)", "Circumference (mm)"],
      rows: [
        { "Indian Size": "6", "US Size": "3", "UK Size": "F", "Diameter (mm)": "14.1", "Circumference (mm)": "44.2" },
        { "Indian Size": "7", "US Size": "3.5", "UK Size": "G", "Diameter (mm)": "14.5", "Circumference (mm)": "45.5" },
        { "Indian Size": "8", "US Size": "4", "UK Size": "H", "Diameter (mm)": "14.9", "Circumference (mm)": "46.8" },
        { "Indian Size": "9", "US Size": "4.5", "UK Size": "I", "Diameter (mm)": "15.3", "Circumference (mm)": "48.0" },
        { "Indian Size": "10", "US Size": "5", "UK Size": "J", "Diameter (mm)": "15.7", "Circumference (mm)": "49.3" },
      ]
    },
    {
      id: "bracelets",
      name: "Bracelets",
      instructions: "Measure around your wrist with a flexible tape measure. Add 0.5\" for a comfortable fit or 1\" for a loose fit.",
      columns: ["Size", "Wrist Size (inches)", "Bracelet Length (inches)"],
      rows: [
        { "Size": "XS", "Wrist Size (inches)": "5.5 - 6", "Bracelet Length (inches)": "6.5" },
        { "Size": "S", "Wrist Size (inches)": "6 - 6.5", "Bracelet Length (inches)": "7" },
        { "Size": "M", "Wrist Size (inches)": "6.5 - 7", "Bracelet Length (inches)": "7.5" },
        { "Size": "L", "Wrist Size (inches)": "7 - 7.5", "Bracelet Length (inches)": "8" },
        { "Size": "XL", "Wrist Size (inches)": "7.5 - 8", "Bracelet Length (inches)": "8.5" },
      ]
    },
    {
      id: "necklaces",
      name: "Necklaces",
      instructions: "Consider your neckline, body type, and the occasion when choosing a necklace length.",
      columns: ["Style", "Length (inches)", "How It Fits"],
      rows: [
        { "Style": "Choker", "Length (inches)": "14-16", "How It Fits": "Sits snugly around the neck" },
        { "Style": "Princess", "Length (inches)": "17-19", "How It Fits": "Falls just below the collarbone" },
        { "Style": "Matinee", "Length (inches)": "20-24", "How It Fits": "Falls at or above the bust line" },
        { "Style": "Opera", "Length (inches)": "28-34", "How It Fits": "Falls at the bust line or below" },
        { "Style": "Rope", "Length (inches)": "36+", "How It Fits": "Falls below the bust, can be doubled" },
      ]
    }
  ],
  footerText: "Need help finding your size? Contact our team for personalized assistance."
};

const defaultFAQSettings: FAQSettings = {
  pageTitle: "Frequently Asked Questions",
  pageSubtitle: "Find answers to common questions about our products and services",
  categories: [
    {
      id: "orders",
      name: "Orders & Shipping",
      questions: [
        { id: "1", question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. Free shipping is available on orders above ₹2,000." },
        { id: "2", question: "Do you ship internationally?", answer: "Yes, we ship to select international destinations. International shipping typically takes 10-15 business days. Additional customs duties may apply." },
        { id: "3", question: "How can I track my order?", answer: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from the 'My Orders' section in your account." }
      ]
    },
    {
      id: "returns",
      name: "Returns & Exchanges",
      questions: [
        { id: "1", question: "What is your return policy?", answer: "We offer a 15-day return policy for unused items in their original packaging. Items must be returned with all tags intact and in the original condition." },
        { id: "2", question: "How do I initiate a return?", answer: "To initiate a return, go to 'My Orders', select the order, and click 'Request Return'. Our team will guide you through the process." }
      ]
    }
  ],
  ctaTitle: "Still have questions?",
  ctaText: "Can't find what you're looking for? Our support team is here to help.",
  ctaButtonText: "Contact Us",
  ctaButtonLink: "/contact"
};

const iconOptions = ["Hammer", "BookOpen", "Diamond", "Heart", "Star", "Award", "Shield", "Gem"];

const AboutPage = () => {
  const { data: aboutData, isLoading: loadingAbout } = useSiteSetting<AboutSettings>("about");
  const { data: sizeGuideData, isLoading: loadingSizeGuide } = useSiteSetting<SizeGuideSettings>("size_guide");
  const { data: faqData, isLoading: loadingFAQ } = useSiteSetting<FAQSettings>("faq");
  const updateSetting = useUpdateSiteSetting();

  const [aboutSettings, setAboutSettings] = useState<AboutSettings>(defaultAboutSettings);
  const [sizeGuideSettings, setSizeGuideSettings] = useState<SizeGuideSettings>(defaultSizeGuideSettings);
  const [faqSettings, setFaqSettings] = useState<FAQSettings>(defaultFAQSettings);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("story");

  useEffect(() => {
    if (aboutData) setAboutSettings({ ...defaultAboutSettings, ...aboutData });
  }, [aboutData]);

  useEffect(() => {
    if (sizeGuideData) setSizeGuideSettings({ ...defaultSizeGuideSettings, ...sizeGuideData });
  }, [sizeGuideData]);

  useEffect(() => {
    if (faqData) setFaqSettings({ ...defaultFAQSettings, ...faqData });
  }, [faqData]);

  const isLoading = loadingAbout || loadingSizeGuide || loadingFAQ;

  // ========== Image Upload ==========
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
      const url = await uploadSiteAsset(file, "about");
      setAboutSettings((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleArtisanImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, artisanId: string) => {
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

    setUploading(`artisan-${artisanId}`);
    try {
      const url = await uploadSiteAsset(file, "about/artisans");
      setAboutSettings((prev) => ({
        ...prev,
        artisans: prev.artisans.map((a) => (a.id === artisanId ? { ...a, image: url } : a))
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  // ========== About Handlers ==========
  const updateArtisan = (id: string, field: keyof Artisan, value: string) => {
    setAboutSettings((prev) => ({
      ...prev,
      artisans: prev.artisans.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    }));
  };

  const addArtisan = () => {
    setAboutSettings((prev) => ({
      ...prev,
      artisans: [...prev.artisans, { id: crypto.randomUUID(), name: "", role: "", quote: "", image: "" }]
    }));
  };

  const removeArtisan = (id: string) => {
    setAboutSettings((prev) => ({
      ...prev,
      artisans: prev.artisans.filter((a) => a.id !== id)
    }));
  };

  const updateValue = (id: string, field: keyof Value, value: string) => {
    setAboutSettings((prev) => ({
      ...prev,
      values: prev.values.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    }));
  };

  const addValue = () => {
    setAboutSettings((prev) => ({
      ...prev,
      values: [...prev.values, { id: crypto.randomUUID(), icon: "Star", title: "", description: "" }]
    }));
  };

  const removeValue = (id: string) => {
    setAboutSettings((prev) => ({
      ...prev,
      values: prev.values.filter((v) => v.id !== id)
    }));
  };

  // ========== Size Guide Handlers ==========
  const addSizeCategory = () => {
    setSizeGuideSettings((prev) => ({
      ...prev,
      categories: [...prev.categories, { id: crypto.randomUUID(), name: "New Category", instructions: "", columns: ["Column 1", "Column 2"], rows: [] }]
    }));
  };

  const removeSizeCategory = (id: string) => {
    setSizeGuideSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id)
    }));
  };

  const updateSizeCategory = (id: string, field: keyof SizeCategory, value: unknown) => {
    setSizeGuideSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    }));
  };

  const addSizeRow = (categoryId: string) => {
    setSizeGuideSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => {
        if (c.id !== categoryId) return c;
        const newRow: Record<string, string> = {};
        c.columns.forEach((col) => (newRow[col] = ""));
        return { ...c, rows: [...c.rows, newRow] };
      })
    }));
  };

  const removeSizeRow = (categoryId: string, rowIndex: number) => {
    setSizeGuideSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => {
        if (c.id !== categoryId) return c;
        return { ...c, rows: c.rows.filter((_, i) => i !== rowIndex) };
      })
    }));
  };

  const updateSizeCell = (categoryId: string, rowIndex: number, column: string, value: string) => {
    setSizeGuideSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => {
        if (c.id !== categoryId) return c;
        const newRows = [...c.rows];
        newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };
        return { ...c, rows: newRows };
      })
    }));
  };

  // ========== FAQ Handlers ==========
  const addFAQCategory = () => {
    setFaqSettings((prev) => ({
      ...prev,
      categories: [...prev.categories, { id: crypto.randomUUID(), name: "New Category", questions: [] }]
    }));
  };

  const removeFAQCategory = (id: string) => {
    setFaqSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id)
    }));
  };

  const updateFAQCategory = (id: string, name: string) => {
    setFaqSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, name } : c))
    }));
  };

  const addFAQQuestion = (categoryId: string) => {
    setFaqSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => {
        if (c.id !== categoryId) return c;
        return { ...c, questions: [...c.questions, { id: crypto.randomUUID(), question: "", answer: "" }] };
      })
    }));
  };

  const removeFAQQuestion = (categoryId: string, questionId: string) => {
    setFaqSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => {
        if (c.id !== categoryId) return c;
        return { ...c, questions: c.questions.filter((q) => q.id !== questionId) };
      })
    }));
  };

  const updateFAQQuestion = (categoryId: string, questionId: string, field: "question" | "answer", value: string) => {
    setFaqSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => {
        if (c.id !== categoryId) return c;
        return { ...c, questions: c.questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)) };
      })
    }));
  };

  // ========== Save ==========
  const saveAllSettings = async () => {
    if (activeTab === "story") {
      await updateSetting.mutateAsync({ key: "about", value: aboutSettings as unknown as Record<string, unknown>, category: "content" });
    } else if (activeTab === "size-guide") {
      await updateSetting.mutateAsync({ key: "size_guide", value: sizeGuideSettings as unknown as Record<string, unknown>, category: "content" });
    } else if (activeTab === "faq") {
      await updateSetting.mutateAsync({ key: "faq", value: faqSettings as unknown as Record<string, unknown>, category: "content" });
    }
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
          <h1 className="text-2xl font-bold text-foreground">About Pages</h1>
          <p className="text-muted-foreground">Manage Our Story, Size Guide, and FAQ content</p>
        </div>
        <Button onClick={saveAllSettings} disabled={updateSetting.isPending} className="gap-2">
          {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="story">Our Story</TabsTrigger>
          <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* ========== OUR STORY TAB ========== */}
        <TabsContent value="story" className="space-y-4">
          <Accordion type="multiple" defaultValue={["hero", "mission"]} className="space-y-4">
            <AccordionItem value="hero" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">Hero Section</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input value={aboutSettings.heroTitle} onChange={(e) => setAboutSettings((p) => ({ ...p, heroTitle: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Subtitle</Label>
                    <Input value={aboutSettings.heroSubtitle} onChange={(e) => setAboutSettings((p) => ({ ...p, heroSubtitle: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Hero Background Image</Label>
                  <div className="flex gap-4 items-center">
                    <div className="w-48 h-24 bg-muted rounded overflow-hidden">
                      {aboutSettings.heroImage && <img src={aboutSettings.heroImage} alt="Hero" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "heroImage")} className="hidden" id="hero-upload" />
                      <Button variant="outline" size="sm" onClick={() => document.getElementById("hero-upload")?.click()} disabled={uploading === "heroImage"}>
                        {uploading === "heroImage" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mission" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">Mission Section</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Mission Headline</Label>
                  <Input value={aboutSettings.missionTitle} onChange={(e) => setAboutSettings((p) => ({ ...p, missionTitle: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Mission Text</Label>
                  <Textarea rows={4} value={aboutSettings.missionText} onChange={(e) => setAboutSettings((p) => ({ ...p, missionText: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Mission Image</Label>
                  <div className="flex gap-4 items-center">
                    <div className="w-48 h-24 bg-muted rounded overflow-hidden">
                      {aboutSettings.missionImage && <img src={aboutSettings.missionImage} alt="Mission" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleImageUpload(e, "missionImage")} className="hidden" id="mission-upload" />
                      <Button variant="outline" size="sm" onClick={() => document.getElementById("mission-upload")?.click()} disabled={uploading === "missionImage"}>
                        {uploading === "missionImage" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="values" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">Values Section ({aboutSettings.values.length})</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                {aboutSettings.values.map((value, index) => (
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
                          <select value={value.icon} onChange={(e) => updateValue(value.id, "icon", e.target.value)} className="w-full h-9 rounded-md border bg-background px-3 text-sm">
                            {iconOptions.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
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

            <AccordionItem value="artisans" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">Artisans / Team ({aboutSettings.artisans.length})</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                {aboutSettings.artisans.map((artisan, index) => (
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
                          {artisan.image ? (<img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>)}
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
                          <Input type="file" accept={ALLOWED_IMAGE_ACCEPT} onChange={(e) => handleArtisanImageUpload(e, artisan.id)} className="hidden" id={`artisan-${artisan.id}`} />
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

            <AccordionItem value="cta" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">Call to Action</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CTA Title</Label>
                    <Input value={aboutSettings.ctaTitle} onChange={(e) => setAboutSettings((p) => ({ ...p, ctaTitle: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input value={aboutSettings.ctaButtonText} onChange={(e) => setAboutSettings((p) => ({ ...p, ctaButtonText: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Textarea rows={2} value={aboutSettings.ctaText} onChange={(e) => setAboutSettings((p) => ({ ...p, ctaText: e.target.value }))} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* ========== SIZE GUIDE TAB ========== */}
        <TabsContent value="size-guide" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input value={sizeGuideSettings.pageTitle} onChange={(e) => setSizeGuideSettings((p) => ({ ...p, pageTitle: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Page Subtitle</Label>
                  <Input value={sizeGuideSettings.pageSubtitle} onChange={(e) => setSizeGuideSettings((p) => ({ ...p, pageSubtitle: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Footer Text</Label>
                <Input value={sizeGuideSettings.footerText} onChange={(e) => setSizeGuideSettings((p) => ({ ...p, footerText: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {sizeGuideSettings.categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                  <Input value={category.name} onChange={(e) => updateSizeCategory(category.id, "name", e.target.value)} className="max-w-xs font-semibold" />
                  <Button variant="ghost" size="icon" onClick={() => removeSizeCategory(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Instructions</Label>
                    <Textarea rows={2} value={category.instructions} onChange={(e) => updateSizeCategory(category.id, "instructions", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Columns (comma-separated)</Label>
                    <Input value={category.columns.join(", ")} onChange={(e) => updateSizeCategory(category.id, "columns", e.target.value.split(", ").map(c => c.trim()).filter(Boolean))} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Rows</Label>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            {category.columns.map((col) => (<th key={col} className="px-2 py-1 text-left font-medium">{col}</th>))}
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-t">
                              {category.columns.map((col) => (
                                <td key={col} className="px-1 py-1">
                                  <Input value={row[col] || ""} onChange={(e) => updateSizeCell(category.id, rowIndex, col, e.target.value)} className="h-8 text-xs" />
                                </td>
                              ))}
                              <td className="px-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSizeRow(category.id, rowIndex)}>
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addSizeRow(category.id)} className="gap-1">
                      <Plus className="h-3 w-3" /> Add Row
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addSizeCategory} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Add Size Category
            </Button>
          </div>
        </TabsContent>

        {/* ========== FAQ TAB ========== */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input value={faqSettings.pageTitle} onChange={(e) => setFaqSettings((p) => ({ ...p, pageTitle: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Page Subtitle</Label>
                  <Input value={faqSettings.pageSubtitle} onChange={(e) => setFaqSettings((p) => ({ ...p, pageSubtitle: e.target.value }))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {faqSettings.categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                  <Input value={category.name} onChange={(e) => updateFAQCategory(category.id, e.target.value)} className="max-w-xs font-semibold" />
                  <Button variant="ghost" size="icon" onClick={() => removeFAQCategory(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.questions.map((q, idx) => (
                    <div key={q.id} className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Q{idx + 1}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFAQQuestion(category.id, q.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                      <Input placeholder="Question" value={q.question} onChange={(e) => updateFAQQuestion(category.id, q.id, "question", e.target.value)} />
                      <Textarea placeholder="Answer" rows={2} value={q.answer} onChange={(e) => updateFAQQuestion(category.id, q.id, "answer", e.target.value)} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addFAQQuestion(category.id)} className="gap-1">
                    <Plus className="h-3 w-3" /> Add Question
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addFAQCategory} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Add FAQ Category
            </Button>
          </div>

          <Card>
            <CardHeader className="py-3 px-4">
              <span className="font-semibold">Call to Action</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Title</Label>
                  <Input value={faqSettings.ctaTitle} onChange={(e) => setFaqSettings((p) => ({ ...p, ctaTitle: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input value={faqSettings.ctaButtonText} onChange={(e) => setFaqSettings((p) => ({ ...p, ctaButtonText: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Textarea rows={2} value={faqSettings.ctaText} onChange={(e) => setFaqSettings((p) => ({ ...p, ctaText: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <Input value={faqSettings.ctaButtonLink} onChange={(e) => setFaqSettings((p) => ({ ...p, ctaButtonLink: e.target.value }))} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutPage;
