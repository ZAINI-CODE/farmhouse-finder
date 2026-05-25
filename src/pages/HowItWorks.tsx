import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Calendar, 
  CreditCard, 
  PartyPopper, 
  Users, 
  Building, 
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const customerSteps = [
  {
    step: 1,
    icon: Search,
    title: "Browse & Search",
    description: "Explore our collection of verified farmhouses and event venues. Use filters to find the perfect location for your celebration based on capacity, amenities, and budget."
  },
  {
    step: 2,
    icon: Calendar,
    title: "Check Availability",
    description: "Select your preferred date and view real-time availability. Check pricing, included amenities, and property rules before proceeding."
  },
  {
    step: 3,
    icon: Users,
    title: "Add Services",
    description: "Enhance your event with verified vendors. Choose from catering, photography, decoration, music, and more — all in one place."
  },
  {
    step: 4,
    icon: CreditCard,
    title: "Secure Booking",
    description: "Complete your booking with our secure payment system. Pay a deposit to confirm, with the balance due before your event."
  },
  {
    step: 5,
    icon: PartyPopper,
    title: "Celebrate!",
    description: "Enjoy your event at a beautiful venue with professional services. Our support team is available if you need any assistance."
  },
];

const ownerSteps = [
  {
    step: 1,
    icon: Building,
    title: "List Your Property",
    description: "Create a detailed listing with photos, amenities, pricing, and availability calendar. Our team helps optimize your listing for visibility."
  },
  {
    step: 2,
    icon: CheckCircle,
    title: "Get Verified",
    description: "Complete our verification process including document submission and optional site visit. Verified properties get more bookings."
  },
  {
    step: 3,
    icon: Calendar,
    title: "Manage Bookings",
    description: "Accept or decline booking requests. Manage your calendar, set custom pricing for peak seasons, and communicate with guests."
  },
  {
    step: 4,
    icon: CreditCard,
    title: "Receive Payments",
    description: "Get paid securely via bank transfer after each successful event. We handle payment collection and send you detailed statements."
  },
  {
    step: 5,
    icon: Star,
    title: "Grow Your Business",
    description: "Build your reputation through positive reviews. Top-rated properties get featured placement and more visibility."
  },
];

const benefits = [
  {
    title: "For Customers",
    items: [
      "Wide selection of verified venues",
      "Transparent pricing with no hidden fees",
      "One-stop shop for all event services",
      "Secure booking and payment",
      "24/7 customer support",
      "Flexible cancellation options"
    ]
  },
  {
    title: "For Property Owners",
    items: [
      "Free listing with no upfront costs",
      "Access to thousands of potential customers",
      "Easy-to-use booking management",
      "Secure and timely payments",
      "Marketing support and visibility",
      "Detailed analytics and insights"
    ]
  },
  {
    title: "For Vendors",
    items: [
      "Connect with event organizers",
      "Showcase your portfolio",
      "Receive booking requests directly",
      "Build your reputation with reviews",
      "Grow your customer base",
      "Dedicated vendor support"
    ]
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-accent-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              How BookFarm Works
            </h1>
            <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto">
              From finding the perfect venue to celebrating your special day — we make event planning simple and enjoyable.
            </p>
          </div>
        </section>

        {/* Customer Journey */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-4">For Event Planners</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Planning your dream event is just a few steps away
            </p>
            
            <div className="max-w-4xl mx-auto">
              {customerSteps.map((step, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-accent-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < customerSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-primary/20 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="h-5 w-5 text-accent" />
                      <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link to="/properties">
                  Browse Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Property Owner Journey */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-4">For Property Owners</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Turn your property into a revenue-generating event venue
            </p>
            
            <div className="max-w-4xl mx-auto">
              {ownerSteps.map((step, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < ownerSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-accent/20 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="h-5 w-5 text-accent" />
                      <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" variant="accent">
                <Link to="/register?type=owner">
                  List Your Property
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">Why Choose BookFarm?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-4">{benefit.title}</h3>
                    <ul className="space-y-3">
                      {benefit.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-accent-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-accent-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of happy customers and successful property owners on BookFarm.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/properties">Explore Venues</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-accent-foreground hover:bg-primary-foreground/10">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
