import { Link } from "react-router-dom";
import { Heart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { ProductTheme } from "@/hooks/useProducts";

interface ProductCardTheme {
  card_style: "default" | "minimal" | "bordered";
  image_aspect_ratio: "square" | "portrait" | "landscape";
  show_description: boolean;
  show_rating: boolean;
  show_wishlist: boolean;
  button_style: "full" | "outline" | "minimal";
  hover_effect: "shadow" | "scale" | "border" | "none";
  image_fit: "contain" | "cover";
}

const defaultTheme: ProductCardTheme = {
  card_style: "default",
  image_aspect_ratio: "square",
  show_description: true,
  show_rating: true,
  show_wishlist: true,
  button_style: "full",
  hover_effect: "shadow",
  image_fit: "contain",
};

// Default individual product theme
const defaultProductTheme: ProductTheme = {
  card_style: undefined,
  badge_style: "default",
  badge_color: undefined,
  image_fit: undefined,
  hover_effect: undefined,
  featured_border: false,
  highlight_color: "#d4af37",
};

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: "new" | "sale" | "trending";
  variant?: "default" | "featured";
  theme?: ProductTheme | null;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  badge,
  variant = "default",
  theme: productTheme,
}: ProductCardProps) => {
  const { data: savedTheme } = useSiteSetting<ProductCardTheme>("product_card_theme");
  const globalTheme: ProductCardTheme = { ...defaultTheme, ...savedTheme };
  
  // Merge individual product theme
  const itemTheme: ProductTheme = { ...defaultProductTheme, ...productTheme };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="fill-primary text-primary" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={14} className="fill-primary text-primary" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-muted-foreground" />);
    }
    return stars;
  };

  const getBadgeStyles = () => {
    switch (badge) {
      case "new":
        return "bg-primary text-primary-foreground";
      case "sale":
        return "bg-sale text-white";
      case "trending":
        return "bg-trending text-white";
      default:
        return "";
    }
  };

  const getCardStyleClass = () => {
    // Use individual theme if set, otherwise use global
    const cardStyle = itemTheme.card_style || globalTheme.card_style;
    switch (cardStyle) {
      case "minimal": return "border-0 shadow-none";
      case "bordered": return "border-2 border-border";
      default: return "border border-border";
    }
  };

  const getHoverClass = () => {
    // Use individual theme if set, otherwise use global
    const hoverEffect = itemTheme.hover_effect || globalTheme.hover_effect;
    switch (hoverEffect) {
      case "scale": return "hover:scale-[1.02]";
      case "border": return "hover:border-primary";
      case "none": return "";
      default: return "hover:shadow-lg";
    }
  };

  const getAspectClass = () => {
    if (variant === "featured") return "h-80";
    switch (globalTheme.image_aspect_ratio) {
      case "portrait": return "aspect-[3/4]";
      case "landscape": return "aspect-[4/3]";
      default: return "aspect-square";
    }
  };

  const getButtonClass = () => {
    switch (globalTheme.button_style) {
      case "outline": 
        return "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground";
      case "minimal": 
        return "bg-transparent text-primary underline hover:no-underline";
      default: 
        return "bg-primary hover:bg-primary-dark text-primary-foreground";
    }
  };

  const getImageClass = () => {
    if (variant === "featured") {
      return "w-full h-full object-cover";
    }
    // Use individual theme if set, otherwise use global
    const imageFit = itemTheme.image_fit || globalTheme.image_fit;
    return imageFit === "cover" 
      ? "w-full h-full object-cover" 
      : "max-h-full max-w-full object-contain";
  };
  
  // Get badge style from individual theme
  const getBadgeClass = () => {
    const badgeStyle = itemTheme.badge_style || "default";
    const badgeColor = itemTheme.badge_color;
    
    if (badgeColor) {
      return badgeStyle === "rounded" || badgeStyle === "pill"
        ? `${badgeStyle === "pill" ? "rounded-full" : "rounded-lg"}`
        : "";
    }
    
    // Default badge styles with shape
    const shapeClass = badgeStyle === "pill" ? "rounded-full" : badgeStyle === "rounded" ? "rounded-lg" : "";
    
    switch (badge) {
      case "new":
        return `bg-primary text-primary-foreground ${shapeClass}`;
      case "sale":
        return `bg-sale text-white ${shapeClass}`;
      case "trending":
        return `bg-trending text-white ${shapeClass}`;
      default:
        return shapeClass;
    }
  };
  
  // Get featured border style
  const getFeaturedBorderStyle = () => {
    if (itemTheme.featured_border) {
      return {
        borderColor: itemTheme.highlight_color || "#d4af37",
        borderWidth: "3px",
      };
    }
    return {};
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className={`bg-card group transition-all duration-300 block ${getCardStyleClass()} ${getHoverClass()}`}
      style={getFeaturedBorderStyle()}
    >
      <div className={`relative ${variant === "featured" ? "h-80 overflow-hidden" : `bg-surface p-8 ${getAspectClass()} flex items-center justify-center`}`}>
        {badge && (
          <span 
            className={`absolute top-4 left-4 ${getBadgeClass()} text-[10px] font-bold px-2 py-1 uppercase z-10`}
            style={itemTheme.badge_color ? { 
              backgroundColor: itemTheme.badge_color,
              color: "#ffffff",
            } : {}}
          >
            {badge}
          </span>
        )}
        {globalTheme.show_wishlist && (
          <button className="absolute top-4 right-4 text-muted-foreground hover:text-sale z-10">
            <div className="bg-card rounded-full p-1 shadow-sm">
              <Heart size={16} />
            </div>
          </button>
        )}
        {image ? (
          <img
            src={image}
            alt={name}
            className={getImageClass()}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-2xl text-muted-foreground font-bold uppercase">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {globalTheme.show_rating && (
          <div className="flex text-primary text-xs mb-2">
            {renderStars()}
            <span className="text-muted-foreground ml-1">({reviewCount})</span>
          </div>
        )}
        <h3 className="font-display font-medium text-lg mb-2 text-foreground truncate">
          {name}
        </h3>
        {globalTheme.show_description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            {description}
          </p>
        )}
        <div className="font-bold text-lg mb-4 text-foreground">
          {originalPrice && (
            <span className="text-muted-foreground line-through text-sm mr-2">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
          ₹{price.toLocaleString()}
        </div>
        <Button className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors ${getButtonClass()}`}>
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
