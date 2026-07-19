import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { motion, AnimatePresence } from "framer-motion";
import { ReelsPlayer } from "./ReelsPlayer";

const categories = [
  { id: "rooms-washrooms", label: "Rooms & Washrooms" },
  { id: "food-beverages", label: "Food & Beverages" },
  { id: "explore-musanze", label: "Explore Musanze" },
  { id: "musanze-reels", label: "Musanze Reels" },
  { id: "property", label: "Property & Exterior" },
];

const images = [
  { src: "/images/exterior-night.jpg", span: "row-span-2", alt: "Pretty Village exterior at night", category: "property" },
  { src: "/images/reception.jpg", span: "", alt: "Boutique lobby reception desk", category: "property" },
  { src: "/images/bedroom-daylight.jpg", span: "", alt: "Luxury bedroom in daylight", category: "rooms-washrooms" },
  { src: "/images/bedroom-blue-light.jpg", span: "col-span-2", alt: "Suite with blue ambient LED lighting", category: "rooms-washrooms" },
  { src: "/images/bathroom-shower.jpg", span: "", alt: "Matte black rain shower and wavy tiling", category: "rooms-washrooms" },
  { src: "/images/bathroom-sink.jpg", span: "", alt: "Pedestal sink and lighted vanity mirror", category: "rooms-washrooms" },
  { src: "/images/exterior-gate.jpg", span: "", alt: "Front entrance security gate", category: "property" },
  { src: "/images/lobby-lounge.jpg", span: "", alt: "Lobby lounge area decorated with African art", category: "property" },
  { src: "/images/gourmet-rice-curry.jpg", span: "", alt: "Gourmet rice and vegetable curry lunch service", category: "food-beverages" },
  { src: "/images/dining-room.jpg", span: "", alt: "Boutique dining area with Imigongo abstract art", category: "food-beverages" },
  { src: "/images/bar-lounge.jpg", span: "", alt: "Modern bar counter with cross-cut log ceiling", category: "food-beverages" },
  { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80", span: "", alt: "Luxury beverage cocktails", category: "food-beverages" },
  { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80", span: "", alt: "Fresh single-origin Rwandan coffee", category: "food-beverages" },
  { src: "/images/explore-caves.jpg", span: "", alt: "The historic Musanze Caves entrance", category: "explore-musanze" },
  { src: "/images/explore-cypress-path.jpg", span: "", alt: "Cobblestone path lined with tall cypress trees", category: "explore-musanze" },
  { src: "/images/explore-resort-pool.jpg", span: "col-span-2", alt: "Beautiful swimming pool with stone waterfall", category: "explore-musanze" },
  { src: "/images/explore-pool-close.jpg", span: "", alt: "Swimming pool side and landscaped gardens", category: "explore-musanze" },
  { src: "/images/explore-garden-pathway.jpg", span: "", alt: "Stone paved pathway shaded by palm trees", category: "explore-musanze" },
  { src: "/images/explore-gardens-sign.jpg", span: "", alt: "Manicured landscape garden pathways", category: "explore-musanze" },
  { src: "/images/explore-garden-lawn.jpg", span: "", alt: "Spacious green lawn surrounded by tall forest", category: "explore-musanze" },
  { src: "/images/explore-hills.jpg", span: "", alt: "Lush green hills of Musanze under high clouds", category: "explore-musanze" }
];

export function Gallery() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState("rooms-washrooms");

  const filteredImages = images.filter(img => img.category === activeTab);

  return (
    <section id="gallery" className="bg-mist/30 py-32 md:py-48">
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div>
            <p className="eyebrow text-moss">Gallery</p>
            <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl">
              Fragments of<br />
              <em className="italic text-moss">a slower day.</em>
            </h2>
          </div>

          {/* iOS 26.5 Glassmorphic Segmented Control */}
          <div className="ios-glass p-1.5 rounded-2xl flex flex-wrap md:flex-nowrap gap-1.5 shadow-sm max-w-full self-start md:self-end justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl text-[10px] md:text-xs font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-300 ios-springy-btn ${
                  activeTab === cat.id
                    ? "bg-forest text-mist shadow-sm"
                    : "text-foreground/60 hover:text-foreground/90 hover:bg-white/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher: Reels Player vs Photo Grid */}
        <div className="mt-16">
          {activeTab === "musanze-reels" ? (
            <ReelsPlayer />
          ) : (
            <motion.div
              layout
              className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((img) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.2, 1] }}
                    key={img.src}
                    className={`group relative overflow-hidden rounded-2xl shadow-sm ${img.span}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-forest/0 transition-colors group-hover:bg-forest/20" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
