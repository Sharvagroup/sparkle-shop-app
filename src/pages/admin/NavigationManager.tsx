import { useState, useEffect, useRef } from "react";
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
import { Loader2, Save, Plus, Trash2, GripVertical, ExternalLink, ChevronDown, Home, ShoppingBag, Layers, Info, Phone, Search } from "lucide-react";
import { useSiteSetting, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LinkUrlAutocomplete } from "@/components/admin/LinkUrlAutocomplete";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

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

interface SearchSettings {
    enabled: boolean;
    placeholder: string;
    showRecentSearches: boolean;
    recentSearchLimit: number;
    showProductSuggestions: boolean;
    suggestionLimit: number;
    showCategorySuggestions: boolean;
    showCollectionSuggestions: boolean;
    minSearchLength: number;
    highlightMatches: boolean;
    searchInDescription: boolean;
    searchInMaterial: boolean;
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
    const { data: searchData } = useSiteSetting<SearchSettings>("search");
    const updateSetting = useUpdateSiteSetting();

    const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const dragNodeRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState("navigation");

    // Search Settings State
    const [searchEnabled, setSearchEnabled] = useState(true);
    const [searchPlaceholder, setSearchPlaceholder] = useState("Search for jewellery...");
    const [showRecentSearches, setShowRecentSearches] = useState(true);
    const [recentSearchLimit, setRecentSearchLimit] = useState(5);
    const [showProductSuggestions, setShowProductSuggestions] = useState(true);
    const [suggestionLimit, setSuggestionLimit] = useState(6);
    const [showCategorySuggestions, setShowCategorySuggestions] = useState(true);
    const [showCollectionSuggestions, setShowCollectionSuggestions] = useState(true);
    const [minSearchLength, setMinSearchLength] = useState(2);
    const [highlightMatches, setHighlightMatches] = useState(true);
    const [searchInDescription, setSearchInDescription] = useState(true);
    const [searchInMaterial, setSearchInMaterial] = useState(true);

    useEffect(() => {
        if (navData?.items && navData.items.length > 0) {
            setNavItems(navData.items);
        }
    }, [navData]);

