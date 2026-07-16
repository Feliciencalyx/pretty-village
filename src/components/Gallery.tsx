import { useReveal } from "@/hooks/use-reveal";

const images = [
  { src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80", span: "row-span-2", alt: "Mountain gorilla in mist" },
  { src: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80", span: "", alt: "Village weaver" },
  { src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&q=80", span: "", alt: "Volcano at dawn" },
  { src: "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=1200&q=80", span: "col-span-2", alt: "Terraced fields" },
  { src: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1200&q=80", span: "", alt: "Rwandan coffee" },
  { src: "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=1200&q=80", span: "", alt: "Forest canopy" },
];

export function Gallery() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="gallery" className="bg-mist/30 py-32 md:py-48">
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className={`flex items-end justify-between transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div>
            <p className="eyebrow text-moss">Gallery</p>
            <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl">
              Fragments of<br />
              <em className="italic text-moss">a slower day.</em>
            </h2>
          </div>
        </div>
        <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden ${img.span} transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-forest/0 transition-colors group-hover:bg-forest/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
