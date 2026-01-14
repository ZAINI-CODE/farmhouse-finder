import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { 
  MapPin, Users, Star, Heart, Search, SlidersHorizontal, 
  Grid3X3, List, X, CalendarIcon, Loader2, Map
} from "lucide-react";

// Lazy load map component to avoid SSR issues
const PropertyMap = lazy(() => import("@/components/properties/PropertyMap").then(m => ({ default: m.PropertyMap })));
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

// Fallback images for properties without images
const fallbackImages = [property1, property2, property3, property4];

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_day: number;
  rating: number | null;
  reviews_count: number | null;
  max_guests: number | null;
  images: string[] | null;
  amenities: string[] | null;
  description: string | null;
}

const amenitiesOptions = ["Pool", "Garden", "Kitchen", "Parking", "WiFi", "Fire Pit", "Views", "Hot Tub"];

export default function Properties() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [guestCapacity, setGuestCapacity] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, location, price_per_day, rating, reviews_count, max_guests, images, amenities, description')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  // Initialize filters from URL parameters
  useEffect(() => {
    const locationParam = searchParams.get("location");
    const dateParam = searchParams.get("date");
    if (locationParam) {
      setSearchQuery(locationParam);
    }
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
      }
    }
  }, [searchParams]);

  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    // Use fallback image based on property id hash for consistency
    const fallbackIndex = parseInt(property.id.replace(/\D/g, '').slice(0, 2) || '0') % fallbackImages.length;
    return fallbackImages[fallbackIndex];
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = property.price_per_day >= priceRange[0] && property.price_per_day <= priceRange[1];
    const matchesGuests = guestCapacity === 0 || (property.max_guests && property.max_guests >= guestCapacity);
    const matchesRating = minRating === 0 || (property.rating && property.rating >= minRating);
    const matchesAmenities = selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => property.amenities?.includes(amenity));
    return matchesSearch && matchesPrice && matchesGuests && matchesRating && matchesAmenities;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Explore Properties in Lahore
            </h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading properties...' : `Discover ${filteredProperties.length} stunning venues for your next event`}
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 w-full lg:w-[200px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Event Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 shrink-0"
                  onClick={() => setSelectedDate(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                  {(selectedAmenities.length > 0 || guestCapacity > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 200000) && (
                    <Badge className="ml-2 bg-accent text-accent-foreground">
                      {selectedAmenities.length + (guestCapacity > 0 ? 1 : 0) + (minRating > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 200000 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                    title="Grid view"
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                    title="List view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-3 transition-colors ${viewMode === "map" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                    title="Map view"
                  >
                    <Map className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Price Range
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      PKR {priceRange[0].toLocaleString()} - PKR {priceRange[1].toLocaleString()}
                    </p>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000}
                      step={5000}
                      className="mt-2"
                    />
                  </div>

                  {/* Guest Capacity */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Minimum Guests
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      {guestCapacity === 0 ? 'Any capacity' : `At least ${guestCapacity} guests`}
                    </p>
                    <Slider
                      value={[guestCapacity]}
                      onValueChange={(val) => setGuestCapacity(val[0])}
                      max={500}
                      step={10}
                      className="mt-2"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Minimum Rating
                    </label>
                    <div className="flex gap-2 mt-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating)}
                          className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-colors",
                            minRating === rating
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border hover:border-primary"
                          )}
                        >
                          {rating === 0 ? (
                            "Any"
                          ) : (
                            <>
                              <Star className="h-3 w-3 fill-current" />
                              {rating}+
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesOptions.map((amenity) => (
                        <button
                          key={amenity}
                          onClick={() => {
                            if (selectedAmenities.includes(amenity)) {
                              setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                            } else {
                              setSelectedAmenities([...selectedAmenities, amenity]);
                            }
                          }}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-full border transition-colors",
                            selectedAmenities.includes(amenity)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border hover:border-primary"
                          )}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedAmenities.length > 0 || priceRange[0] > 0 || priceRange[1] < 200000 || guestCapacity > 0 || minRating > 0) && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {priceRange[0] > 0 || priceRange[1] < 200000 ? (
                        <Badge variant="secondary" className="gap-1">
                          Price: PKR {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 200000])} />
                        </Badge>
                      ) : null}
                      {guestCapacity > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          {guestCapacity}+ guests
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setGuestCapacity(0)} />
                        </Badge>
                      )}
                      {minRating > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          {minRating}+ stars
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setMinRating(0)} />
                        </Badge>
                      )}
                      {selectedAmenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="gap-1">
                          {amenity}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))} />
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAmenities([]);
                        setPriceRange([0, 200000]);
                        setGuestCapacity(0);
                        setMinRating(0);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Properties Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedAmenities([]);
                  setPriceRange([0, 200000]);
                  setGuestCapacity(0);
                  setMinRating(0);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "map" ? (
            <Suspense fallback={
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              <PropertyMap properties={filteredProperties} getPropertyImage={getPropertyImage} />
            </Suspense>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/properties/${property.id}`}>
                    <div className={`group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                      viewMode === "list" ? "flex" : ""
                    }`}>
                      {/* Image */}
                      <div className={`relative overflow-hidden ${
                        viewMode === "list" ? "w-80 shrink-0" : "aspect-[4/3]"
                      }`}>
                        <img
                          src={getPropertyImage(property)}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(property.id, 'property');
                          }}
                          className={cn(
                            "absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all",
                            isFavorite(property.id, 'property') 
                              ? "text-destructive" 
                              : "text-muted-foreground hover:text-destructive hover:bg-card"
                          )}
                        >
                          <Heart className={cn("h-5 w-5", isFavorite(property.id, 'property') && "fill-current")} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{property.location}</span>
                        </div>
                        
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>

                        {property.amenities && property.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {property.amenities.slice(0, 3).map((amenity) => (
                              <span
                                key={amenity}
                                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                              >
                                {amenity}
                              </span>
                            ))}
                            {property.amenities.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{property.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-medium text-foreground">{property.rating || 0}</span>
                              <span className="text-muted-foreground text-sm">
                                ({property.reviews_count || 0})
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{property.max_guests || 0}</span>
                            </div>
                          </div>
                          <div>
                            <span className="font-heading font-bold text-lg text-primary">
                              PKR {property.price_per_day.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground text-sm">/day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
