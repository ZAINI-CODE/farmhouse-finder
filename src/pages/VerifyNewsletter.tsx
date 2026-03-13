import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type VerificationStatus = "loading" | "success" | "error" | "invalid";

export default function VerifyNewsletter() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("invalid");
        setMessage("No verification token provided.");
        return;
      }

      try {
        // Find subscription by token
        const { data: subscription, error: findError } = await supabase
          .from("newsletter_subscriptions")
          .select("id, email, is_verified")
          .eq("verification_token", token)
          .maybeSingle();

        if (findError) {
          console.error("Error finding subscription:", findError);
          setStatus("error");
          setMessage("An error occurred while verifying your email.");
          return;
        }

        if (!subscription) {
          setStatus("invalid");
          setMessage("Invalid or expired verification link.");
          return;
        }

        if (subscription.is_verified) {
          setStatus("success");
          setMessage("Your email has already been verified!");
          return;
        }

        // Update subscription to verified
        const { error: updateError } = await supabase
          .from("newsletter_subscriptions")
          .update({
            is_verified: true,
            verified_at: new Date().toISOString(),
          })
          .eq("id", subscription.id);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          setStatus("error");
          setMessage("Failed to verify your email. Please try again.");
          return;
        }

        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
              <h1 className="text-2xl font-heading font-bold">Verifying your email...</h1>
              <p className="text-muted-foreground">Please wait while we verify your subscription.</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-green-600">Email Verified!</h1>
              <p className="text-muted-foreground">{message}</p>
              <p className="text-muted-foreground">
                You'll now receive the latest venues and exclusive offers in your inbox.
              </p>
              <Button asChild className="mt-4">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-destructive">Verification Failed</h1>
              <p className="text-muted-foreground">{message}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          )}

          {status === "invalid" && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Mail className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-heading font-bold">Invalid Link</h1>
              <p className="text-muted-foreground">{message}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
