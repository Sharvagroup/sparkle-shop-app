import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";

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

const SizeGuide = () => {
  const { data: sizeGuideData, isLoading } = useSiteSetting<SizeGuideSettings>("size_guide");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="Size Guide" />
        <PromoBanner />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show empty state if no settings configured
  if (!sizeGuideData || !sizeGuideData.categories || sizeGuideData.categories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="Size Guide" />
        <PromoBanner />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display mb-2">Size Guide Not Configured</h1>
            <p className="text-muted-foreground mb-6">
              The size guide content has not been set up yet. Please configure it in the admin settings.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const settings = sizeGuideData;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={settings.pageTitle} description={settings.pageSubtitle} />
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-medium text-foreground mb-4">
              {settings.pageTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {settings.pageSubtitle}
            </p>
          </div>
          
          <Tabs defaultValue={settings.categories[0]?.id} className="space-y-8">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${settings.categories.length}, 1fr)` }}>
              {settings.categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {settings.categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{category.name} Size Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {category.instructions && (
                      <div className="mb-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">How to Measure</h4>
                        <p className="text-sm text-muted-foreground">{category.instructions}</p>
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {category.columns.map((col) => (
                              <TableHead key={col}>{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {category.columns.map((col, colIndex) => (
                                <TableCell key={col} className={colIndex === 0 ? "font-medium" : ""}>
                                  {row[col]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {settings.footerText && (
            <div className="mt-8 text-center p-6 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                {settings.footerText.includes("Contact") ? (
                  <>
                    {settings.footerText.split("Contact")[0]}
                    <a href="/contact" className="text-primary hover:underline">Contact our team</a>
                    {settings.footerText.split("Contact")[1]?.replace("our team", "") || " for personalized assistance."}
                  </>
                ) : (
                  settings.footerText
                )}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SizeGuide;