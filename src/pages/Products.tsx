import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService, Product } from "@/services/productService";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Star } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const filters = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    brand: searchParams.get("brand") || undefined,
    gender: searchParams.get("gender") || undefined,
    sort: searchParams.get("sort") || "-createdAt",
    page: parseInt(searchParams.get("page") || "1"),
    limit: 12,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getProducts(filters),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => productService.getBrands(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set("search", searchTerm);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 ">
        {/* Search and Filters */}
        <div className="mb-8 mt-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData?.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.gender || "all"}
                onValueChange={(value) => handleFilterChange("gender", value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Men">👔 Men</SelectItem>
                  <SelectItem value="Women">👗 Women</SelectItem>
                  <SelectItem value="Unisex">👕 Unisex</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.brand || "all"}
                onValueChange={(value) => handleFilterChange("brand", value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brandsData?.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.sort}
                onValueChange={(value) => handleFilterChange("sort", value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-createdAt">Newest</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="-price">Price: High to Low</SelectItem>
                  <SelectItem value="-averageRating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.category || filters.brand || filters.gender) && (
            <div className="flex items-center gap-2 flex-wrap mt-4">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {filters.search && (
                <Badge variant="secondary">
                  Search: {filters.search}
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary">
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.gender && (
                <Badge variant="secondary">
                  {filters.gender === 'Men' ? '👔' : filters.gender === 'Women' ? '👗' : '👕'} {filters.gender}
                  <button
                    onClick={() => handleFilterChange("gender", "")}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.brand && (
                <Badge variant="secondary">
                  {filters.brand}
                  <button
                    onClick={() => handleFilterChange("brand", "")}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data?.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        filters.page > 1 && handlePageChange(filters.page - 1)
                      }
                      className={
                        filters.page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {[...Array(data.totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i + 1)}
                        isActive={filters.page === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        filters.page < data.totalPages &&
                        handlePageChange(filters.page + 1)
                      }
                      className={
                        filters.page >= data.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const price = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  const getGenderBadge = () => {
    if (!product.gender) return null;

    const genderConfig = {
      Men: { emoji: '👔', variant: 'default' as const },
      Women: { emoji: '👗', variant: 'secondary' as const },
      Unisex: { emoji: '👕', variant: 'outline' as const }
    };

    const config = genderConfig[product.gender as keyof typeof genderConfig];
    if (!config) return null;

    return (
      <Badge variant={config.variant} className="absolute top-2 left-2">
        {config.emoji} {product.gender}
      </Badge>
    );
  };

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {getGenderBadge()}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Save{" "}
              {Math.round(
                ((product.price - product.discountPrice!) / product.price) * 100
              )}
              %
            </Badge>
          )}
          {product.totalStock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.brand}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.totalReviews})
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Products;
