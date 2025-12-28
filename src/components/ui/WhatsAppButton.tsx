import { MessageCircle } from "lucide-react";
import { useSiteSetting, ContactSettings } from "@/hooks/useSiteSettings";

interface ContactWithMessage extends ContactSettings {
  whatsappMessage?: string;
}

const WhatsAppButton = () => {
  const { data: contact } = useSiteSetting<ContactWithMessage>("contact");
  
  const whatsappNumber = contact?.whatsapp || contact?.phone || "+919876543210";
  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const defaultMessage = contact?.whatsappMessage || "Hello! I have a question about your jewelry collection.";
  const message = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group md:bottom-8 md:right-8"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-card text-foreground text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-border hidden md:block">
        Chat with us
      </span>
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
};

export default WhatsAppButton;
