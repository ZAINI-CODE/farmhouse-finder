import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Building2, Copy, Check, ArrowLeft, Clock, AlertCircle,
  Phone, Mail, MapPin, Upload, Shield
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import property1 from "@/assets/property-1.jpg";

// Pakistani Banks
const pakistaniBanks = [
  {
    id: "hbl",
    name: "Habib Bank Limited",
    shortName: "HBL",
    logo: "🏦",
    color: "bg-green-600",
    accountTitle: "BookFarm Properties Pvt Ltd",
    accountNumber: "1234-5678901-03",
    iban: "PK36HABB0000001234567890",
    branchCode: "0123",
    branchName: "Mall Road, Lahore",
  },
  {
    id: "mcb",
    name: "MCB Bank",
    shortName: "MCB",
    logo: "🏛️",
    color: "bg-purple-600",
    accountTitle: "BookFarm Properties Pvt Ltd",
    accountNumber: "0987-6543210-01",
    iban: "PK47MUCB0000009876543210",
    branchCode: "0456",
    branchName: "Gulberg III, Lahore",
  },
  {
    id: "ubl",
    name: "United Bank Limited",
    shortName: "UBL",
    logo: "🏢",
    color: "bg-blue-600",
    accountTitle: "BookFarm Properties Pvt Ltd",
    accountNumber: "2468-1357902-02",
    iban: "PK58UNIL0000002468135790",
    branchCode: "0789",
    branchName: "DHA Phase 5, Lahore",
  },
  {
    id: "meezan",
    name: "Meezan Bank",
    shortName: "Meezan",
    logo: "🕌",
    color: "bg-emerald-600",
    accountTitle: "BookFarm Properties Pvt Ltd",
    accountNumber: "1357-2468013-04",
    iban: "PK69MEZN0000001357246801",
    branchCode: "0321",
    branchName: "Johar Town, Lahore",
  },
  {
    id: "alfalah",
    name: "Bank Alfalah",
    shortName: "Alfalah",
    logo: "🌙",
    color: "bg-red-600",
    accountTitle: "BookFarm Properties Pvt Ltd",
    accountNumber: "8642-9753108-05",
    iban: "PK80ALFH0000008642975310",
    branchCode: "0654",
    branchName: "Model Town, Lahore",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    shortName: "JazzCash",
    logo: "📱",
    color: "bg-red-500",
    accountTitle: "BookFarm Properties",
    accountNumber: "0300-1234567",
    iban: "",
    branchCode: "",
    branchName: "Mobile Wallet",
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    shortName: "Easypaisa",
    logo: "💚",
    color: "bg-green-500",
    accountTitle: "BookFarm Properties",
    accountNumber: "0345-9876543",
    iban: "",
    branchCode: "",
    branchName: "Mobile Wallet",
  },
];

