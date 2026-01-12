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

const defaultSettings: FAQSettings = {
  pageTitle: "Frequently Asked Questions",
  pageSubtitle: "Find answers to common questions about our products and services",
  categories: [],
  ctaTitle: "Still have questions?",
  ctaText: "Can't find what you're looking for? Our support team is here to help.",
  ctaButtonText: "Contact Us",
  ctaButtonLink: "/contact"
};

const FAQAdmin = () => {
  const { data: savedSettings, isLoading } = useSiteSetting<FAQSettings>("faq");
  const updateSetting = useUpdateSiteSetting();
  const [settings, setSettings] = useState<FAQSettings>(defaultSettings);
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
      await updateSetting.mutateAsync({ key: "faq", value: settings as unknown as Record<string, unknown> });
      toast({ title: "FAQ settings saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save FAQ settings", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    const newCategory: FAQCategory = {
      id: crypto.randomUUID(),
      name: "New Category",
      questions: []
    };
    setSettings({ ...settings, categories: [...settings.categories, newCategory] });
    setOpenCategories([...openCategories, newCategory.id]);
  };

  const updateCategory = (categoryId: string, updates: Partial<FAQCategory>) => {
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

  const addQuestion = (categoryId: string) => {
    const newQuestion: FAQQuestion = {
      id: crypto.randomUUID(),
      question: "",
      answer: ""
    };
    setSettings({
      ...settings,
      categories: settings.categories.map(c => 
        c.id === categoryId 
          ? { ...c, questions: [...c.questions, newQuestion] }
          : c
      )
    });
  };

  const updateQuestion = (categoryId: string, questionId: string, updates: Partial<FAQQuestion>) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => 
        c.id === categoryId 
          ? {
              ...c,
              questions: c.questions.map(q => 
                q.id === questionId ? { ...q, ...updates } : q
              )
            }
          : c
      )
    });
  };

  const deleteQuestion = (categoryId: string, questionId: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(c => 
        c.id === categoryId 
          ? { ...c, questions: c.questions.filter(q => q.id !== questionId) }
          : c
      )
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
          <h1 className="text-2xl font-display font-medium">FAQ Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your FAQ page content</p>
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
                placeholder="Frequently Asked Questions"
              />
            </div>
            <div>
              <Label>Page Subtitle</Label>
              <Input
                value={settings.pageSubtitle}
                onChange={(e) => setSettings({ ...settings, pageSubtitle: e.target.value })}
                placeholder="Find answers to common questions..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>FAQ Categories & Questions</CardTitle>
          <Button onClick={addCategory} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No categories yet. Add your first category to get started.
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
                          ({category.questions.length} questions)
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
                      {category.questions.map((question, qIndex) => (
                        <div key={question.id} className="bg-muted/30 p-4 rounded-md space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div>
                                <Label className="text-xs">Question {qIndex + 1}</Label>
                                <Input
                                  value={question.question}
                                  onChange={(e) => updateQuestion(category.id, question.id, { question: e.target.value })}
                                  placeholder="Enter the question..."
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Answer</Label>
                                <Textarea
                                  value={question.answer}
                                  onChange={(e) => updateQuestion(category.id, question.id, { answer: e.target.value })}
                                  placeholder="Enter the answer..."
                                  rows={3}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteQuestion(category.id, question.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addQuestion(category.id)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>CTA Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>CTA Title</Label>
              <Input
                value={settings.ctaTitle}
                onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                placeholder="Still have questions?"
              />
            </div>
            <div>
              <Label>CTA Text</Label>
              <Input
                value={settings.ctaText}
                onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
                placeholder="Can't find what you're looking for?"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={settings.ctaButtonText}
                onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })}
                placeholder="Contact Us"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={settings.ctaButtonLink}
                onChange={(e) => setSettings({ ...settings, ctaButtonLink: e.target.value })}
                placeholder="/contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQAdmin;
