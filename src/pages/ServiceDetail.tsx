import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Star, Phone, Mail, Clock, Check, ArrowLeft,
  Calendar, MessageCircle, Share2, Heart, Award, Users,
  UtensilsCrossed, Camera, Music, Flower2, Cake, Sparkles, Loader2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";

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
  phone: string | null;
  email: string | null;
  website: string | null;
  images: string[] | null;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ElementType> = {
    catering: UtensilsCrossed,
    photography: Camera,
    music: Music,
    decoration: Flower2,
    bakery: Cake,
    planning: Sparkles,
  };
  return icons[category.toLowerCase()] || Sparkles;
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
  return colors[category.toLowerCase()] || "bg-primary/10 text-primary";
};

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching vendor:', error);
      } else {
        setVendor(data);
      }
      setLoading(false);
    };

    fetchVendor();
  }, [id]);

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

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">Vendor not found</p>
            <Link to="/services">
              <Button variant="outline">Back to Services</Button>
            </Link>
          </div>
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
                          {vendor.business_name}
                        </h1>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {vendor.is_verified && (
                          <Badge className="bg-accent text-accent-foreground">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  {vendor.description || 'No description available for this vendor.'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Star className="h-5 w-5 mx-auto text-accent fill-accent mb-2" />
                    <p className="font-bold text-foreground">{vendor.rating || 0}</p>
                    <p className="text-xs text-muted-foreground">{vendor.reviews_count || 0} reviews</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Award className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="font-bold text-foreground">{vendor.is_verified ? 'Verified' : 'Unverified'}</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Users className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="font-bold text-foreground capitalize">{vendor.category}</p>
                    <p className="text-xs text-muted-foreground">Category</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <Clock className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="font-bold text-foreground">{vendor.price_range || '$$'}</p>
                    <p className="text-xs text-muted-foreground">Price Range</p>
                  </div>
                </div>

                {/* Tags */}
                {vendor.specialties && vendor.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {vendor.specialties.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Gallery */}
              {vendor.images && vendor.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <h2 className="font-heading text-xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${vendor.business_name} - ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ReviewsSection
                  itemId={vendor.id}
                  itemType="vendor"
                  rating={vendor.rating}
                  reviewsCount={vendor.reviews_count}
                />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Contact Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="font-heading text-lg font-semibold mb-4">
                    Contact {vendor.business_name}
                  </h3>

                  <div className="space-y-4 mb-6">
                    {vendor.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{vendor.phone}</p>
                        </div>
                      </div>
                    )}

                    {vendor.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{vendor.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Calendar className="h-5 w-5 mr-2" />
                      Check Availability
                    </Button>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3"
                >
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleFavorite(vendor.id, 'vendor')}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite(vendor.id, 'vendor') ? 'fill-destructive text-destructive' : ''}`} />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
