import { useReveal } from "@/hooks/use-reveal";

const services = [
  {
    title: "Lobby & Reception",
    detail: "Staffed desk & guest services",
    desc: "A warm, professionally staffed reception area to assist you with check-in, check-out, and immediate guest needs.",
    img: "/images/reception.jpg",
  },
  {
    title: "Luxury Bedrooms",
    detail: "Custom ambient mood lighting",
    desc: "Plush beds with gold-accented headboards, marble-finish wardrobes, and customizable day & night LED lighting systems.",
    img: "/images/bedroom-daylight.jpg",
  },
  {
    title: "Sleek Bathrooms",
    detail: "Matte black rain showers",
    desc: "Elegant private bathrooms equipped with matte black high-pressure rain showers, pedestal sinks, and lighted mirrors.",
    img: "/images/bathroom-shower.jpg",
  },
  {
    title: "Food & Beverages",
    detail: "Private dining & gourmet coffee",
    desc: "Indulge in fresh, single-origin Rwandan coffee in the mornings, and premium gourmet fusion meals prepared by a private chef upon request.",
    img: "/images/gourmet-rice-curry.jpg",
  },
  {
    title: "Concierge & Transfers",
    detail: "Private airport transport",
    desc: "Hassle-free private 4x4 transfers from Kigali Airport directly to the property, plus booking assistance for all local services.",
    img: "/images/exterior-gate.jpg",
  },
  {
    title: "Secure Compound",
    detail: "24/7 gated security & patrol",
    desc: "Complete peace of mind with 24/7 security, high-walled perimeter fencing, security wiring, and modern evening illumination.",
    img: "/images/exterior-night.jpg",
  },
];

export function Services() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="services" className="relative overflow-hidden bg-background py-32 md:py-48">
      <div ref={ref} className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className={`max-w-2xl transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="eyebrow text-moss">Services & Facilities</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl text-balance">
            On-site services <em className="italic text-moss">tailored</em><br />
            for your comfort.
          </h2>
          <p className="mt-8 max-w-lg text-lg font-light text-foreground/70">
            Every detail at Pretty Village is managed to provide a seamless, secure, and premium stay, giving you the luxury of a hotel with the space and freedom of home.
          </p>
        </div>

        <div className="mt-20 grid gap-px bg-border md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.title}
              className={`group relative overflow-hidden bg-background transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-forest/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-mist">
                  <div>
                    <p className="eyebrow text-mist/70">{s.detail}</p>
                    <h3 className="mt-2 text-3xl md:text-4xl">{s.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-base font-light text-foreground/70">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
