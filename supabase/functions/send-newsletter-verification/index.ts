import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  baseUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, baseUrl }: VerificationRequest = await req.json();

    console.log(`Processing newsletter verification for: ${email}`);

    if (!email || !baseUrl) {
      throw new Error("Email and baseUrl are required");
    }

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if email already exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .select("id, is_verified, verification_token")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing subscription:", checkError);
      throw new Error("Failed to check subscription status");
    }

    let verificationToken: string;

    if (existing) {
      if (existing.is_verified) {
        console.log(`Email ${email} is already verified`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "already_verified" 
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      // Use existing token or generate new one
      verificationToken = existing.verification_token;
      console.log(`Using existing verification token for ${email}`);
    } else {
      // Insert new subscription
      const { data: newSub, error: insertError } = await supabaseAdmin
        .from("newsletter_subscriptions")
        .insert({ email })
        .select("verification_token")
        .single();

      if (insertError) {
        console.error("Error inserting subscription:", insertError);
        if (insertError.code === "23505") {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: "already_subscribed" 
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
        throw new Error("Failed to create subscription");
      }

      verificationToken = newSub.verification_token;
      console.log(`Created new subscription for ${email}`);
    }

    // Build verification URL
    const verificationUrl = `${baseUrl}/verify-newsletter?token=${verificationToken}`;

    console.log(`Sending verification email to ${email}`);

    // Send verification email
    const emailResponse = await resend.emails.send({
      from: "BookFarm <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your newsletter subscription",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4A5D4F 0%, #3A4D3F 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">BookFarm</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #4A5D4F; margin-top: 0;">Verify Your Email</h2>
            
            <p>Thank you for subscribing to the BookFarm newsletter! Please click the button below to verify your email address.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background: #4A5D4F; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; margin: 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #4A5D4F;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} BookFarm. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "verification_sent" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter-verification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
