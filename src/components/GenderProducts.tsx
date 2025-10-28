import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import ProductCard from "./ProductCard";
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface GenderProductsProps {
  gender: 'Men' | 'Women';
  title: string;
  description: string;
}

const GenderProducts = ({ gender, title, description }: GenderProductsProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['genderProducts', gender],
    queryFn: () => productService.getProducts({ gender, limit: 4, sort: '-createdAt' }),
  });

  if (error) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {description}
            </p>
          </div>
          <Link to={`/products?gender=${gender}`}>
            <Button variant="ghost" size="lg" className="hidden md:flex">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
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
          <div className="text-center mt-12 md:hidden">
            <Link to={`/products?gender=${gender}`}>
              <Button size="lg">
                View All {gender}'s Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No {gender.toLowerCase()}'s products available at the moment</p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default GenderProducts;
