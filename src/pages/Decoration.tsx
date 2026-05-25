import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Star, Search, ArrowRight, Flower2, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const decorationVendors = [
  {
    id: "4",
    name: "Fatima's Floral Designs",
    location: "Gulberg III, Lahore",
    rating: 4.9,
    reviews: 178,
    price: "From PKR 80,000",
    description: "Transform your venue into a magical wonderland. Specializing in floral installations and lighting.",
    tags: ["Floral", "Lighting", "Theme Design"],
    featured: true,
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600",
    style: ["Romantic", "Luxury"],
  },
  {
    id: "18",
    name: "Asad Event Decorators",
    location: "DHA Phase 6, Lahore",
    rating: 4.8,
    reviews: 234,
    price: "From PKR 120,000",
    description: "Creating unforgettable atmospheres. From intimate gatherings to grand celebrations.",
    tags: ["Grand", "Theatrical", "Custom"],
    featured: true,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
    style: ["Dramatic", "Glamorous"],
  },
  {
    id: "19",
    name: "Nadia's Traditional Decor",
    location: "Model Town, Lahore",
    rating: 4.7,
    reviews: 156,
    price: "From PKR 50,000",
    description: "Bringing warmth and tradition to your events. Mehndi, baraat, and walima specialists.",
    tags: ["Traditional", "Mehndi", "Baraat"],
    featured: false,
    image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=600",
    style: ["Traditional", "Cultural"],
  },
  {
    id: "20",
    name: "Modern Touch Events",
    location: "Johar Town, Lahore",
    rating: 4.9,
    reviews: 145,
    price: "From PKR 90,000",
    description: "Clean lines, elegant simplicity. Modern decor that makes a sophisticated statement.",
    tags: ["Modern", "Minimalist", "Contemporary"],
    featured: false,
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600",
    style: ["Modern", "Minimal"],
  },
  {
    id: "21",
    name: "Zahid Garden Decorations",
    location: "Bahria Town, Lahore",
    rating: 4.8,
    reviews: 189,
    price: "From PKR 70,000",
    description: "Outdoor garden specialists. Lush greenery, fairy lights, and vibrant colors.",
    tags: ["Outdoor", "Garden", "Natural"],
    featured: true,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    style: ["Garden", "Natural"],
  },
  {
    id: "22",
    name: "Royal Palace Decor",
    location: "Cantt, Lahore",
    rating: 4.9,
    reviews: 167,
    price: "From PKR 150,000",
    description: "Timeless beauty and sophistication. Classic designs inspired by Mughal heritage.",
    tags: ["Classic", "Elegant", "Timeless"],
    featured: false,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600",
    style: ["Classic", "Royal"],
  },
];

export default function Decoration() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = decorationVendors.filter((vendor) =>
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
        <div className="bg-gradient-to-br from-pink-500/10 via-background to-background py-12 mb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                <Flower2 className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-foreground"
                >
                  Decoration Services
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  Transform your venue into a dream setting in Lahore
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
                placeholder="Search by style, location, or theme..."
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
            {["All", "Floral", "Traditional", "Modern", "Classic", "Outdoor", "Mehndi"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mb-6">
            Showing {filteredVendors.length} decoration services
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
                            className="text-xs bg-pink-500/10 text-pink-700 px-2 py-1 rounded-md"
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
