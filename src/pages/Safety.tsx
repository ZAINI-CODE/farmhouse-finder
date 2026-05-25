import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  CheckCircle, 
  Users, 
  Building, 
  Camera, 
  Phone, 
  AlertTriangle,
  Heart,
  Lock,
  Eye
} from "lucide-react";

const safetyFeatures = [
  {
    icon: CheckCircle,
    title: "Verified Properties",
    description: "Every property undergoes thorough verification including document checks, site visits, and safety assessments before listing."
  },
  {
    icon: Users,
    title: "Verified Vendors",
    description: "All vendors are screened for business legitimacy, portfolio quality, and customer feedback before they can offer services."
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "All transactions are encrypted with industry-standard SSL. We never store your complete payment details on our servers."
  },
  {
    icon: Eye,
    title: "Review System",
    description: "Genuine reviews from verified customers help you make informed decisions about properties and vendors."
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Our support team is available around the clock to assist with any safety concerns or emergencies."
  },
  {
    icon: Shield,
    title: "Booking Protection",
    description: "Your booking is protected. If a host cancels, we help you find alternatives or provide a full refund."
  },
];

const propertyStandards = [
  "Fire safety equipment (extinguishers, smoke detectors)",
  "Emergency exits clearly marked and accessible",
  "First aid kit available on premises",
  "Adequate lighting in common areas and parking",
  "Clean and hygienic facilities",
  "Proper electrical wiring and equipment",
  "Safe water supply for drinking and use",
  "Secure perimeter and access control",
];

const guestGuidelines = [
  {
    title: "Before Your Event",
    items: [
      "Verify the property address and contact details",
      "Communicate your requirements clearly with the host",
      "Review the property rules and cancellation policy",
      "Share your itinerary with a trusted contact",
      "Confirm emergency contact numbers"
    ]
  },
  {
    title: "During Your Event",
    items: [
      "Respect the property and neighborhood",
      "Follow all property rules and guidelines",
      "Report any safety concerns immediately",
      "Keep emergency exits accessible",
      "Stay within the agreed guest capacity"
    ]
  },
  {
    title: "After Your Event",
    items: [
      "Leave the property in good condition",
      "Report any damages or issues promptly",
      "Leave an honest review to help future guests",
      "Provide feedback to help us improve"
    ]
  }
];

export default function Safety() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-accent-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Safety at BookFarm
            </h1>
            <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto">
              Your safety is our top priority. We've built multiple layers of protection to ensure you have a secure and worry-free experience.
            </p>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">How We Keep You Safe</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {safetyFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Property Standards */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold">Property Safety Standards</h2>
                  <p className="text-muted-foreground">All listed properties must meet these requirements</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {propertyStandards.map((standard, index) => (
                  <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-foreground">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Guest Guidelines */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">Guest Safety Guidelines</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {guestGuidelines.map((section, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-semibold mb-4">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
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

        {/* Report Concerns */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-4">Report a Safety Concern</h2>
              <p className="text-muted-foreground mb-8">
                If you encounter any safety issues during your booking, please report them immediately. 
                We take all concerns seriously and will investigate promptly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Card className="flex-1 max-w-xs">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="font-semibold">Emergency Hotline</p>
                    <a href="tel:+923001234567" className="text-accent hover:underline">+92 300 123 4567</a>
                  </CardContent>
                </Card>
                <Card className="flex-1 max-w-xs">
                  <CardContent className="p-6 text-center">
                    <Camera className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="font-semibold">Report via Email</p>
                    <a href="mailto:safety@bookfarm.com" className="text-accent hover:underline">safety@bookfarm.com</a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Community Trust */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Heart className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="font-heading text-2xl font-bold mb-4">Built on Trust</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our community of property owners, vendors, and guests works together to maintain high standards. 
              We encourage respectful behavior and honest communication to create positive experiences for everyone.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
