import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 5, 2026</p>

        <div className="prose prose-lg max-w-none text-foreground space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Required for the website to function properly. These enable core features like security, 
                  authentication, and accessibility. Cannot be disabled.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Functional Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Help us remember your preferences such as language settings, login information, 
                  and theme preferences to provide a personalized experience.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Help us understand how visitors interact with our website by collecting anonymous 
                  information about pages visited, time spent, and any errors encountered.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Used to track visitors across websites to display relevant advertisements. 
                  These cookies may be set by our advertising partners.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may use third-party services that set their own cookies, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong className="text-foreground">Payment Processors:</strong> For secure payment processing</li>
              <li><strong className="text-foreground">Social Media:</strong> For social sharing features</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong className="text-foreground">Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through their settings</li>
              <li><strong className="text-foreground">Cookie Preferences:</strong> Use our cookie preference center to manage non-essential cookies</li>
              <li><strong className="text-foreground">Opt-out Links:</strong> Many advertising networks offer opt-out mechanisms</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Note: Disabling certain cookies may affect the functionality of our website and your user experience.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">5. Cookie Duration</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies can be either session cookies (deleted when you close your browser) or persistent 
              cookies (remain on your device for a set period). Our essential cookies typically last for 
              the duration of your session, while preference cookies may last up to 1 year.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at:
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
