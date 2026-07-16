import { useReveal } from "@/hooks/use-reveal";
import { useState } from "react";

const apartments = [
  {
    name: "Bisoke Loft",
    tag: "One bedroom · Volcano view",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80",
    price: "from $180 / night",
    desc: "A warm timber loft with floor-to-ceiling windows framing Mount Bisoke.",
  },
  {
    name: "Karisimbi Suite",
    tag: "Two bedroom · Garden terrace",
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1400&q=80",
    price: "from $260 / night",
    desc: "A generous suite with a private terrace opening onto banana groves and terraced fields.",
  },
  {
    name: "Sabyinyo Studio",
    tag: "Studio · Courtyard",
    img: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1400&q=80",
    price: "from $130 / night",
    desc: "An intimate studio wrapped around a small courtyard of ferns and quiet water.",
  },
];

export function Stay() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState(0);
  return (
    <section id="stay" className="bg-forest py-32 text-mist md:py-48">
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className={`grid gap-12 md:grid-cols-[1fr_auto] md:items-end transition-all duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div>
            <p className="eyebrow text-fern">Stay</p>
            <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl text-balance">
              Twelve apartments,<br />
              <em className="italic text-fern/90">one hillside.</em>
            </h2>
          </div>
          <div className="flex gap-2">
            {apartments.map((a, i) => (
              <button
                key={a.name}
                onClick={() => setActive(i)}
                className={`h-1 w-16 transition-all ${i === active ? "bg-fern" : "bg-mist/25"}`}
                aria-label={a.name}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            {apartments.map((a, i) => (
              <img
                key={a.name}
                src={a.img}
                alt={a.name}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                  i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="eyebrow text-fern/80">{apartments[active].tag}</p>
              <h3 className="mt-4 text-4xl md:text-5xl">{apartments[active].name}</h3>
              <p className="mt-6 text-lg font-light text-mist/75 leading-relaxed">
                {apartments[active].desc}
              </p>
              <p className="mt-8 eyebrow text-fern">{apartments[active].price}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#contact" className="inline-flex items-center gap-3 border border-mist/40 px-8 py-4 text-xs uppercase tracking-[0.3em] transition hover:bg-mist hover:text-forest">
                Enquire <span className="inline-block h-px w-6 bg-current" />
              </a>
              <div className="flex gap-6 pt-2">
                {apartments.map((a, i) => (
                  <button
                    key={a.name}
                    onClick={() => setActive(i)}
                    className={`text-xs uppercase tracking-[0.25em] transition ${
                      i === active ? "text-fern" : "text-mist/40 hover:text-mist/70"
                    }`}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
