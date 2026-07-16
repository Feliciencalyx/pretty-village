import { useReveal } from "@/hooks/use-reveal";
import { useState } from "react";

export function Contact() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [sent, setSent] = useState(false);

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
              <p className="mt-2 text-foreground/80">Kinigi Road, Musanze<br />Northern Province, Rwanda</p>
            </div>
            <div>
              <p className="eyebrow text-muted-foreground">Write</p>
              <p className="mt-2 text-foreground/80">stay@musanzevillage.rw</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className={`space-y-6 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {[
            { label: "Name", type: "text", name: "name" },
            { label: "Email", type: "email", name: "email" },
            { label: "Arrival", type: "date", name: "arrival" },
            { label: "Guests", type: "number", name: "guests" },
          ].map((f) => (
            <div key={f.name}>
              <label className="eyebrow text-muted-foreground">{f.label}</label>
              <input
                required
                type={f.type}
                name={f.name}
                className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-lg font-light text-foreground outline-none transition-colors focus:border-moss"
              />
            </div>
          ))}
          <div>
            <label className="eyebrow text-muted-foreground">Anything else</label>
            <textarea
              rows={3}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-lg font-light text-foreground outline-none transition-colors focus:border-moss resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={sent}
            className="mt-6 inline-flex items-center gap-4 rounded-sm border border-primary bg-primary px-8 py-4 text-xs uppercase tracking-[0.3em] text-primary-foreground transition hover:bg-transparent hover:text-primary disabled:opacity-70"
          >
            {sent ? "Message sent" : "Send enquiry"}
            <span className="inline-block h-px w-6 bg-current" />
          </button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-12">
        <p className="eyebrow text-muted-foreground">© {new Date().getFullYear()} Pretty Village Musanze</p>
        <div className="flex gap-8 eyebrow text-muted-foreground">
          <a href="#" className="hover:text-foreground">Instagram</a>
          <a href="#" className="hover:text-foreground">Journal</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
