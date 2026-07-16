import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { label: "Stay", href: "#stay" },
  { label: "Experiences", href: "#experiences" },
  { label: "Village", href: "#village" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="group flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className={scrolled ? "text-primary" : "text-mist"}>
            <path d="M20 4 L34 32 L6 32 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M14 32 L20 20 L26 32" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="20" cy="14" r="1.5" fill="currentColor" />
          </svg>
          <span className={`text-sm tracking-[0.3em] uppercase ${scrolled ? "text-primary" : "text-mist"}`}>
            Pretty Village
          </span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-xs uppercase tracking-[0.25em] transition-colors ${
                scrolled ? "text-foreground/70 hover:text-primary" : "text-mist/80 hover:text-mist"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={`hidden md:inline-flex items-center rounded-sm border px-5 py-2.5 text-xs uppercase tracking-[0.25em] transition ${
            scrolled
              ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              : "border-mist/60 text-mist hover:bg-mist hover:text-forest"
          }`}
        >
          Reserve
        </a>
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden ${scrolled ? "text-primary" : "text-mist"}`}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </div>
        </button>
      </div>
      {open && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-md md:hidden">
          <nav className="flex flex-col px-6 py-6">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-border/40 py-4 text-xs uppercase tracking-[0.25em] text-foreground/70">
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="mt-6 rounded-sm border border-primary py-3 text-center text-xs uppercase tracking-[0.25em] text-primary">
              Reserve
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
