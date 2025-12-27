import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. Free shipping is available on orders above ₹2,000.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to select international destinations. International shipping typically takes 10-15 business days. Additional customs duties may apply.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from the 'My Orders' section in your account.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 15-day return policy for unused items in their original packaging. Items must be returned with all tags intact and in the original condition.",
      },
      {
        q: "How do I initiate a return?",
        a: "To initiate a return, go to 'My Orders', select the order, and click 'Request Return'. Our team will guide you through the process.",
      },
      {
        q: "Are exchanges free?",
        a: "Yes, your first exchange is free. For subsequent exchanges, standard shipping charges will apply.",
      },
    ],
  },
  {
    category: "Product Care",
    questions: [
      {
        q: "How do I care for my jewelry?",
        a: "Store jewelry in a cool, dry place away from direct sunlight. Avoid contact with perfumes, lotions, and water. Clean gently with a soft cloth.",
      },
      {
        q: "Are your products hypoallergenic?",
        a: "Most of our jewelry is hypoallergenic and nickel-free. Product descriptions specify the materials used. Contact us for specific allergy concerns.",
      },
    ],
  },
  {
    category: "Payment & Security",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. Cash on delivery is available for select locations.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and never store your complete payment details. All transactions are processed through secure payment gateways.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-medium text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our products and services
            </p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-display font-medium text-foreground mb-4 border-b border-border pb-2">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${section.category}-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center p-8 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
