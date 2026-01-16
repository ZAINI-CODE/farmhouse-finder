import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle, XCircle, Info } from "lucide-react";

const cancellationTiers = [
  {
    period: "More than 30 days before event",
    refund: "100% refund",
    description: "Full refund of the booking amount, minus a small processing fee (PKR 500).",
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    period: "15-30 days before event",
    refund: "75% refund",
    description: "75% of the booking amount will be refunded to your original payment method.",
    icon: CheckCircle,
    color: "text-green-500"
  },
  {
    period: "7-14 days before event",
    refund: "50% refund",
    description: "50% of the booking amount will be refunded. Consider rescheduling instead.",
    icon: Clock,
    color: "text-yellow-600"
  },
  {
    period: "3-6 days before event",
    refund: "25% refund",
    description: "25% refund available. We strongly recommend rescheduling at this stage.",
    icon: AlertTriangle,
    color: "text-orange-500"
  },
  {
    period: "Less than 3 days before event",
    refund: "No refund",
    description: "Unfortunately, cancellations within 72 hours are non-refundable.",
    icon: XCircle,
    color: "text-red-500"
  }
];

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              We understand plans can change. Here's everything you need to know about cancellations and refunds.
            </p>
          </div>
        </section>

        {/* Cancellation Tiers */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-heading text-2xl font-bold mb-8 text-center">Refund Schedule</h2>
            <div className="space-y-4">
              {cancellationTiers.map((tier, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${tier.color} mt-1`}>
                        <tier.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{tier.period}</h3>
                          <span className={`font-bold ${tier.color}`}>{tier.refund}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{tier.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Cancel */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-heading text-2xl font-bold mb-8">How to Cancel Your Booking</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Log into Your Account</h3>
                  <p className="text-muted-foreground">Sign in to your BookFarm account using your registered email and password.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Go to Your Dashboard</h3>
                  <p className="text-muted-foreground">Navigate to "My Bookings" section in your dashboard.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Select the Booking</h3>
                  <p className="text-muted-foreground">Find the booking you wish to cancel and click on it to view details.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Request Cancellation</h3>
                  <p className="text-muted-foreground">Click "Cancel Booking" and provide a reason. You'll receive a confirmation email with refund details.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-heading text-2xl font-bold mb-8">Important Information</h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Refund Processing Time
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Refunds are processed within 7-10 business days after cancellation approval. The amount will be credited to your original payment method. Bank processing times may add an additional 3-5 business days.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Vendor Services
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you've booked additional vendor services (catering, photography, etc.), each vendor may have their own cancellation policy. Please review their terms before canceling. Vendor service refunds are processed separately.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Rescheduling Option
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instead of canceling, consider rescheduling your event. Rescheduling is free if done more than 14 days before the original event date (subject to venue availability). A nominal fee of PKR 2,000 applies for rescheduling within 14 days.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Force Majeure
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  In cases of natural disasters, government restrictions, or other unforeseen circumstances beyond your control, full refunds or free rescheduling may be offered at BookFarm's discretion. Contact our support team with relevant documentation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Property Owner Cancellations
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If a property owner cancels your booking, you will receive a full 100% refund plus a PKR 5,000 credit towards your next booking. We'll also help you find an alternative venue at no extra cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Need Help with a Cancellation?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is available to assist you with any cancellation-related queries.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:support@bookfarm.com" className="text-primary hover:underline">
                support@bookfarm.com
              </a>
              <span className="text-muted-foreground">|</span>
              <a href="tel:+923001234567" className="text-primary hover:underline">
                +92 300 123 4567
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
