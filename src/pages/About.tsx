import { Link } from "react-router-dom";
import { Hammer, BookOpen, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  const values = [
    {
      icon: Hammer,
      title: "Our Craftsmanship",
      description: "Every curve and contour is meticulously shaped by master artisans who have inherited their skills through generations, ensuring unmatched quality and detail."
    },
    {
      icon: BookOpen,
      title: "Our Heritage",
      description: "Rooted in the royal traditions of India, our designs pay homage to the grandeur of the past while embracing the minimalist elegance of today."
    },
    {
      icon: Diamond,
      title: "Our Values",
      description: "We are committed to ethical sourcing and sustainability, ensuring that the beauty of our jewelry is matched only by the integrity of its creation."
    }
  ];

  const artisans = [
    {
      name: "Aanya Kapoor",
      role: "Founder & Creative Director",
      roleColor: "text-primary",
      quote: "\"I wanted to create pieces that don't just adorn the body, but also touch the soul.\"",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
      borderColor: "border-primary"
    },
    {
      name: "Rajesh Verma",
      role: "Head Goldsmith",
      roleColor: "text-muted-foreground",
      quote: "\"Thirty years of shaping gold has taught me that patience is the true secret to beauty.\"",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      borderColor: "border-border"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[450px] w-full flex items-center justify-center bg-foreground overflow-hidden">
          <img 
            alt="Sharva Jewelry Craftsmanship" 
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display text-white mb-6 drop-shadow-lg tracking-wide">
              Our Story
            </h1>
            <p className="text-gray-100 text-lg md:text-xl font-light tracking-wider drop-shadow-md">
              Crafting timeless elegance rooted in Indian heritage
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 md:py-28 px-6 bg-background">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-0.5 bg-primary mx-auto mb-10" />
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-10 leading-snug">
              Redefining traditional luxury for the modern soul.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              At Sharva, we believe that jewelry is more than just an accessory; it is a repository of memories, a symbol of heritage, and a work of art. Founded with a vision to preserve the intricate techniques of ancient Indian goldsmithing, Sharva blends these time-honored traditions with contemporary aesthetics. Each piece in our collection narrates a story of dedication, passion, and the pursuit of perfection.
            </p>
            <div className="mt-12">
              <img 
                alt="Sharva Jewelry Detail" 
                className="w-full h-64 object-cover rounded-sm opacity-90 shadow-lg"
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted border-y border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center">
              {values.map((value) => (
                <div key={value.title} className="flex flex-col items-center group">
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow border border-border">
                    <value.icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Artisans Section */}
        <section className="py-24 px-6 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                The Artisans Behind Sharva
              </h2>
              <div className="w-12 h-0.5 bg-border mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {artisans.map((artisan) => (
                <div key={artisan.name} className="flex flex-col items-center text-center">
                  <div className={`w-40 h-40 rounded-full overflow-hidden mb-6 border-2 ${artisan.borderColor} p-1`}>
                    <img 
                      alt={`${artisan.name} Portrait`} 
                      className="w-full h-full object-cover rounded-full"
                      src={artisan.image}
                    />
                  </div>
                  <h4 className="text-xl font-display font-medium text-foreground">{artisan.name}</h4>
                  <p className={`${artisan.roleColor} text-xs uppercase tracking-widest mb-4 font-bold`}>
                    {artisan.role}
                  </p>
                  <p className="text-muted-foreground text-sm italic">{artisan.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display mb-8 text-foreground">
              Experience the Legacy
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 font-light">
              Explore our curated collections and find the piece that speaks to your unique story.
            </p>
            <Link to="/">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-4 px-10 rounded-sm uppercase tracking-widest transition-colors shadow-lg text-xs md:text-sm"
              >
                Shop Our Collections
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
