import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Eye, EyeOff, Save, Loader2, LayoutDashboard } from "lucide-react";
import { useSiteSettings, useUpdateSiteSetting, HomepageSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

const sectionLabels: Record<string, { label: string; description: string }> = {
  hero: { label: "Hero Banner", description: "Main carousel/banner at the top" },
  sale_banner: { label: "Sale Banner", description: "Promotional sale announcement" },
  categories: { label: "Categories", description: "Product category showcase" },
  offers: { label: "Special Offers", description: "Promotional offers with popups" },
  new_arrivals: { label: "New Arrivals", description: "Latest products section" },
  best_sellers: { label: "Best Sellers", description: "Top selling products" },
  celebrity_specials: { label: "Celebrity Specials", description: "Celebrity endorsed items" },
  testimonials: { label: "Testimonials", description: "Customer reviews section" },
};

const Homepage = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const [sections, setSections] = useState<string[]>([]);
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (settings?.homepage) {
      const homepageSettings = settings.homepage as unknown as HomepageSettings;
      setSections(homepageSettings.sections || Object.keys(sectionLabels));
    } else {
      setSections(Object.keys(sectionLabels));
    }
  }, [settings]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);
    setSections(newSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleSectionVisibility = (section: string) => {
    const newHidden = new Set(hiddenSections);
    if (newHidden.has(section)) {
      newHidden.delete(section);
    } else {
      newHidden.add(section);
    }
    setHiddenSections(newHidden);
  };

  const handleSave = async () => {
    const visibleSections = sections.filter((s) => !hiddenSections.has(s));
    await updateSetting.mutateAsync({
      key: "homepage",
      value: { sections: visibleSections },
      category: "homepage",
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homepage</h1>
          <p className="text-muted-foreground">Customize your homepage layout and sections</p>
        </div>
        <Button onClick={handleSave} disabled={updateSetting.isPending} className="gap-2">
          {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Layout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Section Order
          </CardTitle>
          <CardDescription>
            Drag and drop sections to reorder. Toggle visibility to show/hide sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section, index) => {
              const config = sectionLabels[section];
              const isHidden = hiddenSections.has(section);

              return (
                <div
                  key={section}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    draggedIndex === index
                      ? "border-primary bg-primary/5 shadow-lg"
                      : isHidden
                      ? "border-border bg-muted/50 opacity-60"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{config?.label || section}</p>
                    <p className="text-sm text-muted-foreground">{config?.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`visible-${section}`}
                        checked={!isHidden}
                        onCheckedChange={() => toggleSectionVisibility(section)}
                      />
                      <Label htmlFor={`visible-${section}`} className="text-sm cursor-pointer">
                        {isHidden ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-primary" />
                        )}
                      </Label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>This is how your homepage sections will appear (order only)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {sections
              .filter((s) => !hiddenSections.has(s))
              .map((section, index) => (
                <div
                  key={section}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full font-medium"
                >
                  {index + 1}. {sectionLabels[section]?.label || section}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Homepage;
