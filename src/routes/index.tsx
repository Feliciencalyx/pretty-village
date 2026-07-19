import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Stay } from "@/components/Stay";
import { Services } from "@/components/Services";
import { Village } from "@/components/Village";
import { Gallery } from "@/components/Gallery";
import { Contact, Footer } from "@/components/Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Story />
      <Stay />
      <Services />
      <Village />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
