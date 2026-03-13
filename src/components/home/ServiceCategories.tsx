import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  UtensilsCrossed, 
  Camera, 
  Music, 
  Flower2, 
  Cake, 
  Sparkles,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "catering",
    title: "Catering",
    description: "Professional catering services for all occasions",
    icon: UtensilsCrossed,
    count: 85,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    id: "photography",
    title: "Photography",
    description: "Capture your special moments beautifully",
    icon: Camera,
    count: 62,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "music",
    title: "Music & DJ",
    description: "Live bands, DJs, and entertainment",
    icon: Music,
    count: 48,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "decoration",
    title: "Decoration",
    description: "Transform venues into magical spaces",
    icon: Flower2,
    count: 73,
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    id: "bakery",
    title: "Cakes & Bakery",
    description: "Custom cakes and sweet treats",
    icon: Cake,
    count: 41,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "planning",
    title: "Event Planning",
    description: "Full-service event coordination",
    icon: Sparkles,
    count: 34,
    color: "bg-emerald-500/10 text-emerald-600",
  },
];

export function ServiceCategories() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-medium"
          >
            Complete Event Solutions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2"
          >
            Browse Service Categories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-3 max-w-xl mx-auto"
          >
            Find trusted vendors for every aspect of your event
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={category.id === "catering" ? "/services/catering" : category.id === "photography" ? "/services/photography" : category.id === "decoration" ? "/services/decoration" : category.id === "music" ? "/services/music-dj" : category.id === "planning" ? "/services/event-planning" : `/services?category=${category.id}`}>
                <div className="group bg-card rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <category.icon className="h-7 w-7" />
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {category.count} vendors
                    </span>
                  </div>
                  
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-accent font-medium text-sm group-hover:gap-2 transition-all">
                    <span>Explore vendors</span>
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="accent" size="lg">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
