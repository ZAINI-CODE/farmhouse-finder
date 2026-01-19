import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Loader2, CheckCircle2, XCircle, Eye, MapPin, Users, Bed, 
  IndianRupee, Calendar, Crown, AlertCircle
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
  status: string | null;
  rejection_reason: string | null;
  submitted_at: string | null;
  created_at: string;
  owner_id: string;
  owner?: {
    full_name: string;
    email: string;
    phone: string | null;
  };
}

interface Vendor {
  id: string;
  business_name: string;
  description: string | null;
  category: string;
  location: string;
  phone: string | null;
  email: string | null;
  images: string[] | null;
  status: string | null;
  rejection_reason: string | null;
  submitted_at: string | null;
  created_at: string;
  user_id: string;
  owner?: {
    full_name: string;
    email: string;
  };
}

const AdminListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Property | Vendor | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user, activeTab]);

  const fetchListings = async () => {
    setLoading(true);
    
    if (activeTab === 'properties') {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          owner:profiles!properties_owner_id_fkey(full_name, email, phone)
        `)
        .in('status', ['pending_approval', 'rejected'])
        .order('submitted_at', { ascending: false, nullsFirst: false })
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
    } else {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          owner:profiles!vendors_user_id_fkey(full_name, email)
        `)
        .in('status', ['pending_approval', 'rejected'])
        .order('submitted_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vendors:', error);
        toast({
          title: "Error",
          description: "Failed to load vendors",
          variant: "destructive",
        });
      } else {
        setVendors(data || []);
      }
    }
    
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedItem) return;
    
    setActionLoading(true);
    const table = activeTab === 'properties' ? 'properties' : 'vendors';
    
    // Set expiry date to 30 days from now
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { error: updateError } = await supabase
      .from(table)
      .update({
        status: 'published',
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
        rejection_reason: null,
        expires_at: expiresAt,
      })
      .eq('id', selectedItem.id);

    if (updateError) {
      console.error('Error approving listing:', updateError);
      toast({
        title: "Error",
        description: "Failed to approve listing",
        variant: "destructive",
      });
    } else {
      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: user?.id,
        action_type: 'approve_listing',
        target_type: activeTab === 'properties' ? 'property' : 'vendor',
        target_id: selectedItem.id,
        reason: 'Listing approved and published',
      });

      toast({
        title: "Approved!",
        description: `${activeTab === 'properties' ? 'Property' : 'Vendor'} has been approved and published`,
      });
      
      fetchListings();
    }
    
    setActionLoading(false);
    setShowApproveDialog(false);
    setSelectedItem(null);
  };

  const handleReject = async () => {
    if (!selectedItem || !rejectionReason.trim()) {
      toast({
        title: "Missing reason",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    
    setActionLoading(true);
    const table = activeTab === 'properties' ? 'properties' : 'vendors';
    
    const { error: updateError } = await supabase
      .from(table)
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
      })
      .eq('id', selectedItem.id);

    if (updateError) {
      console.error('Error rejecting listing:', updateError);
      toast({
        title: "Error",
        description: "Failed to reject listing",
        variant: "destructive",
      });
    } else {
      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: user?.id,
        action_type: 'reject_listing',
        target_type: activeTab === 'properties' ? 'property' : 'vendor',
        target_id: selectedItem.id,
        reason: rejectionReason,
      });

      toast({
        title: "Rejected",
        description: `${activeTab === 'properties' ? 'Property' : 'Vendor'} has been rejected`,
      });
      
      fetchListings();
    }
    
    setActionLoading(false);
    setShowRejectDialog(false);
    setSelectedItem(null);
    setRejectionReason('');
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
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Admin: Listing Approvals
            </h1>
            <p className="text-muted-foreground mt-2">
              Review and approve/reject pending property and vendor listings
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : properties.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      All caught up!
                    </h3>
                    <p className="text-muted-foreground">
                      No pending property approvals at this time.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <Card key={property.id} className="border-0 shadow-sm">
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
                                  <Badge variant={property.status === 'rejected' ? 'destructive' : 'default'}>
                                    {property.status === 'pending_approval' ? 'Pending' : 'Rejected'}
                                  </Badge>
                                </div>

                                {property.owner && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Owner: {property.owner.full_name} ({property.owner.email})
                                  </p>
                                )}

                                <div className="flex items-center gap-1 text-muted-foreground mb-3">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{property.location}</span>
                                </div>

                                {property.description && (
                                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {property.description}
                                  </p>
                                )}

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
                                </div>

                                {property.rejection_reason && (
                                  <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-semibold text-destructive">Previously Rejected:</p>
                                        <p className="text-sm text-muted-foreground">{property.rejection_reason}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {property.submitted_at && (
                                  <p className="text-xs text-muted-foreground">
                                    Submitted: {new Date(property.submitted_at).toLocaleDateString()}
                                  </p>
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
                                  variant="default"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(property);
                                    setShowApproveDialog(true);
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(property);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="vendors">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : vendors.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      All caught up!
                    </h3>
                    <p className="text-muted-foreground">
                      No pending vendor approvals at this time.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <Card key={vendor.id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-foreground">
                                {vendor.business_name}
                              </h3>
                              <Badge variant="outline">{vendor.category}</Badge>
                              <Badge variant={vendor.status === 'rejected' ? 'destructive' : 'default'}>
                                {vendor.status === 'pending_approval' ? 'Pending' : 'Rejected'}
                              </Badge>
                            </div>

                            {vendor.owner && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Owner: {vendor.owner.full_name} ({vendor.owner.email})
                              </p>
                            )}

                            <div className="flex items-center gap-1 text-muted-foreground mb-3">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{vendor.location}</span>
                            </div>

                            {vendor.description && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {vendor.description}
                              </p>
                            )}

                            {vendor.rejection_reason && (
                              <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-semibold text-destructive">Previously Rejected:</p>
                                    <p className="text-sm text-muted-foreground">{vendor.rejection_reason}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-row lg:flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/services/${vendor.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(vendor);
                                setShowApproveDialog(true);
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(vendor);
                                setShowRejectDialog(true);
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this {activeTab === 'properties' ? 'property' : 'vendor'} listing?
              It will be published and visible to all users. The listing will expire in 30 days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve & Publish'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this listing. The owner will be able to see this reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection_reason">Rejection Reason *</Label>
            <Textarea
              id="rejection_reason"
              placeholder="e.g., Images are low quality, description is insufficient, pricing seems incorrect..."
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason('');
            }} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Listing'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminListings;
