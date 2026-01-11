import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, Plus, Pencil, Trash2, MapPin, Users, Bed, 
  IndianRupee, Loader2, Star, Eye, EyeOff
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string | null;
  location: string;
  address: string | null;
  price_per_day: number;
  max_guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[] | null;
  images: string[] | null;
  is_active: boolean | null;
  rating: number | null;
  reviews_count: number | null;
  created_at: string;
}

const PropertyManage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean | null) => {
    const { error } = await supabase
      .from('properties')
      .update({ is_active: !currentStatus })
      .eq('id', propertyId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Property ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
      fetchProperties();
    }
  };

  const deleteProperty = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', deleteId);

    if (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Property has been deleted",
      });
      fetchProperties();
    }
    setDeleting(false);
    setDeleteId(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/owner/admin')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Manage Properties
              </h1>
              <p className="text-muted-foreground mt-2">
                View, edit, and manage your listed properties
              </p>
            </div>
            <Button onClick={() => navigate('/properties/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Property
            </Button>
          </div>

          {/* Properties List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : properties.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Properties Listed
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't listed any properties yet. Start by adding your first property.
                  </p>
                  <Button onClick={() => navigate('/properties/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    List Your First Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                          <img
                            src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-foreground">
                                  {property.title}
                                </h3>
                                <Badge variant={property.is_active ? "default" : "secondary"}>
                                  {property.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-1 text-muted-foreground mb-3">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{property.location}</span>
                                {property.address && (
                                  <span className="text-sm"> • {property.address}</span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="w-4 h-4" />
                                  <span>{property.price_per_day.toLocaleString()}/day</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{property.max_guests || 50} guests</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Bed className="w-4 h-4" />
                                  <span>{property.bedrooms || 1} bedrooms</span>
                                </div>
                                {property.rating && property.rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{property.rating} ({property.reviews_count} reviews)</span>
                                  </div>
                                )}
                              </div>

                              {property.amenities && property.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {property.amenities.slice(0, 5).map((amenity) => (
                                    <Badge key={amenity} variant="outline" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {property.amenities.length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{property.amenities.length - 5} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row lg:flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/properties/${property.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/properties/edit/${property.id}`)}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePropertyStatus(property.id, property.is_active)}
                              >
                                {property.is_active ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteId(property.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
              All associated bookings will also be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteProperty}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Property'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default PropertyManage;
