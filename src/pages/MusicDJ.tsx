import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Star, Search, ArrowRight, Music, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const djVendors = [
  {
    id: "dj-1",
    name: "DJ Soundwave",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 312,
    price: "$800-2000",
    description: "High-energy DJ with 15+ years experience. Specializing in weddings, corporate events, and festivals.",
    tags: ["Weddings", "Corporate", "Festivals"],
    featured: true,
    image: "https://images.unsplash.com/photo-1571266028243-d220c6a8b028?w=600",
    specialties: ["EDM", "Top 40", "Hip Hop"],
  },
  {
    id: "dj-2",
    name: "Melody Masters Band",
    location: "Nashville, TN",
    rating: 4.8,
    reviews: 189,
    price: "$2000-5000",
    description: "Live band experience with versatile repertoire. From jazz to rock, we set the perfect mood.",
    tags: ["Live Band", "Jazz", "Rock"],
    featured: true,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
    specialties: ["Live Music", "Jazz", "Rock"],
  },
  {
    id: "dj-3",
    name: "Beats by Marcus",
    location: "Atlanta, GA",
    rating: 4.9,
    reviews: 267,
    price: "$600-1500",
    description: "Urban music specialist with state-of-the-art sound equipment. Making parties unforgettable.",
    tags: ["Hip Hop", "R&B", "Urban"],
    featured: false,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600",
    specialties: ["Hip Hop", "R&B", "Trap"],
  },
  {
    id: "dj-4",
    name: "Classical Strings Quartet",
    location: "New York, NY",
    rating: 5.0,
    reviews: 156,
    price: "$1500-3500",
    description: "Elegant classical music for sophisticated events. Perfect for ceremonies and cocktail hours.",
    tags: ["Classical", "Ceremony", "Elegant"],
    featured: true,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600",
    specialties: ["Classical", "Chamber Music", "Ceremony"],
  },
  {
    id: "dj-5",
    name: "Fiesta Sound System",
    location: "Miami, FL",
    rating: 4.7,
    reviews: 234,
    price: "$500-1200",
    description: "Latin music experts bringing the heat to any celebration. Salsa, bachata, and reggaeton specialists.",
    tags: ["Latin", "Salsa", "Party"],
    featured: false,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
    specialties: ["Salsa", "Bachata", "Reggaeton"],
  },
  {
    id: "dj-6",
    name: "Acoustic Vibes Duo",
    location: "Denver, CO",
    rating: 4.8,
    reviews: 145,
    price: "$400-900",
    description: "Intimate acoustic performances for smaller gatherings. Guitar and vocals that create magic.",
    tags: ["Acoustic", "Intimate", "Duo"],
    featured: false,
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600",
    specialties: ["Acoustic", "Folk", "Indie"],
  },
];

export default function MusicDJ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = djVendors.filter((vendor) =>
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
        <div className="bg-gradient-to-br from-purple-500/10 via-background to-background py-12 mb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Music className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-foreground"
                >
                  Music & DJ Services
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  Find the perfect sound for your event
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
                placeholder="Search by genre, location, or style..."
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
            {["All", "DJ", "Live Band", "Classical", "Latin", "Acoustic", "EDM"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mb-6">
            Showing {filteredVendors.length} music & DJ services
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
                        {vendor.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-xs bg-purple-500/10 text-purple-700 px-2 py-1 rounded-md"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="font-heading font-bold text-primary">
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
