import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { MapPin, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

interface PropertyMapProps {
  properties: Property[];
  getPropertyImage: (property: Property) => string;
}

// Geocode locations to coordinates (Lahore area coordinates)
const getCoordinates = (location: string, index: number): [number, number] => {
  // Default coordinates around Lahore with some variation
  const lahoreCenter: [number, number] = [31.5204, 74.3587];
  
  // Location mappings for common areas
  const locationCoords: Record<string, [number, number]> = {
    "lahore": [31.5204, 74.3587],
    "dha": [31.4697, 74.4035],
    "gulberg": [31.5088, 74.3426],
    "bahria": [31.3667, 74.1800],
    "model town": [31.4833, 74.3167],
    "johar town": [31.4615, 74.2960],
    "cantt": [31.5340, 74.3850],
    "defence": [31.4697, 74.4035],
    "garden town": [31.4972, 74.3330],
    "allama iqbal town": [31.4680, 74.2780],
  };
  
  // Try to match location
  const lowerLocation = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationCoords)) {
    if (lowerLocation.includes(key)) {
      // Add small random offset to prevent overlapping
      return [
        coords[0] + (Math.random() - 0.5) * 0.01,
        coords[1] + (Math.random() - 0.5) * 0.01,
      ];
    }
  }
  
  // Fallback with spread around Lahore center
  return [
    lahoreCenter[0] + (Math.random() - 0.5) * 0.08,
    lahoreCenter[1] + (Math.random() - 0.5) * 0.08,
  ];
};

export function PropertyMap({ properties, getPropertyImage }: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Center on Lahore
  const center: [number, number] = [31.5204, 74.3587];
  const zoom = 11;

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        ref={mapRef}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property, index) => {
          const coords = getCoordinates(property.location, index);
          return (
            <Marker key={property.id} position={coords} icon={customIcon}>
              <Popup className="property-popup" maxWidth={300} minWidth={250}>
                <Link to={`/properties/${property.id}`} className="block">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={getPropertyImage(property)}
                      alt={property.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {property.rating && property.rating > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              <span>{property.rating.toFixed(1)}</span>
                            </div>
                          )}
                          {property.max_guests && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{property.max_guests}</span>
                            </div>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          PKR {property.price_per_day.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
