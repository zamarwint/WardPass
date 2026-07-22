import { ChevronsLeftRightEllipsis, EyeOff, Server, Share2Icon, ShieldEllipsis, Smartphone } from "lucide-react"
import { PaymentCard } from "@/app/_components/UICards";
import Link from "next/link";
import Image from "next/image";
import Hero from "./_components/Hero";;

const features = [
  {
    icon: <EyeOff />,
    title: "Zero-Knowledge Architecture",
    description: "We can't see your data, and neither can anyone else. Your master key never leaves your device.",
    protocol: "ZK-PROOFS_V2"
  },
  {
    icon: <ShieldEllipsis />,
    title: "Client-Side AES-256-GCM Encryption",
    description: "Military-grade encryption happens locally on your device before a single byte hits our servers.",
    protocol: "AES-256-GCM"
  },
  {
    icon: <Share2Icon />,
    title: "End-to-End Secure Sharing",
    description: "Share passwords with family or team members via encrypted tunnels, revoking access instantly when needed.",
    protocol: "ACTIVE_TUNNELS"
  },
]

const securityPipeline = [
  {
    icon: <Smartphone />,
    phaseNumber: 1,
    phaseTitle: "Phase 01",
    title: "Your Device",
    description: "Data is encrypted locally using AES-256 before leaving your hardware."
  },
  {
    icon: <ChevronsLeftRightEllipsis />,
    phaseNumber: 2,
    phaseTitle: "Phase 02",
    title: "Encrypted Tunnel",
    description: "Ciphertext traverses the network via TLS 1.3 secured connections."
  },
  {
    icon: <Server />,
    phaseNumber: 3,
    phaseTitle: "Phase 03",
    title: "Kinetic Vault",
    description: "Encrypted blobs are stored in distributed, hardened infrastructure."
  },
]

const securityPipelineClasses = (phaseNumber: number) => {
  switch (phaseNumber) {
    case 1:
      return ["w-12 h-12 bg-primary text-background flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,0,0.3)]", "text-primary mb-1 uppercase tracking-widest font-geist"]
    case 2:
      return ["w-12 h-12 bg-background text-primary border border-primary flex items-center justify-center shrink-0", "text-primary mb-1 uppercase tracking-widest font-geist"]
    case 3:
      return ["w-12 h-12 bg-background border border-foreground/20 flex items-center justify-center shrink-0", "mb-1 uppercase tracking-widest font-geist"]
    default:
      return [""]
  }
}

function CircuitLines() {
  return (
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,100 L200,100 L250,150 L500,150 L550,100 L1000,100" fill="none" className="stroke-primary" strokeWidth="1"></path>
      <path d="M0,200 L150,200 L200,250 L600,250 L650,200 L1000,200" fill="none" className="stroke-primary" strokeDasharray="4,4" strokeWidth="1"></path>
    </svg>
  )
}

function SecurityDecoration() {
  return (
    <>
      {/* Horizontal connection line (Desktop) */}
      <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-foreground/10 z-0">
        {/* Active circuit segment */}
        <div className="h-full bg-primary w-2/3 shadow-[0_0_8px_rgba(255,255,0,0.5)]"></div>
      </div>
      {/* Vertical connection line (Mobile) */}
      <div className="md:hidden absolute top-0 left-6 h-full w-px bg-foreground/10 z-0">
        <div className="w-full bg-primary h-2/3 shadow-[0_0_8px_rgba(255,255,0,0.5)]"></div>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <main className="grow font-geist">
      <Hero />

      {/* Trust Bar Section */}
      <section className="border-y border-foreground/5 py-12">
        <div className="mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="uppercase tracking-widest font-bold">Certified Security Protocols</p>
            <Link href="https://gdpr-info.eu/" target="_blank">
              <Image src="/security-badges.svg" alt="Security Badges" width={1440} height={190} className="w-full max-w-200 h-auto" loading="eager" />
            </Link>
          </div>
        </div>
      </section>


      {/* ABOUT SECTION */}
      <section id="about" className="border-y border-foreground/5 py-21 px-4 font-geist">
        <div className="flex flex-col md:flex-row mx-auto items-center justify-around gap-10 md:gap-0">
          <div className="w-64 md:w-2/6 text-center md:text-left flex flex-col gap-15">
            <h2 className="text-2xl md:text-8xl font-bold text-primary">What is WardPass?</h2>
            <div className="flex flex-col gap-8 text-xl">
              <p>WardPass is a secure password management solution. With WardPass, you can easily organize your passwords into different folders, and use them when you want to sign in to any service.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <PaymentCard />
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="w-full py-24 px-4 md:px-10 border-y border-foreground/5 flex items-center justify-center">
        <div className="flex flex-col items-start">
          <div className="mb-16 max-w-3xl flex flex-col gap-4 items-start justify-start">
            <h2 className="font-bold text-3xl">Engineered for Absolute Trust</h2>
            <p className="text-muted-foreground">We rebuilt password management from the ground up, prioritizing mathematical certainty over promises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Features */}
            {features.map((feature, index) => (
              <div key={index} className="p-8 flex flex-col h-full bg-card">
                <div className="w-12 h-12 mb-6 flex items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                  <span className="">{feature.icon}</span>
                </div>
                <h3 className="font-bold mb-3 text-lg">{feature.title}</h3>
                <p className="mb-8 grow">
                  {feature.description}
                </p>
                <div className="pt-4 border-t border-white/10 font-mono text-xs">
                  PROTOCOL: {feature.protocol}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="security" className="py-24 border-y border-foreground/5 relative overflow-hidden">
        {/* Decorative circuit lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <CircuitLines />
        </div>
        <div className="mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-bold text-2xl">The Security Pipeline</h2>
            <p className="max-w-2xl mx-auto">A transparent look at how your data travels from your device to our vaults.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start relative px-4 md:px-10">
            <SecurityDecoration />
            {securityPipeline.map((step, index) => (
              <div key={index} className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 relative z-10 mb-12 md:mb-0 md:w-1/3 pr-8">
                <div className={`${securityPipelineClasses(step.phaseNumber)[0]}`}>
                  <span>{step.icon}</span>
                </div>
                <div>
                  <div className={`${securityPipelineClasses(step.phaseNumber)[1]}`}>{step.phaseTitle}</div>
                  <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
                  <p className="text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - */}
      <section className="py-30 border-y border-foreground/5" >
        <div className="mx-auto">
          <div className="p-12 text-center max-w-4xl mx-auto border border-foreground/20 hover:border-primary/50 bg-card">
            <h2 className="text-2xl md:text-4xl font-bold font-geist mb-6">Ready to secure your assets?</h2>
            <p className="mb-10 max-w-2xl mx-auto text-muted-foreground">Join thousands of power users who trust WardPass with their most sensitive digital credentials.</p>
            <Link href="sign-up" className="btn-primary px-10 py-4 inline-block uppercase tracking-wider hover:bg-primary/80">
              Initialize Vault
            </Link>
          </div>
        </div>
      </section >
    </main>
  )
}