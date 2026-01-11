// Shared default settings for About, FAQ, and Size Guide pages
// This prevents duplication and ensures consistency between frontend and admin

export interface Artisan {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutSettings {
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

export interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  questions: FAQQuestion[];
}

export interface FAQSettings {
  pageTitle: string;
  pageSubtitle: string;
  categories: FAQCategory[];
  ctaTitle: string;
  ctaText: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export interface SizeCategory {
  id: string;
  name: string;
  instructions: string;
  columns: string[];
  rows: Record<string, string>[];
}

export interface SizeGuideSettings {
  pageTitle: string;
  pageSubtitle: string;
  categories: SizeCategory[];
  footerText: string;
}

// Default About Settings
export const defaultAboutSettings: AboutSettings = {
  heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop",
  heroTitle: "Our Story",
  heroSubtitle: "Crafting timeless elegance rooted in Indian heritage",
  missionTitle: "Redefining traditional luxury for the modern soul.",
  missionText: "We believe that jewelry is more than just an accessory; it is a repository of memories, a symbol of heritage, and a work of art. Founded with a vision to preserve the intricate techniques of ancient goldsmithing, we blend these time-honored traditions with contemporary aesthetics. Each piece in our collection narrates a story of dedication, passion, and the pursuit of perfection.",
  missionImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop",
  artisans: [
    {
      id: "1",
      name: "Aanya Kapoor",
      role: "Founder & Creative Director",
      quote: "I wanted to create pieces that don't just adorn the body, but also touch the soul.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: "2",
      name: "Rajesh Verma",
      role: "Head Goldsmith",
      quote: "Thirty years of shaping gold has taught me that patience is the true secret to beauty.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    }
  ],
  values: [
    { id: "1", icon: "Hammer", title: "Our Craftsmanship", description: "Every curve and contour is meticulously shaped by master artisans who have inherited their skills through generations, ensuring unmatched quality and detail." },
    { id: "2", icon: "BookOpen", title: "Our Heritage", description: "Rooted in the royal traditions of India, our designs pay homage to the grandeur of the past while embracing the minimalist elegance of today." },
    { id: "3", icon: "Diamond", title: "Our Values", description: "We are committed to ethical sourcing and sustainability, ensuring that the beauty of our jewelry is matched only by the integrity of its creation." }
  ],
  ctaTitle: "Experience the Legacy",
  ctaText: "Explore our curated collections and find the piece that speaks to your unique story.",
  ctaButtonText: "Shop Our Collections"
};

// Default FAQ Settings
export const defaultFAQSettings: FAQSettings = {
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

// Default Size Guide Settings
export const defaultSizeGuideSettings: SizeGuideSettings = {
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
