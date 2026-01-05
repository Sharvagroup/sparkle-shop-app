import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Plus, Trash2, GripVertical, ExternalLink, ChevronDown, Home, ShoppingBag, Layers, Info, Phone } from "lucide-react";
import { useSiteSetting, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Types for navigation items
interface NavChild {
    id: string;
    label: string;
    url: string;
    isExternal?: boolean;
}

type NavItemType = 
    | "static" 
    | "category_dropdown" 
    | "collection_dropdown" 
    | "new_in_dropdown" 
    | "best_sellers_dropdown" 
    | "new_arrivals_dropdown" 
    | "celebrity_specials_dropdown" 
    | "announcements_dropdown";

interface NavItem {
    id: string;
    label: string;
    url: string;
    type: NavItemType;
    isExternal?: boolean;
    isActive?: boolean;
    children?: NavChild[];
}

interface NavigationSettings {
    items: NavItem[];
}

const NAV_TYPE_LABELS: Record<NavItemType, string> = {
    static: "Static Link",
    category_dropdown: "Categories Dropdown",
    collection_dropdown: "Collections Dropdown",
    new_in_dropdown: "New In Dropdown (All Dynamic)",
    best_sellers_dropdown: "Best Sellers Dropdown",
    new_arrivals_dropdown: "New Arrivals Dropdown",
    celebrity_specials_dropdown: "Celebrity Specials Dropdown",
    announcements_dropdown: "Announcements Dropdown",
};

const defaultNavItems: NavItem[] = [
    { id: "home", label: "Home", url: "/", type: "static", isActive: true },
    { id: "shop", label: "Shop", url: "/products", type: "category_dropdown", isActive: true },
    { id: "collections", label: "Collections", url: "/products", type: "collection_dropdown", isActive: true },
    { id: "new-in", label: "New In", url: "/products", type: "new_in_dropdown", isActive: true },
    { id: "about", label: "About", url: "/about", type: "static", isActive: true },
    { id: "contact", label: "Contact", url: "/contact", type: "static", isActive: true },
];

const iconMap: Record<string, React.ReactNode> = {
    home: <Home className="h-4 w-4" />,
    shop: <ShoppingBag className="h-4 w-4" />,
    collections: <Layers className="h-4 w-4" />,
    about: <Info className="h-4 w-4" />,
    contact: <Phone className="h-4 w-4" />,
};

const NavigationManager = () => {
    const { data: navData, isLoading } = useSiteSetting<NavigationSettings>("header_navigation");
    const updateSetting = useUpdateSiteSetting();

    const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

    useEffect(() => {
        if (navData?.items && navData.items.length > 0) {
            setNavItems(navData.items);
        }
    }, [navData]);

    const addNavItem = () => {
        setNavItems((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                label: "New Link",
                url: "/",
                type: "static",
                isActive: true,
            },
        ]);
    };

    const removeNavItem = (id: string) => {
        setNavItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateNavItem = (id: string, field: keyof NavItem, value: unknown) => {
        setNavItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const addChildItem = (parentId: string) => {
        setNavItems((prev) =>
            prev.map((item) => {
                if (item.id !== parentId) return item;
                const newChild: NavChild = {
                    id: crypto.randomUUID(),
                    label: "Sub Link",
                    url: "/",
                };
                return { ...item, children: [...(item.children || []), newChild] };
            })
        );
    };

    const removeChildItem = (parentId: string, childId: string) => {
        setNavItems((prev) =>
            prev.map((item) => {
                if (item.id !== parentId) return item;
                return {
                    ...item,
                    children: (item.children || []).filter((c) => c.id !== childId),
                };
            })
        );
    };

    const updateChildItem = (parentId: string, childId: string, field: keyof NavChild, value: string | boolean) => {
        setNavItems((prev) =>
            prev.map((item) => {
                if (item.id !== parentId) return item;
                return {
                    ...item,
                    children: (item.children || []).map((c) =>
                        c.id === childId ? { ...c, [field]: value } : c
                    ),
                };
            })
        );
    };

    const saveNavigation = async () => {
        try {
            await updateSetting.mutateAsync({
                key: "header_navigation",
                value: { items: navItems },
                category: "navigation",
            });
            toast.success("Navigation saved successfully!");
        } catch (error) {
            toast.error("Failed to save navigation");
        }
    };

    const resetToDefault = () => {
        setNavItems(defaultNavItems);
        toast.info("Reset to default navigation. Save to apply.");
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
                    <h1 className="text-2xl font-bold text-foreground">Navigation Manager</h1>
                    <p className="text-muted-foreground">
                        Configure your header navigation menu
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={resetToDefault}>
                        Reset to Default
                    </Button>
                    <Button onClick={saveNavigation} disabled={updateSetting.isPending} className="gap-2">
                        {updateSetting.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Navigation
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    {navItems.map((item, index) => (
                        <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
                            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                                    {iconMap[item.id] || <ShoppingBag className="h-4 w-4 text-muted-foreground" />}
                                    <span className="font-medium">{item.label}</span>
                                    {item.type !== "static" && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                            {NAV_TYPE_LABELS[item.type]?.replace(" Dropdown", "") || item.type}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={item.isActive !== false}
                                        onCheckedChange={(checked) => updateNavItem(item.id, "isActive", checked)}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeNavItem(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 px-4 space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            value={item.label}
                                            onChange={(e) => updateNavItem(item.id, "label", e.target.value)}
                                            placeholder="Menu Label"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">URL</Label>
                                        <Input
                                            value={item.url}
                                            onChange={(e) => updateNavItem(item.id, "url", e.target.value)}
                                            placeholder="/path or https://..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Type</Label>
                                        <Select
                                            value={item.type}
                                            onValueChange={(value) => updateNavItem(item.id, "type", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(NAV_TYPE_LABELS).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {item.type === "static" && (
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id={`external-${item.id}`}
                                            checked={item.isExternal === true}
                                            onCheckedChange={(checked) => updateNavItem(item.id, "isExternal", checked)}
                                        />
                                        <Label htmlFor={`external-${item.id}`} className="text-xs flex items-center gap-1">
                                            <ExternalLink className="h-3 w-3" /> Opens in new tab
                                        </Label>
                                    </div>
                                )}

                                {/* Static link children (manual dropdowns) */}
                                {item.type === "static" && (
                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-xs text-muted-foreground">
                                                Dropdown Items (optional)
                                            </Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addChildItem(item.id)}
                                                className="gap-1 h-7 text-xs"
                                            >
                                                <Plus className="h-3 w-3" /> Add Sub-item
                                            </Button>
                                        </div>
                                        {item.children && item.children.length > 0 && (
                                            <div className="space-y-2 pl-4 border-l-2 border-muted">
                                                {item.children.map((child) => (
                                                    <div key={child.id} className="flex items-center gap-2">
                                                        <Input
                                                            value={child.label}
                                                            onChange={(e) =>
                                                                updateChildItem(item.id, child.id, "label", e.target.value)
                                                            }
                                                            placeholder="Label"
                                                            className="h-8 text-xs flex-1"
                                                        />
                                                        <Input
                                                            value={child.url}
                                                            onChange={(e) =>
                                                                updateChildItem(item.id, child.id, "url", e.target.value)
                                                            }
                                                            placeholder="/path"
                                                            className="h-8 text-xs flex-1"
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => removeChildItem(item.id, child.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3 text-destructive" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {item.type !== "static" && (
                                    <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                        <ChevronDown className="h-3 w-3 inline mr-1" />
                                        {item.type === "new_in_dropdown" 
                                            ? "Dropdown will show: Best Sellers, New Arrivals, Celebrity Specials, Announcements"
                                            : `Dropdown items will be auto-populated from ${NAV_TYPE_LABELS[item.type]?.replace(" Dropdown", "") || item.type}.`
                                        }
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    <Button variant="outline" onClick={addNavItem} className="w-full gap-2">
                        <Plus className="h-4 w-4" /> Add Menu Item
                    </Button>
                </div>

                {/* Preview Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>How your navigation will appear</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted rounded-lg p-4">
                            <div className="flex items-center gap-4 flex-wrap">
                                {navItems
                                    .filter((item) => item.isActive !== false)
                                    .map((item) => (
                                        <div key={item.id} className="relative group">
                                            <span className="text-sm font-medium hover:text-primary cursor-pointer flex items-center gap-1">
                                                {item.label}
                                                {(item.type !== "static" || (item.children && item.children.length > 0)) && (
                                                    <ChevronDown className="h-3 w-3" />
                                                )}
                                                {item.isExternal && <ExternalLink className="h-3 w-3" />}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                            {navItems.filter((i) => i.isActive !== false).length} active menu items
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NavigationManager;
