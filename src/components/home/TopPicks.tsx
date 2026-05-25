import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, UtensilsCrossed, Camera, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const topPicks = [
  {
    id: "1",
    type: "vendor",
    name: "Golden Fork Catering",
    category: "Catering",
    location: "Lahore, Pakistan",
    rating: 4.9,
    reviews: 234,
    price: "From PKR 2,500/person",
    icon: UtensilsCrossed,
    iconBg: "bg-orange-500/10 text-orange-600",
    link: "/services/1",
    highlight: "Top Rated",
  },
  {
    id: "2",
    type: "vendor",
    name: "Lens & Light Photography",
    category: "Photography",
    location: "Karachi, Pakistan",
    rating: 5.0,
    reviews: 189,
    price: "From PKR 70,000",
    icon: Camera,
    iconBg: "bg-blue-500/10 text-blue-600",
    link: "/services/2",
    highlight: "Most Booked",
  },
  {
    id: "4",
    type: "vendor",
    name: "Bloom & Blossom Decor",
    category: "Decoration",
    location: "Islamabad, Pakistan",
    rating: 4.9,
    reviews: 178,
    price: "From PKR 55,000",
    icon: Flower2,
    iconBg: "bg-pink-500/10 text-pink-600",
    link: "/services/4",
    highlight: "Editor's Choice",
  },
];

export function TopPicks() {
  return (
    <section className="py-10 bg-secondary/30 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Top Picks for You
            </h2>
          </div>
          <Link to="/services">
            <Button variant="ghost" size="sm" className="group">
              View All
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPicks.map((pick, index) => {
            const Icon = pick.icon;
            return (
              <motion.div
                key={pick.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={pick.link}>
                  <div className="group bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center ${pick.iconBg}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs border-accent/50 text-accent">
                          {pick.highlight}
                        </Badge>
                      </div>
                      <h3 className="font-heading font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {pick.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          <span className="font-medium">{pick.rating}</span>
                        </div>
                        <span>•</span>
                        <span className="truncate">{pick.location}</span>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-primary">{pick.price}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
