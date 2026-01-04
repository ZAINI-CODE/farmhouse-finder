import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  type: "booking_confirmed" | "payment_received" | "payment_verified" | "booking_reminder";
  recipientEmail: string;
  recipientName: string;
  bookingDetails: {
    bookingId: string;
    propertyName: string;
    eventDate: string;
    guestCount: number;
    totalAmount: number;
    transactionId?: string;
  };
}

const getEmailContent = (req: BookingNotificationRequest) => {
  const { type, recipientName, bookingDetails } = req;
  
  const baseStyles = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f9fafb;
    padding: 40px 20px;
  `;
  
  const cardStyles = `
    background: white;
    border-radius: 16px;
    padding: 32px;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  `;

  switch (type) {
    case "booking_confirmed":
      return {
        subject: `🎉 Booking Confirmed - ${bookingDetails.propertyName}`,
        html: `
          <div style="${baseStyles}">
            <div style="${cardStyles}">
              <h1 style="color: #16a34a; margin-bottom: 16px;">✅ Booking Confirmed!</h1>
              <p>Dear ${recipientName},</p>
              <p>Great news! Your booking has been confirmed.</p>
              
              <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="margin-top: 0;">Booking Details</h3>
                <p><strong>Property:</strong> ${bookingDetails.propertyName}</p>
                <p><strong>Event Date:</strong> ${bookingDetails.eventDate}</p>
                <p><strong>Guests:</strong> ${bookingDetails.guestCount}</p>
                <p><strong>Total Amount:</strong> PKR ${bookingDetails.totalAmount.toLocaleString()}</p>
                <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
              </div>
              
              <p>You can view your booking details and download your receipt from your dashboard.</p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
                Thank you for choosing BookFarm!<br>
                The BookFarm Team
              </p>
            </div>
          </div>
        `,
      };

    case "payment_received":
      return {
        subject: `💰 Payment Received - Verification in Progress`,
        html: `
          <div style="${baseStyles}">
            <div style="${cardStyles}">
              <h1 style="color: #f59e0b; margin-bottom: 16px;">⏳ Payment Under Verification</h1>
              <p>Dear ${recipientName},</p>
              <p>We have received your payment submission and it is being verified.</p>
              
              <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #fbbf24;">
                <h3 style="margin-top: 0; color: #92400e;">Payment Details</h3>
                <p><strong>Property:</strong> ${bookingDetails.propertyName}</p>
                <p><strong>Amount:</strong> PKR ${bookingDetails.totalAmount.toLocaleString()}</p>
                <p><strong>Transaction ID:</strong> ${bookingDetails.transactionId || 'N/A'}</p>
              </div>
              
              <p>Our team will verify your payment within 24 hours. You will receive a confirmation email once verified.</p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
                Best regards,<br>
                The BookFarm Team
              </p>
            </div>
          </div>
        `,
      };

    case "payment_verified":
      return {
        subject: `✅ Payment Verified - ${bookingDetails.propertyName}`,
        html: `
          <div style="${baseStyles}">
            <div style="${cardStyles}">
              <h1 style="color: #16a34a; margin-bottom: 16px;">✅ Payment Verified!</h1>
              <p>Dear ${recipientName},</p>
              <p>Your payment has been successfully verified!</p>
              
              <div style="background: #dcfce7; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #86efac;">
                <h3 style="margin-top: 0; color: #166534;">Confirmed Booking</h3>
                <p><strong>Property:</strong> ${bookingDetails.propertyName}</p>
                <p><strong>Event Date:</strong> ${bookingDetails.eventDate}</p>
                <p><strong>Guests:</strong> ${bookingDetails.guestCount}</p>
                <p><strong>Total Paid:</strong> PKR ${bookingDetails.totalAmount.toLocaleString()}</p>
              </div>
              
              <p>Your booking is now fully confirmed. You can download your receipt from your dashboard.</p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
                Thank you for your payment!<br>
                The BookFarm Team
              </p>
            </div>
          </div>
        `,
      };

    case "booking_reminder":
      return {
        subject: `📅 Reminder: Your Event at ${bookingDetails.propertyName} is Coming Up!`,
        html: `
          <div style="${baseStyles}">
            <div style="${cardStyles}">
              <h1 style="color: #3b82f6; margin-bottom: 16px;">📅 Event Reminder</h1>
              <p>Dear ${recipientName},</p>
              <p>This is a friendly reminder about your upcoming event!</p>
              
              <div style="background: #dbeafe; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #93c5fd;">
                <h3 style="margin-top: 0; color: #1e40af;">Event Details</h3>
                <p><strong>Property:</strong> ${bookingDetails.propertyName}</p>
                <p><strong>Date:</strong> ${bookingDetails.eventDate}</p>
                <p><strong>Guests:</strong> ${bookingDetails.guestCount}</p>
              </div>
              
              <p>We look forward to hosting your event. If you have any questions, please contact us.</p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
                See you soon!<br>
                The BookFarm Team
              </p>
            </div>
          </div>
        `,
      };

    default:
      throw new Error(`Unknown notification type: ${type}`);
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notificationRequest: BookingNotificationRequest = await req.json();
    
    console.log("Sending notification:", notificationRequest.type, "to:", notificationRequest.recipientEmail);
    
    const { subject, html } = getEmailContent(notificationRequest);

    const emailResponse = await resend.emails.send({
      from: "BookFarm <onboarding@resend.dev>",
      to: [notificationRequest.recipientEmail],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
