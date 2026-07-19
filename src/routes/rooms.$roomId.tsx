import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Flame, Coffee, Wifi, Check, Sparkles, User, Maximize2, Compass } from "lucide-react";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Contact";

const ROOM_DATA = {
  "bisoke-loft": {
    name: "Bisoke Loft",
    tag: "One bedroom · Deluxe Suite",
    price: 50,
    size: "45 m²",
    occupancy: "Up to 2 adults",
    bed: "Queen size (1 bed)",
    view: "Quiet residential avenue",
    img: "/images/bedroom-daylight.jpg",
    images: [
      "/images/bedroom-daylight.jpg",
      "/images/reception.jpg",
      "/images/exterior-gate.jpg"
    ],
    desc: "A bright, modern suite featuring a premium bed, custom gold-accented headboard, and a built-in wardrobe. Every suite includes its own private balcony, scenic balcony views, a comfortable bedroom with a single queen bed, and a private ensuite bathroom and toilet.",
    longDesc: "Designed for travelers who value absolute privacy and premium aesthetics, the Bisoke Loft features a custom queen bed with elegant headboard details. Every suite at Pretty Village comes with its own private balcony boasting scenic mountain and garden views, a beautifully appointed bedroom with one comfortable bed, and a modern private ensuite toilet and bathroom. The bedroom is bathed in warm natural light during the day, with tiled floors and beige drapery creating a soothing retreat. Gated security is active 24/7.",
    amenities: [
      "Private balcony with scenic views",
      "Ensuite private toilet & bathroom",
      "Cozy bedroom with 1 bed",
      "Custom gold headboard detail",
      "Spacious built-in wardrobe",
      "24/7 gated security",
      "Staffed front desk",
      "Polished tile flooring",
      "High-speed Wi-Fi",
      "Daily housekeeping"
    ]
  },
  "karisimbi-suite": {
    name: "Karisimbi Suite",
    tag: "One bedroom · Ambient Suite",
    price: 50,
    size: "75 m²",
    occupancy: "Up to 2 adults",
    bed: "Queen size (1 bed)",
    view: "Quiet residential avenue",
    img: "/images/bedroom-blue-light.jpg",
    images: [
      "/images/bedroom-blue-light.jpg",
      "/images/bedroom-daylight.jpg",
      "/images/bathroom-shower.jpg"
    ],
    desc: "A spacious suite equipped with custom LED mood lighting, polished tile flooring, and premium linens. Every suite includes its own private balcony, scenic balcony views, a comfortable bedroom with a single queen bed, and a private ensuite bathroom and toilet.",
    longDesc: "Perfect for guests seeking a luxurious, contemporary space in Musanze. Every suite at Pretty Village comes with its own private balcony boasting scenic mountain and garden views, a beautifully appointed bedroom with one comfortable bed, and a modern private ensuite toilet and bathroom. The Karisimbi Suite comes alive in the evening with customizable blue LED ambient strip lighting, setting a relaxing atmosphere. Gated security and reception are active 24/7.",
    amenities: [
      "Private balcony with scenic views",
      "Ensuite private toilet & bathroom",
      "Cozy bedroom with 1 bed",
      "Blue LED ambient mood lighting",
      "Customizable light settings",
      "Plush bedding & blankets",
      "Sleek fitted wardrobe",
      "24/7 compound security",
      "On-site guest support",
      "High-speed Wi-Fi"
    ]
  }
};

export const Route = createFileRoute("/rooms/$roomId")({
  loader: ({ params }) => {
    const id = params.roomId as keyof typeof ROOM_DATA;
    if (!ROOM_DATA[id]) {
      throw notFound();
    }
    return ROOM_DATA[id];
  },
  component: RoomDetails,
});

function RoomDetails() {
  const room = Route.useLoaderData();
  const params = Route.useParams();
  const [activeImage, setActiveImage] = useState(room.img);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      
      {/* Top spacing / Hero */}
      <section className="relative h-[65vh] w-full bg-forest overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={room.img} 
            alt={room.name} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 pb-12 md:px-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mist hover:text-fern transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Stay
            </Link>
            <p className="eyebrow text-fern/90">{room.tag}</p>
            <h1 className="text-5xl md:text-7xl mt-4 font-light text-mist leading-none">{room.name}</h1>
          </div>
          
          <div className="bg-forest/45 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-3xl max-w-sm w-full shadow-lg">
            <p className="text-xs uppercase tracking-widest text-fern font-semibold">Rate</p>
            <p className="text-3xl font-light text-mist mt-1">
              ${room.price} <span className="text-sm font-light text-mist/60">/ night</span>
            </p>
            <Link
              to="/book"
              search={{ room: params.roomId }}
              className="mt-6 w-full inline-flex items-center justify-center bg-fern text-forest font-semibold uppercase tracking-[0.25em] text-xs py-4 rounded-2xl transition hover:bg-mist hover:text-forest shadow-md ios-springy-btn"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </section>

      {/* Overview & Quick Info */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <div>
            <h2 className="text-3xl md:text-4xl font-light leading-relaxed mb-6">
              A serene retreat designed around modern comfort and quiet security.
            </h2>
            <p className="text-lg font-light text-foreground/80 leading-relaxed mb-8">
              {room.desc}
            </p>
            <p className="text-base font-light text-foreground/70 leading-relaxed">
              {room.longDesc}
            </p>
            
            {/* Gallery of detailed shots */}
            <div className="mt-12">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl mb-4 bg-muted shadow-sm">
                <img 
                  src={activeImage} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {room.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-28 h-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ios-springy-btn ${
                      activeImage === imgUrl ? "border-fern scale-95" : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Detail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Room specifications */}
            <div className="border border-border/40 bg-card p-8 rounded-3xl mb-12 shadow-sm">
              <h3 className="text-xl font-light mb-6 uppercase tracking-wider">Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border/40 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Maximize2 className="w-4 h-4 text-fern" /> Size
                  </span>
                  <span className="font-medium">{room.size}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/40 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4 text-fern" /> Occupancy
                  </span>
                  <span className="font-medium">{room.occupancy}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/40 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Coffee className="w-4 h-4 text-fern" /> Bed Config
                  </span>
                  <span className="font-medium">{room.bed}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/40 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Compass className="w-4 h-4 text-fern" /> View
                  </span>
                  <span className="font-medium text-right">{room.view}</span>
                </div>
              </div>
            </div>

            {/* Premium amenities list */}
            <div>
              <h3 className="text-xl font-light mb-6 uppercase tracking-wider">Premium Amenities</h3>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-fern/10 text-fern mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
