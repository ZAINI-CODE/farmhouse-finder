import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Star, Search, ArrowRight, CalendarCheck, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const eventPlanners = [
  {
    id: "ep-1",
    name: "Ayesha's Elite Events",
    location: "Gulberg III, Lahore",
    rating: 5.0,
    reviews: 287,
    price: "Rs. 100,000-500,000",
    description: "Full-service luxury event planning for high-end weddings and corporate galas. White-glove service guaranteed.",
    tags: ["Luxury", "Weddings", "Corporate"],
    featured: true,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
    specialties: ["Weddings", "Galas", "Corporate"],
  },
  {
    id: "ep-2",
    name: "Shadi Planners by Sana",
    location: "DHA Phase 6, Lahore",
    rating: 4.9,
    reviews: 234,
    price: "Rs. 60,000-250,000",
    description: "Making wedding dreams come true since 2010. Complete shadi planning from mehndi to walima.",
    tags: ["Weddings", "Romantic", "Personalized"],
    featured: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
    specialties: ["Weddings", "Engagements", "Dholki"],
  },
  {
    id: "ep-3",
    name: "Corporate Connect Lahore",
    location: "Main Boulevard, Lahore",
    rating: 4.8,
    reviews: 189,
    price: "Rs. 150,000-800,000",
    description: "Specialized in corporate conferences, product launches, and team building events.",
    tags: ["Corporate", "Conferences", "Team Building"],
    featured: false,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    specialties: ["Conferences", "Launches", "Corporate"],
  },
  {
    id: "ep-4",
    name: "Dawat-e-Khas",
    location: "Model Town, Lahore",
    rating: 4.9,
    reviews: 312,
    price: "Rs. 45,000-180,000",
    description: "Bringing vibrant celebrations to life! Specializing in mehndi, dholki, and cultural events.",
    tags: ["Mehndi", "Cultural", "Fun"],
    featured: true,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
    specialties: ["Mehndi", "Dholki", "Cultural"],
  },
  {
    id: "ep-5",
    name: "Green Garden Events",
    location: "Bahria Town, Lahore",
    rating: 4.7,
    reviews: 156,
    price: "Rs. 35,000-150,000",
    description: "Outdoor event specialists. Beautiful garden parties, daytime events, and eco-friendly celebrations.",
    tags: ["Outdoor", "Garden", "Daytime"],
    featured: false,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    specialties: ["Garden Events", "Outdoor", "Daytime"],
  },
  {
    id: "ep-6",
    name: "Milestone Moments Pakistan",
    location: "Johar Town, Lahore",
    rating: 4.8,
    reviews: 198,
    price: "Rs. 25,000-120,000",
    description: "Celebrating life's biggest moments. From aqeeqah to retirement parties, we do it all.",
    tags: ["Life Events", "Intimate", "Personal"],
    featured: false,
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600",
    specialties: ["Aqeeqah", "Anniversaries", "Birthdays"],
  },
];

export default function EventPlanning() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = eventPlanners.filter((vendor) =>
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
        <div className="bg-gradient-to-br from-blue-500/10 via-background to-background py-12 mb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <CalendarCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-foreground"
                >
                  Event Planning Services
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  Professional planners for any occasion in Lahore
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
                placeholder="Search by event type, location, or specialty..."
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
            {["All", "Weddings", "Corporate", "Mehndi", "Cultural", "Outdoor", "Luxury"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-accent-foreground transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mb-6">
            Showing {filteredVendors.length} event planning services
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
                            className="text-xs bg-blue-500/10 text-blue-700 px-2 py-1 rounded-md"
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
