import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  MapPin, Star, Search, ArrowRight,
  UtensilsCrossed, Camera, Music, Flower2, Cake, Sparkles
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "all", label: "All Services", icon: Sparkles },
  { id: "catering", label: "Catering", icon: UtensilsCrossed },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "music", label: "Music & DJ", icon: Music },
  { id: "decoration", label: "Decoration", icon: Flower2 },
  { id: "bakery", label: "Cakes & Bakery", icon: Cake },
  { id: "planning", label: "Event Planning", icon: Sparkles },
];

const vendors = [
  {
    id: "1",
    name: "Golden Fork Catering",
    category: "catering",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 234,
    price: "$$",
    description: "Award-winning catering with farm-to-table cuisine",
    tags: ["Farm-to-Table", "Weddings", "Corporate"],
    featured: true,
  },
  {
    id: "2",
    name: "Lens & Light Photography",
    category: "photography",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviews: 189,
    price: "$$$",
    description: "Capturing your special moments with artistic excellence",
    tags: ["Weddings", "Portraits", "Events"],
    featured: true,
  },
  {
    id: "3",
    name: "Beat Masters DJ",
    category: "music",
    location: "Austin, TX",
    rating: 4.8,
    reviews: 156,
    price: "$$",
    description: "Professional DJ services for all types of events",
    tags: ["Weddings", "Parties", "Corporate"],
  },
  {
    id: "4",
    name: "Bloom & Blossom Decor",
    category: "decoration",
    location: "Miami, FL",
    rating: 4.9,
    reviews: 178,
    price: "$$$",
    description: "Transform your venue into a magical wonderland",
    tags: ["Floral", "Lighting", "Theme Design"],
    featured: true,
  },
  {
    id: "5",
    name: "Sweet Delights Bakery",
    category: "bakery",
    location: "Chicago, IL",
    rating: 4.7,
    reviews: 203,
    price: "$$",
    description: "Custom cakes and desserts for every occasion",
    tags: ["Wedding Cakes", "Cupcakes", "Dessert Tables"],
  },
  {
    id: "6",
    name: "Perfect Day Planning",
    category: "planning",
    location: "New York, NY",
    rating: 5.0,
    reviews: 145,
    price: "$$$",
    description: "Full-service event planning and coordination",
    tags: ["Weddings", "Corporate", "Luxury"],
    featured: true,
  },
  {
    id: "7",
    name: "Taste of Italy Catering",
    category: "catering",
    location: "Boston, MA",
    rating: 4.8,
    reviews: 167,
    price: "$$",
    description: "Authentic Italian cuisine for your special events",
    tags: ["Italian", "Mediterranean", "Buffet"],
  },
  {
    id: "8",
    name: "Rhythm & Soul Band",
    category: "music",
    location: "Nashville, TN",
    rating: 4.9,
    reviews: 98,
    price: "$$$",
    description: "Live band entertainment for memorable events",
    tags: ["Live Music", "Jazz", "Soul"],
  },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory = activeCategory === "all" || vendor.category === activeCategory;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
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

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name, location, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base rounded-xl"
              />
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
            Showing {filteredVendors.length} service providers
          </p>

          {/* Vendors Grid */}
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
                          vendor.category === "catering" ? "bg-orange-500/10 text-orange-600" :
                          vendor.category === "photography" ? "bg-blue-500/10 text-blue-600" :
                          vendor.category === "music" ? "bg-purple-500/10 text-purple-600" :
                          vendor.category === "decoration" ? "bg-pink-500/10 text-pink-600" :
                          vendor.category === "bakery" ? "bg-amber-500/10 text-amber-600" :
                          "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          <CategoryIcon className="h-7 w-7" />
                        </div>
                        {vendor.featured && (
                          <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="font-heading font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                        {vendor.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        {vendor.location}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {vendor.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {vendor.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium">{vendor.rating}</span>
                          <span className="text-muted-foreground text-sm">
                            ({vendor.reviews})
                          </span>
                        </div>
                        <span className="text-muted-foreground font-medium">
                          {vendor.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filteredVendors.length === 0 && (
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
