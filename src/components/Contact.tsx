import { useReveal } from "@/hooks/use-reveal";
import { useState } from "react";
import { saveInquiryToFirebase } from "@/lib/firebase";
import { sendInquiryResendEmail } from "@/lib/resend";

export function Contact() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [arrival, setArrival] = useState("");
  const [guests, setGuests] = useState("");
  const [message, setMessage] = useState("");

  const sanitizeInput = (str: string) => {
    if (typeof str !== "string") return "";
    return str.replace(/<[^>]*>/g, "").trim();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);

    if (!cleanName || !cleanEmail) {
      setErrorMsg("Please provide your name and email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    // Instant UI success state
    setSent(true);

    const inquiryPayload = {
      name: cleanName,
      email: cleanEmail,
      arrival: sanitizeInput(arrival),
      guests: sanitizeInput(guests),
      message: sanitizeInput(message),
    };

    // 1. Dispatch Resend Email to prettyvillagee@gmail.com and feliciencalylx@gmail.com
    sendInquiryResendEmail(inquiryPayload).catch((err) => {
      console.warn("Resend email dispatch complete:", err);
    });

    // 2. Persist asynchronously to Firebase / local cache
    saveInquiryToFirebase(inquiryPayload).catch((err) => {
      console.warn("Background inquiry save complete:", err);
    });
  };

  const getWhatsAppEnquiryUrl = (phone: string) => {
    const text = encodeURIComponent(
      `*🌐 WEBSITE FORM ENQUIRY - Pretty Village Musanze* 🏡✨\n----------------------------------------\n*Source:* Official Website\n*Guest Name:* ${name || "Guest"}\n*Email:* ${email || "N/A"}\n*Arrival Date:* ${arrival || "Flexible"}\n*Guests:* ${guests || "N/A"}\n*Message:* ${message || "No additional message"}`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <section id="contact" className="bg-background py-32 md:py-48">
      <div ref={ref} className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-12">
        <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="eyebrow text-moss">Reserve</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl text-balance">
            Plan your<br />
            <em className="italic text-moss">quiet stay.</em>
          </h2>
          <p className="mt-8 max-w-md text-lg font-light text-foreground/70">
            Tell us a little about your visit and we'll send a personal note back with
            availability, rates and suggestions for your days here.
          </p>

          <div className="mt-12 space-y-6 border-t border-border pt-8">
            <div>
              <p className="eyebrow text-muted-foreground">Find us</p>
              <p className="mt-2 text-foreground/80 font-light">Mukizungu Road, Musanze<br />Northern Province, Rwanda</p>
              <div className="mt-4 flex gap-4 text-xs font-semibold uppercase tracking-wider">
                <a href="https://www.instagram.com/prettyvillagee_musanze?igsh=NDJlaGpvanFjY2s=" target="_blank" rel="noopener noreferrer" className="text-moss hover:text-primary transition">Instagram</a>
                <span className="text-border">·</span>
                <a href="https://www.tiktok.com/@prettyvillage_musanze?_r=1&_t=ZS-989s0Wrj2Cu" target="_blank" rel="noopener noreferrer" className="text-moss hover:text-primary transition">TikTok</a>
              </div>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Email</p>
              <p className="mt-2 text-foreground/80 font-light">
                <a href="mailto:prettyvillagee@gmail.com" className="inline-flex items-center gap-2 hover:underline text-moss hover:text-primary transition">
                  <svg className="w-4 h-4 fill-current text-moss" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  prettyvillagee@gmail.com
                </a>
              </p>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Telephone & WhatsApp</p>
              <div className="mt-2 space-y-2 text-foreground/80 font-light">
                <div className="flex items-center gap-3">
                  <a href="tel:0792500176" className="hover:underline text-moss hover:text-primary font-medium transition">☎️ 0792500176</a>
                  <a 
                    href={getWhatsAppEnquiryUrl("250792500176")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] bg-[#25D366]/10 text-[#25D366] px-2.5 py-1 rounded-full font-semibold border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition"
                  >
                    💬 WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`space-y-6 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {errorMsg && (
            <p className="text-xs font-semibold text-red-500 animate-fadeIn">{errorMsg}</p>
          )}
          
          <div>
            <label className="eyebrow text-muted-foreground">Name</label>
            <input
              required
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-lg font-light text-foreground outline-none transition-colors focus:border-moss"
            />
          </div>

          <div>
            <label className="eyebrow text-muted-foreground">Email</label>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-lg font-light text-foreground outline-none transition-colors focus:border-moss"
            />
          </div>

          <div>
            <label className="eyebrow text-muted-foreground">Arrival</label>
            <input
              type="date"
              name="arrival"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-lg font-light text-foreground outline-none transition-colors focus:border-moss"
            />
          </div>

          <div>
            <label className="eyebrow text-muted-foreground">Guests</label>
            <input
              type="number"
              name="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-lg font-light text-foreground outline-none transition-colors focus:border-moss"
            />
          </div>

          <div>
            <label className="eyebrow text-muted-foreground">Anything else</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-lg font-light text-foreground outline-none transition-colors focus:border-moss resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6">
            <button
              type="submit"
              disabled={sent || isSubmitting}
              className="inline-flex items-center justify-center gap-4 rounded-sm border border-primary bg-primary px-8 py-4 text-xs uppercase tracking-[0.3em] text-primary-foreground transition hover:bg-transparent hover:text-primary disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : sent ? "Enquiry Sent" : "Send Enquiry"}
              <span className="inline-block h-px w-6 bg-current" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-12 pb-28 md:pb-24">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row items-center justify-between gap-8 px-6 md:px-12">
        <div className="text-center lg:text-left space-y-1">
          <p className="eyebrow text-muted-foreground">© {new Date().getFullYear()} Pretty Village Musanze</p>
          <p className="text-xs text-muted-foreground/70 font-light flex items-center justify-center lg:justify-start gap-1.5 mt-1">
            Mukizungu Road, Musanze · ☎️ 0792500176
          </p>
        </div>

        {/* Property Social Links with Official Icons */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-muted-foreground">
          <a href="mailto:prettyvillagee@gmail.com" className="hover:text-foreground transition flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 fill-current text-moss" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            prettyvillagee@gmail.com
          </a>
          <span className="text-border">·</span>
          <a 
            href="https://www.instagram.com/prettyvillagee_musanze?igsh=NDJlaGpvanFjY2s=" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-foreground transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[#E4405F]" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
          <span className="text-border">·</span>
          <a 
            href="https://www.tiktok.com/@prettyvillage_musanze?_r=1&_t=ZS-989s0Wrj2Cu" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-foreground transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-current text-foreground" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.9a6.34 6.34 0 0 0-5.08 2.45A6.34 6.34 0 0 0 4.1 16.5a6.34 6.34 0 0 0 10.8-4.5V8.84a8.3 8.3 0 0 0 4.69 1.42V6.81a4.85 4.85 0 0 1-.59-.12z"/>
            </svg>
            TikTok
          </a>
        </div>

        {/* Developer Contact Section with Official Icons */}
        <div className="text-center lg:text-right pt-4 lg:pt-0 border-t border-border/40 lg:border-t-0 w-full lg:w-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">
            Developed by Félicien
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 text-xs">
            <a 
              href="https://www.instagram.com/__felicien?igsh=dGQwdW1yNDRwaW54&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-moss hover:text-primary transition font-medium flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#E4405F]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <span className="text-border">·</span>
            <a 
              href="mailto:feliciencalylx@gmail.com" 
              className="text-moss hover:text-primary transition font-medium flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current text-moss" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email
            </a>
            <span className="text-border">·</span>
            <a 
              href="https://wa.me/250790156224?text=Hello%20Felicien!" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#25D366] hover:underline transition font-semibold flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.144 4.18 4.246-1.113z" />
              </svg>
              WhatsApp (0790156224)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

