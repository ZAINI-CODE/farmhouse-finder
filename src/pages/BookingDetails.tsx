import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft, Calendar, Users, MapPin, Download, Printer,
  CheckCircle2, Clock, AlertCircle, XCircle, Loader2,
  Building2, Phone, Mail, CreditCard, FileText, Share2, MessageSquare
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessagesSection } from '@/components/messaging/MessagesSection';

interface BookingDetail {
  id: string;
  property_id: string;
  event_date: string;
  guest_count: number;
  status: string;
  total_amount: number;
  event_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  property?: {
    title: string;
    location: string;
    address: string;
    images: string[];
    price_per_day: number;
  };
  profile?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export default function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && bookingId) {
      fetchBookingDetails();
    }
  }, [user, authLoading, bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      // Fetch property details
      const { data: propertyData } = await supabase
        .from('properties')
        .select('title, location, address, images, price_per_day')
        .eq('id', bookingData.property_id)
        .single();

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('user_id', bookingData.user_id)
        .single();

      setBooking({
        ...bookingData,
        property: propertyData || undefined,
        profile: profileData || undefined,
      });
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      toast({
        title: "Error",
        description: "Could not load booking details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const icons: Record<string, JSX.Element> = {
      confirmed: <CheckCircle2 className="w-3 h-3 mr-1" />,
      pending: <Clock className="w-3 h-3 mr-1" />,
      completed: <CheckCircle2 className="w-3 h-3 mr-1" />,
      cancelled: <XCircle className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge className={styles[status] || 'bg-muted'}>
        <span className="flex items-center">
          {icons[status] || <AlertCircle className="w-3 h-3 mr-1" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  const handleDownloadReceipt = () => {
    if (!booking) return;

    // Create receipt content
    const receiptContent = `
╔═══════════════════════════════════════════════════════════════╗
║                        BOOKING RECEIPT                        ║
║                          BookFarm                             ║
╠═══════════════════════════════════════════════════════════════╣

  RECEIPT #: ${booking.id.slice(0, 8).toUpperCase()}
  DATE: ${format(new Date(booking.created_at), 'PPP')}
  STATUS: ${booking.status.toUpperCase()}

───────────────────────────────────────────────────────────────

  PROPERTY DETAILS
  ────────────────
  Name: ${booking.property?.title || 'N/A'}
  Location: ${booking.property?.location || 'N/A'}
  Address: ${booking.property?.address || 'N/A'}

───────────────────────────────────────────────────────────────

  BOOKING DETAILS
  ────────────────
  Event Date: ${format(new Date(booking.event_date), 'PPP')}
  Guests: ${booking.guest_count}
  Event Type: ${booking.event_type || 'Not specified'}

───────────────────────────────────────────────────────────────

  PAYMENT SUMMARY
  ────────────────
  Venue Rental: PKR ${booking.property?.price_per_day?.toLocaleString() || '0'}
  Service Fee: PKR ${Math.round(booking.total_amount * 0.05).toLocaleString()}
  ─────────────────────────────────────────
  TOTAL AMOUNT: PKR ${booking.total_amount.toLocaleString()}

───────────────────────────────────────────────────────────────

  CUSTOMER DETAILS
  ────────────────
  Name: ${booking.profile?.full_name || 'N/A'}
  Email: ${booking.profile?.email || 'N/A'}
  Phone: ${booking.profile?.phone || 'N/A'}

╚═══════════════════════════════════════════════════════════════╝

  Thank you for choosing BookFarm!
  For support, contact: support@bookfarm.pk
    `;

    // Create and download text file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BookFarm-Receipt-${booking.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Your booking receipt has been downloaded",
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!booking) return;

    const shareData = {
      title: `Booking at ${booking.property?.title}`,
      text: `Event on ${format(new Date(booking.event_date), 'PPP')} - ${booking.guest_count} guests`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Booking link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-heading text-2xl font-bold mb-2">Booking Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The booking you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
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
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground">Booking Details</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold">Booking Details</h1>
                <p className="text-muted-foreground text-sm">
                  Reference: #{booking.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrintReceipt}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button size="sm" onClick={handleDownloadReceipt}>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </div>

          <div ref={receiptRef} className="space-y-6">
            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl flex items-center justify-between ${
                booking.status === 'confirmed' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                booking.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                booking.status === 'completed' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {booking.status === 'confirmed' && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                {booking.status === 'pending' && <Clock className="h-6 w-6 text-yellow-600" />}
                {booking.status === 'completed' && <CheckCircle2 className="h-6 w-6 text-blue-600" />}
                {booking.status === 'cancelled' && <XCircle className="h-6 w-6 text-red-600" />}
                <div>
                  <p className="font-semibold">
                    {booking.status === 'confirmed' && 'Booking Confirmed'}
                    {booking.status === 'pending' && 'Awaiting Confirmation'}
                    {booking.status === 'completed' && 'Event Completed'}
                    {booking.status === 'cancelled' && 'Booking Cancelled'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {format(new Date(booking.updated_at), 'PPp')}
                  </p>
                </div>
              </div>
              {getStatusBadge(booking.status)}
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Property Info */}
              <Card className="md:col-span-2 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={booking.property?.images?.[0] || '/placeholder.svg'}
                      alt={booking.property?.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{booking.property?.title || 'Property'}</h3>
                      <p className="text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {booking.property?.location || 'Location'}
                      </p>
                      {booking.property?.address && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {booking.property.address}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Info */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{format(new Date(booking.event_date), 'PPP')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {booking.guest_count}
                    </span>
                  </div>
                  {booking.event_type && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Event Type</span>
                      <span className="font-medium">{booking.event_type}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-accent">
                        {booking.profile?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{booking.profile?.full_name || 'Customer'}</p>
                      <p className="text-sm text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.profile?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.profile?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-accent" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Venue Rental</span>
                    <span>PKR {(booking.property?.price_per_day || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Service Fee (5%)</span>
                    <span>PKR {Math.round(booking.total_amount * 0.05).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-accent">PKR {booking.total_amount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {booking.notes && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{booking.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Messages Section */}
            <MessagesSection bookingId={booking.id} />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              {booking.status === 'pending' && (
                <Button className="flex-1" onClick={() => navigate('/payment', { state: { bookingDetails: booking } })}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Payment
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Print styles */}
      <style>{`
        @media print {
          nav, footer, button {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
