import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import ProductCard from "./ProductCard";
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';
import { Button } from './ui/button';

const FeaturedProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productService.getFeaturedProducts(),
  });

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load featured products</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Featured Products</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover our handpicked selection of the season's most iconic footwear
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : data && data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No featured products available at the moment</p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
