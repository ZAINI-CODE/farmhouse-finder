import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import {
  MapPin, Star, Search, ArrowRight, CalendarIcon, X, Heart, Loader2,
  UtensilsCrossed, Camera, Music, Flower2, Cake, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { id: "all", label: "All Services", icon: Sparkles },
  { id: "catering", label: "Catering", icon: UtensilsCrossed },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "music", label: "Music & DJ", icon: Music },
  { id: "decoration", label: "Decoration", icon: Flower2 },
  { id: "bakery", label: "Cakes & Bakery", icon: Cake },
  { id: "planning", label: "Event Planning", icon: Sparkles },
];

interface Vendor {
  id: string;
  business_name: string;
  category: string;
  location: string;
  rating: number | null;
  reviews_count: number | null;
  price_range: string | null;
  description: string | null;
  specialties: string[] | null;
  is_verified: boolean | null;
}

export default function Services() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vendors from database
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendors')
        .select('id, business_name, category, location, rating, reviews_count, price_range, description, specialties, is_verified')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vendors:', error);
      } else {
        setVendors(data || []);
      }
      setLoading(false);
    };

    fetchVendors();
  }, []);

  // Initialize filters from URL parameters
  useEffect(() => {
    const locationParam = searchParams.get("location");
    const dateParam = searchParams.get("date");
    if (locationParam) {
      setSearchQuery(locationParam);
    }
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
      }
    }
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory = activeCategory === "all" || vendor.category.toLowerCase() === activeCategory;
    const matchesSearch =
      vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      vendor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId.toLowerCase());
    return category?.icon || Sparkles;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Find Trusted Service Providers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-xl mx-auto"
            >
              Browse verified vendors for catering, photography, decoration, and more
            </motion.p>
          </div>

          {/* Search and Date Filter */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search vendors by name, location, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl"
                />
              </div>
              
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-14 w-full sm:w-[200px] justify-start text-left font-normal rounded-xl",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Event Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-14 w-14 shrink-0 rounded-xl"
                  onClick={() => setSelectedDate(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSearchParams(category.id === "all" ? {} : { category: category.id })}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            {loading ? 'Loading...' : `Showing ${filteredVendors.length} service providers`}
          </p>

          {/* Vendors Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                No vendors found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSearchParams({});
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVendors.map((vendor, index) => {
                const CategoryIcon = getCategoryIcon(vendor.category);
                return (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/services/${vendor.id}`}>
                      <div className="group bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            vendor.category.toLowerCase() === "catering" ? "bg-orange-500/10 text-orange-600" :
                            vendor.category.toLowerCase() === "photography" ? "bg-blue-500/10 text-blue-600" :
                            vendor.category.toLowerCase() === "music" ? "bg-purple-500/10 text-purple-600" :
                            vendor.category.toLowerCase() === "decoration" ? "bg-pink-500/10 text-pink-600" :
                            vendor.category.toLowerCase() === "bakery" ? "bg-amber-500/10 text-amber-600" :
                            "bg-emerald-500/10 text-emerald-600"
                          }`}>
                            <CategoryIcon className="h-7 w-7" />
                          </div>
                          <div className="flex items-center gap-2">
                            {vendor.is_verified && (
                              <Badge className="bg-accent text-accent-foreground">Verified</Badge>
                            )}
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(vendor.id, 'vendor');
                              }}
                              className={cn(
                                "w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-all",
                                isFavorite(vendor.id, 'vendor') 
                                  ? "text-destructive" 
                                  : "text-muted-foreground hover:text-destructive"
                              )}
                            >
                              <Heart className={cn("h-4 w-4", isFavorite(vendor.id, 'vendor') && "fill-current")} />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                          {vendor.business_name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          {vendor.location}
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {vendor.description || 'No description available'}
                        </p>

                        {/* Tags */}
                        {vendor.specialties && vendor.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {vendor.specialties.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-medium">{vendor.rating || 0}</span>
                            <span className="text-muted-foreground text-sm">
                              ({vendor.reviews_count || 0})
                            </span>
                          </div>
                          <span className="text-muted-foreground font-medium">
                            {vendor.price_range || '$$'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-primary rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Are You a Service Provider?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Join BookFarm and connect with thousands of customers looking for your services.
            </p>
            <Link to="/register?type=vendor">
              <Button variant="hero" size="lg">
                Become a Vendor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
