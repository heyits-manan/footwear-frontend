import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import GenderProducts from "@/components/GenderProducts";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedProducts />
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
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