interface BookingDetails {
  propertyId: string;
  propertyName: string;
  date: Date;
  guests: number;
  packageName: string;
  packagePrice: number;
  addOns: { name: string; price: number }[];
  serviceFee: number;
  total: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendPaymentReceived } = useNotifications();
  
  const bookingDetails = location.state?.bookingDetails as BookingDetails;
  
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if no booking details
  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-heading text-2xl font-bold mb-2">No Booking Found</h1>
            <p className="text-muted-foreground mb-6">
              Please start a new booking to continue.
            </p>
            <Button onClick={() => navigate("/properties")}>
              Browse Properties
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedBankDetails = pakistaniBanks.find(b => b.id === selectedBank);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
  };

  const handleSubmitPayment = async () => {
    if (!selectedBank || !transactionId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a bank and enter transaction ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const selectedBankName = pakistaniBanks.find(b => b.id === selectedBank)?.name || selectedBank;
    
    // If this is an existing booking (has id), update it with payment info
    if ((bookingDetails as any).id) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({
            payment_status: 'pending_verification',
            transaction_id: transactionId,
            payment_method: selectedBankName,
          })
          .eq('id', (bookingDetails as any).id);

        if (error) {
          console.error('Error updating booking:', error);
        }
      } catch (error) {
        console.error('Error updating booking:', error);
      }
    }
    
    // Send payment received notification
    try {
      await sendPaymentReceived(
        bookingDetails.contactInfo?.email || 'customer@example.com',
        bookingDetails.contactInfo?.name || 'Customer',
        {
          bookingId: (bookingDetails as any).id?.slice(0, 8).toUpperCase() || `BF-${Date.now().toString().slice(-8)}`,
          propertyName: bookingDetails.propertyName || (bookingDetails as any).property?.title || 'Property',
          eventDate: bookingDetails.date ? format(bookingDetails.date, 'PPP') : format(new Date((bookingDetails as any).event_date), 'PPP'),
          guestCount: bookingDetails.guests || (bookingDetails as any).guest_count,
          totalAmount: bookingDetails.total || (bookingDetails as any).total_amount,
          transactionId: transactionId,
        }
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    
    setTimeout(() => {
      toast({
        title: "Payment Submitted! ✅",
        description: "Your payment is being verified. You'll receive confirmation within 24 hours.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Payment</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                    Complete Payment
                  </h1>
                  <p className="text-muted-foreground">
                    Select your preferred bank and transfer the amount
                  </p>
                </div>

                {/* Amount to Pay */}
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount to Pay</p>
                      <p className="font-heading text-3xl font-bold text-accent">
                        PKR {bookingDetails.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Booking Reference</p>
                      <p className="font-mono font-semibold">
                        BF-{Date.now().toString().slice(-8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Selection */}
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-4">
                    Select Payment Method
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {pakistaniBanks.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-center transition-all hover:shadow-md",
                          selectedBank === bank.id
                            ? "border-accent bg-accent/5 shadow-md"
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl text-white",
                          bank.color
                        )}>
                          {bank.logo}
                        </div>
                        <p className="font-medium text-sm">{bank.shortName}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank Details */}
                {selectedBankDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-card rounded-2xl border border-border p-6 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xl text-white",
                        selectedBankDetails.color
                      )}>
                        {selectedBankDetails.logo}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold">{selectedBankDetails.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedBankDetails.branchName}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Account Title</p>
                          <p className="font-medium">{selectedBankDetails.accountTitle}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(selectedBankDetails.accountTitle, "Account Title")}
                        >
                          {copiedField === "Account Title" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Account Number</p>
                          <p className="font-mono font-medium">{selectedBankDetails.accountNumber}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(selectedBankDetails.accountNumber, "Account Number")}
                        >
                          {copiedField === "Account Number" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {selectedBankDetails.iban && (
                        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">IBAN</p>
                            <p className="font-mono font-medium text-sm">{selectedBankDetails.iban}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedBankDetails.iban, "IBAN")}
                          >
                            {copiedField === "IBAN" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}

                      {selectedBankDetails.branchCode && (
                        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">Branch Code</p>
                            <p className="font-mono font-medium">{selectedBankDetails.branchCode}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedBankDetails.branchCode, "Branch Code")}
                          >
                            {copiedField === "Branch Code" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800 dark:text-amber-200">Important</p>
                          <p className="text-amber-700 dark:text-amber-300">
                            Transfer exactly <strong>PKR {bookingDetails.total.toLocaleString()}</strong> to avoid delays. 
                            Include booking reference in the description.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Transaction ID Input */}
                {selectedBank && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-base">Transaction ID / Reference Number</Label>
                      <Input
                        placeholder="Enter your bank transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="h-14 text-base"
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter the transaction ID from your bank transfer receipt
                      </p>
                    </div>

                    <Button
                      size="xl"
                      className="w-full"
                      onClick={handleSubmitPayment}
                      disabled={isSubmitting || !transactionId.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Confirm Payment
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Security Note */}
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                  <Shield className="h-5 w-5 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Your payment is secure. We verify all transactions within 24 hours.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border overflow-hidden">
                <img
                  src={property1}
                  alt={bookingDetails.propertyName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">
                      {bookingDetails.propertyName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>Lahore, Pakistan</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event Date</span>
                      <span className="font-medium">
                        {format(new Date(bookingDetails.date), "PPP")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-medium">{bookingDetails.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package</span>
                      <span className="font-medium">{bookingDetails.packageName}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{bookingDetails.packageName}</span>
                      <span>PKR {bookingDetails.packagePrice.toLocaleString()}</span>
                    </div>
                    {bookingDetails.addOns.map((addon, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-muted-foreground">{addon.name}</span>
                        <span>PKR {addon.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>PKR {bookingDetails.serviceFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-heading font-bold text-lg">
                    <span>Total</span>
                    <span className="text-accent">PKR {bookingDetails.total.toLocaleString()}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2 space-y-2 text-sm">
                    <p className="font-medium">Contact Details</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{bookingDetails.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{bookingDetails.contactInfo.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
