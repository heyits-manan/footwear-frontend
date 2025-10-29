import React from "react";
import { useQuery } from "@tanstack/react-query";
import { recommendationService } from "@/services/recommendationService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecommendedProductsProps {
  type: "trending" | "new-arrivals" | "best-sellers" | "personalized";
  title: string;
  limit?: number;
  category?: string;
  gender?: string;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  type,
  title,
  limit = 8,
  category,
  gender,
}) => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["recommendations", type, limit, category, gender],
    queryFn: async () => {
      switch (type) {
        case "trending":
          return recommendationService.getTrendingProducts(limit);
        case "new-arrivals":
          return recommendationService.getNewArrivals(limit, category, gender);
        case "best-sellers":
          return recommendationService.getBestSellers(limit, category, gender);
        case "personalized":
          return recommendationService.getPersonalizedRecommendations(limit);
        default:
          return { products: [] };
      }
    },
  });

  if (isLoading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const products = data?.products || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {type === "trending" && data?.period && (
          <Badge variant="outline">{data.period}</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <Card
            key={product._id}
            className="cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.discountPrice && (
                  <Badge className="absolute top-2 right-2 bg-red-600">
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100
                    )}
                    % OFF
                  </Badge>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {product.brand}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {product.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.totalReviews})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    ${(product.discountPrice || product.price).toFixed(2)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm line-through text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {type === "personalized" && data?.basedOn && (
        <div className="mt-4 text-sm text-muted-foreground">
          Based on {data.basedOn.orderCount} orders and{" "}
          {data.basedOn.wishlistCount} wishlist items
        </div>
      )}
    </div>
  );
};
