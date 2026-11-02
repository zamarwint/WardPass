import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import SecurityPipeline from "@/components/landing/SecurityPipeline";
import CallToAction from "@/components/landing/CallToAction";
import Hero from "@/components/landing/Hero";

export default async function Page() {
  return (
    <main className="grow font-geist">
      {/* HERO SECTION */}
      <Hero />

      {/* ABOUT SECTION */}
      <About />

      {/* Feature Grid Section */}
      <Features />

      {/* How It Works / Security Pipeline Section */}
      <SecurityPipeline />

      {/* CTA Section */}
      <CallToAction />
    </main>
  );
}
