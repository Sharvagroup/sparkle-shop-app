import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";

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

const FAQ = () => {
  const { data: faqData, isLoading } = useSiteSetting<FAQSettings>("faq");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="FAQ" />
        <PromoBanner />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show empty state if no settings configured
  if (!faqData || !faqData.categories || faqData.categories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="FAQ" />
        <PromoBanner />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display mb-2">FAQs Not Configured</h1>
            <p className="text-muted-foreground mb-6">
              The FAQ content has not been set up yet. Please configure it in the admin settings.
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

  const settings = faqData;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={settings.pageTitle} description={settings.pageSubtitle} />
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-medium text-foreground mb-4">
              {settings.pageTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {settings.pageSubtitle}
            </p>
          </div>
          
          <div className="space-y-8">
            {settings.categories.map((section) => (
              <div key={section.id}>
                <h2 className="text-xl font-display font-medium text-foreground mb-4 border-b border-border pb-2">
                  {section.name}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`${section.id}-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
          
          {settings.ctaTitle && (
            <div className="mt-12 text-center p-8 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">{settings.ctaTitle}</h3>
              <p className="text-muted-foreground mb-4">
                {settings.ctaText}
              </p>
              <a 
                href={settings.ctaButtonLink} 
                className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {settings.ctaButtonText}
              </a>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;