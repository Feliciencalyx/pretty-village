import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Mesh, Group } from "three";

function Volcano() {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.getElapsedTime() * 0.08;
  });
  return (
    <group ref={g}>
      {/* Main cone */}
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[1.8, 2.4, 6, 1]} />
        <meshStandardMaterial color="#2d5a3d" roughness={0.9} flatShading />
      </mesh>
      {/* Second peak */}
      <mesh position={[-1.6, -0.7, -0.5]} scale={0.75}>
        <coneGeometry args={[1.4, 2, 6, 1]} />
        <meshStandardMaterial color="#1a3c2a" roughness={0.9} flatShading />
      </mesh>
      {/* Third peak */}
      <mesh position={[1.5, -0.85, -0.4]} scale={0.6}>
        <coneGeometry args={[1.3, 1.8, 6, 1]} />
        <meshStandardMaterial color="#3a6b48" roughness={0.9} flatShading />
      </mesh>
      {/* Snow cap on main */}
      <mesh position={[0, 0.75, 0]}>
        <coneGeometry args={[0.5, 0.6, 6, 1]} />
        <meshStandardMaterial color="#e8f0e8" roughness={0.4} flatShading />
      </mesh>
      {/* Mist ring */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.15, 12, 40]} />
        <meshStandardMaterial color="#a0c49d" transparent opacity={0.25} />
      </mesh>
      {/* Floating orbs = distant villages */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.6, -1.1, Math.sin(a) * 2.6]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function Bird({ offset }: { offset: number }) {
  const m = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (m.current) {
      const t = clock.getElapsedTime() + offset;
      m.current.position.x = Math.sin(t * 0.3) * 3;
      m.current.position.z = Math.cos(t * 0.3) * 3;
      m.current.position.y = 1.2 + Math.sin(t * 2) * 0.15;
      m.current.rotation.y = -t * 0.3 + Math.PI / 2;
    }
  });
  return (
    <mesh ref={m}>
      <coneGeometry args={[0.05, 0.2, 3]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  );
}

export function VolcanoScene() {
  return (
    <div className="h-[500px] w-full md:h-[600px]">
      <Canvas camera={{ position: [4, 2, 5], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff5e0" />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#a0c49d" />
          <fog attach="fog" args={["#a0c49d", 8, 18]} />
          <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
            <Volcano />
          </Float>
          <Bird offset={0} />
          <Bird offset={2} />
          <Bird offset={4} />
          <Environment preset="forest" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