    useEffect(() => {
        if (searchData) {
            setSearchEnabled(searchData.enabled !== false);
            setSearchPlaceholder(searchData.placeholder || "Search for jewellery...");
            setShowRecentSearches(searchData.showRecentSearches !== false);
            setRecentSearchLimit(searchData.recentSearchLimit || 5);
            setShowProductSuggestions(searchData.showProductSuggestions !== false);
            setSuggestionLimit(searchData.suggestionLimit || 6);
            setShowCategorySuggestions(searchData.showCategorySuggestions !== false);
            setShowCollectionSuggestions(searchData.showCollectionSuggestions !== false);
            setMinSearchLength(searchData.minSearchLength || 2);
            setHighlightMatches(searchData.highlightMatches !== false);
            setSearchInDescription(searchData.searchInDescription !== false);
            setSearchInMaterial(searchData.searchInMaterial !== false);
        }
    }, [searchData]);

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        dragNodeRef.current = e.target as HTMLDivElement;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
        // Add a slight delay before adding the dragging class for better visual feedback
        setTimeout(() => {
            if (dragNodeRef.current) {
                dragNodeRef.current.style.opacity = "0.5";
            }
        }, 0);
    };

    const handleDragEnd = () => {
        if (dragNodeRef.current) {
            dragNodeRef.current.style.opacity = "1";
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
        dragNodeRef.current = null;
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            handleDragEnd();
            return;
        }

        const newItems = [...navItems];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(dropIndex, 0, draggedItem);
        setNavItems(newItems);
        handleDragEnd();
        toast.info("Item reordered. Save to apply changes.");
    };

    const moveItem = (fromIndex: number, direction: "up" | "down") => {
        const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || toIndex >= navItems.length) return;
        
        const newItems = [...navItems];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        setNavItems(newItems);
    };

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

    const saveSearch = async () => {
        try {
            await updateSetting.mutateAsync({
                key: "search",
                value: {
                    enabled: searchEnabled,
                    placeholder: searchPlaceholder,
                    showRecentSearches,
                    recentSearchLimit,
                    showProductSuggestions,
                    suggestionLimit,
                    showCategorySuggestions,
                    showCollectionSuggestions,
                    minSearchLength,
                    highlightMatches,
                    searchInDescription,
                    searchInMaterial,
                },
                category: "search",
            });
            toast.success("Search settings saved successfully!");
        } catch (error) {
            toast.error("Failed to save search settings");
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
                    <h1 className="text-2xl font-bold text-foreground">Navigation & Search</h1>
                    <p className="text-muted-foreground">
                        Configure your header navigation menu and search settings
                    </p>
                </div>
                {activeTab === "navigation" && (
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
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                    <TabsTrigger value="search">Search Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="navigation" className="space-y-6">

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-2">
                    {navItems.map((item, index) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`transition-all duration-200 ${
                                dragOverIndex === index && draggedIndex !== index
                                    ? "border-t-2 border-primary pt-2"
                                    : ""
                            }`}
                        >
                            <Card className={`${!item.isActive ? "opacity-60" : ""} ${draggedIndex === index ? "ring-2 ring-primary" : ""}`}>
                                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground transition-colors" />
                                        <span className="text-sm text-muted-foreground font-mono">#{index + 1}</span>
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
                                        <LinkUrlAutocomplete
                                            value={item.url}
                                            onChange={(value) => updateNavItem(item.id, "url", value)}
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
                                                        <LinkUrlAutocomplete
                                                            value={child.url}
                                                            onChange={(value) =>
                                                                updateChildItem(item.id, child.id, "url", value)
                                                            }
                                                            placeholder="/path"
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
                        </div>
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
                </TabsContent>

                <TabsContent value="search">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Search Settings</CardTitle>
                                <CardDescription>Configure the search bar behavior and suggestions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Search Bar Settings */}
                                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <Search className="h-5 w-5 text-primary" />
                                        <h4 className="font-medium">Search Bar</h4>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Enable Search Bar</Label>
                                            <p className="text-xs text-muted-foreground">Show the search bar in the header</p>
                                        </div>
                                        <Switch checked={searchEnabled} onCheckedChange={setSearchEnabled} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Placeholder Text</Label>
                                        <Input value={searchPlaceholder} onChange={(e) => setSearchPlaceholder(e.target.value)} placeholder="Search for jewellery..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Minimum Search Length</Label>
                                        <Select value={minSearchLength.toString()} onValueChange={(v) => setMinSearchLength(parseInt(v))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 character</SelectItem>
                                                <SelectItem value="2">2 characters</SelectItem>
                                                <SelectItem value="3">3 characters</SelectItem>
                                                <SelectItem value="4">4 characters</SelectItem>
                                                <SelectItem value="5">5 characters</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">Characters required before showing suggestions</p>
                                    </div>
                                </div>

                                {/* Suggestions Settings */}
                                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                                    <h4 className="font-medium">Suggestions</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Show Product Suggestions</Label>
                                            <p className="text-xs text-muted-foreground">Display product matches in the dropdown</p>
                                        </div>
                                        <Switch checked={showProductSuggestions} onCheckedChange={setShowProductSuggestions} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Suggestion Limit</Label>
                                        <Select value={suggestionLimit.toString()} onValueChange={(v) => setSuggestionLimit(parseInt(v))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3">3 suggestions</SelectItem>
                                                <SelectItem value="4">4 suggestions</SelectItem>
                                                <SelectItem value="5">5 suggestions</SelectItem>
                                                <SelectItem value="6">6 suggestions</SelectItem>
                                                <SelectItem value="8">8 suggestions</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Show Categories</Label>
                                            <p className="text-xs text-muted-foreground">Include category matches in suggestions</p>
                                        </div>
                                        <Switch checked={showCategorySuggestions} onCheckedChange={setShowCategorySuggestions} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Show Collections</Label>
                                            <p className="text-xs text-muted-foreground">Include collection matches in suggestions</p>
                                        </div>
                                        <Switch checked={showCollectionSuggestions} onCheckedChange={setShowCollectionSuggestions} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Highlight Matches</Label>
                                            <p className="text-xs text-muted-foreground">Highlight matching text in suggestions</p>
                                        </div>
                                        <Switch checked={highlightMatches} onCheckedChange={setHighlightMatches} />
                                    </div>
                                </div>

                                {/* Search Scope Settings */}
                                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                                    <h4 className="font-medium">Search Scope</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Search in Descriptions</Label>
                                            <p className="text-xs text-muted-foreground">Include product descriptions in search</p>
                                        </div>
                                        <Switch checked={searchInDescription} onCheckedChange={setSearchInDescription} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Search in Materials</Label>
                                            <p className="text-xs text-muted-foreground">Include product materials in search</p>
                                        </div>
                                        <Switch checked={searchInMaterial} onCheckedChange={setSearchInMaterial} />
                                    </div>
                                </div>

                                {/* Recent Searches Settings */}
                                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                                    <h4 className="font-medium">Recent Searches</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Show Recent Searches</Label>
                                            <p className="text-xs text-muted-foreground">Display user's recent searches</p>
                                        </div>
                                        <Switch checked={showRecentSearches} onCheckedChange={setShowRecentSearches} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Recent Search Limit</Label>
                                        <Select value={recentSearchLimit.toString()} onValueChange={(v) => setRecentSearchLimit(parseInt(v))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3">3 searches</SelectItem>
                                                <SelectItem value="5">5 searches</SelectItem>
                                                <SelectItem value="7">7 searches</SelectItem>
                                                <SelectItem value="10">10 searches</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">Maximum recent searches to store</p>
                                    </div>
                                </div>

                                <Button onClick={saveSearch} disabled={updateSetting.isPending} className="gap-2">
                                    {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Search Settings
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>How search will behave</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="p-4 bg-muted rounded-lg space-y-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={searchPlaceholder}
                                            disabled
                                            className="w-full bg-background border border-border rounded-full py-2 px-4 pr-10 text-sm"
                                        />
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-xs space-y-1 text-muted-foreground">
                                        <p>• Suggestions appear after {minSearchLength} character{minSearchLength > 1 ? "s" : ""}</p>
                                        <p>• Shows up to {suggestionLimit} product suggestions</p>
                                        {showCategorySuggestions && <p>• Category suggestions enabled</p>}
                                        {showCollectionSuggestions && <p>• Collection suggestions enabled</p>}
                                        {showRecentSearches && <p>• Shows {recentSearchLimit} recent searches</p>}
                                        {searchInDescription && <p>• Searches in descriptions</p>}
                                        {searchInMaterial && <p>• Searches in materials</p>}
                                        {highlightMatches && <p>• Match highlighting enabled</p>}
                                    </div>
                                </div>
                                {!searchEnabled && (
                                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-xs">
                                        Search bar is currently disabled
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default NavigationManager;
