import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Copy, Check, ArrowLeft, Clock, AlertCircle,
  Phone, Mail, MapPin, Shield, CreditCard, Smartphone, Landmark
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import property1 from "@/assets/property-1.jpg";

type PaymentCategory = "mobile" | "bank" | "card";

const paymentCategories = [
  { id: "mobile" as PaymentCategory, label: "Mobile Wallets", icon: Smartphone, description: "JazzCash & EasyPaisa" },
  { id: "bank" as PaymentCategory, label: "Bank Transfer", icon: Landmark, description: "HBL, MCB, UBL & more" },
  { id: "card" as PaymentCategory, label: "Credit / Debit Card", icon: CreditCard, description: "Visa & Mastercard" },
];

// Mobile wallet options
const mobileWallets = [
  {
    id: "jazzcash",
    name: "JazzCash",
    shortName: "JazzCash",
    logo: "📱",
    color: "bg-red-500",
    accountTitle: "BookFarm Properties",
    accountNumber: "0303-8032173",
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
    accountNumber: "0303-8032173",
    iban: "",
    branchCode: "",
    branchName: "Mobile Wallet",
  },
];

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
  
  const [activeCategory, setActiveCategory] = useState<PaymentCategory>("mobile");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
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

  const selectedWalletDetails = mobileWallets.find(w => w.id === selectedPayment);
  const selectedBankDetails = pakistaniBanks.find(b => b.id === selectedPayment);
  const selectedMethodDetails = selectedWalletDetails || selectedBankDetails;

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
    if (activeCategory === "card") {
      toast({
        title: "Card Payment Coming Soon",
        description: "Online card payments will be available soon. Please use a mobile wallet or bank transfer.",
      });
      return;
    }
    if (!selectedPayment || !transactionId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a payment method and enter transaction ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const allMethods = [...mobileWallets, ...pakistaniBanks];
    const selectedMethodName = allMethods.find(m => m.id === selectedPayment)?.name || selectedPayment;
    
    // If this is an existing booking (has id), update it with payment info
    if ((bookingDetails as any).id) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({
            payment_status: 'pending_verification',
            transaction_id: transactionId,
            payment_method: selectedMethodName,
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
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount to Pay</p>
                      <p className="font-heading text-3xl font-bold text-primary">
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

                {/* Payment Category Selection */}
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-4">
                    Select Payment Method
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {paymentCategories.map((cat) => {
                      const CatIcon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { setActiveCategory(cat.id); setSelectedPayment(null); }}
                          className={cn(
                            "p-4 rounded-xl border-2 text-center transition-all hover:shadow-md",
                            activeCategory === cat.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <CatIcon className={cn("h-6 w-6 mx-auto mb-2", activeCategory === cat.id ? "text-primary" : "text-muted-foreground")} />
                          <p className="font-semibold text-sm">{cat.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Wallets */}
                  {activeCategory === "mobile" && (
                    <div className="grid grid-cols-2 gap-3">
                      {mobileWallets.map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => setSelectedPayment(wallet.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-center transition-all hover:shadow-md",
                            selectedPayment === wallet.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl text-white",
                            wallet.color
                          )}>
                            {wallet.logo}
                          </div>
                          <p className="font-medium text-sm">{wallet.shortName}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {activeCategory === "bank" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {pakistaniBanks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedPayment(bank.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-center transition-all hover:shadow-md",
                            selectedPayment === bank.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border hover:border-primary/50"
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
                  )}

                  {/* Credit / Debit Card */}
                  {activeCategory === "card" && (
                    <div className="bg-card rounded-2xl border border-border p-6 text-center">
                      <div className="flex justify-center gap-4 mb-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">
                          VISA
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm">
                          Mastercard
                        </div>
                      </div>
                      <Badge variant="outline" className="mb-3">Coming Soon</Badge>
                      <p className="text-muted-foreground text-sm">
                        Online card payments via Visa &amp; Mastercard will be available soon.
                        <br />Please use JazzCash, EasyPaisa, or Bank Transfer for now.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveCategory("mobile")}
                      >
                        Use Mobile Wallet Instead
                      </Button>
                    </div>
                  )}
                </div>

                {/* Payment Details */}
                {selectedMethodDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-card rounded-2xl border border-border p-6 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xl text-white",
                        selectedMethodDetails.color
                      )}>
                        {selectedMethodDetails.logo}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold">{selectedMethodDetails.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedMethodDetails.branchName}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Account Title</p>
                          <p className="font-medium">{selectedMethodDetails.accountTitle}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(selectedMethodDetails.accountTitle, "Account Title")}
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
                          <p className="text-xs text-muted-foreground">Account Number / Mobile</p>
                          <p className="font-mono font-medium">{selectedMethodDetails.accountNumber}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(selectedMethodDetails.accountNumber, "Account Number")}
                        >
                          {copiedField === "Account Number" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {selectedMethodDetails.iban && (
                        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">IBAN</p>
                            <p className="font-mono font-medium text-sm">{selectedMethodDetails.iban}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedMethodDetails.iban, "IBAN")}
                          >
                            {copiedField === "IBAN" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}

                      {selectedMethodDetails.branchCode && (
                        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">Branch Code</p>
                            <p className="font-mono font-medium">{selectedMethodDetails.branchCode}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedMethodDetails.branchCode, "Branch Code")}
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
                {selectedPayment && activeCategory !== "card" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-base">Transaction ID / Reference Number</Label>
                      <Input
                        placeholder="Enter your transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="h-14 text-base"
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter the transaction ID from your transfer receipt
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
                  <Shield className="h-5 w-5 text-primary" />
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
                    <span className="text-primary">PKR {bookingDetails.total.toLocaleString()}</span>
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
