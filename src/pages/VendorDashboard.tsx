import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, DollarSign, Star, MessageSquare, 
  TrendingUp, Settings, Bell, Plus, Eye, ChefHat,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface VendorService {
  id: string;
  service_type: string;
  price: number;
  status: string | null;
  booking_id: string;
  booking?: {
    id: string;
    event_date: string;
    guest_count: number;
    status: string | null;
    total_amount: number;
    property?: { title: string; location: string } | null;
    customer?: { full_name: string; email: string; phone: string | null } | null;
  } | null;
}

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<{ id: string; business_name: string; rating: number | null } | null>(null);
  const [bookingServices, setBookingServices] = useState<VendorService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchVendorData();
    }
  }, [user, authLoading]);

  const fetchVendorData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch vendor profile
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id, business_name, rating')
        .eq('user_id', user.id)
        .maybeSingle();

      if (vendorData) {
        setVendor(vendorData);

        // Fetch booking services for this vendor
        const { data: servicesData, error } = await supabase
          .from('booking_services')
          .select(`
            *,
            booking:bookings(
              id, event_date, guest_count, status, total_amount,
              property:properties(title, location),
              customer:profiles(full_name, email, phone)
            )
          `)
          .eq('vendor_id', vendorData.id)
          .order('created_at', { ascending: false });

        if (!error && servicesData) {
          setBookingServices(servicesData as VendorService[]);
        }
      }
    } catch (err) {
      console.error('Error fetching vendor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (serviceId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    const { error } = await supabase
      .from('booking_services')
      .update({ status: newStatus })
      .eq('id', serviceId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: `Status updated to ${newStatus}.` });
      fetchVendorData();
    }
  };

  // Compute stats from real data
  const totalEarnings = bookingServices
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + (s.price || 0), 0);
  const totalBookings = bookingServices.length;
  const pendingCount = bookingServices.filter(s => !s.status || s.status === 'pending').length;
  const confirmedCount = bookingServices.filter(s => s.status === 'confirmed').length;
  const completedCount = bookingServices.filter(s => s.status === 'completed').length;

  const stats = [
    { label: 'Total Earnings', value: `PKR ${totalEarnings.toLocaleString()}`, change: '', icon: DollarSign },
    { label: 'Total Bookings', value: totalBookings.toString(), change: '', icon: Calendar },
    { label: 'Avg Rating', value: vendor?.rating ? vendor.rating.toFixed(1) : 'N/A', change: '', icon: Star },
    { label: 'Pending', value: pendingCount.toString(), change: '', icon: Eye },
  ];

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Vendor Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              You don't have a vendor profile yet. Register as a vendor to access this dashboard.
            </p>
            <Button onClick={() => navigate('/vendor/register')}>Register as Vendor</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingServices = bookingServices.filter(s => !s.status || s.status === 'pending');
  const confirmedServices = bookingServices.filter(s => s.status === 'confirmed');
  const completedServices = bookingServices.filter(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">{vendor.business_name}</h1>
                <p className="text-muted-foreground">Vendor Dashboard</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="gap-2 relative">
                <Bell className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <stat.icon className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    {stat.change && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">{stat.change}</span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Requests */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-display">Booking Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                      <TabsTrigger value="confirmed">Confirmed ({confirmedCount})</TabsTrigger>
                      <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
                    </TabsList>
                    
                    {(['pending', 'confirmed', 'completed'] as const).map((tabStatus) => {
                      const list =
                        tabStatus === 'pending' ? pendingServices :
                        tabStatus === 'confirmed' ? confirmedServices : completedServices;
                      return (
                        <TabsContent key={tabStatus} value={tabStatus} className="space-y-4">
                          {list.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No {tabStatus} bookings yet
                            </div>
                          ) : list.map((service) => (
                            <div key={service.id} className="p-4 bg-secondary rounded-xl">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-foreground">{service.service_type}</h3>
                                  {service.booking?.customer && (
                                    <p className="text-sm text-muted-foreground">
                                      by {service.booking.customer.full_name}
                                    </p>
                                  )}
                                </div>
                                <Badge className={getStatusColor(service.status)}>
                                  {service.status || 'pending'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                                <div>
                                  <span className="text-muted-foreground">Date</span>
                                  <p className="font-medium text-foreground">
                                    {service.booking?.event_date
                                      ? format(new Date(service.booking.event_date), 'MMM d, yyyy')
                                      : '-'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Guests</span>
                                  <p className="font-medium text-foreground">{service.booking?.guest_count || '-'}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Venue</span>
                                  <p className="font-medium text-foreground">
                                    {service.booking?.property?.title || '-'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Amount</span>
                                  <p className="font-medium text-accent">
                                    PKR {(service.price || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              {(tabStatus === 'pending') && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleUpdateStatus(service.id, 'confirmed')}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleUpdateStatus(service.id, 'cancelled')}
                                  >
                                    Decline
                                  </Button>
                                  {service.booking?.customer?.phone && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const phone = service.booking!.customer!.phone!.replace(/\D/g, '');
                                        const msg = encodeURIComponent('Hello, regarding your booking request.');
                                        window.open(
                                          `https://wa.me/${phone}?text=${msg}`,
                                          '_blank',
                                          'noopener,noreferrer'
                                        );
                                      }}
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              )}
                              {tabStatus === 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(service.id, 'completed')}
                                >
                                  Mark as Completed
                                </Button>
                              )}
                            </div>
                          ))}
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-display">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="w-4 h-4" /> Add New Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="w-4 h-4" /> Manage Availability
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="w-4 h-4" /> View Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Star className="w-4 h-4" /> View Reviews
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-0 shadow-sm bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">💡 Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    Respond to booking requests within 2 hours to increase your acceptance rate and ranking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorDashboard;
