import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, MapPin, Star, ArrowLeft, Building2, Briefcase, Loader2, Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_day: number;
  images: string[];
  rating: number;
  reviews_count: number;
}

interface Vendor {
  id: string;
  business_name: string;
  location: string;
  category: string;
  price_range: string;
  images: string[];
  rating: number;
  reviews_count: number;
}

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const propertyFavorites = favorites.filter(f => f.itemType === 'property');
  const vendorFavorites = favorites.filter(f => f.itemType === 'vendor');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      if (favorites.length === 0) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);

      // Fetch favorite properties
      const propertyIds = propertyFavorites.map(f => f.itemId);
      if (propertyIds.length > 0) {
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id, title, location, price_per_day, images, rating, reviews_count')
          .in('id', propertyIds);
        
        if (propertiesData) {
          setProperties(propertiesData);
        }
      } else {
        setProperties([]);
      }

      // Fetch favorite vendors
      const vendorIds = vendorFavorites.map(f => f.itemId);
      if (vendorIds.length > 0) {
        const { data: vendorsData } = await supabase
          .from('vendors')
          .select('id, business_name, location, category, price_range, images, rating, reviews_count')
          .in('id', vendorIds);
        
        if (vendorsData) {
          setVendors(vendorsData);
        }
      } else {
        setVendors([]);
      }

      setLoadingData(false);
    };

    if (!favoritesLoading) {
      fetchFavoriteItems();
    }
  }, [favorites, favoritesLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isLoading = favoritesLoading || loadingData;

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                My Favorites
              </h1>
              <p className="text-muted-foreground mt-1">
                Your saved properties and vendors
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="properties" className="gap-2">
                <Building2 className="w-4 h-4" />
                Properties ({propertyFavorites.length})
              </TabsTrigger>
              <TabsTrigger value="vendors" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Vendors ({vendorFavorites.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No saved properties</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring and save properties you love!
                  </p>
                  <Button onClick={() => navigate('/properties')}>
                    Browse Properties
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-sm overflow-hidden group">
                        <div className="relative">
                          <img
                            src={property.images?.[0] || '/placeholder.svg'}
                            alt={property.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(property.id, 'property');
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-background/90 rounded-full shadow-md hover:bg-white dark:hover:bg-background transition-colors"
                          >
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{property.rating || 0}</span>
                              <span className="text-muted-foreground">({property.reviews_count || 0})</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                            <MapPin className="w-3 h-3" /> {property.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-accent">
                              PKR {property.price_per_day?.toLocaleString()}/day
                            </span>
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/properties/${property.id}`}>View</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="vendors">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : vendors.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No saved vendors</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring and save vendors you love!
                  </p>
                  <Button onClick={() => navigate('/services')}>
                    Browse Services
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendors.map((vendor, index) => (
                    <motion.div
                      key={vendor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-sm overflow-hidden group">
                        <div className="relative">
                          <img
                            src={vendor.images?.[0] || '/placeholder.svg'}
                            alt={vendor.business_name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(vendor.id, 'vendor');
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-background/90 rounded-full shadow-md hover:bg-white dark:hover:bg-background transition-colors"
                          >
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          </button>
                          <Badge className="absolute top-3 left-3 bg-background/90">
                            {vendor.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {vendor.business_name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{vendor.rating || 0}</span>
                              <span className="text-muted-foreground">({vendor.reviews_count || 0})</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                            <MapPin className="w-3 h-3" /> {vendor.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-muted-foreground">
                              {vendor.price_range || 'Contact for price'}
                            </span>
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/services/${vendor.id}`}>View</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
