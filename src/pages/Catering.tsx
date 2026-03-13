import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Star, Search, ArrowRight, UtensilsCrossed, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const cateringVendors = [
  {
    id: "1",
    name: "Rahim's Royal Catering",
    location: "Gulberg III, Lahore",
    rating: 4.9,
    reviews: 234,
    price: "Rs. 1,500-3,500/person",
    description: "Award-winning catering with traditional Pakistani cuisine. Perfect for weddings and corporate events.",
    tags: ["Pakistani", "Weddings", "Corporate"],
    featured: true,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600",
    specialties: ["Biryani", "BBQ"],
  },
  {
    id: "7",
    name: "Sultan's Kitchen",
    location: "DHA Phase 5, Lahore",
    rating: 4.8,
    reviews: 167,
    price: "Rs. 1,200-2,800/person",
    description: "Authentic Mughlai cuisine for your special events. Traditional recipes with fresh ingredients.",
    tags: ["Mughlai", "Continental", "Buffet"],
    featured: false,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600",
    specialties: ["Mughlai", "Continental"],
  },
  {
    id: "9",
    name: "Ahmed's BBQ House",
    location: "Model Town, Lahore",
    rating: 4.7,
    reviews: 145,
    price: "Rs. 800-2,000/person",
    description: "Famous for tikka, seekh kebab and traditional BBQ. Specializing in outdoor events.",
    tags: ["BBQ", "Tikka", "Outdoor"],
    featured: true,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    specialties: ["BBQ", "Tikka"],
  },
  {
    id: "10",
    name: "Karachi Biryani Masters",
    location: "Johar Town, Lahore",
    rating: 4.9,
    reviews: 312,
    price: "Rs. 600-1,500/person",
    description: "Authentic Karachi-style biryani and pulao. Serving Lahore for over 25 years.",
    tags: ["Biryani", "Pulao", "Traditional"],
    featured: false,
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600",
    specialties: ["Biryani", "Pulao"],
  },
  {
    id: "11",
    name: "Nihari House Catering",
    location: "Old Anarkali, Lahore",
    rating: 4.8,
    reviews: 189,
    price: "Rs. 1,000-2,500/person",
    description: "Traditional Lahori breakfast and lunch catering. Famous nihari, halwa puri, and more.",
    tags: ["Traditional", "Lahori", "Breakfast"],
    featured: false,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    specialties: ["Nihari", "Lahori"],
  },
  {
    id: "12",
    name: "Bismillah Dawat",
    location: "Garden Town, Lahore",
    rating: 4.9,
    reviews: 156,
    price: "Rs. 900-2,200/person",
    description: "Complete wedding and event catering solutions. Halal, hygienic, and delicious.",
    tags: ["Halal", "Weddings", "Events"],
    featured: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    specialties: ["Pakistani", "Halal"],
  },
];

export default function Catering() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = cateringVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-500/10 via-background to-background py-12 mb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <UtensilsCrossed className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-foreground"
                >
                  Catering Services
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  Find the perfect caterer for your event in Lahore
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by cuisine, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl"
              />
            </div>
            <Button variant="outline" className="h-12">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["All", "Biryani", "BBQ", "Mughlai", "Traditional", "Continental", "Lahori"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-accent-foreground transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mb-6">
            Showing {filteredVendors.length} catering services
          </p>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/services/${vendor.id}`}>
                  <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {vendor.featured && (
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium">{vendor.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        {vendor.location}
                        <span className="text-muted-foreground/60">•</span>
                        <span>{vendor.reviews} reviews</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {vendor.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {vendor.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-xs bg-orange-500/10 text-orange-700 px-2 py-1 rounded-md"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="font-heading font-bold text-accent">
                          {vendor.price}
                        </span>
                        <Button variant="ghost" size="sm" className="group/btn">
                          View Details
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
