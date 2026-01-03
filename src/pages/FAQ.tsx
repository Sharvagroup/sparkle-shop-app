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
  categories: [
    {
      id: "orders",
      name: "Orders & Shipping",
      questions: [
        { id: "1", question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. Free shipping is available on orders above ₹2,000." },
        { id: "2", question: "Do you ship internationally?", answer: "Yes, we ship to select international destinations. International shipping typically takes 10-15 business days. Additional customs duties may apply." },
        { id: "3", question: "How can I track my order?", answer: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from the 'My Orders' section in your account." }
      ]
    },
    {
      id: "returns",
      name: "Returns & Exchanges",
      questions: [
        { id: "1", question: "What is your return policy?", answer: "We offer a 15-day return policy for unused items in their original packaging. Items must be returned with all tags intact and in the original condition." },
        { id: "2", question: "How do I initiate a return?", answer: "To initiate a return, go to 'My Orders', select the order, and click 'Request Return'. Our team will guide you through the process." },
        { id: "3", question: "Are exchanges free?", answer: "Yes, your first exchange is free. For subsequent exchanges, standard shipping charges will apply." }
      ]
    },
    {
      id: "care",
      name: "Product Care",
      questions: [
        { id: "1", question: "How do I care for my jewelry?", answer: "Store jewelry in a cool, dry place away from direct sunlight. Avoid contact with perfumes, lotions, and water. Clean gently with a soft cloth." },
        { id: "2", question: "Are your products hypoallergenic?", answer: "Most of our jewelry is hypoallergenic and nickel-free. Product descriptions specify the materials used. Contact us for specific allergy concerns." }
      ]
    },
    {
      id: "payment",
      name: "Payment & Security",
      questions: [
        { id: "1", question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. Cash on delivery is available for select locations." },
        { id: "2", question: "Is my payment information secure?", answer: "Absolutely. We use industry-standard SSL encryption and never store your complete payment details. All transactions are processed through secure payment gateways." }
      ]
    }
  ],
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
      <SEO title={`${settings.pageTitle} | Sharva`} description={settings.pageSubtitle} />
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
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
