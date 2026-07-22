// Resend & Direct Email Integration Helper for Pretty Village Musanze
// Configured to send notifications for inquiries and bookings directly to:
// 1. feliciencalylx@gmail.com
// 2. prettyvillagee@gmail.com

export const RECIPIENT_EMAILS = [
  "feliciencalylx@gmail.com",
  "prettyvillagee@gmail.com"
];

export const PRIMARY_PHONE_1 = "0792500176";
export const PRIMARY_PHONE_2 = "0790156224";

export interface InquiryPayload {
  name: string;
  email: string;
  arrival?: string;
  guests?: string | number;
  message?: string;
}

export interface BookingPayload {
  id: string;
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  room: {
    name: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  addons: Array<{ name: string; price: number }>;
  financials: {
    total: number;
  };
  payment?: {
    method: string;
  };
}

/**
 * Sends email via Resend API to management recipients.
 */
async function sendEmailRequest(subject: string, htmlContent: string, textContent: string, replyTo?: string) {
  const resendApiKey = 
    (import.meta as any).env?.VITE_RESEND_API_KEY || 
    (typeof process !== "undefined" ? process.env?.RESEND_API_KEY : "");

  if (!resendApiKey) {
    console.warn("No Resend API Key configured.");
    return { success: false };
  }

  let sentCount = 0;
  const results = [];

  // Loop over recipients to handle Resend testing sandbox restrictions seamlessly
  for (const recipient of RECIPIENT_EMAILS) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Pretty Village Musanze <onboarding@resend.dev>",
          to: recipient,
          reply_to: replyTo,
          subject,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`Resend email successfully sent to ${recipient}:`, data);
        sentCount++;
        results.push({ recipient, success: true, data });
      } else {
        const errText = await res.text();
        console.warn(`Resend email error for ${recipient}:`, res.status, errText);
        results.push({ recipient, success: false, error: errText });
      }
    } catch (err: any) {
      console.error(`Resend dispatch exception for ${recipient}:`, err);
      results.push({ recipient, success: false, error: err?.message || err });
    }
  }

  return { success: sentCount > 0, results };
}

/**
 * Sends a notification email for new website inquiries/messages.
 */
export async function sendInquiryResendEmail(inquiry: InquiryPayload) {
  const subject = `📩 New Enquiry from ${inquiry.name} - Pretty Village Musanze`;

  const textContent = `
NEW ENQUIRY RECEIVED
------------------------------------
Guest Name: ${inquiry.name}
Email: ${inquiry.email}
Arrival Date: ${inquiry.arrival || "Not specified"}
Number of Guests: ${inquiry.guests || "Not specified"}

Message:
${inquiry.message || "No additional message provided."}

------------------------------------
Target Inboxes: prettyvillagee@gmail.com & feliciencalylx@gmail.com
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fbf9; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="color: #1e3a29; margin-top: 0;">🏡 New Enquiry Received</h2>
      <p style="color: #4a5568; font-size: 14px;">A visitor has submitted an enquiry through the Pretty Village Musanze website.</p>
      
      <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #edf2f7; margin: 16px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #718096; width: 140px;"><strong>Guest Name:</strong></td>
            <td style="padding: 8px 0; color: #1a202c; font-weight: 600;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; color: #2b6cb0;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;"><strong>Arrival Date:</strong></td>
            <td style="padding: 8px 0; color: #1a202c;">${inquiry.arrival || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;"><strong>Guests:</strong></td>
            <td style="padding: 8px 0; color: #1a202c;">${inquiry.guests || "Not specified"}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #edf2f7;">
        <h4 style="margin: 0 0 8px 0; color: #1e3a29;">Message / Notes:</h4>
        <p style="margin: 0; color: #2d3748; font-size: 14px; white-space: pre-wrap;">${inquiry.message || "No additional message provided."}</p>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #a0aec0; text-align: center;">
        Pretty Village Musanze · Target Inboxes: prettyvillagee@gmail.com & feliciencalylx@gmail.com
      </div>
    </div>
  `;

  return sendEmailRequest(subject, htmlContent, textContent, inquiry.email);
}

/**
 * Sends a notification email for new booking reservations.
 */
export async function sendBookingResendEmail(booking: BookingPayload) {
  const subject = `✨ New Booking Reservation (${booking.id}) - ${booking.guest.name}`;

  const addonsList = booking.addons.length > 0
    ? booking.addons.map((a) => `- ${a.name} ($${a.price})`).join("\n")
    : "- None";

  const textContent = `
NEW RESERVATION CONFIRMED
------------------------------------
Booking ID: ${booking.id}
Guest Name: ${booking.guest.name}
Email: ${booking.guest.email}
Phone: ${booking.guest.phone}

Suite: ${booking.room.name}
Check-in: ${booking.checkIn}
Check-out: ${booking.checkOut}
Duration: ${booking.nights} night(s)
Guests: ${booking.guests} guest(s)

Upgrades Selected:
${addonsList}

Total Paid: $${booking.financials.total}
Payment Method: ${booking.payment?.method || "Standard"}

------------------------------------
Target Inboxes: prettyvillagee@gmail.com & feliciencalylx@gmail.com
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fbf9; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="background-color: #1e3a29; padding: 16px 24px; border-radius: 8px 8px 0 0; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">🏡 New Reservation Received!</h2>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">Booking ID: <strong>${booking.id}</strong></p>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #edf2f7;">
        <h3 style="color: #1e3a29; margin-top: 0; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Guest Details</h3>
        <p style="margin: 6px 0; font-size: 14px; color: #2d3748;"><strong>Name:</strong> ${booking.guest.name}</p>
        <p style="margin: 6px 0; font-size: 14px; color: #2d3748;"><strong>Email:</strong> <a href="mailto:${booking.guest.email}">${booking.guest.email}</a></p>
        <p style="margin: 6px 0; font-size: 14px; color: #2d3748;"><strong>Phone:</strong> <a href="tel:${booking.guest.phone}">${booking.guest.phone}</a></p>

        <h3 style="color: #1e3a29; margin-top: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Stay Summary</h3>
        <p style="margin: 6px 0; font-size: 14px; color: #2d3748;"><strong>Residence:</strong> ${booking.room.name}</p>
        <p style="margin: 6px 0; font-size: 14px; color: #2d3748;"><strong>Check-in:</strong> ${booking.checkIn}</p>
        <p style="margin: 6px 0; font-size: 14px; color: #2d3748;"><strong>Check-out:</strong> ${booking.checkOut} (${booking.nights} nights)</p>
        <p style="margin: 6px 0; font-size: 14px; color: #2d3748;"><strong>Guests:</strong> ${booking.guests} guest(s)</p>
        
        <h3 style="color: #1e3a29; margin-top: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 8px;">Financial Total</h3>
        <p style="margin: 6px 0; font-size: 18px; color: #1e3a29; font-weight: bold;">Total Amount: $${booking.financials.total}</p>

        <div style="margin-top: 20px; padding: 12px; background-color: #f7fafc; border-radius: 6px; font-size: 13px;">
          <strong>WhatsApp Quick Contact:</strong><br/>
          Host 1: <a href="https://wa.me/250792500176">0792500176</a> | Host 2: <a href="https://wa.me/250790156224">0790156224</a>
        </div>
      </div>

      <div style="margin-top: 24px; font-size: 12px; color: #a0aec0; text-align: center;">
        Pretty Village Musanze · Notifications sent to prettyvillagee@gmail.com & feliciencalylx@gmail.com
      </div>
    </div>
  `;

  return sendEmailRequest(subject, htmlContent, textContent, booking.guest.email);
}
