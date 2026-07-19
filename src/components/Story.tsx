import { useReveal } from "@/hooks/use-reveal";

export function Story() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="story" className="relative bg-background py-32 md:py-48">
      <div ref={ref} className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-12">
        <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="eyebrow text-moss">The Village</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl text-balance">
            Modern comfort,<br />
            <em className="italic text-moss">secured</em> privacy.
          </h2>
          <div className="mt-10 space-y-6 text-lg font-light leading-relaxed text-foreground/75 text-pretty">
            <p>
              Pretty Village Musanze is a secure, premium collection of boutique apartments
              nestled in a quiet neighborhood of Musanze, offering the perfect blend
              of contemporary style, high-end security, and on-site hospitality.
            </p>
            <p>
              Designed for guests who value quality and tranquility, our compound features a staffed
              lobby reception, beautifully finished suites, customizable ambient lighting, and
              private gated premises for complete peace of mind.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-8">
            {[
              ["24/7", "Gated Security"],
              ["Modern", "Boutique Suites"],
              ["Lobby", "Reception Desk"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-4xl text-moss">{n}</div>
                <div className="mt-2 eyebrow text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`relative transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
          <div className="absolute inset-0 -z-10 rounded-sm bg-gradient-to-br from-mist/40 to-fern/20" />
          <div className="overflow-hidden rounded-sm shadow-xl aspect-[4/3]">
            <img 
              src="/images/exterior-gate.jpg" 
              alt="Pretty Village Gated Entrance" 
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" 
            />
          </div>
          <p className="mt-4 text-center eyebrow text-muted-foreground">Pretty Village entrance gate & modern facade at night</p>
        </div>
      </div>
    </section>
  );
}
