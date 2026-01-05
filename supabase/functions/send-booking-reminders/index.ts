import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting booking reminder job...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    console.log(`Looking for bookings on: ${tomorrowStr}`);

    // Fetch bookings for tomorrow that are confirmed
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        event_date,
        event_type,
        guest_count,
        total_amount,
        user_id,
        property_id,
        properties (
          title,
          location,
          address
        )
      `)
      .eq("event_date", tomorrowStr)
      .eq("status", "confirmed");

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      throw bookingsError;
    }

    console.log(`Found ${bookings?.length || 0} bookings for tomorrow`);

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No bookings to remind", count: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const booking of bookings) {
      try {
        // Get user profile for email
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("user_id", booking.user_id)
          .single();

        if (profileError || !profile?.email) {
          console.error(`Could not find profile for user ${booking.user_id}:`, profileError);
          errors.push(`Missing profile for booking ${booking.id}`);
          continue;
        }

        const property = booking.properties as { title: string; location: string; address: string } | null;
        const formattedDate = new Date(booking.event_date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
              .content { padding: 30px; }
              .reminder-badge { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 25px; }
              .reminder-badge h2 { color: #d97706; margin: 0; font-size: 20px; }
              .card { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-row:last-child { border-bottom: none; }
              .detail-label { color: #6b7280; font-weight: 500; }
              .detail-value { color: #111827; font-weight: 600; }
              .checklist { background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .checklist h3 { color: #059669; margin-top: 0; }
              .checklist ul { margin: 0; padding-left: 20px; }
              .checklist li { padding: 5px 0; color: #374151; }
              .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Booking Reminder</h1>
                <p>Your event is tomorrow!</p>
              </div>
              <div class="content">
                <p>Dear ${profile.full_name},</p>
                
                <div class="reminder-badge">
                  <h2>🎉 Your event is happening tomorrow!</h2>
                </div>
                
                <div class="card">
                  <div class="detail-row">
                    <span class="detail-label">📅 Event Date</span>
                    <span class="detail-value">${formattedDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🏠 Venue</span>
                    <span class="detail-value">${property?.title || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📍 Location</span>
                    <span class="detail-value">${property?.location || 'N/A'}</span>
                  </div>
                  ${property?.address ? `
                  <div class="detail-row">
                    <span class="detail-label">🗺️ Address</span>
                    <span class="detail-value">${property.address}</span>
                  </div>
                  ` : ''}
                  <div class="detail-row">
                    <span class="detail-label">🎊 Event Type</span>
                    <span class="detail-value">${booking.event_type || 'Event'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">👥 Guests</span>
                    <span class="detail-value">${booking.guest_count}</span>
                  </div>
                </div>
                
                <div class="checklist">
                  <h3>📋 Quick Checklist</h3>
                  <ul>
                    <li>Confirm arrival time with venue</li>
                    <li>Verify all vendor arrangements</li>
                    <li>Review your guest list</li>
                    <li>Check weather forecast</li>
                    <li>Prepare emergency contacts</li>
                  </ul>
                </div>
                
                <p>We hope you have an amazing event! If you have any questions, please don't hesitate to contact us.</p>
              </div>
              <div class="footer">
                <p>Booking ID: ${booking.id.slice(0, 8).toUpperCase()}</p>
                <p>This is an automated reminder from your booking system.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        const { error: emailError } = await resend.emails.send({
          from: "Bookings <onboarding@resend.dev>",
          to: [profile.email],
          subject: `⏰ Reminder: Your ${booking.event_type || 'event'} is tomorrow!`,
          html: emailHtml,
        });

        if (emailError) {
          console.error(`Failed to send reminder to ${profile.email}:`, emailError);
          errors.push(`Email failed for booking ${booking.id}: ${emailError.message}`);
        } else {
          console.log(`Reminder sent to ${profile.email} for booking ${booking.id}`);
          sentCount++;
        }
      } catch (err) {
        console.error(`Error processing booking ${booking.id}:`, err);
        errors.push(`Processing failed for booking ${booking.id}`);
      }
    }

    console.log(`Reminder job completed. Sent: ${sentCount}, Errors: ${errors.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sent ${sentCount} reminder emails`,
        count: sentCount,
        totalBookings: bookings.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in booking reminder job:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
