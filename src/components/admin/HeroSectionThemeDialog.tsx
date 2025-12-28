import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useUpdateSiteSetting, useSiteSetting } from "@/hooks/useSiteSettings";

export interface HeroSectionTheme {
  section_height: "small" | "medium" | "large" | "full";
  auto_slide_speed: number;
}

const defaultTheme: HeroSectionTheme = {
  section_height: "medium",
  auto_slide_speed: 5,
};

interface HeroSectionThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HeroSectionThemeDialog = ({
  open,
  onOpenChange,
}: HeroSectionThemeDialogProps) => {
  const [theme, setTheme] = useState<HeroSectionTheme>(defaultTheme);
  const { data: savedTheme } = useSiteSetting<HeroSectionTheme>("hero_theme");
  const updateSetting = useUpdateSiteSetting();

  useEffect(() => {
    if (savedTheme) {
      setTheme({
        section_height: savedTheme.section_height || "medium",
        auto_slide_speed: savedTheme.auto_slide_speed ?? 5,
      });
    }
  }, [savedTheme]);

  const handleSave = async () => {
    await updateSetting.mutateAsync({
      key: "hero_theme",
      value: theme as unknown as Record<string, unknown>,
      category: "homepage",
    });
    onOpenChange(false);
  };

  const getHeightLabel = (height: string) => {
    switch (height) {
      case "small":
        return "400px";
      case "medium":
        return "500px";
      case "large":
        return "600px";
      case "full":
        return "100vh";
      default:
        return "500px";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Hero Section Theme
          </DialogTitle>
          <DialogDescription>
            Configure the overall Hero banner section settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section Height */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Section Height</Label>
              <span className="text-sm text-muted-foreground">
                {getHeightLabel(theme.section_height)}
              </span>
            </div>
            <ToggleGroup
              type="single"
              value={theme.section_height}
              onValueChange={(value) =>
                value &&
                setTheme({
                  ...theme,
                  section_height: value as "small" | "medium" | "large" | "full",
                })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="small" className="flex-1">
                Small
              </ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1">
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem value="large" className="flex-1">
                Large
              </ToggleGroupItem>
              <ToggleGroupItem value="full" className="flex-1">
                Full
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Auto Slide Speed */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Auto-Slide Speed</Label>
              <span className="text-sm text-muted-foreground">
                {theme.auto_slide_speed} seconds
              </span>
            </div>
            <Slider
              value={[theme.auto_slide_speed]}
              onValueChange={([value]) =>
                setTheme({ ...theme, auto_slide_speed: value })
              }
              min={3}
              max={15}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Time between automatic slide transitions (3-15 seconds)
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-medium">Height:</span>{" "}
                  <span className="text-muted-foreground">
                    {getHeightLabel(theme.section_height)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Slide Speed:</span>{" "}
                  <span className="text-muted-foreground">
                    {theme.auto_slide_speed}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateSetting.isPending}>
            {updateSetting.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
