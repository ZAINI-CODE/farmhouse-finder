import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, Building2, Users, Crown, TrendingUp, Clock,
  CheckCircle2, XCircle, AlertCircle, Calendar, DollarSign
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface Stats {
  totalProperties: number;
  activeProperties: number;
  featuredProperties: number;
  pendingProperties: number;
  totalVendors: number;
  activeVendors: number;
  totalUsers: number;
  totalBookings: number;
  activePromotions: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    activeProperties: 0,
    featuredProperties: 0,
    pendingProperties: 0,
    totalVendors: 0,
    activeVendors: 0,
    totalUsers: 0,
    totalBookings: 0,
    activePromotions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    
    try {
      // Fetch property stats
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, status, is_featured, is_active');

      if (propError) throw propError;

      const totalProperties = properties?.length || 0;
      const activeProperties = properties?.filter(p => p.status === 'published' && p.is_active).length || 0;
      const featuredProperties = properties?.filter(p => p.is_featured).length || 0;
      const pendingProperties = properties?.filter(p => p.status === 'pending_approval').length || 0;

      // Fetch vendor stats
      const { data: vendors, error: vendorError } = await supabase
        .from('vendors')
        .select('id, status, is_active');

      if (vendorError) throw vendorError;

      const totalVendors = vendors?.length || 0;
      const activeVendors = vendors?.filter(v => v.status === 'published' && v.is_active).length || 0;

      // Fetch user stats
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id');

      if (profileError) throw profileError;

      const totalUsers = profiles?.length || 0;

      // Fetch booking stats
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('id');

      if (bookingError) throw bookingError;

      const totalBookings = bookings?.length || 0;

      // Fetch promotion stats
      const { data: promotions, error: promoError } = await supabase
        .from('listing_promotions')
        .select('id')
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString());

      if (promoError) throw promoError;

      const activePromotions = promotions?.length || 0;

      setStats({
        totalProperties,
        activeProperties,
        featuredProperties,
        pendingProperties,
        totalVendors,
        activeVendors,
        totalUsers,
        totalBookings,
        activePromotions,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard stats",
        variant: "destructive",
      });
    }
    
    setLoading(false);
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

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Properties',
      value: stats.activeProperties,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Featured Listings',
      value: stats.featuredProperties,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Pending Approval',
      value: stats.pendingProperties,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Active Promotions',
      value: stats.activePromotions,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Platform overview and key metrics
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/admin/listings')}
            >
              <Clock className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Review Listings</div>
                <div className="text-xs text-muted-foreground">{stats.pendingProperties} pending</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/properties/manage')}
            >
              <Building2 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Manage Properties</div>
                <div className="text-xs text-muted-foreground">{stats.activeProperties} active</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/owner/admin')}
            >
              <Calendar className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Bookings</div>
                <div className="text-xs text-muted-foreground">{stats.totalBookings} total</div>
              </div>
            </Button>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-foreground">
                              {stat.value}
                            </p>
                          </div>
                          <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Property Approval Rate</span>
                  <span className="font-semibold">
                    {stats.totalProperties > 0 
                      ? Math.round((stats.activeProperties / stats.totalProperties) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Featured Percentage</span>
                  <span className="font-semibold">
                    {stats.activeProperties > 0 
                      ? Math.round((stats.featuredProperties / stats.activeProperties) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vendor Status</span>
                  <Badge variant={stats.activeVendors > 5 ? "default" : "secondary"}>
                    {stats.activeVendors} Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Reviews</span>
                  <Badge variant={stats.pendingProperties > 0 ? "destructive" : "default"}>
                    {stats.pendingProperties}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Most Common Action Needed</p>
                  <p className="font-semibold">
                    {stats.pendingProperties > 0 
                      ? `Review ${stats.pendingProperties} pending ${stats.pendingProperties === 1 ? 'listing' : 'listings'}` 
                      : 'All listings reviewed!'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monetization Status</p>
                  <p className="font-semibold">
                    {stats.activePromotions} active promotion{stats.activePromotions !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Platform Growth</p>
                  <p className="font-semibold">
                    {stats.totalUsers} registered users
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
