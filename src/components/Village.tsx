import { useReveal } from "@/hooks/use-reveal";

export function Village() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="village" className="relative overflow-hidden bg-forest py-32 text-mist md:py-48">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/exterior-night.jpg"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      >
        <source src="https://cdn.pixabay.com/video/2020/03/25/34211-401170291_large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-forest via-forest/85 to-forest" />

      <div ref={ref} className="relative mx-auto max-w-[1200px] px-6 text-center md:px-12">
        <p className={`eyebrow text-fern transition-all duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
          The village
        </p>
        <blockquote className={`mt-10 text-4xl leading-[1.15] md:text-6xl text-balance transition-all duration-1000 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          <em className="italic text-fern/90">"</em>
          Musanze is not a destination.<br />
          It is a rhythm — of mist, of markets,<br />
          of low sun over the volcanoes.
          <em className="italic text-fern/90">"</em>
        </blockquote>
        <p className={`mt-10 eyebrow text-mist/60 transition-all duration-1000 delay-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}>
          — A note from the village
        </p>
      </div>
    </section>
  );
}
