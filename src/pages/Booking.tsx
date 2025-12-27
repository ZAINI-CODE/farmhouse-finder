import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon, Users, MapPin, Check, ChevronRight,
  CreditCard, Shield, ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import property1 from "@/assets/property-1.jpg";

const packages = [
  {
    id: "basic",
    name: "Basic Package",
    price: 1500,
    features: [
      "Venue rental for 8 hours",
      "Basic setup & cleanup",
      "Parking for 50 vehicles",
      "Tables & chairs included",
    ],
  },
  {
    id: "premium",
    name: "Premium Package",
    price: 2500,
    features: [
      "Venue rental for 12 hours",
      "Premium setup & decoration",
      "Parking for 100 vehicles",
      "Tables, chairs & linens",
      "Sound system included",
      "Event coordinator",
    ],
    popular: true,
  },
  {
    id: "luxury",
    name: "Luxury Package",
    price: 4000,
    features: [
      "Venue rental for 24 hours",
      "Full luxury decoration",
      "Unlimited parking",
      "Premium furniture & linens",
      "Professional sound & lighting",
      "Dedicated event coordinator",
      "Catering kitchen access",
      "Overnight accommodation",
    ],
  },
];

const addOns = [
  { id: "catering", name: "Catering Service", price: 45, unit: "per person" },
  { id: "photography", name: "Photography Package", price: 800, unit: "flat rate" },
  { id: "decoration", name: "Premium Decoration", price: 500, unit: "flat rate" },
  { id: "dj", name: "DJ & Music", price: 600, unit: "flat rate" },
];

export default function Booking() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState(50);
  const [selectedPackage, setSelectedPackage] = useState("premium");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const currentPackage = packages.find(p => p.id === selectedPackage)!;
  
  const calculateTotal = () => {
    let total = currentPackage.price;
    selectedAddOns.forEach(addonId => {
      const addon = addOns.find(a => a.id === addonId);
      if (addon) {
        if (addon.unit === "per person") {
          total += addon.price * guests;
        } else {
          total += addon.price;
        }
      }
    });
    return total;
  };

  const serviceFee = Math.round(calculateTotal() * 0.05);
  const total = calculateTotal() + serviceFee;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    toast({
      title: "Booking Request Submitted!",
      description: "The property owner will review your request and get back to you within 24 hours.",
    });
    navigate("/");
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
            <Link to="/properties" className="hover:text-foreground transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-foreground">Book Venue</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                    step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "w-16 md:w-24 h-1 mx-2",
                    step > s ? "bg-primary" : "bg-secondary"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                      Select Date & Guests
                    </h1>
                    <p className="text-muted-foreground">
                      Choose when you'd like to host your event
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base">Event Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-14 justify-start text-left font-normal text-base",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Number of Guests</Label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          min={10}
                          max={200}
                          className="h-14 pl-12 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Package Selection */}
                  <div>
                    <h2 className="font-heading text-xl font-semibold mb-4">
                      Select Your Package
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={cn(
                            "relative p-5 rounded-xl border-2 text-left transition-all",
                            selectedPackage === pkg.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {pkg.popular && (
                            <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                              Most Popular
                            </span>
                          )}
                          <h3 className="font-heading font-semibold text-lg mb-1">
                            {pkg.name}
                          </h3>
                          <p className="text-2xl font-bold text-primary mb-3">
                            ${pkg.price.toLocaleString()}
                          </p>
                          <ul className="space-y-2">
                            {pkg.features.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                {feature}
                              </li>
                            ))}
                            {pkg.features.length > 4 && (
                              <li className="text-sm text-primary font-medium">
                                +{pkg.features.length - 4} more features
                              </li>
                            )}
                          </ul>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Add-ons */}
                  <div>
                    <h2 className="font-heading text-xl font-semibold mb-4">
                      Add Extra Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addOns.map((addon) => (
                        <button
                          key={addon.id}
                          onClick={() => toggleAddOn(addon.id)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                            selectedAddOns.includes(addon.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                              selectedAddOns.includes(addon.id)
                                ? "bg-primary border-primary"
                                : "border-muted-foreground"
                            )}>
                              {selectedAddOns.includes(addon.id) && (
                                <Check className="h-4 w-4 text-primary-foreground" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{addon.name}</p>
                              <p className="text-sm text-muted-foreground">{addon.unit}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-primary">
                            ${addon.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="xl"
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={!date}
                  >
                    Continue to Details
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="mb-4"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                      Your Contact Details
                    </h1>
                    <p className="text-muted-foreground">
                      Let us know how to reach you
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-base">Full Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                          className="h-14 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base">Email Address</Label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          className="h-14 text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className="h-14 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Special Requests (Optional)</Label>
                      <textarea
                        placeholder="Any special requirements or requests for your event..."
                        value={contactInfo.notes}
                        onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                        className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-background text-base resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <Button
                    size="xl"
                    className="w-full"
                    onClick={() => setStep(3)}
                    disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="mb-4"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                      Review & Confirm
                    </h1>
                    <p className="text-muted-foreground">
                      Almost there! Review your booking details
                    </p>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                    <h3 className="font-heading font-semibold text-lg">Booking Summary</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Event Date</span>
                        <span className="font-medium">{date ? format(date, "PPP") : "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Number of Guests</span>
                        <span className="font-medium">{guests} guests</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Package</span>
                        <span className="font-medium">{currentPackage.name}</span>
                      </div>
                      {selectedAddOns.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Add-ons</span>
                          <span className="font-medium">{selectedAddOns.length} services</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact Name</span>
                        <span className="font-medium">{contactInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{contactInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{contactInfo.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Notice */}
                  <div className="bg-accent/10 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Secure Booking</p>
                      <p className="text-sm text-muted-foreground">
                        No payment required now. The property owner will confirm your booking and you'll receive payment instructions via email.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="xl"
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Submit Booking Request
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    By submitting, you agree to our Terms of Service and Cancellation Policy
                  </p>
                </motion.div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  {/* Property Preview */}
                  <div className="relative aspect-video">
                    <img
                      src={property1}
                      alt="Sunset Valley Estate"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg mb-1">
                      Sunset Valley Estate
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      Napa Valley, California
                    </div>

                    <Separator className="my-4" />

                    {/* Price Breakdown */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{currentPackage.name}</span>
                        <span>${currentPackage.price.toLocaleString()}</span>
                      </div>
                      
                      {selectedAddOns.map(addonId => {
                        const addon = addOns.find(a => a.id === addonId);
                        if (!addon) return null;
                        const price = addon.unit === "per person" ? addon.price * guests : addon.price;
                        return (
                          <div key={addonId} className="flex justify-between">
                            <span className="text-muted-foreground">{addon.name}</span>
                            <span>${price.toLocaleString()}</span>
                          </div>
                        );
                      })}

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service fee</span>
                        <span>${serviceFee.toLocaleString()}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span className="text-primary">${total.toLocaleString()}</span>
                      </div>
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
