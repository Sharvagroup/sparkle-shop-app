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

const ringSizes = [
  { indian: "6", us: "3", uk: "F", diameter: "14.1", circumference: "44.2" },
  { indian: "7", us: "3.5", uk: "G", diameter: "14.5", circumference: "45.5" },
  { indian: "8", us: "4", uk: "H", diameter: "14.9", circumference: "46.8" },
  { indian: "9", us: "4.5", uk: "I", diameter: "15.3", circumference: "48.0" },
  { indian: "10", us: "5", uk: "J", diameter: "15.7", circumference: "49.3" },
  { indian: "11", us: "5.5", uk: "K", diameter: "16.1", circumference: "50.6" },
  { indian: "12", us: "6", uk: "L", diameter: "16.5", circumference: "51.9" },
  { indian: "13", us: "6.5", uk: "M", diameter: "16.9", circumference: "53.1" },
  { indian: "14", us: "7", uk: "N", diameter: "17.3", circumference: "54.4" },
  { indian: "15", us: "7.5", uk: "O", diameter: "17.7", circumference: "55.7" },
  { indian: "16", us: "8", uk: "P", diameter: "18.1", circumference: "56.9" },
  { indian: "17", us: "8.5", uk: "Q", diameter: "18.5", circumference: "58.2" },
  { indian: "18", us: "9", uk: "R", diameter: "18.9", circumference: "59.5" },
];

const braceletSizes = [
  { size: "XS", wrist: "5.5 - 6", length: "6.5" },
  { size: "S", wrist: "6 - 6.5", length: "7" },
  { size: "M", wrist: "6.5 - 7", length: "7.5" },
  { size: "L", wrist: "7 - 7.5", length: "8" },
  { size: "XL", wrist: "7.5 - 8", length: "8.5" },
];

const necklaceLengths = [
  { name: "Choker", length: "14-16", fit: "Sits snugly around the neck" },
  { name: "Princess", length: "17-19", fit: "Falls just below the collarbone" },
  { name: "Matinee", length: "20-24", fit: "Falls at or above the bust line" },
  { name: "Opera", length: "28-34", fit: "Falls at the bust line or below" },
  { name: "Rope", length: "36+", fit: "Falls below the bust, can be doubled" },
];

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-medium text-foreground mb-4">
              Size Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your perfect fit with our comprehensive sizing charts
            </p>
          </div>
          
          <Tabs defaultValue="rings" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rings">Rings</TabsTrigger>
              <TabsTrigger value="bracelets">Bracelets</TabsTrigger>
              <TabsTrigger value="necklaces">Necklaces</TabsTrigger>
            </TabsList>

            <TabsContent value="rings">
              <Card>
                <CardHeader>
                  <CardTitle>Ring Size Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">How to Measure Your Ring Size</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Wrap a piece of string or paper around your finger</li>
                      <li>Mark where the string/paper overlaps</li>
                      <li>Measure the length in millimeters</li>
                      <li>Use the circumference column to find your size</li>
                    </ol>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Indian Size</TableHead>
                          <TableHead>US Size</TableHead>
                          <TableHead>UK Size</TableHead>
                          <TableHead>Diameter (mm)</TableHead>
                          <TableHead>Circumference (mm)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ringSizes.map((size) => (
                          <TableRow key={size.indian}>
                            <TableCell className="font-medium">{size.indian}</TableCell>
                            <TableCell>{size.us}</TableCell>
                            <TableCell>{size.uk}</TableCell>
                            <TableCell>{size.diameter}</TableCell>
                            <TableCell>{size.circumference}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bracelets">
              <Card>
                <CardHeader>
                  <CardTitle>Bracelet Size Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">How to Measure Your Bracelet Size</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Measure around your wrist with a flexible tape measure</li>
                      <li>Add 0.5" for a comfortable fit or 1" for a loose fit</li>
                      <li>Use the chart below to find your size</li>
                    </ol>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size</TableHead>
                        <TableHead>Wrist Size (inches)</TableHead>
                        <TableHead>Bracelet Length (inches)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {braceletSizes.map((size) => (
                        <TableRow key={size.size}>
                          <TableCell className="font-medium">{size.size}</TableCell>
                          <TableCell>{size.wrist}"</TableCell>
                          <TableCell>{size.length}"</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="necklaces">
              <Card>
                <CardHeader>
                  <CardTitle>Necklace Length Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Choosing the Right Necklace Length</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider your neckline, body type, and the occasion when choosing a necklace length.
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Style</TableHead>
                        <TableHead>Length (inches)</TableHead>
                        <TableHead>How It Fits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {necklaceLengths.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.length}"</TableCell>
                          <TableCell>{item.fit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center p-6 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Need help finding your size? <a href="/contact" className="text-primary hover:underline">Contact our team</a> for personalized assistance.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SizeGuide;
