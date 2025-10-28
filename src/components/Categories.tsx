import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    title: "Running",
    description: "Built for speed and endurance",
    color: "from-accent/20 to-accent/5",
  },
  {
    id: 2,
    title: "Sports",
    description: "Maximum support for your workout",
    color: "from-primary/20 to-primary/5",
  },
  {
    id: 3,
    title: "Casual",
    description: "Style meets comfort",
    color: "from-secondary to-background",
  },
];

const Categories = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Shop by Category</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Find the perfect pair for your lifestyle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.title}`}
            className={`relative h-80 rounded-lg overflow-hidden group cursor-pointer bg-gradient-to-br ${category.color}`}
          >
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <Button
                variant="ghost"
                className="self-start group-hover:bg-primary group-hover:text-primary-foreground transition-all"
              >
                Explore
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
