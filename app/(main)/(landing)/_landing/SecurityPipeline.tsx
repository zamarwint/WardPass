import { ChevronsLeftRightEllipsis, Server, Smartphone } from "lucide-react";

function CircuitLines() {
  return (
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0,100 L200,100 L250,150 L500,150 L550,100 L1000,100"
        fill="none"
        className="stroke-primary"
        strokeWidth="1"
      ></path>
      <path
        d="M0,200 L150,200 L200,250 L600,250 L650,200 L1000,200"
        fill="none"
        className="stroke-primary"
        strokeDasharray="4,4"
        strokeWidth="1"
      ></path>
    </svg>
  );
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
  );
}

const securityPipelineClasses = (phaseNumber: number) => {
  switch (phaseNumber) {
    case 1:
      return [
        "w-12 h-12 bg-primary text-background flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,0,0.3)]",
        "text-primary mb-1 uppercase tracking-widest font-geist",
      ];
    case 2:
      return [
        "w-12 h-12 bg-background text-primary border border-primary flex items-center justify-center shrink-0",
        "text-primary mb-1 uppercase tracking-widest font-geist",
      ];
    case 3:
      return [
        "w-12 h-12 bg-background border border-foreground/20 flex items-center justify-center shrink-0",
        "mb-1 uppercase tracking-widest font-geist",
      ];
    default:
      return [""];
  }
};

const securityPipeline = [
  {
    icon: <Smartphone />,
    phaseNumber: 1,
    phaseTitle: "Phase 01",
    title: "Your Device",
    description:
      "Data is encrypted locally using AES-256 before leaving your hardware.",
  },
  {
    icon: <ChevronsLeftRightEllipsis />,
    phaseNumber: 2,
    phaseTitle: "Phase 02",
    title: "Encrypted Tunnel",
    description:
      "Ciphertext traverses the network via TLS 1.3 secured connections.",
  },
  {
    icon: <Server />,
    phaseNumber: 3,
    phaseTitle: "Phase 03",
    title: "Kinetic Vault",
    description:
      "Encrypted blobs are stored in distributed, hardened infrastructure.",
  },
];

export default function SecurityPipeline() {
  return (
    <section
      id="security"
      className="py-24 border-y border-foreground/5 relative overflow-hidden"
    >
      {/* Decorative circuit lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <CircuitLines />
      </div>
      <div className="mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="mb-4 font-bold text-2xl">The Security Pipeline</h2>
          <p className="max-w-2xl mx-auto">
            A transparent look at how your data travels from your device to our
            vaults.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start relative px-4 md:px-10">
          <SecurityDecoration />
          {securityPipeline.map((step, index) => (
            <div
              key={index}
              className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 relative z-10 mb-12 md:mb-0 md:w-1/3 pr-8"
            >
              <div
                className={`${securityPipelineClasses(step.phaseNumber)[0]}`}
              >
                <span>{step.icon}</span>
              </div>
              <div>
                <div
                  className={`${securityPipelineClasses(step.phaseNumber)[1]}`}
                >
                  {step.phaseTitle}
                </div>
                <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
                <p className="text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
