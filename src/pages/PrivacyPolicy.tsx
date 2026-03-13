import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: January 6, 2026</p>

        <div className="space-y-10 text-foreground">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect information to provide and improve our services:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong className="text-foreground">Account Information:</strong> Name, email, phone number, and payment details</li>
              <li><strong className="text-foreground">Booking Data:</strong> Reservation history, preferences, and communications</li>
              <li><strong className="text-foreground">Device & Usage Data:</strong> IP address, browser type, pages visited, and interaction patterns</li>
              <li><strong className="text-foreground">Location Data:</strong> General location to provide relevant recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Your information helps us:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Process bookings and facilitate transactions</li>
              <li>Send confirmations, reminders, and support communications</li>
              <li>Personalize your experience and recommendations</li>
              <li>Improve platform functionality and security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">3. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We share your information with:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong className="text-foreground">Property Owners & Vendors:</strong> To fulfill your bookings</li>
              <li><strong className="text-foreground">Payment Processors:</strong> To complete secure transactions</li>
              <li><strong className="text-foreground">Service Providers:</strong> For hosting, analytics, and customer support</li>
              <li><strong className="text-foreground">Legal Authorities:</strong> When required by law or to protect rights</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">4. Cookies & Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance functionality, analyze usage, and deliver personalized content. See our <a href="/cookies" className="text-accent hover:underline">Cookie Policy</a> for details on managing preferences.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">5. Data Protection & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures including encryption, secure servers, and regular audits. While we strive to protect your data, no transmission method is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Access, correct, or delete your personal data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, contact us at <a href="mailto:privacy@bookfarm.com" className="text-accent hover:underline">privacy@bookfarm.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">7. Policy Updates</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically. Material changes will be communicated via email or platform notification. Continued use after updates constitutes acceptance.
            </p>
          </section>

          <section className="pt-6 border-t border-border">
            <p className="text-muted-foreground">
              Questions? Contact us at <a href="mailto:privacy@bookfarm.com" className="text-accent hover:underline">privacy@bookfarm.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
