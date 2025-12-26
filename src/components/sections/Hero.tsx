import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center bg-muted overflow-hidden">
      {/* Background Image */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIKiMJGKBlwXT4Ea1wCLiwQMsLknXl2_hlS-0ReOUh2NuM8ONcHB2irx2kSTxRz6ZMI0yxhdeQqpZFdnHEEgEIyZt8GXAneitQ3ct9hW5yQWJluHWbSTMbKhfdk5H6d56BA3kK5Hs1z51OO8ruNVsb2HlKFasxk8edMUnKoYaKtvV5ns6CmlKC3jpfxuxLbkex-xcFYoeXTPWtLSbF5CaFrT6Kji3VQ72xQ5ZOcXNHdCCEvNl8HdJbOcJ3l2j4ntUyws085O48X08"
        alt="Luxury gold jewelry background"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-display text-white mb-4 drop-shadow-md">
          Timeless Elegance
        </h1>
        <p className="text-gray-100 text-lg md:text-xl mb-8 font-light max-w-xl mx-auto drop-shadow-sm">
          Discover our handcrafted collection of exquisite jewelry designed to make every moment unforgettable.
        </p>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-3 px-8 uppercase tracking-wide transition-colors shadow-lg"
        >
          Shop New Arrivals
        </Button>
      </div>
      
      {/* Navigation Arrows */}
      <button className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all">
        <ChevronLeft size={24} />
      </button>
      <button className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all">
        <ChevronRight size={24} />
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        <span className="w-8 h-2 bg-primary rounded-full" />
        <span className="w-2 h-2 bg-white/50 rounded-full" />
        <span className="w-2 h-2 bg-white/50 rounded-full" />
      </div>
    </section>
  );
};

export default Hero;
