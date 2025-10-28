import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart, Heart, Truck, Shield } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["relatedProducts", id],
    queryFn: () => productService.getRelatedProducts(id!),
    enabled: !!id,
  });

  const product = data?.product;

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast({
        title: "Error",
        description: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    const sizeStock = product.sizes.find((s) => s.size === selectedSize);
    if (!sizeStock || sizeStock.stock < quantity) {
      toast({
        title: "Error",
        description: "Insufficient stock for selected size",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedSize, quantity, selectedColor);
    toast({
      title: "Success",
      description: "Product added to cart!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link to="/products">
              <Button className="mt-4">Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const price = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="min-h-screen flex flex-col mt-10">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {" / "}
          <Link to="/products" className="hover:underline">
            Products
          </Link>
          {" / "}
          <span>{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              {product.gender && (
                <div className="mb-3">
                  <Badge
                    variant={
                      product.gender === "Men"
                        ? "default"
                        : product.gender === "Women"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {product.gender === "Men"
                      ? "👔"
                      : product.gender === "Women"
                      ? "👗"
                      : "👕"}{" "}
                    {product.gender}
                  </Badge>
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <p className="text-muted-foreground">{product.brand}</p>
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({product.totalReviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">₹{price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <Badge className="bg-red-500">
                    {Math.round(
                      ((product.price - product.discountPrice!) /
                        product.price) *
                        100
                    )}
                    % OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-2">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sizeObj) => (
                  <Button
                    key={sizeObj.size}
                    variant={
                      selectedSize === sizeObj.size ? "default" : "outline"
                    }
                    onClick={() => setSelectedSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                    className="min-w-[60px]"
                  >
                    {sizeObj.size}
                    {sizeObj.stock === 0 && (
                      <span className="ml-1 text-xs">(Out)</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.totalStock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  Free shipping on orders over ₹1000
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">1 year warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Separator className="my-12" />
        <div>
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReviewList productId={id!} />
            </div>
            <div>
              {isAuthenticated ? (
                <ReviewForm productId={id!} />
              ) : (
                <div className="p-6 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground mb-4">
                    Sign in to write a review
                  </p>
                  <Link to="/login">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedData && relatedData.products.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedData.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
