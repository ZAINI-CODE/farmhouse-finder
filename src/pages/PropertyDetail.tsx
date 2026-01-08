import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Users, Star, Heart, Share2, Calendar, ChevronLeft,
  ChevronRight, Check, Wifi, Car, UtensilsCrossed, Flower2,
  TreePine, Waves, Flame, Camera, Loader2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const fallbackImages = [property1, property2, property3, property4];

const amenityIcons: Record<string, React.ElementType> = {
  "Pool": Waves,
  "Swimming Pool": Waves,
  "Garden": Flower2,
  "Kitchen": UtensilsCrossed,
  "Full Kitchen": UtensilsCrossed,
  "Parking": Car,
  "WiFi": Wifi,
  "Fire Pit": Flame,
  "Nature Trails": TreePine,
  "Photo Spots": Camera,
  "Views": TreePine,
  "Hot Tub": Waves,
};

interface Property {
  id: string;
  title: string;
  location: string;
  address: string | null;
  price_per_day: number;
  rating: number | null;
  reviews_count: number | null;
  max_guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  images: string[] | null;
  amenities: string[] | null;
  description: string | null;
  owner_id: string;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImage, setCurrentImage] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching property:', error);
      } else {
        setProperty(data);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  const getImages = () => {
    if (property?.images && property.images.length > 0) {
      return property.images;
    }
    return fallbackImages;
  };

  const images = getImages();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">Property not found</p>
            <Button onClick={() => navigate('/properties')}>
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const amenities = property.amenities || [];

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
            <span className="text-foreground">{property.title}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{property.rating || 0}</span>
                  <span className="text-muted-foreground">({property.reviews_count || 0} reviews)</span>
                </div>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleFavorite(property.id, 'property')}
                className={isFavorite(property.id, 'property') ? "text-destructive border-destructive" : ""}
              >
                <Heart className={`h-5 w-5 ${isFavorite(property.id, 'property') ? "fill-current" : ""}`} />
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
                src={images[currentImage]}
                alt={property.title}
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
              {images.map((_, index) => (
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
              {currentImage + 1} / {images.length}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Capacity", value: `${property.max_guests || 0} guests` },
                  { label: "Price", value: `PKR ${property.price_per_day.toLocaleString()}/day` },
                  { label: "Bedrooms", value: (property.bedrooms || 0).toString() },
                  { label: "Bathrooms", value: (property.bathrooms || 0).toString() },
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
                  {property.description || 'No description available for this property.'}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              {amenities.length > 0 && (
                <>
                  <div>
                    <h2 className="font-heading text-2xl font-semibold mb-6">Amenities & Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || Check;
                        return (
                          <div
                            key={amenity}
                            className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border"
                          >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                              <Icon className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{amenity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Location */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-4">Location</h2>
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{property.address || property.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="font-heading text-3xl font-bold text-foreground">
                        PKR {property.price_per_day.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/day</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-accent text-accent" />
                      <span className="font-semibold">{property.rating || 0}</span>
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
                          max={property.max_guests || 100}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="xl"
                    className="w-full mb-4"
                    onClick={() => navigate(`/booking/${property.id}`)}
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
                      <span>PKR {property.price_per_day.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>PKR {Math.round(property.price_per_day * 0.1).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>PKR {(property.price_per_day + Math.round(property.price_per_day * 0.1)).toLocaleString()}</span>
                    </div>
                  </div>
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
