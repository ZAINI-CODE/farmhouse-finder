import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  CheckCircle2, XCircle, Clock, AlertCircle, Loader2, Users,
  Calendar, MapPin, CreditCard, Eye, Building2, ArrowLeft,
  Banknote, Search, Filter, Mail, Phone
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

interface OwnerBooking {
  id: string;
  property_id: string;
  user_id: string;
  event_date: string;
  guest_count: number;
  status: string;
  total_amount: number;
  event_type: string | null;
  notes: string | null;
  payment_status: string | null;
  transaction_id: string | null;
  payment_method: string | null;
  created_at: string;
  property?: {
    title: string;
    location: string;
    images: string[];
  };
  customer?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

interface Property {
  id: string;
  title: string;
  location: string;
}

export default function OwnerAdmin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { sendBookingConfirmation, sendPaymentVerified } = useNotifications();

  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<OwnerBooking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchOwnerData();
    }
  }, [user, authLoading]);

  const fetchOwnerData = async () => {
    try {
      // Fetch owner's properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title, location')
        .eq('owner_id', user?.id);

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);

      if (propertiesData && propertiesData.length > 0) {
        // Fetch bookings for owner's properties
        const propertyIds = propertiesData.map(p => p.id);
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Fetch property and customer details for each booking
        const enrichedBookings = await Promise.all(
          (bookingsData || []).map(async (booking) => {
            const property = propertiesData.find(p => p.id === booking.property_id);
            
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, email, phone')
              .eq('user_id', booking.user_id)
              .maybeSingle();

            return {
              ...booking,
              property: property ? { ...property, images: [] } : undefined,
              customer: profileData || undefined,
            };
          })
        );

        setBookings(enrichedBookings);
      }
    } catch (error: any) {
      console.error('Error fetching owner data:', error);
      toast({
        title: "Error",
        description: "Could not load your bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending_verification': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-3 h-3" />;
      case 'pending_verification': return <Clock className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      case 'failed': return <XCircle className="w-3 h-3" />;
      default: return <Banknote className="w-3 h-3" />;
    }
  };

  const handleVerifyPayment = async (booking: OwnerBooking) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'verified',
          status: 'confirmed',
          payment_verified_at: new Date().toISOString(),
          payment_verified_by: user?.id,
        })
        .eq('id', booking.id);

      if (error) throw error;

      // Send confirmation notification
      if (booking.customer?.email) {
        await sendPaymentVerified(
          booking.customer.email,
          booking.customer.full_name || 'Customer',
          {
            bookingId: booking.id.slice(0, 8).toUpperCase(),
            propertyName: booking.property?.title || 'Property',
            eventDate: format(new Date(booking.event_date), 'PPP'),
            guestCount: booking.guest_count,
            totalAmount: booking.total_amount,
          }
        );
      }

      toast({
        title: "Payment Verified ✅",
        description: "The booking has been confirmed and the customer has been notified.",
      });

      setShowDetailsDialog(false);
      fetchOwnerData();
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Error",
        description: "Could not verify payment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (booking: OwnerBooking) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'failed',
          status: 'pending',
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Payment Rejected",
        description: "The payment has been marked as failed. The customer will need to retry.",
      });

      setShowDetailsDialog(false);
      fetchOwnerData();
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      toast({
        title: "Error",
        description: "Could not reject payment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveBooking = async (booking: OwnerBooking) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking.id);

      if (error) throw error;

      // Send confirmation notification
      if (booking.customer?.email) {
        await sendBookingConfirmation(
          booking.customer.email,
          booking.customer.full_name || 'Customer',
          {
            bookingId: booking.id.slice(0, 8).toUpperCase(),
            propertyName: booking.property?.title || 'Property',
            eventDate: format(new Date(booking.event_date), 'PPP'),
            guestCount: booking.guest_count,
            totalAmount: booking.total_amount,
          }
        );
      }

      toast({
        title: "Booking Approved ✅",
        description: "The customer has been notified of the confirmation.",
      });

      setShowDetailsDialog(false);
      fetchOwnerData();
    } catch (error: any) {
      console.error('Error approving booking:', error);
      toast({
        title: "Error",
        description: "Could not approve booking",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (booking: OwnerBooking) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "The booking has been cancelled.",
      });

      setShowDetailsDialog(false);
      fetchOwnerData();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Could not cancel booking",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesProperty = selectedProperty === 'all' || b.property_id === selectedProperty;
    const matchesSearch = searchQuery === '' || 
      b.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProperty && matchesSearch;
  });

  const pendingBookings = filteredBookings.filter(b => b.status === 'pending');
  const pendingPayments = filteredBookings.filter(b => b.payment_status === 'pending_verification');
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed');
  const allBookings = filteredBookings;

  const stats = {
    total: bookings.length,
    pending: pendingBookings.length,
    pendingPayments: pendingPayments.length,
    confirmed: confirmedBookings.length,
    revenue: bookings
      .filter(b => b.payment_status === 'verified')
      .reduce((sum, b) => sum + b.total_amount, 0),
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-heading text-2xl font-bold mb-2">No Properties Found</h1>
            <p className="text-muted-foreground mb-6">
              You need to list a property before you can manage bookings.
            </p>
            <Button onClick={() => navigate('/properties/new')}>
              List Your First Property
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold">Booking Management</h1>
                <p className="text-muted-foreground">Manage bookings and verify payments</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'text-primary' },
              { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-yellow-500' },
              { label: 'Pending Payments', value: stats.pendingPayments, icon: Banknote, color: 'text-amber-500' },
              { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle2, color: 'text-green-500' },
              { label: 'Total Revenue', value: `PKR ${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-primary' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary rounded-lg">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-full md:w-[250px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Tabs */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="pending" className="gap-2">
                    <Clock className="w-4 h-4" />
                    Pending ({pendingBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="gap-2">
                    <Banknote className="w-4 h-4" />
                    Verify Payments ({pendingPayments.length})
                  </TabsTrigger>
                  <TabsTrigger value="confirmed" className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmed ({confirmedBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    All ({allBookings.length})
                  </TabsTrigger>
                </TabsList>

                {['pending', 'payments', 'confirmed', 'all'].map((tab) => {
                  const tabBookings = 
                    tab === 'pending' ? pendingBookings :
                    tab === 'payments' ? pendingPayments :
                    tab === 'confirmed' ? confirmedBookings :
                    allBookings;

                  return (
                    <TabsContent key={tab} value={tab} className="space-y-4">
                      {tabBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">No bookings found</p>
                        </div>
                      ) : (
                        tabBookings.map((booking) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col md:flex-row gap-4 p-4 bg-secondary/50 rounded-xl border border-border"
                          >
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                                <div>
                                  <h3 className="font-semibold text-lg">{booking.property?.title}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {booking.property?.location}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                  <Badge className={getPaymentStatusColor(booking.payment_status || 'pending')}>
                                    <span className="flex items-center gap-1">
                                      {getPaymentStatusIcon(booking.payment_status || 'pending')}
                                      {booking.payment_status === 'verified' ? 'Paid' : 
                                       booking.payment_status === 'pending_verification' ? 'Verify Payment' :
                                       booking.payment_status === 'failed' ? 'Failed' : 'Awaiting Payment'}
                                    </span>
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Customer</p>
                                  <p className="font-medium">{booking.customer?.full_name || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Event Date</p>
                                  <p className="font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(booking.event_date), 'PPP')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Guests</p>
                                  <p className="font-medium flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {booking.guest_count}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Amount</p>
                                  <p className="font-semibold text-primary">PKR {booking.total_amount.toLocaleString()}</p>
                                </div>
                              </div>

                              {booking.transaction_id && (
                                <div className="mt-3 p-2 bg-background rounded-lg text-sm">
                                  <span className="text-muted-foreground">Transaction ID: </span>
                                  <span className="font-mono font-medium">{booking.transaction_id}</span>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowDetailsDialog(true);
                                  }}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                                
                                {booking.payment_status === 'pending_verification' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleVerifyPayment(booking)}
                                      disabled={actionLoading}
                                    >
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Verify Payment
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRejectPayment(booking)}
                                      disabled={actionLoading}
                                    >
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                
                                {booking.status === 'pending' && booking.payment_status === 'verified' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveBooking(booking)}
                                    disabled={actionLoading}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Approve Booking
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Review booking information and take action
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Property</h4>
                  <p>{selectedBooking.property?.title}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.property?.location}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Event Details</h4>
                  <p>{format(new Date(selectedBooking.event_date), 'PPP')}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.guest_count} guests</p>
                  {selectedBooking.event_type && (
                    <p className="text-sm text-muted-foreground">{selectedBooking.event_type}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    {selectedBooking.customer?.full_name || 'N/A'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {selectedBooking.customer?.email || 'N/A'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {selectedBooking.customer?.phone || 'N/A'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <div className="p-4 bg-secondary rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">PKR {selectedBooking.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge className={getPaymentStatusColor(selectedBooking.payment_status || 'pending')}>
                      {selectedBooking.payment_status || 'pending'}
                    </Badge>
                  </div>
                  {selectedBooking.transaction_id && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID</span>
                      <span className="font-mono">{selectedBooking.transaction_id}</span>
                    </div>
                  )}
                  {selectedBooking.payment_method && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span>{selectedBooking.payment_method}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedBooking.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-muted-foreground">{selectedBooking.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedBooking?.payment_status === 'pending_verification' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => selectedBooking && handleRejectPayment(selectedBooking)}
                  disabled={actionLoading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Payment
                </Button>
                <Button
                  onClick={() => selectedBooking && handleVerifyPayment(selectedBooking)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Verify Payment & Confirm
                </Button>
              </>
            )}
            {selectedBooking?.status === 'pending' && selectedBooking?.payment_status !== 'pending_verification' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => selectedBooking && handleCancelBooking(selectedBooking)}
                  disabled={actionLoading}
                >
                  Cancel Booking
                </Button>
                <Button
                  onClick={() => selectedBooking && handleApproveBooking(selectedBooking)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Approve Booking
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
