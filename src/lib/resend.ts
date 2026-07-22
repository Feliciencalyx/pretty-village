// Resend & Direct Email Integration Helper for Pretty Village Musanze
// Configured to send notifications for inquiries and bookings directly to:
// 1. prettyvillagee@gmail.com
// 2. feliciencalylx@gmail.com

export const RECIPIENT_EMAILS = [
  "prettyvillagee@gmail.com",
  "feliciencalylx@gmail.com"
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
 * Sends email via Resend or Web3Forms API to management recipients.
 */
async function sendEmailRequest(subject: string, htmlContent: string, textContent: string, replyTo?: string) {
  const resendApiKey = (import.meta as any).env?.VITE_RESEND_API_KEY || (typeof process !== "undefined" ? process.env?.RESEND_API_KEY : "");
  const web3FormsKey = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || (typeof process !== "undefined" ? process.env?.WEB3FORMS_ACCESS_KEY : "");

  let dispatched = false;
  let errors: string[] = [];

  // Strategy 1: Attempt Resend API if VITE_RESEND_API_KEY is configured
  if (resendApiKey && resendApiKey !== "your_resend_api_key_here") {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Pretty Village Musanze <onboarding@resend.dev>",
          to: RECIPIENT_EMAILS,
          reply_to: replyTo,
          subject,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Resend email successfully sent to inbox:", data);
        dispatched = true;
        return { success: true, provider: "Resend", data };
      } else {
        const errText = await res.text();
        errors.push(`Resend error (${res.status}): ${errText}`);
      }
    } catch (err: any) {
      errors.push(`Resend exception: ${err?.message || err}`);
    }
  }

  // Strategy 2: Attempt Web3Forms API if VITE_WEB3FORMS_ACCESS_KEY is configured
  if (web3FormsKey && web3FormsKey !== "your_web3forms_access_key_here") {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject,
          from_name: "Pretty Village Musanze Website",
          replyto: replyTo,
          message: textContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Web3Forms email successfully sent to inbox:", data);
        dispatched = true;
        return { success: true, provider: "Web3Forms", data };
      } else {
        const errText = await res.text();
        errors.push(`Web3Forms error (${res.status}): ${errText}`);
      }
    } catch (err: any) {
      errors.push(`Web3Forms exception: ${err?.message || err}`);
    }
  }

  // Fallback: If no API key is provided, log warning for developer configuration
  if (!dispatched) {
    console.warn(
      "⚠️ Real Email Delivery Warning: No active VITE_RESEND_API_KEY or VITE_WEB3FORMS_ACCESS_KEY found in .env.\n" +
      "To receive emails directly in prettyvillagee@gmail.com & feliciencalylx@gmail.com inbox, add your API key to .env file!\n" +
      "Dispatched payload preview:",
      { subject, to: RECIPIENT_EMAILS, textContent }
    );
  }

  return { 
    success: dispatched, 
    simulated: !dispatched, 
    errors: errors.length > 0 ? errors : undefined 
  };
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
