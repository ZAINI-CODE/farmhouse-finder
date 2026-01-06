import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: January 6, 2026</p>

        <div className="space-y-10 text-foreground">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">1. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help us recognize your browser, remember preferences, and understand how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">2. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <p className="text-foreground font-medium">Essential Cookies</p>
                <p className="text-muted-foreground text-sm">Required for core functionality like authentication, security, and booking processing. Cannot be disabled.</p>
              </div>
              <div>
                <p className="text-foreground font-medium">Functional Cookies</p>
                <p className="text-muted-foreground text-sm">Remember your preferences, language settings, and personalization choices.</p>
              </div>
              <div>
                <p className="text-foreground font-medium">Analytics Cookies</p>
                <p className="text-muted-foreground text-sm">Help us understand how visitors interact with our platform to improve performance and user experience.</p>
              </div>
              <div>
                <p className="text-foreground font-medium">Marketing Cookies</p>
                <p className="text-muted-foreground text-sm">Used to deliver relevant advertisements and measure campaign effectiveness.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">3. Purpose of Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We use cookies to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Keep you signed in securely</li>
              <li>Remember your search preferences and filters</li>
              <li>Analyze traffic patterns and platform usage</li>
              <li>Personalize content and recommendations</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Some cookies are placed by trusted third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong className="text-foreground">Analytics providers</strong> (e.g., Google Analytics)</li>
              <li><strong className="text-foreground">Payment processors</strong> for secure transactions</li>
              <li><strong className="text-foreground">Advertising partners</strong> for relevant ads</li>
              <li><strong className="text-foreground">Social media platforms</strong> for sharing features</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              These third parties have their own privacy policies governing cookie use.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">5. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong className="text-foreground">Block all cookies:</strong> May limit platform functionality</li>
              <li><strong className="text-foreground">Delete existing cookies:</strong> Clears stored preferences</li>
              <li><strong className="text-foreground">Allow only essential cookies:</strong> Basic functionality remains</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Note: Disabling cookies may affect your experience, including login persistence and personalized features.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-3">6. Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy to reflect changes in technology or legal requirements. Check this page periodically for the latest information.
            </p>
          </section>

          <section className="pt-6 border-t border-border">
            <p className="text-muted-foreground">
              Questions about cookies? Contact us at <a href="mailto:privacy@bookfarm.com" className="text-primary hover:underline">privacy@bookfarm.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
