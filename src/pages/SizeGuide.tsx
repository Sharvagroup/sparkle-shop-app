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
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

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
        { "Indian Size": "11", "US Size": "5.5", "UK Size": "K", "Diameter (mm)": "16.1", "Circumference (mm)": "50.6" },
        { "Indian Size": "12", "US Size": "6", "UK Size": "L", "Diameter (mm)": "16.5", "Circumference (mm)": "51.9" },
        { "Indian Size": "13", "US Size": "6.5", "UK Size": "M", "Diameter (mm)": "16.9", "Circumference (mm)": "53.1" },
        { "Indian Size": "14", "US Size": "7", "UK Size": "N", "Diameter (mm)": "17.3", "Circumference (mm)": "54.4" },
        { "Indian Size": "15", "US Size": "7.5", "UK Size": "O", "Diameter (mm)": "17.7", "Circumference (mm)": "55.7" },
        { "Indian Size": "16", "US Size": "8", "UK Size": "P", "Diameter (mm)": "18.1", "Circumference (mm)": "56.9" },
        { "Indian Size": "17", "US Size": "8.5", "UK Size": "Q", "Diameter (mm)": "18.5", "Circumference (mm)": "58.2" },
        { "Indian Size": "18", "US Size": "9", "UK Size": "R", "Diameter (mm)": "18.9", "Circumference (mm)": "59.5" },
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

const SizeGuide = () => {
  const { data: sizeGuideData, isLoading } = useSiteSetting<SizeGuideSettings>("size_guide");
  const settings = sizeGuideData ? { ...defaultSizeGuideSettings, ...sizeGuideData } : defaultSizeGuideSettings;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-48 mx-auto" />
              <Skeleton className="h-6 w-80 mx-auto" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-display font-medium text-foreground mb-4">
                  {settings.pageTitle}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {settings.pageSubtitle}
                </p>
              </div>
              
              <Tabs defaultValue={settings.categories[0]?.id || "rings"} className="space-y-8">
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
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SizeGuide;
