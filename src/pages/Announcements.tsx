import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { format } from "date-fns";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Announcements = () => {
  const { data: announcements = [], isLoading } = useAnnouncements();

  // Filter only published announcements
  const publishedAnnouncements = announcements.filter(a => a.is_published);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-medium text-foreground mb-4">
              Announcements & News
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with our latest news, collections, and offers
            </p>
          </div>
          
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : publishedAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No announcements yet</h2>
                <p className="text-muted-foreground">Check back later for updates and news</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {publishedAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {announcement.featured_image && (
                      <div className="w-full md:w-64 h-48 md:h-auto">
                        <img 
                          src={announcement.featured_image} 
                          alt={announcement.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.category && (
                            <Badge variant="secondary">{announcement.category}</Badge>
                          )}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {announcement.published_at 
                              ? format(new Date(announcement.published_at), "MMM d, yyyy")
                              : format(new Date(announcement.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <CardTitle className="text-xl hover:text-primary transition-colors">
                          {announcement.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {announcement.excerpt && (
                          <p className="text-muted-foreground mb-4">{announcement.excerpt}</p>
                        )}
                        <Link 
                          to={`/announcements/${announcement.slug}`}
                          className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                        >
                          Read more <ArrowRight className="h-4 w-4" />
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Announcements;
