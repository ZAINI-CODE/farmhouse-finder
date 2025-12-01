import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Users, Star, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const featuredProperties = [
  {
    id: "1",
    title: "Sunset Valley Estate",
    location: "Napa Valley, CA",
    price: 1500,
    rating: 4.9,
    reviews: 127,
    guests: 150,
    image: property1,
    badge: "Featured",
    amenities: ["Pool", "Garden", "Catering"],
  },
  {
    id: "2",
    title: "Rustic Barn Venue",
    location: "Austin, TX",
    price: 1200,
    rating: 4.8,
    reviews: 89,
    guests: 200,
    image: property2,
    badge: "Popular",
    amenities: ["Indoor", "Outdoor", "Parking"],
  },
  {
    id: "3",
    title: "Hilltop Haven Retreat",
    location: "Sonoma, CA",
    price: 2000,
    rating: 5.0,
    reviews: 64,
    guests: 80,
    image: property3,
    badge: "New",
    amenities: ["Views", "Fire Pit", "Kitchen"],
  },
  {
    id: "4",
    title: "Charming Garden Cottage",
    location: "Charleston, SC",
    price: 800,
    rating: 4.7,
    reviews: 156,
    guests: 50,
    image: property4,
    amenities: ["Garden", "Gazebo", "Lights"],
  },
];

export function FeaturedProperties() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent font-medium"
            >
              Hand-Picked Selection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2"
            >
              Featured Properties
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mt-3 max-w-xl"
            >
              Explore our top-rated venues perfect for your next event or celebration
            </motion.p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="group">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/properties/${property.id}`}>
                <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Badges */}
                    {property.badge && (
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-accent text-accent-foreground border-0"
                      >
                        {property.badge}
                      </Badge>
                    )}
                    
                    {/* Favorite Button */}
                    <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-card transition-all">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                    
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium text-foreground">{property.rating}</span>
                          <span className="text-muted-foreground text-sm">
                            ({property.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{property.guests}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-heading font-bold text-lg text-primary">
                          ${property.price}
                        </span>
                        <span className="text-muted-foreground text-sm">/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
