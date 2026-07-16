import { useReveal } from "@/hooks/use-reveal";
import { VolcanoScene } from "./VolcanoScene";

export function Story() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="story" className="relative bg-background py-32 md:py-48">
      <div ref={ref} className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-12">
        <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="eyebrow text-moss">The village</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl text-balance">
            A quiet stay,<br />
            <em className="italic text-moss">rooted</em> in the land.
          </h2>
          <div className="mt-10 space-y-6 text-lg font-light leading-relaxed text-foreground/75 text-pretty">
            <p>
              Musanze Village is a small collection of boutique apartments set among terraced
              farmland and eucalyptus groves, minutes from the trails that climb into Volcanoes
              National Park.
            </p>
            <p>
              Every apartment opens onto the volcanoes — Karisimbi, Bisoke, Sabyinyo — and every
              morning brings the low call of the mountains stirring under mist.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-8">
            {[
              ["12", "Apartments"],
              ["5", "Volcanoes visible"],
              ["1hr", "To gorilla trailheads"],
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
          <VolcanoScene />
          <p className="mt-4 text-center eyebrow text-muted-foreground">The Virunga range · drag to explore</p>
        </div>
      </div>
    </section>
  );
}
