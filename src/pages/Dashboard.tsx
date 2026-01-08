import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, MapPin, Clock, Users, MessageSquare, Heart, Settings, Bell, 
  ChevronRight, Plus, Home, Briefcase, BarChart3, Star, Building2,
  CreditCard, AlertCircle, CheckCircle2, XCircle, Loader2, Banknote
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Booking {
  id: string;
  property_id: string;
  event_date: string;
  guest_count: number;
  status: string;
  total_amount: number;
  event_type: string | null;
  notes: string | null;
  created_at: string;
  payment_status?: string;
  transaction_id?: string;
  property?: {
    title: string;
    location: string;
    images: string[];
  };
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [userRole, setUserRole] = useState<string>('customer');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const favorites = [
    { id: 1, name: 'Pearl Farmhouse', location: 'Canal Road, Lahore', price: 'Rs. 45,000/day', image: '/placeholder.svg' },
    { id: 2, name: 'Bahria Orchards Villa', location: 'Bahria Orchard, Lahore', price: 'Rs. 95,000/day', image: '/placeholder.svg' },
  ];

  const notifications = [
    { id: 1, message: 'Your booking at Royal Garden Farmhouse is confirmed!', time: '2 hours ago', read: false },
    { id: 2, message: 'New message from Green Valley Resort owner', time: '1 day ago', read: false },
    { id: 3, message: 'Rate your experience at Raiwind Gardens', time: '3 days ago', read: true },
  ];

  const ownerMenuItems = [
    { icon: Plus, label: 'List New Property', href: '/properties/new', description: 'Add a new venue to your listings' },
    { icon: Building2, label: 'My Properties', href: '/properties/manage', description: 'Manage your listed properties' },
    { icon: Calendar, label: 'Booking Requests', href: '/owner/admin', description: 'View and manage booking requests' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics', description: 'Track your property performance' },
    { icon: Star, label: 'Reviews', href: '/reviews', description: 'See what customers are saying' },
  ];

  const vendorMenuItems = [
    { icon: Plus, label: 'Add Service', href: '/services/new', description: 'Add a new service offering' },
    { icon: Briefcase, label: 'My Services', href: '/services/manage', description: 'Manage your services' },
    { icon: Calendar, label: 'Service Requests', href: '/services/requests', description: 'View service booking requests' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics', description: 'Track your service performance' },
  ];

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
      case 'verified': 
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending_verification': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': 
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      case 'pending_verification': return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      case 'failed': return <XCircle className="w-3 h-3" />;
      default: return <Banknote className="w-3 h-3" />;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Payment Verified';
      case 'completed': return 'Paid';
      case 'pending_verification': return 'Verifying Payment';
      case 'pending': return 'Awaiting Payment';
      case 'failed': return 'Payment Failed';
      default: return status;
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userName = profile?.full_name || user?.user_metadata?.full_name || 'User';

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Welcome back, {userName}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {userRole === 'owner' 
                  ? 'Manage your properties and bookings' 
                  : userRole === 'vendor'
                  ? 'Manage your services and requests'
                  : 'Manage your bookings and explore new venues'}
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="gap-2 relative">
                <Bell className="w-4 h-4" />
                Notifications
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">2</span>
              </Button>
            </div>
          </div>

          {/* Owner/Vendor Quick Actions */}
          {(userRole === 'owner' || userRole === 'vendor') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {(userRole === 'owner' ? ownerMenuItems : vendorMenuItems).map((item, index) => (
                  <Link key={item.label} to={item.href}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                            <item.icon className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{item.label}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: userRole === 'owner' ? 'Total Properties' : 'Total Bookings', value: userRole === 'owner' ? '3' : '12', icon: userRole === 'owner' ? Building2 : Calendar, href: null },
                  { label: userRole === 'owner' ? 'Active Bookings' : 'Upcoming', value: '2', icon: Clock, href: null },
                  { label: 'Favorites', value: '5', icon: Heart, href: '/favorites' },
                  { label: 'Messages', value: '3', icon: MessageSquare, href: null },
                ].map((stat, index) => {
                  const cardContent = (
                    <Card className={`border-0 shadow-sm ${stat.href ? 'hover:shadow-md cursor-pointer transition-shadow' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <stat.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );

                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {stat.href ? (
                        <Link to={stat.href}>{cardContent}</Link>
                      ) : (
                        cardContent
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Bookings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-heading">
                    {userRole === 'owner' ? 'Property Bookings' : 'My Bookings'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                      <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upcoming" className="space-y-4">
                      {loadingBookings ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : upcomingBookings.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">No upcoming bookings</p>
                          <Button className="mt-4" onClick={() => navigate('/properties')}>
                            Browse Properties
                          </Button>
                        </div>
                      ) : (
                        upcomingBookings.map((booking) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col md:flex-row gap-4 p-4 bg-secondary rounded-xl"
                          >
                            <img
                              src={booking.property?.images?.[0] || '/placeholder.svg'}
                              alt={booking.property?.title || 'Property'}
                              className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-foreground">{booking.property?.title || 'Property'}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {booking.property?.location || 'Lahore, Pakistan'}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                  <Badge className={getPaymentStatusColor(booking.payment_status || 'pending')}>
                                    <span className="flex items-center gap-1">
                                      {getPaymentStatusIcon(booking.payment_status || 'pending')}
                                      {getPaymentStatusLabel(booking.payment_status || 'pending')}
                                    </span>
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {format(new Date(booking.event_date), 'PPP')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {booking.guest_count} guests
                                </span>
                                {booking.event_type && (
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" /> {booking.event_type}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-3 gap-2">
                                <span className="font-semibold text-primary">PKR {booking.total_amount.toLocaleString()}</span>
                                <div className="flex gap-2">
                                  {booking.payment_status === 'pending' && (
                                    <Button size="sm" onClick={() => navigate('/payment', { state: { bookingDetails: booking } })}>
                                      <CreditCard className="w-3 h-3 mr-1" />
                                      Pay Now
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline" onClick={() => navigate(`/booking/details/${booking.id}`)}>View Details</Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="past" className="space-y-4">
                      {loadingBookings ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : pastBookings.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">No past bookings</p>
                        </div>
                      ) : (
                        pastBookings.map((booking) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col md:flex-row gap-4 p-4 bg-secondary rounded-xl"
                          >
                            <img
                              src={booking.property?.images?.[0] || '/placeholder.svg'}
                              alt={booking.property?.title || 'Property'}
                              className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-foreground">{booking.property?.title || 'Property'}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {booking.property?.location || 'Lahore, Pakistan'}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                  <Badge className={getPaymentStatusColor(booking.payment_status || 'completed')}>
                                    <span className="flex items-center gap-1">
                                      {getPaymentStatusIcon(booking.payment_status || 'completed')}
                                      {getPaymentStatusLabel(booking.payment_status || 'completed')}
                                    </span>
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {format(new Date(booking.event_date), 'PPP')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {booking.guest_count} guests
                                </span>
                              </div>
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-3 gap-2">
                                <span className="font-semibold text-primary">PKR {booking.total_amount.toLocaleString()}</span>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => navigate(`/booking/details/${booking.id}`)}>View Details</Button>
                                  <Button size="sm" onClick={() => navigate(`/booking/${booking.property_id}`)}>Book Again</Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-heading">Notifications</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary text-xs">Mark all read</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg ${notif.read ? 'bg-background' : 'bg-primary/5 border-l-2 border-primary'}`}
                    >
                      <p className="text-sm text-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Favorites */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-heading">Saved Properties</CardTitle>
                    <Link to="/properties" className="text-primary text-xs flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {favorites.map((fav) => (
                    <Link
                      key={fav.id}
                      to={`/properties/${fav.id}`}
                      className="flex gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <img
                        src={fav.image}
                        alt={fav.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium text-foreground">{fav.name}</h4>
                        <p className="text-xs text-muted-foreground">{fav.location}</p>
                        <p className="text-sm font-semibold text-primary mt-1">{fav.price}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions for Customers */}
              {userRole === 'customer' && (
                <Card className="border-0 shadow-sm bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-heading font-bold text-lg mb-2">Own a Farmhouse?</h3>
                    <p className="text-sm opacity-90 mb-4">List your property and start earning</p>
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/register?type=owner">List Your Property</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
