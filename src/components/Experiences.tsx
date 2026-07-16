import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import { useReveal } from "@/hooks/use-reveal";

function Leaf({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  return (
    <mesh position={position} rotation={rotation}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial color={color} roughness={0.7} flatShading />
    </mesh>
  );
}

function Tree() {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.getElapsedTime() * 0.15;
  });
  return (
    <group ref={g}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 8]} />
        <meshStandardMaterial color="#6b3a2a" roughness={0.9} />
      </mesh>
      <Leaf position={[0, 0.6, 0]} rotation={[0, 0, 0]} color="#2d5a3d" />
      <Leaf position={[0.35, 0.45, 0.2]} rotation={[0, 0.5, 0]} color="#3a6b48" />
      <Leaf position={[-0.35, 0.5, -0.15]} rotation={[0, -0.5, 0]} color="#4a7a58" />
      <Leaf position={[0.1, 0.85, -0.3]} rotation={[0, 0, 0]} color="#5a8a5c" />
      <Leaf position={[-0.2, 0.75, 0.3]} rotation={[0, 0, 0]} color="#3a6b48" />
    </group>
  );
}

const experiences = [
  {
    title: "Gorilla trek",
    duration: "Full day",
    desc: "A guided ascent through bamboo forest to sit quietly among mountain gorillas.",
    video: "https://cdn.pixabay.com/video/2020/07/28/45478-445097737_large.mp4",
  },
  {
    title: "Twin lakes canoe",
    duration: "Half day",
    desc: "Paddle across Lakes Burera and Ruhondo with the volcanoes mirrored in the water.",
    video: "https://cdn.pixabay.com/video/2019/09/29/27411-364914537_large.mp4",
  },
  {
    title: "Village walk",
    duration: "2 hours",
    desc: "A slow walk through terraced farmland, meeting weavers, potters and coffee growers.",
    video: "https://cdn.pixabay.com/video/2022/02/15/108165-680818735_large.mp4",
  },
  {
    title: "Golden monkey tracking",
    duration: "Half day",
    desc: "Follow troops of the endemic golden monkey through the bamboo of the Virungas.",
    video: "https://cdn.pixabay.com/video/2021/08/04/84369-587493964_large.mp4",
  },
];

export function Experiences() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="experiences" className="relative overflow-hidden bg-background py-32 md:py-48">
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-30">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 3]} intensity={1} />
            <Float speed={1.5} floatIntensity={0.8}><Tree /></Float>
          </Suspense>
        </Canvas>
      </div>

      <div ref={ref} className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className={`max-w-2xl transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="eyebrow text-moss">Experiences</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl text-balance">
            Days that <em className="italic text-moss">move</em><br />
            with the mountain.
          </h2>
          <p className="mt-8 max-w-lg text-lg font-light text-foreground/70">
            Every stay is curated with a slow rhythm of walks, treks and moments of pause —
            shaped around the weather and your own pace.
          </p>
        </div>

        <div className="mt-20 grid gap-px bg-border md:grid-cols-2">
          {experiences.map((e, i) => (
            <article
              key={e.title}
              className={`group relative overflow-hidden bg-background transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                >
                  <source src={e.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-forest/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-mist">
                  <div>
                    <p className="eyebrow text-mist/70">{e.duration}</p>
                    <h3 className="mt-2 text-3xl md:text-4xl">{e.title}</h3>
                  </div>
                  <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
              <div className="p-8">
                <p className="text-base font-light text-foreground/70">{e.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
