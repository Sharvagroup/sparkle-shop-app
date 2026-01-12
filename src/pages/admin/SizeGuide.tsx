import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Save, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSiteSetting, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

const defaultSettings: SizeGuideSettings = {
  pageTitle: "Size Guide",
  pageSubtitle: "Find your perfect fit with our comprehensive sizing charts",
  categories: [],
  footerText: "Need help finding your size? Contact our team for personalized assistance."
};

const SizeGuideAdmin = () => {
  const { data: savedSettings, isLoading } = useSiteSetting<SizeGuideSettings>("size_guide");
  const updateSetting = useUpdateSiteSetting();
  const [settings, setSettings] = useState<SizeGuideSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  useEffect(() => {
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...savedSettings });
      setOpenCategories(savedSettings.categories?.map(c => c.id) || []);
    }
  }, [savedSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSetting.mutateAsync({ key: "size_guide", value: settings as unknown as Record<string, unknown> });
      toast({ title: "Size guide settings saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save size guide settings", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    const newCategory: SizeCategory = {
      id: crypto.randomUUID(),
      name: "New Category",
      instructions: "",
      columns: ["Size"],
      rows: []
    };
    setSettings({ ...settings, categories: [...settings.categories, newCategory] });
    setOpenCategories([...openCategories, newCategory.id]);
  };

  const updateCategory = (categoryId: string, updates: Partial<SizeCategory>) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => 
        c.id === categoryId ? { ...c, ...updates } : c
      )
    });
  };

  const deleteCategory = (categoryId: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.filter(c => c.id !== categoryId)
    });
    setOpenCategories(openCategories.filter(id => id !== categoryId));
  };

  const addColumn = (categoryId: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => {
        if (c.id === categoryId) {
          const newColName = `Column ${c.columns.length + 1}`;
          return {
            ...c,
            columns: [...c.columns, newColName],
            rows: c.rows.map(row => ({ ...row, [newColName]: "" }))
          };
        }
        return c;
      })
    });
  };

  const updateColumn = (categoryId: string, oldName: string, newName: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => {
        if (c.id === categoryId) {
          return {
            ...c,
            columns: c.columns.map(col => col === oldName ? newName : col),
            rows: c.rows.map(row => {
              const newRow = { ...row };
              if (oldName !== newName) {
                newRow[newName] = newRow[oldName];
                delete newRow[oldName];
              }
              return newRow;
            })
          };
        }
        return c;
      })
    });
  };

  const deleteColumn = (categoryId: string, colName: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => {
        if (c.id === categoryId) {
          return {
            ...c,
            columns: c.columns.filter(col => col !== colName),
            rows: c.rows.map(row => {
              const newRow = { ...row };
              delete newRow[colName];
              return newRow;
            })
          };
        }
        return c;
      })
    });
  };

  const addRow = (categoryId: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => {
        if (c.id === categoryId) {
          const newRow: Record<string, string> = {};
          c.columns.forEach(col => { newRow[col] = ""; });
          return { ...c, rows: [...c.rows, newRow] };
        }
        return c;
      })
    });
  };

  const updateRow = (categoryId: string, rowIndex: number, colName: string, value: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => {
        if (c.id === categoryId) {
          const newRows = [...c.rows];
          newRows[rowIndex] = { ...newRows[rowIndex], [colName]: value };
          return { ...c, rows: newRows };
        }
        return c;
      })
    });
  };

  const deleteRow = (categoryId: string, rowIndex: number) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => {
        if (c.id === categoryId) {
          return { ...c, rows: c.rows.filter((_, i) => i !== rowIndex) };
        }
        return c;
      })
    });
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-medium">Size Guide Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your size guide page content</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Page Header Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Page Title</Label>
              <Input
                value={settings.pageTitle}
                onChange={(e) => setSettings({ ...settings, pageTitle: e.target.value })}
                placeholder="Size Guide"
              />
            </div>
            <div>
              <Label>Page Subtitle</Label>
              <Input
                value={settings.pageSubtitle}
                onChange={(e) => setSettings({ ...settings, pageSubtitle: e.target.value })}
                placeholder="Find your perfect fit..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Size Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Size Categories & Charts</CardTitle>
          <Button onClick={addCategory} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No categories yet. Add your first size category to get started.
            </p>
          ) : (
            settings.categories.map((category) => (
              <Collapsible 
                key={category.id} 
                open={openCategories.includes(category.id)}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <Input
                          value={category.name}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateCategory(category.id, { name: e.target.value });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-48"
                          placeholder="Category Name"
                        />
                        <span className="text-sm text-muted-foreground">
                          ({category.rows.length} sizes)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCategory(category.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {openCategories.includes(category.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-4">
                      {/* Instructions */}
                      <div>
                        <Label>How to Measure Instructions</Label>
                        <Textarea
                          value={category.instructions}
                          onChange={(e) => updateCategory(category.id, { instructions: e.target.value })}
                          placeholder="Explain how customers should measure..."
                          rows={2}
                        />
                      </div>

                      {/* Columns */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Columns</Label>
                          <Button variant="outline" size="sm" onClick={() => addColumn(category.id)}>
                            <Plus className="w-3 h-3 mr-1" />
                            Add Column
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.columns.map((col, colIndex) => (
                            <div key={colIndex} className="flex items-center gap-1">
                              <Input
                                value={col}
                                onChange={(e) => updateColumn(category.id, col, e.target.value)}
                                className="w-32"
                              />
                              {category.columns.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteColumn(category.id, col)}
                                  className="text-destructive hover:text-destructive p-1 h-auto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Table Rows */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Size Data</Label>
                          <Button variant="outline" size="sm" onClick={() => addRow(category.id)}>
                            <Plus className="w-3 h-3 mr-1" />
                            Add Row
                          </Button>
                        </div>
                        {category.rows.length === 0 ? (
                          <p className="text-muted-foreground text-sm text-center py-4">
                            No sizes added yet. Add rows to populate the size chart.
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border text-sm">
                              <thead>
                                <tr className="bg-muted">
                                  {category.columns.map((col) => (
                                    <th key={col} className="border p-2 text-left font-medium">
                                      {col}
                                    </th>
                                  ))}
                                  <th className="border p-2 w-10"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {category.rows.map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {category.columns.map((col) => (
                                      <td key={col} className="border p-1">
                                        <Input
                                          value={row[col] || ""}
                                          onChange={(e) => updateRow(category.id, rowIndex, col, e.target.value)}
                                          className="border-0 h-8"
                                        />
                                      </td>
                                    ))}
                                    <td className="border p-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteRow(category.id, rowIndex)}
                                        className="text-destructive hover:text-destructive p-1 h-auto"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}
        </CardContent>
      </Card>

      {/* Footer Text */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Section</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Footer Text</Label>
          <Textarea
            value={settings.footerText}
            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
            placeholder="Need help finding your size?"
            rows={2}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SizeGuideAdmin;
