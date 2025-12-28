import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, MessageSquare, Heart, Settings, Bell, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const bookings = [
    {
      id: 1,
      property: 'Green Valley Farmhouse',
      location: 'Karjat, Maharashtra',
      date: 'Jan 15, 2025',
      time: '10:00 AM - 6:00 PM',
      guests: 50,
      status: 'confirmed',
      amount: '₹45,000',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      property: 'Sunset Heritage Villa',
      location: 'Lonavala, Maharashtra',
      date: 'Feb 20, 2025',
      time: '9:00 AM - 9:00 PM',
      guests: 100,
      status: 'pending',
      amount: '₹85,000',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      property: 'Royal Gardens Estate',
      location: 'Pune, Maharashtra',
      date: 'Dec 10, 2024',
      time: '11:00 AM - 7:00 PM',
      guests: 75,
      status: 'completed',
      amount: '₹62,000',
      image: '/placeholder.svg'
    }
  ];

  const favorites = [
    { id: 1, name: 'Lakeside Retreat', location: 'Igatpuri', price: '₹35,000/day', image: '/placeholder.svg' },
    { id: 2, name: 'Mountain View Farm', location: 'Mahabaleshwar', price: '₹28,000/day', image: '/placeholder.svg' },
  ];

  const notifications = [
    { id: 1, message: 'Your booking at Green Valley Farmhouse is confirmed!', time: '2 hours ago', read: false },
    { id: 2, message: 'New message from Sunset Heritage Villa owner', time: '1 day ago', read: false },
    { id: 3, message: 'Rate your experience at Royal Gardens Estate', time: '3 days ago', read: true },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, John!</h1>
              <p className="text-muted-foreground mt-1">Manage your bookings and explore new venues</p>
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Bookings', value: '12', icon: Calendar },
                  { label: 'Upcoming', value: '2', icon: Clock },
                  { label: 'Favorites', value: '5', icon: Heart },
                  { label: 'Messages', value: '3', icon: MessageSquare },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm">
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
                  </motion.div>
                ))}
              </div>

              {/* Bookings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-display">My Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                      <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upcoming" className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-4 p-4 bg-secondary rounded-xl"
                        >
                          <img
                            src={booking.image}
                            alt={booking.property}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{booking.property}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {booking.location}
                                </p>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {booking.guests} guests
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-semibold text-primary">{booking.amount}</span>
                              <Button size="sm" variant="outline">View Details</Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="past" className="space-y-4">
                      {pastBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-4 p-4 bg-secondary rounded-xl"
                        >
                          <img
                            src={booking.image}
                            alt={booking.property}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{booking.property}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {booking.location}
                                </p>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-semibold text-primary">{booking.amount}</span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Write Review</Button>
                                <Button size="sm">Book Again</Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
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
                    <CardTitle className="text-lg font-display">Notifications</CardTitle>
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
                    <CardTitle className="text-lg font-display">Saved Properties</CardTitle>
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

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <h3 className="font-display font-bold text-lg mb-2">Are you a vendor?</h3>
                  <p className="text-sm opacity-90 mb-4">Join BookFarm and grow your business</p>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/vendor/register">Register as Vendor</Link>
                  </Button>
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

export default Dashboard;
