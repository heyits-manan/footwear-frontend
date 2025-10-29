import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import GenderProducts from "@/components/GenderProducts";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { RecommendedProducts } from "@/components/RecommendedProducts";

const Index = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect admins to admin dashboard
    if (isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  // Don't render customer UI if admin
  if (isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      <RecommendedProducts type="trending" title="Trending Now" limit={8} />
      <GenderProducts
        gender="Men"
        title="Men's Collection"
        description="Premium footwear designed for the modern man"
      />
      <GenderProducts
        gender="Women"
        title="Women's Collection"
        description="Stylish and comfortable footwear for every occasion"
      />
      <Categories />
      <RecommendedProducts type="new-arrivals" title="New Arrivals" limit={8} />
      <RecommendedProducts type="best-sellers" title="Best Sellers" limit={8} />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
