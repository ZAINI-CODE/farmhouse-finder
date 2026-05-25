import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8">Effective Date: January 6, 2026</p>

        <div className="space-y-10 text-foreground">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using BookFarm, you confirm that you are at least 18 years old and agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the platform immediately.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">2. Platform Role</h2>
            <p className="text-muted-foreground leading-relaxed">
              BookFarm operates as an online marketplace connecting property owners, vendors, and customers. We do not own, manage, or control the properties or services listed. All transactions are between users directly.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You are responsible for:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and up-to-date information</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">4. Listings, Bookings & Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              All listings are created by independent property owners and vendors. BookFarm does not guarantee accuracy, availability, or quality of listings. Payment processing is facilitated through third-party providers; we are not responsible for payment disputes between users.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">5. Vendor & Customer Obligations</h2>
            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">Vendors must:</strong></p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Provide accurate listing information and pricing</li>
                  <li>Honor confirmed bookings and communicate promptly</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">Customers must:</strong></p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Provide accurate booking information</li>
                  <li>Respect property rules and vendor policies</li>
                  <li>Complete payments as agreed</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">6. Prohibited Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You may not:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Use the platform for illegal activities</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Interfere with platform operations or security</li>
              <li>Harvest user data or circumvent access restrictions</li>
              <li>Engage in harassment or discriminatory behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">7. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, branding, and technology on BookFarm are owned by or licensed to us. You may not copy, modify, distribute, or create derivative works without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, BookFarm is not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including disputes between users, property damage, or service failures by third parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">9. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your access at any time, with or without notice, for violations of these terms or any conduct we deem harmful to the platform or other users.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms & Conditions periodically. Continued use of the platform after changes constitutes acceptance. We encourage you to review this page regularly.
            </p>
          </section>

          <section className="pt-6 border-t border-border">
            <p className="text-muted-foreground">
              For questions, contact us at <a href="mailto:legal@bookfarm.com" className="text-accent hover:underline">legal@bookfarm.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
