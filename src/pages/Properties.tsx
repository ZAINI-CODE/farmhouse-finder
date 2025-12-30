import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  MapPin, Users, Star, Heart, Search, SlidersHorizontal, 
  Grid3X3, List, X 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const allProperties = [
  {
    id: "1",
    title: "Royal Garden Farmhouse",
    location: "DHA Phase 6, Lahore",
    price: 85000,
    rating: 4.9,
    reviews: 127,
    guests: 150,
    image: property1,
    badge: "Featured",
    amenities: ["Pool", "Garden", "Catering", "Parking"],
    type: "Estate",
  },
  {
    id: "2",
    title: "Green Valley Resort",
    location: "Bedian Road, Lahore",
    price: 65000,
    rating: 4.8,
    reviews: 89,
    guests: 200,
    image: property2,
    badge: "Popular",
    amenities: ["Indoor", "Outdoor", "Parking", "Kitchen"],
    type: "Barn",
  },
  {
    id: "3",
    title: "Raiwind Gardens",
    location: "Raiwind Road, Lahore",
    price: 120000,
    rating: 5.0,
    reviews: 64,
    guests: 300,
    image: property3,
    badge: "New",
    amenities: ["Views", "Fire Pit", "Kitchen", "WiFi"],
    type: "Farmhouse",
  },
  {
    id: "4",
    title: "Pearl Continental Farmhouse",
    location: "Canal Road, Lahore",
    price: 45000,
    rating: 4.7,
    reviews: 156,
    guests: 80,
    image: property4,
    amenities: ["Garden", "Gazebo", "Lights", "Parking"],
    type: "Cottage",
  },
  {
    id: "5",
    title: "Bahria Orchards Villa",
    location: "Bahria Orchard, Lahore",
    price: 95000,
    rating: 4.9,
    reviews: 92,
    guests: 120,
    image: property1,
    amenities: ["Mountain Views", "Stables", "Pool", "BBQ"],
    type: "Ranch",
  },
  {
    id: "6",
    title: "Lake City Retreat",
    location: "Lake City, Lahore",
    price: 150000,
    rating: 5.0,
    reviews: 45,
    guests: 250,
    image: property3,
    badge: "Premium",
    amenities: ["Lake Access", "Dock", "Kayaks", "Hot Tub"],
    type: "Estate",
  },
];

const propertyTypes = ["All", "Estate", "Barn", "Farmhouse", "Cottage", "Ranch"];
const amenitiesOptions = ["Pool", "Garden", "Kitchen", "Parking", "WiFi", "Fire Pit", "Views", "Hot Tub"];

export default function Properties() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || property.type === selectedType;
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesAmenities = selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => property.amenities.includes(amenity));
    return matchesSearch && matchesType && matchesPrice && matchesAmenities;
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
              Discover {filteredProperties.length} stunning venues for your next event
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
              
              <div className="flex gap-3">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                  {(selectedType !== "All" || selectedAmenities.length > 0) && (
                    <Badge className="ml-2 bg-accent text-accent-foreground">
                      {(selectedType !== "All" ? 1 : 0) + selectedAmenities.length}
                    </Badge>
                  )}
                </Button>
                
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
                  >
                    <List className="h-5 w-5" />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Property Type */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Property Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedType === type
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Price Range: Rs. {priceRange[0].toLocaleString()} - Rs. {priceRange[1].toLocaleString()}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000}
                      step={5000}
                      className="mt-4"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Amenities
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {amenitiesOptions.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAmenities([...selectedAmenities, amenity]);
                              } else {
                                setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                              }
                            }}
                          />
                          {amenity}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedType !== "All" || selectedAmenities.length > 0 || priceRange[0] > 0 || priceRange[1] < 200000) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedType("All");
                        setSelectedAmenities([]);
                        setPriceRange([0, 200000]);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Properties Grid/List */}
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
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {property.badge && (
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">
                          {property.badge}
                        </Badge>
                      )}
                      
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-card transition-all">
                        <Heart className="h-5 w-5" />
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

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-medium text-foreground">{property.rating}</span>
                            <span className="text-muted-foreground text-sm">
                              ({property.reviews})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{property.guests}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-heading font-bold text-lg text-primary">
                            Rs. {property.price.toLocaleString()}
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

          {filteredProperties.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setSelectedAmenities([]);
                  setPriceRange([0, 200000]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
