import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Star, Phone, Mail, Clock, Check, ArrowLeft,
  Calendar, MessageCircle, Share2, Heart, Award, Users,
  UtensilsCrossed, Camera, Music, Flower2, Cake, Sparkles
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const vendors: Record<string, {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  fullDescription: string;
  tags: string[];
  featured: boolean;
  phone: string;
  email: string;
  experience: string;
  eventsCompleted: number;
  services: { name: string; price: string; description: string }[];
  gallery: string[];
  reviewsList: { name: string; rating: number; date: string; comment: string }[];
}> = {
  "1": {
    id: "1",
    name: "Golden Fork Catering",
    category: "catering",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 234,
    price: "$$",
    description: "Award-winning catering with farm-to-table cuisine",
    fullDescription: "Golden Fork Catering has been serving the Bay Area for over 15 years, specializing in farm-to-table cuisine that celebrates local, seasonal ingredients. Our executive chef has worked in Michelin-starred restaurants and brings that expertise to every event we cater.",
    tags: ["Farm-to-Table", "Weddings", "Corporate"],
    featured: true,
    phone: "+1 (415) 555-0123",
    email: "events@goldenfork.com",
    experience: "15+ Years",
    eventsCompleted: 1200,
    services: [
      { name: "Basic Package", price: "$45/person", description: "3-course meal with appetizers and dessert" },
      { name: "Premium Package", price: "$75/person", description: "5-course meal with premium wines and live cooking station" },
      { name: "Luxury Experience", price: "$120/person", description: "Full 7-course tasting menu with sommelier service" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=600",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    ],
    reviewsList: [
      { name: "Sarah M.", rating: 5, date: "2 weeks ago", comment: "Absolutely incredible food! Our guests couldn't stop raving about the menu." },
      { name: "James K.", rating: 5, date: "1 month ago", comment: "Professional team, amazing presentation, and delicious flavors." },
      { name: "Emily R.", rating: 4, date: "2 months ago", comment: "Great service overall. Minor timing issues but the food was excellent." },
    ],
  },
  "2": {
    id: "2",
    name: "Lens & Light Photography",
    category: "photography",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviews: 189,
    price: "$$$",
    description: "Capturing your special moments with artistic excellence",
    fullDescription: "At Lens & Light, we believe every moment tells a story. Our team of award-winning photographers combines artistic vision with technical expertise to create stunning visual narratives of your most precious celebrations.",
    tags: ["Weddings", "Portraits", "Events"],
    featured: true,
    phone: "+1 (310) 555-0456",
    email: "hello@lensandlight.com",
    experience: "10+ Years",
    eventsCompleted: 800,
    services: [
      { name: "Essential Coverage", price: "$2,500", description: "6 hours of coverage, 300+ edited photos, online gallery" },
      { name: "Full Day Package", price: "$4,500", description: "10 hours, 600+ photos, engagement session included" },
      { name: "Premium Collection", price: "$7,500", description: "Full day + second photographer, album, prints" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
    ],
    reviewsList: [
      { name: "Jennifer L.", rating: 5, date: "1 week ago", comment: "The photos exceeded all our expectations. True artists!" },
      { name: "Michael D.", rating: 5, date: "3 weeks ago", comment: "Worth every penny. They captured moments we didn't even know happened." },
    ],
  },
  "3": {
    id: "3",
    name: "Beat Masters DJ",
    category: "music",
    location: "Austin, TX",
    rating: 4.8,
    reviews: 156,
    price: "$$",
    description: "Professional DJ services for all types of events",
    fullDescription: "Beat Masters DJ brings the energy and excitement to every event. With state-of-the-art equipment and an extensive music library spanning all genres, we ensure your dance floor stays packed all night long.",
    tags: ["Weddings", "Parties", "Corporate"],
    featured: false,
    phone: "+1 (512) 555-0789",
    email: "bookings@beatmasters.com",
    experience: "8+ Years",
    eventsCompleted: 600,
    services: [
      { name: "Basic DJ Package", price: "$800", description: "4 hours of DJ services with professional sound system" },
      { name: "Party Package", price: "$1,500", description: "6 hours, lighting effects, MC services" },
      { name: "Ultimate Experience", price: "$2,500", description: "8 hours, full production, live mixing" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600",
      "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=600",
    ],
    reviewsList: [
      { name: "Alex P.", rating: 5, date: "2 weeks ago", comment: "Amazing energy! Everyone was dancing all night." },
    ],
  },
  "4": {
    id: "4",
    name: "Bloom & Blossom Decor",
    category: "decoration",
    location: "Miami, FL",
    rating: 4.9,
    reviews: 178,
    price: "$$$",
    description: "Transform your venue into a magical wonderland",
    fullDescription: "Bloom & Blossom specializes in creating breathtaking event spaces. From intimate gatherings to grand celebrations, our design team crafts unique environments that reflect your vision and leave lasting impressions.",
    tags: ["Floral", "Lighting", "Theme Design"],
    featured: true,
    phone: "+1 (305) 555-0321",
    email: "design@bloomblossom.com",
    experience: "12+ Years",
    eventsCompleted: 950,
    services: [
      { name: "Essential Decor", price: "$2,000", description: "Basic floral arrangements and table settings" },
      { name: "Themed Package", price: "$5,000", description: "Full venue transformation with custom theme" },
      { name: "Luxury Design", price: "$10,000+", description: "Bespoke design with premium materials" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
    ],
    reviewsList: [
      { name: "Rachel S.", rating: 5, date: "1 month ago", comment: "Transformed our venue beyond imagination. Guests were speechless!" },
    ],
  },
  "5": {
    id: "5",
    name: "Sweet Delights Bakery",
    category: "bakery",
    location: "Chicago, IL",
    rating: 4.7,
    reviews: 203,
    price: "$$",
    description: "Custom cakes and desserts for every occasion",
    fullDescription: "Sweet Delights has been crafting memorable wedding cakes and event desserts for over a decade. Our pastry chefs combine classic techniques with modern creativity to deliver treats that taste as amazing as they look.",
    tags: ["Wedding Cakes", "Cupcakes", "Dessert Tables"],
    featured: false,
    phone: "+1 (312) 555-0654",
    email: "orders@sweetdelights.com",
    experience: "11+ Years",
    eventsCompleted: 1100,
    services: [
      { name: "Custom Cake", price: "$8/serving", description: "Traditional tiered wedding cake" },
      { name: "Dessert Bar", price: "$15/person", description: "Variety of mini desserts and treats" },
      { name: "Full Sweet Table", price: "$25/person", description: "Cake + dessert bar + candy station" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600",
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600",
    ],
    reviewsList: [
      { name: "Lisa M.", rating: 5, date: "3 weeks ago", comment: "The cake was stunning and delicious. Everyone asked for the bakery name!" },
    ],
  },
  "6": {
    id: "6",
    name: "Perfect Day Planning",
    category: "planning",
    location: "New York, NY",
    rating: 5.0,
    reviews: 145,
    price: "$$$",
    description: "Full-service event planning and coordination",
    fullDescription: "Perfect Day Planning takes the stress out of event planning. Our experienced coordinators handle every detail, from venue selection to day-of coordination, ensuring your event runs flawlessly.",
    tags: ["Weddings", "Corporate", "Luxury"],
    featured: true,
    phone: "+1 (212) 555-0987",
    email: "plan@perfectday.com",
    experience: "20+ Years",
    eventsCompleted: 500,
    services: [
      { name: "Day-of Coordination", price: "$2,000", description: "Vendor management and timeline execution" },
      { name: "Partial Planning", price: "$5,000", description: "3 months of planning support + day-of" },
      { name: "Full Service", price: "$10,000+", description: "Complete planning from start to finish" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600",
    ],
    reviewsList: [
      { name: "Amanda T.", rating: 5, date: "2 weeks ago", comment: "Made our wedding day absolutely perfect. Can't recommend enough!" },
    ],
  },
  "7": {
    id: "7",
    name: "Taste of Italy Catering",
    category: "catering",
    location: "Boston, MA",
    rating: 4.8,
    reviews: 167,
    price: "$$",
    description: "Authentic Italian cuisine for your special events",
    fullDescription: "Taste of Italy brings the warmth and flavors of authentic Italian cooking to your celebrations. Our chefs use traditional recipes passed down through generations, combined with the freshest local ingredients.",
    tags: ["Italian", "Mediterranean", "Buffet"],
    featured: false,
    phone: "+1 (617) 555-0147",
    email: "catering@tasteofitaly.com",
    experience: "18+ Years",
    eventsCompleted: 900,
    services: [
      { name: "Family Style", price: "$40/person", description: "Traditional Italian feast served family-style" },
      { name: "Plated Dinner", price: "$55/person", description: "Elegant 4-course plated dinner" },
      { name: "Pasta Bar", price: "$35/person", description: "Live pasta station with custom sauces" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600",
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600",
    ],
    reviewsList: [
      { name: "David R.", rating: 5, date: "1 month ago", comment: "Best Italian food we've ever had at an event. Authentic and delicious!" },
    ],
  },
  "8": {
    id: "8",
    name: "Rhythm & Soul Band",
    category: "music",
    location: "Nashville, TN",
    rating: 4.9,
    reviews: 98,
    price: "$$$",
    description: "Live band entertainment for memorable events",
    fullDescription: "Rhythm & Soul is Nashville's premier live event band. With versatile musicians who can play everything from jazz standards to modern hits, we bring unmatched energy and professionalism to every performance.",
    tags: ["Live Music", "Jazz", "Soul"],
    featured: false,
    phone: "+1 (615) 555-0258",
    email: "book@rhythmsoul.com",
    experience: "15+ Years",
    eventsCompleted: 450,
    services: [
      { name: "Cocktail Hour", price: "$1,500", description: "2-hour acoustic set for cocktails" },
      { name: "Reception Package", price: "$4,000", description: "4-hour performance with full band" },
      { name: "All Night Party", price: "$6,500", description: "6+ hours with DJ sets between breaks" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600",
      "https://images.unsplash.com/photo-1501612780327-45045538702b?w=600",
    ],
    reviewsList: [
      { name: "Chris W.", rating: 5, date: "3 weeks ago", comment: "Incredible musicians! The dance floor was packed all night." },
    ],
  },
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ElementType> = {
    catering: UtensilsCrossed,
    photography: Camera,
    music: Music,
    decoration: Flower2,
    bakery: Cake,
    planning: Sparkles,
  };
  return icons[category] || Sparkles;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    catering: "bg-orange-500/10 text-orange-600",
    photography: "bg-blue-500/10 text-blue-600",
    music: "bg-purple-500/10 text-purple-600",
    decoration: "bg-pink-500/10 text-pink-600",
    bakery: "bg-amber-500/10 text-amber-600",
    planning: "bg-emerald-500/10 text-emerald-600",
  };
  return colors[category] || "bg-primary/10 text-primary";
};

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const vendor = vendors[id || "1"];
  const [isFavorite, setIsFavorite] = useState(false);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 container mx-auto px-4">
          <p className="text-center text-muted-foreground">Vendor not found</p>
          <Link to="/services" className="block text-center mt-4">
            <Button variant="outline">Back to Services</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(vendor.category);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-6"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getCategoryColor(vendor.category)}`}>
                    <CategoryIcon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                          {vendor.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.location}</span>
                        </div>
                      </div>
                      {vendor.featured && (
                        <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{vendor.fullDescription}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Star className="h-5 w-5 mx-auto text-accent fill-accent mb-2" />
                    <p className="font-bold text-foreground">{vendor.rating}</p>
                    <p className="text-xs text-muted-foreground">{vendor.reviews} reviews</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Award className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="font-bold text-foreground">{vendor.experience}</p>
                    <p className="text-xs text-muted-foreground">Experience</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Users className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="font-bold text-foreground">{vendor.eventsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Clock className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="font-bold text-foreground">{vendor.price}</p>
                    <p className="text-xs text-muted-foreground">Price Range</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {vendor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Tabs defaultValue="services" className="bg-card rounded-2xl border border-border p-6">
                  <TabsList className="w-full grid grid-cols-3 mb-6">
                    <TabsTrigger value="services">Packages</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="services" className="space-y-4">
                    {vendor.services.map((service, index) => (
                      <div
                        key={index}
                        className="bg-secondary/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="font-heading font-semibold text-foreground">
                            {service.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-heading font-bold text-lg text-primary whitespace-nowrap">
                            {service.price}
                          </span>
                          <Button variant="outline" size="sm">
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="gallery">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vendor.gallery.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-xl overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`${vendor.name} gallery ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-4">
                    {vendor.reviewsList.map((review, index) => (
                      <div
                        key={index}
                        className="bg-secondary/30 rounded-xl p-5"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{review.name}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="ml-auto flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border p-6 sticky top-28"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Contact This Vendor
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">{vendor.email}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="accent" className="w-full" size="lg">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Check Availability
                  </Button>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-5 w-5 mr-2 ${isFavorite ? "fill-destructive text-destructive" : ""}`}
                    />
                    Save
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    Verified vendor
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Check className="h-4 w-4 text-primary" />
                    Response within 24 hours
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
