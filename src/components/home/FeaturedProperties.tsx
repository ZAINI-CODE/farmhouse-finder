import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Users, Star, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import property1 from "@/assets/property-1.jpg";

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_day: number;
  rating: number | null;
  reviews_count: number | null;
  max_guests: number | null;
  images: string[] | null;
  amenities: string[] | null;
}

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('id, title, location, price_per_day, rating, reviews_count, max_guests, images, amenities')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(8);
      
      if (data) setProperties(data);
    };
    fetchProperties();
  }, []);

  const getImage = (property: Property) => {
    if (property.images && property.images.length > 0) return property.images[0];
    return property1;
  };

  if (properties.length === 0) return null;

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
          {properties.map((property, index) => (
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
                      src={getImage(property)}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
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
                    
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                      {property.title}
                    </h3>

                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium text-foreground">{property.rating || '—'}</span>
                          {property.reviews_count ? (
                            <span className="text-muted-foreground text-sm">
                              ({property.reviews_count})
                            </span>
                          ) : null}
                        </div>
                        {property.max_guests && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{property.max_guests}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-heading font-bold text-lg text-accent">
                          Rs. {property.price_per_day.toLocaleString()}
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
