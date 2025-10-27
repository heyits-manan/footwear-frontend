import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white tracking-tight">
          Stay in the Loop
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Be the first to know about new releases, exclusive offers, and more
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white h-12"
          />
          <Button className="bg-accent hover:bg-accent/90 text-white h-12 px-8">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
