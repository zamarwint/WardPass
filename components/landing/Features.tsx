import { EyeOff, Share2Icon, ShieldEllipsis } from "lucide-react";

const features = [
  {
    icon: <EyeOff />,
    title: "Zero-Knowledge Architecture",
    description:
      "We can't see your data, and neither can anyone else. Your master key never leaves your device.",
    protocol: "ZK-PROOFS_V2",
  },
  {
    icon: <ShieldEllipsis />,
    title: "Client-Side AES-256-GCM Encryption",
    description:
      "Military-grade encryption happens locally on your device before a single byte hits our servers.",
    protocol: "AES-256-GCM",
  },
  {
    icon: <Share2Icon />,
    title: "End-to-End Secure Sharing",
    description:
      "Share passwords with family or team members via encrypted tunnels, revoking access instantly when needed.",
    protocol: "ACTIVE_TUNNELS",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="w-full py-24 px-4 md:px-10 border-y border-foreground/5 flex items-center justify-center"
    >
      <div className="flex flex-col items-start">
        <div className="mb-16 max-w-3xl flex flex-col gap-4 items-start justify-start">
          <h2 className="font-bold text-3xl">Engineered for Absolute Trust</h2>
          <p className="text-muted-foreground">
            We rebuilt password management from the ground up, prioritizing
            mathematical certainty over promises.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Features */}
          {features.map((feature, index) => (
            <div key={index} className="p-8 flex flex-col h-full bg-card">
              <div className="w-12 h-12 mb-6 flex items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                <span className="">{feature.icon}</span>
              </div>
              <h3 className="font-bold mb-3 text-lg">{feature.title}</h3>
              <p className="mb-8 grow">{feature.description}</p>
              <div className="pt-4 border-t border-white/10 font-mono text-xs">
                PROTOCOL: {feature.protocol}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
