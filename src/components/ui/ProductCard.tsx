import { Link } from "react-router-dom";
import { Heart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSetting } from "@/hooks/useSiteSettings";

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
}: ProductCardProps) => {
  const { data: savedTheme } = useSiteSetting<ProductCardTheme>("product_card_theme");
  const theme: ProductCardTheme = { ...defaultTheme, ...savedTheme };

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
    switch (theme.card_style) {
      case "minimal": return "border-0 shadow-none";
      case "bordered": return "border-2 border-border";
      default: return "border border-border";
    }
  };

  const getHoverClass = () => {
    switch (theme.hover_effect) {
      case "scale": return "hover:scale-[1.02]";
      case "border": return "hover:border-primary";
      case "none": return "";
      default: return "hover:shadow-lg";
    }
  };

  const getAspectClass = () => {
    if (variant === "featured") return "h-80";
    switch (theme.image_aspect_ratio) {
      case "portrait": return "aspect-[3/4]";
      case "landscape": return "aspect-[4/3]";
      default: return "aspect-square";
    }
  };

  const getButtonClass = () => {
    switch (theme.button_style) {
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
    return theme.image_fit === "cover" 
      ? "w-full h-full object-cover" 
      : "max-h-full max-w-full object-contain";
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className={`bg-card group transition-all duration-300 block ${getCardStyleClass()} ${getHoverClass()}`}
    >
      <div className={`relative ${variant === "featured" ? "h-80 overflow-hidden" : `bg-surface p-8 ${getAspectClass()} flex items-center justify-center`}`}>
        {badge && (
          <span className={`absolute top-4 left-4 ${getBadgeStyles()} text-[10px] font-bold px-2 py-1 uppercase z-10`}>
            {badge}
          </span>
        )}
        {theme.show_wishlist && (
          <button className="absolute top-4 right-4 text-muted-foreground hover:text-sale z-10">
            <div className="bg-card rounded-full p-1 shadow-sm">
              <Heart size={16} />
            </div>
          </button>
        )}
        <img
          src={image}
          alt={name}
          className={getImageClass()}
        />
      </div>
      
      <div className="p-6">
        {theme.show_rating && (
          <div className="flex text-primary text-xs mb-2">
            {renderStars()}
            <span className="text-muted-foreground ml-1">({reviewCount})</span>
          </div>
        )}
        <h3 className="font-display font-medium text-lg mb-2 text-foreground truncate">
          {name}
        </h3>
        {theme.show_description && (
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
