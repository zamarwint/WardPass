import About from "./_landing/About";
import Features from "./_landing/Features";
import SecurityPipeline from "./_landing/SecurityPipeline";
import CallToAction from "./_landing/CallToAction";
import Hero from "./_landing/Hero";

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
