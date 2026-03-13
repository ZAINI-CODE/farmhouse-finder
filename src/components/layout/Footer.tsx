import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { SocialLinks } from "@/components/SocialLinks";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "Cancellation", href: "/cancellation" },
    { label: "Contact Us", href: "/contact" },
  ],
  hosting: [
    { label: "List Your Property", href: "/register?type=owner" },
    { label: "Become a Vendor", href: "/register?type=vendor" },
    { label: "Resources", href: "/resources" },
    { label: "Community", href: "/community" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};



export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: "Invalid email",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const baseUrl = window.location.origin;
      
      const { data, error } = await supabase.functions.invoke("send-newsletter-verification", {
        body: { email: validation.data, baseUrl },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast({
          title: "Error",
          description: "Failed to send verification email. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.message === "already_verified") {
        toast({
          title: "Already verified",
          description: "This email is already verified and subscribed.",
        });
      } else if (data?.message === "already_subscribed") {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed. Check your inbox for the verification email.",
        });
      } else {
        setIsSubscribed(true);
        setEmail("");
        toast({
          title: "Check your inbox!",
          description: "We've sent a verification link to your email address.",
        });
      }
    } catch (err) {
      console.error("Subscribe error:", err);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-heading text-2xl font-semibold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-primary-foreground/70">
                Get the latest venues and exclusive offers delivered to your inbox
              </p>
            </div>
          {isSubscribed ? (
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle className="h-5 w-5" />
              <span>Check your email to verify your subscription!</span>
            </div>
          ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
                  disabled={isLoading}
                  required
                />
                <Button variant="accent" className="shrink-0" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-heading font-bold text-xl">B</span>
              </div>
              <span className="font-heading font-bold text-xl">BookFarm</span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Discover unique farmhouses and event venues. Connect with trusted vendors for your perfect celebration.
            </p>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:funfarmhousedeals@gmail.com" className="hover:text-accent transition-colors">funfarmhousedeals@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <a href="https://wa.me/923038032173" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">0303-8032173 (WhatsApp)</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Pakistan</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hosting Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Hosting</h4>
            <ul className="space-y-3">
              {footerLinks.hosting.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} BookFarm. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
            <SocialLinks
                linkClassName="bg-primary-foreground/10 text-primary-foreground/70 hover:bg-accent hover:text-accent-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
