import { Heart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="bg-card border border-border group hover:shadow-lg transition-shadow">
      <div className={`relative ${variant === "featured" ? "h-80 overflow-hidden" : "bg-surface p-8 h-80 flex items-center justify-center"}`}>
        {badge && (
          <span className={`absolute top-4 left-4 ${getBadgeStyles()} text-[10px] font-bold px-2 py-1 uppercase z-10`}>
            {badge}
          </span>
        )}
        <button className="absolute top-4 right-4 text-muted-foreground hover:text-sale z-10">
          <div className="bg-card rounded-full p-1 shadow-sm">
            <Heart size={16} />
          </div>
        </button>
        <img
          src={image}
          alt={name}
          className={variant === "featured" ? "w-full h-full object-cover" : "max-h-full max-w-full object-contain"}
        />
      </div>
      
      <div className="p-6">
        <div className="flex text-primary text-xs mb-2">
          {renderStars()}
          <span className="text-muted-foreground ml-1">({reviewCount})</span>
        </div>
        <h3 className="font-display font-medium text-lg mb-2 text-foreground truncate">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {description}
        </p>
        <div className="font-bold text-lg mb-4 text-foreground">
          {originalPrice && (
            <span className="text-muted-foreground line-through text-sm mr-2">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
          ₹{price.toLocaleString()}
        </div>
        <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-3 text-xs font-bold uppercase tracking-wider transition-colors">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
