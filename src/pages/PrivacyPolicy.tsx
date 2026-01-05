import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 5, 2026</p>

        <div className="prose prose-lg max-w-none text-foreground space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to BookFarm. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, and billing information when you create an account or make a booking.</li>
              <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our platform, including pages visited and features used.</li>
              <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, and device identifiers.</li>
              <li><strong className="text-foreground">Location Data:</strong> General location information to provide relevant venue and vendor recommendations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Process bookings and payments</li>
              <li>Send booking confirmations and reminders</li>
              <li>Provide customer support</li>
              <li>Improve our services and user experience</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We share your information with property owners and vendors only as necessary to fulfill your bookings. 
              We do not sell your personal data to third parties. We may share data with service providers who help 
              us operate our platform, subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption, 
              secure servers, and regular security audits. However, no method of transmission over the internet 
              is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data for as long as necessary to provide our services and comply with 
              legal obligations. Booking records are retained for a minimum of 7 years for tax and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy or your personal data, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: privacy@bookfarm.com<br />
              Address: San Francisco, CA
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
