import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 5, 2026</p>

        <div className="prose prose-lg max-w-none text-foreground space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using BookFarm, you agree to be bound by these Terms of Service and all 
              applicable laws and regulations. If you do not agree with any of these terms, you are 
              prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              BookFarm is a platform that connects customers with farmhouse venues and event service vendors. 
              We facilitate bookings but do not own or operate the properties or provide the services directly. 
              Property owners and vendors are independent third parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">To use certain features, you must create an account. You agree to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">4. Bookings and Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">When making a booking:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>You agree to pay all charges associated with your booking</li>
              <li>Prices are displayed in the local currency and include applicable taxes</li>
              <li>Payment is processed securely through our payment partners</li>
              <li>Booking confirmation is subject to property owner approval</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">5. Cancellation Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cancellation policies vary by property and are displayed during the booking process. 
              Generally, cancellations made more than 7 days before the event date may receive a full refund. 
              Late cancellations may be subject to fees or forfeiture of payment.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">6. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Use the service for any unlawful purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with the proper functioning of the platform</li>
              <li>Attempt to gain unauthorized access to any systems</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">7. Property Owner and Vendor Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              Property owners and vendors are responsible for the accuracy of their listings, 
              maintaining their properties and services, and complying with all applicable laws. 
              BookFarm is not liable for the quality or safety of third-party services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              BookFarm shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages arising from your use of the service. Our total liability shall not 
              exceed the amount paid by you for the specific booking in question.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on BookFarm, including logos, text, graphics, and software, is the property 
              of BookFarm or its licensors and is protected by intellectual property laws. You may not 
              reproduce or distribute any content without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: legal@bookfarm.com<br />
              Address: San Francisco, CA
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
