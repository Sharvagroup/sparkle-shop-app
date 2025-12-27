import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { z } from "zod";
import { useSiteSetting, ContactSettings, SocialSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

interface BusinessHoursSettings {
  hours: Array<{ day: string; hours: string; closed: boolean }>;
}

const Contact = () => {
  const { toast } = useToast();
  const { data: contact, isLoading: contactLoading } = useSiteSetting<ContactSettings>("contact");
  const { data: social, isLoading: socialLoading } = useSiteSetting<SocialSettings>("social");
  const { data: businessHoursSettings } = useSiteSetting<BusinessHoursSettings>("business_hours");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  const contactDetails = [
    {
      icon: Phone,
      title: "Phone Number",
      primary: contact?.phone || "+91 1234567890",
      secondary: "Mon-Fri 9am to 6pm",
    },
    {
      icon: Mail,
      title: "Email Address",
      primary: contact?.email || "support@store.com",
      secondary: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Store Address",
      primary: contact?.address?.split(',')[0] || "Store Address",
      secondary: contact?.address?.split(',').slice(1).join(',') || "City, Country",
    },
  ];

  const defaultBusinessHours = [
    { day: "Monday - Friday", hours: "10:00 AM - 8:00 PM", closed: false },
    { day: "Saturday", hours: "11:00 AM - 7:00 PM", closed: false },
    { day: "Sunday", hours: "Closed", closed: true },
  ];

  const businessHours = businessHoursSettings?.hours || defaultBusinessHours;

  const socialLinks = [
    { icon: Instagram, url: social?.instagram, label: "Instagram" },
    { icon: Youtube, url: social?.youtube, label: "YouTube" },
    { icon: Facebook, url: social?.facebook, label: "Facebook" },
    { icon: Twitter, url: social?.twitter, label: "Twitter" },
  ].filter(s => s.url);

  const isLoading = contactLoading || socialLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] w-full flex items-center justify-center bg-foreground overflow-hidden">
          <img 
            alt="Contact Us" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=800&fit=crop"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display text-white mb-2 drop-shadow-md tracking-wider">
              Contact Us
            </h1>
            <p className="text-gray-200 text-lg font-light tracking-wide">
              We're here to assist you with every query
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
              {/* Contact Form */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-display text-foreground mb-10">
                  Get in Touch
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label 
                        htmlFor="name" 
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-transparent border-b border-border focus:border-primary px-0 py-2 transition-colors placeholder-muted-foreground/50 outline-none text-foreground"
                      />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label 
                        htmlFor="email" 
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-transparent border-b border-border focus:border-primary px-0 py-2 transition-colors placeholder-muted-foreground/50 outline-none text-foreground"
                      />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label 
                      htmlFor="subject" 
                      className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full bg-transparent border-b border-border focus:border-primary px-0 py-2 transition-colors placeholder-muted-foreground/50 outline-none text-foreground"
                    />
                    {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows={4}
                      className="w-full bg-transparent border-b border-border focus:border-primary px-0 py-2 transition-colors placeholder-muted-foreground/50 outline-none resize-none text-foreground"
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>
                  <div className="pt-4">
                    <Button 
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-primary-foreground px-10 py-4 text-xs font-bold uppercase tracking-widest transition-colors shadow-md rounded-sm"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>

              {/* Contact Details */}
              <div className="w-full md:w-1/2 flex flex-col gap-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-display text-foreground mb-10">
                    Our Details
                  </h2>
                  {isLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {contactDetails.map((detail) => (
                        <div key={detail.title} className="flex items-start gap-5">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary shrink-0">
                            <detail.icon size={20} />
                          </div>
                          <div>
                            <h3 className="font-display text-lg text-foreground mb-1">{detail.title}</h3>
                            <p className="text-muted-foreground text-sm">{detail.primary}</p>
                            <p className="text-muted-foreground text-xs mt-1 italic">{detail.secondary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Business Hours */}
                <div className="bg-muted p-6 border border-border rounded-sm">
                  <h3 className="font-display text-lg text-foreground mb-4 border-b border-border pb-2">
                    Business Hours
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {businessHours.map((item) => (
                      <li 
                        key={item.day} 
                        className={`flex justify-between ${item.closed ? 'text-muted-foreground/50' : ''}`}
                      >
                        <span>{item.day}</span>
                        <span>{item.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Map */}
                <div className="w-full h-56 bg-muted rounded-sm overflow-hidden grayscale filter hover:grayscale-0 transition-all duration-500">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076364379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c16587d%3A0x44b6c6563456747b!2s123%20Madison%20Ave%2C%20New%20York%2C%20NY%2010016%2C%20USA!5e0!3m2!1sen!2s!4v1647424683072!5m2!1sen!2s"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="Store Location"
                  />
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Follow Us:
                    </span>
                    <div className="flex gap-4">
                      {socialLinks.map((link) => (
                        <a 
                          key={link.label}
                          href={link.url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors bg-background"
                          aria-label={link.label}
                        >
                          <link.icon size={16} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
