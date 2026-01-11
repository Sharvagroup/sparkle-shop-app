import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const defaultFAQSettings: FAQSettings = {
  pageTitle: "Frequently Asked Questions",
  pageSubtitle: "Find answers to common questions about our products and services",
  categories: [],
  ctaTitle: "Still have questions?",
  ctaText: "Can't find what you're looking for? Our support team is here to help.",
  ctaButtonText: "Contact Us",
  ctaButtonLink: "/contact"
};

const FAQ = () => {
  const { data: faqData, isLoading } = useSiteSetting<FAQSettings>("faq");
  const settings = faqData ? { ...defaultFAQSettings, ...faqData } : defaultFAQSettings;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={settings.pageTitle} description={settings.pageSubtitle} />
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
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
              
              <div className="space-y-8">
                {settings.categories && settings.categories.length > 0 ? (
                  settings.categories.map((section) => (
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
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No FAQ categories have been set up yet.</p>
                    <p className="text-sm mt-2">Please configure FAQs in the admin panel.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-12 text-center p-8 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">{settings.ctaTitle}</h3>
                <p className="text-muted-foreground mb-4">
                  {settings.ctaText}
                </p>
                {settings.ctaButtonLink?.startsWith("http") ? (
                  <a 
                    href={settings.ctaButtonLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {settings.ctaButtonText}
                  </a>
                ) : (
                  <Link 
                    to={settings.ctaButtonLink || "/contact"} 
                    className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {settings.ctaButtonText}
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
