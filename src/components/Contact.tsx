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
      `Hello Pretty Village Musanze! 🏡\nMy name is ${name || "a guest"}.\nEmail: ${email || "N/A"}\nI would like to enquire about availability and rates for ${arrival || "upcoming dates"}${guests ? ` for ${guests} guests` : ""}.\n${message ? `Note: ${message}` : ""}`
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
              <p className="eyebrow text-muted-foreground">Emails</p>
              <p className="mt-2 text-foreground/80 font-light space-y-1">
                <a href="mailto:prettyvillagee@gmail.com" className="block hover:underline text-moss hover:text-primary transition">📧 prettyvillagee@gmail.com</a>
                <a href="mailto:feliciencalylx@gmail.com" className="block hover:underline text-moss hover:text-primary transition">📧 feliciencalylx@gmail.com</a>
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
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-12">
        <div className="text-center md:text-left">
          <p className="eyebrow text-muted-foreground">© {new Date().getFullYear()} Pretty Village Musanze</p>
          <p className="text-xs text-muted-foreground/70 mt-1 font-light">
            Mukizungu Road, Musanze · ☎️ 0792500176
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 eyebrow text-muted-foreground">
          <a href="mailto:prettyvillagee@gmail.com" className="hover:text-foreground">prettyvillagee@gmail.com</a>
          <a href="mailto:feliciencalylx@gmail.com" className="hover:text-foreground">feliciencalylx@gmail.com</a>
          <a href="https://www.instagram.com/prettyvillagee_musanze?igsh=NDJlaGpvanFjY2s=" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a>
          <a href="https://www.tiktok.com/@prettyvillage_musanze?_r=1&_t=ZS-989s0Wrj2Cu" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">TikTok</a>
        </div>
      </div>
    </footer>
  );
}

