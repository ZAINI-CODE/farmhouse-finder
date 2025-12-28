import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, DollarSign, Star, Users, MessageSquare, 
  TrendingUp, Settings, Bell, Plus, Eye, Edit, ChefHat
} from 'lucide-react';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const bookingRequests = [
    {
      id: 1,
      customer: 'Priya Sharma',
      service: 'Wedding Catering',
      date: 'Jan 20, 2025',
      guests: 200,
      venue: 'Green Valley Farmhouse',
      amount: '₹1,50,000',
      status: 'pending',
    },
    {
      id: 2,
      customer: 'Rahul Mehta',
      service: 'Corporate Event Catering',
      date: 'Jan 25, 2025',
      guests: 100,
      venue: 'City Convention Center',
      amount: '₹75,000',
      status: 'pending',
    },
    {
      id: 3,
      customer: 'Anita Desai',
      service: 'Birthday Party Catering',
      date: 'Feb 5, 2025',
      guests: 50,
      venue: 'Sunset Villa',
      amount: '₹35,000',
      status: 'confirmed',
    },
  ];

  const services = [
    {
      id: 1,
      name: 'Wedding Catering Package',
      price: '₹750/plate',
      bookings: 24,
      rating: 4.9,
      status: 'active',
    },
    {
      id: 2,
      name: 'Corporate Event Package',
      price: '₹500/plate',
      bookings: 18,
      rating: 4.8,
      status: 'active',
    },
    {
      id: 3,
      name: 'Birthday Party Package',
      price: '₹400/plate',
      bookings: 32,
      rating: 4.7,
      status: 'active',
    },
  ];

  const stats = [
    { label: 'Total Earnings', value: '₹12.5L', change: '+15%', icon: DollarSign },
    { label: 'Total Bookings', value: '74', change: '+8%', icon: Calendar },
    { label: 'Avg Rating', value: '4.8', change: '+0.2', icon: Star },
    { label: 'Profile Views', value: '1.2K', change: '+25%', icon: Eye },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Royal Catering Services</h1>
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
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">3</span>
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
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">{stat.change}</span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
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
                      <TabsTrigger value="pending">Pending (2)</TabsTrigger>
                      <TabsTrigger value="confirmed">Confirmed (1)</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pending" className="space-y-4">
                      {bookingRequests.filter(b => b.status === 'pending').map((booking) => (
                        <div key={booking.id} className="p-4 bg-secondary rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{booking.service}</h3>
                              <p className="text-sm text-muted-foreground">by {booking.customer}</p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                            <div>
                              <span className="text-muted-foreground">Date</span>
                              <p className="font-medium text-foreground">{booking.date}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Guests</span>
                              <p className="font-medium text-foreground">{booking.guests}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Venue</span>
                              <p className="font-medium text-foreground">{booking.venue}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Amount</span>
                              <p className="font-medium text-primary">{booking.amount}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">Accept</Button>
                            <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="confirmed" className="space-y-4">
                      {bookingRequests.filter(b => b.status === 'confirmed').map((booking) => (
                        <div key={booking.id} className="p-4 bg-secondary rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{booking.service}</h3>
                              <p className="text-sm text-muted-foreground">by {booking.customer}</p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Date</span>
                              <p className="font-medium text-foreground">{booking.date}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Guests</span>
                              <p className="font-medium text-foreground">{booking.guests}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Venue</span>
                              <p className="font-medium text-foreground">{booking.venue}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Amount</span>
                              <p className="font-medium text-primary">{booking.amount}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="completed">
                      <div className="text-center py-8 text-muted-foreground">
                        No completed bookings yet
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* My Services */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-display">My Services</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary text-xs">
                      Manage
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {services.map((service) => (
                    <div key={service.id} className="p-3 bg-secondary rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{service.name}</h4>
                          <p className="text-primary font-semibold text-sm">{service.price}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {service.bookings} bookings
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" /> {service.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

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
