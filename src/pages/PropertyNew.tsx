import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, MapPin, Users, Bed, Bath, IndianRupee, Loader2
} from 'lucide-react';

const amenitiesList = [
  'Parking', 'Swimming Pool', 'Garden', 'Kitchen', 'BBQ Area',
  'Air Conditioning', 'Wi-Fi', 'Sound System', 'Stage', 'Restrooms',
  'Power Backup', 'Security', 'CCTV', 'Catering Kitchen', 'Changing Rooms'
];

const PropertyNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    price_per_day: '',
    max_guests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    images: [] as string[],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to list a property",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.location || !formData.price_per_day) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image of your property",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('properties')
      .insert({
        owner_id: user.id,
        title: formData.title,
        description: formData.description || null,
        location: formData.location,
        address: formData.address || null,
        price_per_day: parseFloat(formData.price_per_day),
        max_guests: formData.max_guests ? parseInt(formData.max_guests) : 50,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 1,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 1,
        amenities: formData.amenities,
        images: formData.images,
        is_active: true,
      });

    setSaving(false);

    if (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Property Listed!",
      description: "Your property has been successfully listed.",
    });
    navigate('/owner/admin');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              List Your Property
            </h1>
            <p className="text-muted-foreground mt-2">
              Add your farmhouse or venue to reach thousands of event organizers
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Royal Garden Farmhouse"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property, its features, and what makes it special..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (City) *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          className="pl-10"
                          placeholder="e.g., Lahore"
                          value={formData.location}
                          onChange={(e) => updateFormData('location', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Day (PKR) *</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          className="pl-10"
                          placeholder="50000"
                          value={formData.price_per_day}
                          onChange={(e) => updateFormData('price_per_day', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Max Guests</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="guests"
                          type="number"
                          className="pl-10"
                          placeholder="100"
                          value={formData.max_guests}
                          onChange={(e) => updateFormData('max_guests', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <div className="relative">
                        <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="bedrooms"
                          type="number"
                          className="pl-10"
                          placeholder="3"
                          value={formData.bedrooms}
                          onChange={(e) => updateFormData('bedrooms', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <div className="relative">
                        <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="bathrooms"
                          type="number"
                          className="pl-10"
                          placeholder="2"
                          value={formData.bathrooms}
                          onChange={(e) => updateFormData('bathrooms', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {amenitiesList.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label 
                          htmlFor={amenity} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Property Images *</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload high-quality photos of your property. The first image will be the cover photo.
                  </p>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    bucket="property-images"
                    images={formData.images}
                    onImagesChange={(images) => updateFormData('images', images)}
                    maxImages={10}
                  />
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Listing Property...
                    </>
                  ) : (
                    'List Property'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyNew;
