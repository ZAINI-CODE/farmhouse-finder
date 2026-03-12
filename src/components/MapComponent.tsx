import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const lahoreCenter: [number, number] = [31.5204, 74.3587];

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
  "wapda town": [31.4167, 74.2733],
  "township": [31.4800, 74.2800],
  "faisalabad": [31.4504, 73.1350],
  "islamabad": [33.6844, 73.0479],
  "rawalpindi": [33.6007, 73.0679],
  "karachi": [24.8607, 67.0011],
  "multan": [30.1575, 71.5249],
  "peshawar": [34.0151, 71.5249],
  "lahore cantt": [31.5298, 74.3845],
};

function getCoordinates(location: string): [number, number] {
  const lower = (location || "").toLowerCase();
  for (const [key, coords] of Object.entries(locationCoords)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  return lahoreCenter; // Default to Lahore
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 14);
  }, [position, map]);
  return null;
}

interface MapComponentProps {
  location: string;
  address?: string | null;
  title: string;
}

export function MapComponent({ location, address, title }: MapComponentProps) {
  const coords = getCoordinates(location);
  const displayAddress = address || location;

  const handleGetDirections = () => {
    const query = encodeURIComponent(displayAddress);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="space-y-3">
      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border shadow-sm">
        <MapContainer
          center={coords}
          zoom={14}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap position={coords} />
          <Marker position={coords}>
            <Popup>
              <div className="p-1">
                <strong className="block mb-1">{title}</strong>
                <span className="text-sm text-gray-600">{displayAddress}</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleGetDirections}
        className="gap-2"
      >
        <Navigation className="h-4 w-4" />
        Get Directions
      </Button>
    </div>
  );
}
