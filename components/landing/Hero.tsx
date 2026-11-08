import { ArrowDown, ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SecureVault from "../SecureVault";

export default function Hero() {
  return (
    <>
      <section className="landing-hero relative overflow-hidden border-b border-foreground/20 pt-32 pb-20 text-foreground md:pt-40 md:pb-28">
        <div className="landing-shell relative z-10 grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
          <div className="max-w-xl">
            <div className="eyebrow mb-7 text-foreground/70"><LockKeyhole size={14} /> A calmer way to stay secure</div>
            <h1 className="landing-display text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your digital life,<br /><span className="landing-serif border-b-2 border-primary pb-1">well kept.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-foreground/75 md:text-lg">
              Keep the passwords and important details you use every day in one thoughtfully organized, encrypted place.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-none bg-primary px-6 text-primary-foreground hover:bg-primary/85"><Link href="/sign-up">Create your account <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-foreground/30 bg-background/25 px-6 text-foreground hover:bg-background/60 hover:text-foreground"><Link href="#how-it-works">See how it works <ArrowDown /></Link></Button>
            </div>
            <p className="mt-6 text-xs text-foreground/65">Start with a personal vault. Add your first login when you’re ready.</p>
          </div>
          <div className="relative mx-auto w-full max-w-[650px]">
            <SecureVault className="relative w-full" />
          </div>
        </div>
        <div className="landing-shell relative z-10 mt-12 grid grid-cols-2 gap-3 border-t border-foreground/20 pt-6 text-xs text-foreground/70 sm:grid-cols-4">
          {["Private by design", "Encrypted vaults", "Simple to use", "Open-source project"].map((item) => <div key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{item}</div>)}
        </div>
      </section>
    </>
  );
}
