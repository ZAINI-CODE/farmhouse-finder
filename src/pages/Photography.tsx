import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Star, Search, ArrowRight, Camera, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const photographyVendors = [
  {
    id: "2",
    name: "Lens & Light Photography",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviews: 189,
    price: "From $2,500",
    description: "Capturing your special moments with artistic excellence. Award-winning wedding and event photography.",
    tags: ["Weddings", "Portraits", "Events"],
    featured: true,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    style: ["Candid", "Artistic"],
  },
  {
    id: "13",
    name: "Moment Makers Studio",
    location: "New York, NY",
    rating: 4.9,
    reviews: 245,
    price: "From $3,500",
    description: "Documentary-style photography that tells your story. Specializing in luxury weddings.",
    tags: ["Documentary", "Luxury", "Editorial"],
    featured: true,
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600",
    style: ["Documentary", "Editorial"],
  },
  {
    id: "14",
    name: "Sunshine Photography",
    location: "Miami, FL",
    rating: 4.8,
    reviews: 178,
    price: "From $1,800",
    description: "Bright, airy, and joyful photography. Capturing the happiness of your celebrations.",
    tags: ["Bright", "Natural", "Joyful"],
    featured: false,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
    style: ["Light & Airy", "Natural"],
  },
  {
    id: "15",
    name: "Classic Moments",
    location: "Chicago, IL",
    rating: 4.9,
    reviews: 201,
    price: "From $2,200",
    description: "Timeless, elegant photography with a classic touch. Beautiful images that last forever.",
    tags: ["Classic", "Elegant", "Timeless"],
    featured: false,
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
    style: ["Classic", "Elegant"],
  },
  {
    id: "16",
    name: "Urban Edge Photos",
    location: "San Francisco, CA",
    rating: 4.7,
    reviews: 134,
    price: "From $2,000",
    description: "Modern, edgy photography for couples who dare to be different. City vibes and bold colors.",
    tags: ["Modern", "Urban", "Bold"],
    featured: false,
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
    style: ["Modern", "Edgy"],
  },
  {
    id: "17",
    name: "Nature's Frame",
    location: "Denver, CO",
    rating: 4.9,
    reviews: 156,
    price: "From $2,800",
    description: "Outdoor and destination photography specialists. Mountains, beaches, and everywhere in between.",
    tags: ["Outdoor", "Destination", "Adventure"],
    featured: true,
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600",
    style: ["Outdoor", "Adventure"],
  },
];

export default function Photography() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = photographyVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.style.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-500/10 via-background to-background py-12 mb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-foreground"
                >
                  Photography Services
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  Capture your special moments forever
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
                placeholder="Search by style, location, or specialty..."
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
            {["All", "Candid", "Documentary", "Classic", "Modern", "Outdoor", "Editorial"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mb-6">
            Showing {filteredVendors.length} photographers
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
                    <div className="relative aspect-[4/3] overflow-hidden">
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
                        <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
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
                        {vendor.style.map((style) => (
                          <span
                            key={style}
                            className="text-xs bg-blue-500/10 text-blue-700 px-2 py-1 rounded-md"
                          >
                            {style}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="font-heading font-bold text-primary">
                          {vendor.price}
                        </span>
                        <Button variant="ghost" size="sm" className="group/btn">
                          View Portfolio
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
