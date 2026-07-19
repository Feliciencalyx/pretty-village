import { useEffect, useState } from "react";

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden bg-forest">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-forest/40" />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-16 pt-32 md:px-16 md:pb-24">
        <div
          className={`transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="eyebrow text-mist/80">Musanze · Northern Province · Rwanda</p>
        </div>

        <div className="max-w-4xl">
          <h1
            className={`text-mist text-[clamp(3rem,9vw,8rem)] leading-[0.95] transition-all duration-1000 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Where the volcanoes<br />
            <em className="italic text-fern/90">whisper</em> at dawn.
          </h1>
          <p
            className={`mt-8 max-w-xl text-lg text-mist/85 font-light transition-all delay-500 duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            A collection of boutique apartments carved into the green folds of the Virunga
            range — a quiet village stay where each morning begins with mist and birdsong.
          </p>
          <div
            className={`mt-10 flex flex-wrap items-center gap-6 transition-all delay-700 duration-1000 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <a
              href="#stay"
              className="inline-flex items-center gap-3 rounded-sm border border-mist bg-mist/10 px-8 py-4 text-xs uppercase tracking-[0.3em] text-mist backdrop-blur-sm transition hover:bg-mist hover:text-forest"
            >
              Discover the village
              <span className="inline-block h-px w-8 bg-current" />
            </a>
            <a href="#story" className="text-xs uppercase tracking-[0.3em] text-mist/70 hover:text-mist">
              Our story
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-mist/60">
        <div className="flex flex-col items-center gap-2">
          <span className="eyebrow text-[0.6rem]">Scroll</span>
          <div className="h-10 w-px animate-pulse bg-mist/40" />
        </div>
      </div>
    </section>
  );
}
