import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { label: "Stay", href: "/#stay" },
  { label: "Services", href: "/#services" },
  { label: "Village", href: "/#village" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Dashboard", href: "/dashboard" },
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

  const renderLink = (l: { label: string; href: string }, className: string) => {
    if (l.href.startsWith("/") && !l.href.includes("#")) {
      return (
        <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className={className}>
          {l.label}
        </Link>
      );
    }
    return (
      <a key={l.href} href={l.href} onClick={() => setOpen(false)} className={className}>
        {l.label}
      </a>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <Link to="/" className="group flex items-center gap-3 transition active:scale-95 duration-200">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 100 100" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
            className={`transition-colors duration-300 ${scrolled ? "text-primary" : "text-mist"}`}
          >
            <path d="M30,35 L50,15 L70,35" />
            <path d="M25,48 L42,48 M58,48 L75,48" strokeWidth="6" />
            <circle cx="36" cy="56" r="3" fill="currentColor" stroke="none" />
            <circle cx="64" cy="56" r="3" fill="currentColor" stroke="none" />
            <path d="M44,58 L44,68 L56,68 L56,58" />
            <path d="M48,68 L46,74 M52,68 L54,74" strokeWidth="3" />
            <path d="M22,50 L28,75 L40,88 L60,88 L72,75 L78,50" />
            <path d="M36,78 C42,81 58,81 64,78" strokeWidth="3" />
            <path d="M22,56 C18,56 16,62 20,64" />
            <path d="M78,56 C82,56 84,62 80,64" />
          </svg>
          <span className={`text-sm tracking-[0.3em] uppercase ${scrolled ? "text-primary" : "text-mist"}`}>
            Pretty Village
          </span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) =>
            renderLink(
              l,
              `text-xs uppercase tracking-[0.25em] transition-colors ${
                scrolled ? "text-foreground/70 hover:text-primary" : "text-mist/80 hover:text-mist"
              }`
            )
          )}
        </nav>
        <Link
          to="/book"
          className={`hidden md:inline-flex items-center rounded-full border px-6 py-3 text-xs uppercase tracking-[0.25em] transition ios-springy-btn ${
            scrolled
              ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm"
              : "border-mist/60 text-mist hover:bg-mist hover:text-forest"
          }`}
        >
          Reserve
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-full transition active:scale-90 duration-200 ${scrolled ? "text-primary hover:bg-black/5" : "text-mist hover:bg-white/10"}`}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </div>
        </button>
      </div>
      {open && (
        <div className="border-b border-border/40 bg-background/90 backdrop-blur-xl md:hidden rounded-b-3xl shadow-lg overflow-hidden animate-fadeIn">
          <nav className="flex flex-col px-8 py-6 gap-2">
            {links.map((l) =>
              renderLink(l, "border-b border-border/20 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 hover:text-primary transition")
            )}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-6 rounded-2xl bg-forest text-mist py-4 text-center text-xs font-bold uppercase tracking-[0.25em] transition hover:bg-fern hover:text-forest shadow-sm active:scale-95 duration-200"
            >
              Reserve
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
