import { Link } from "react-router-dom";
import { Hammer, BookOpen, Diamond, Heart, Star, Award, Shield, Gem, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";

interface Artisan {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface AboutSettings {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  missionTitle: string;
  missionText: string;
  missionImage: string;
  artisans: Artisan[];
  values: Value[];
  ctaTitle: string;
  ctaText: string;
  ctaButtonText: string;
}

import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Hammer, BookOpen, Diamond, Heart, Star, Award, Shield, Gem
};

const About = () => {
  const { data: aboutData, isLoading } = useSiteSetting<AboutSettings>("about");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PromoBanner />
        <Header />
        <main className="flex-grow">
          <Skeleton className="h-[60vh] w-full" />
          <div className="py-20 px-6 max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-24 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show empty state if no settings configured
  if (!aboutData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="About Us" />
        <PromoBanner />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display mb-2">About Page Not Configured</h1>
            <p className="text-muted-foreground mb-6">
              The About page content has not been set up yet. Please configure it in the admin settings.
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

  const settings = aboutData;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={settings.heroTitle} description={settings.missionText?.slice(0, 160)} />
      <PromoBanner />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[450px] w-full flex items-center justify-center bg-foreground overflow-hidden">
          <img 
            alt="About Hero" 
            className="absolute inset-0 w-full h-full object-cover"
            src={settings.heroImage}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display text-white mb-6 drop-shadow-lg tracking-wide">
              {settings.heroTitle}
            </h1>
            <p className="text-gray-100 text-lg md:text-xl font-light tracking-wider drop-shadow-md">
              {settings.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Mission Section */}
        {settings.missionTitle && (
          <section className="py-20 md:py-28 px-6 bg-background">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-0.5 bg-primary mx-auto mb-10" />
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-10 leading-snug">
                {settings.missionTitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                {settings.missionText}
              </p>
              {settings.missionImage && (
                <div className="mt-12">
                  <img 
                    alt="Mission" 
                    className="w-full h-64 object-cover rounded-sm opacity-90 shadow-lg"
                    src={settings.missionImage}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Values Section */}
        {settings.values && settings.values.length > 0 && (
          <section className="py-20 bg-muted border-y border-border">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center">
                {settings.values.map((value) => {
                  const IconComponent = iconMap[value.icon] || Star;
                  return (
                    <div key={value.id} className="flex flex-col items-center group">
                      <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow border border-border">
                        <IconComponent size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-display text-foreground mb-4">{value.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Artisans Section */}
        {settings.artisans && settings.artisans.length > 0 && (
          <section className="py-24 px-6 bg-background">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                  Meet Our Team
                </h2>
                <div className="w-12 h-0.5 bg-border mx-auto" />
              </div>
              <div className={`grid grid-cols-1 ${settings.artisans.length > 1 ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
                {settings.artisans.map((artisan, index) => (
                  <div key={artisan.id} className="flex flex-col items-center text-center">
                    <div className={`w-40 h-40 rounded-full overflow-hidden mb-6 border-2 ${index === 0 ? 'border-primary' : 'border-border'} p-1`}>
                      <img 
                        alt={`${artisan.name} Portrait`} 
                        className="w-full h-full object-cover rounded-full"
                        src={artisan.image || "/placeholder.svg"}
                      />
                    </div>
                    <h4 className="text-xl font-display font-medium text-foreground">{artisan.name}</h4>
                    <p className={`${index === 0 ? 'text-primary' : 'text-muted-foreground'} text-xs uppercase tracking-widest mb-4 font-bold`}>
                      {artisan.role}
                    </p>
                    <p className="text-muted-foreground text-sm italic">"{artisan.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {settings.ctaTitle && (
          <section className="py-20 bg-muted text-center">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-display mb-8 text-foreground">
                {settings.ctaTitle}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10 font-light">
                {settings.ctaText}
              </p>
              <Link to="/">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-4 px-10 rounded-sm uppercase tracking-widest transition-colors shadow-lg text-xs md:text-sm"
                >
                  {settings.ctaButtonText}
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default About;