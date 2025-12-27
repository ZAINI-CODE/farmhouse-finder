import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Users, Star, Heart, Share2, Calendar, ChevronLeft,
  ChevronRight, Check, Wifi, Car, UtensilsCrossed, Flower2,
  TreePine, Waves, Flame, Camera
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const propertyData = {
  id: "1",
  title: "Sunset Valley Estate",
  location: "Napa Valley, California",
  address: "1234 Vineyard Road, Napa Valley, CA 94558",
  price: 1500,
  rating: 4.9,
  reviews: 127,
  guests: 150,
  images: [property1, property2, property3, property4],
  badge: "Featured",
  description: `Experience the magic of Napa Valley at our stunning Sunset Valley Estate. This beautifully restored farmhouse offers the perfect blend of rustic charm and modern luxury, making it an ideal venue for weddings, corporate retreats, and special celebrations.

Set on 50 acres of rolling vineyards, the estate features breathtaking panoramic views, multiple outdoor event spaces, and a historic barn that has been transformed into an elegant reception hall. The property can accommodate up to 150 guests for seated events or 200 for cocktail-style gatherings.`,
  amenities: [
    { icon: Waves, name: "Swimming Pool", description: "Heated pool with lounging area" },
    { icon: Flower2, name: "Garden", description: "Manicured gardens and lawns" },
    { icon: UtensilsCrossed, name: "Full Kitchen", description: "Commercial-grade kitchen" },
    { icon: Car, name: "Parking", description: "Parking for 100+ vehicles" },
    { icon: Wifi, name: "WiFi", description: "High-speed internet throughout" },
    { icon: Flame, name: "Fire Pit", description: "Outdoor fire pit area" },
    { icon: TreePine, name: "Nature Trails", description: "Walking trails on property" },
    { icon: Camera, name: "Photo Spots", description: "Scenic photo locations" },
  ],
  host: {
    name: "Sarah Johnson",
    avatar: "SJ",
    joined: "2019",
    responseRate: "98%",
    responseTime: "within 1 hour",
  },
  reviews_list: [
    {
      id: 1,
      name: "Emily & James",
      avatar: "EJ",
      rating: 5,
      date: "October 2024",
      text: "Our wedding here was absolutely magical! Sarah was incredibly helpful and the venue exceeded all our expectations. The sunset views were breathtaking.",
    },
    {
      id: 2,
      name: "Corporate Events Inc",
      avatar: "CE",
      rating: 5,
      date: "September 2024",
      text: "Perfect venue for our company retreat. The facilities were excellent and the staff made everything run smoothly.",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      avatar: "MR",
      rating: 5,
      date: "August 2024",
      text: "Hosted my daughter's quinceañera here. The garden was beautiful and all our guests were impressed!",
    },
  ],
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % propertyData.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-foreground transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-foreground">{propertyData.title}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {propertyData.badge && (
                  <Badge className="bg-accent text-accent-foreground">{propertyData.badge}</Badge>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{propertyData.rating}</span>
                  <span className="text-muted-foreground">({propertyData.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                {propertyData.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{propertyData.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-destructive border-destructive" : ""}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                Save
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={propertyData.images[currentImage]}
                alt={propertyData.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {propertyData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImage
                      ? "bg-accent w-8"
                      : "bg-card/60 hover:bg-card"
                  }`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
              {currentImage + 1} / {propertyData.images.length}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Capacity", value: `${propertyData.guests} guests` },
                  { label: "Price", value: `$${propertyData.price}/day` },
                  { label: "Rating", value: propertyData.rating.toString() },
                  { label: "Reviews", value: propertyData.reviews.toString() },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-secondary rounded-xl p-4 text-center"
                  >
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-4">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {propertyData.description}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-6">Amenities & Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {propertyData.amenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <amenity.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{amenity.name}</p>
                        <p className="text-xs text-muted-foreground">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Host */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-6">Hosted By</h2>
                <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {propertyData.host.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{propertyData.host.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Hosting since {propertyData.host.joined}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Check className="h-4 w-4 text-accent" />
                        {propertyData.host.responseRate} response rate
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="h-4 w-4 text-accent" />
                        Responds {propertyData.host.responseTime}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline">Contact Host</Button>
                </div>
              </div>

              <Separator />

              {/* Reviews */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-6">
                  Reviews ({propertyData.reviews})
                </h2>
                <div className="space-y-4">
                  {propertyData.reviews_list.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 bg-card rounded-xl border border-border"
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-semibold">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{review.name}</h4>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Show All Reviews
                </Button>
              </div>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="font-heading text-3xl font-bold text-foreground">
                        ${propertyData.price}
                      </span>
                      <span className="text-muted-foreground">/day</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-accent text-accent" />
                      <span className="font-semibold">{propertyData.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Event Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="date" className="pl-10" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Number of Guests</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="Enter guest count"
                          min="1"
                          max={propertyData.guests}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="xl"
                    className="w-full mb-4"
                    onClick={() => navigate(`/booking/${id || '1'}`)}
                  >
                    Request to Book
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mb-4">
                    You won't be charged yet
                  </p>

                  <Separator className="my-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base price</span>
                      <span>${propertyData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>${Math.round(propertyData.price * 0.1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>${propertyData.price + Math.round(propertyData.price * 0.1)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-accent/10 rounded-xl text-center">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">🔥 Popular venue!</span> Booked 5 times in the last week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
