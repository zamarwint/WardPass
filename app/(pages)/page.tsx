"use client";

export default function Page() {
  return (
    <main className="grow">
      {/* Hero Section  */
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          {/* Subtle background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size:[40px_40px] pointer-events-none"></div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[#ffff00]/30 bg-[#ffff00]/5 text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  Active Protection Enabled
                </div>
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
                  Your Digital Life, <br /><span className="text-primary-fixed">Cryptographically Secured</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
                  Deploy a high-performance digital vault engineered for power users. Zero-knowledge architecture meets uncompromising speed. Your data remains an impenetrable asset.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a className="primary-btn px-8 py-4 text-center font-label-sm text-label-sm uppercase tracking-wider flex items-center justify-center gap-2" href="#">
                    Get Started for Free
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                  <a className="secondary-btn px-8 py-4 text-center font-label-sm text-label-sm uppercase tracking-wider" href="#">
                    View Enterprise Plans
                  </a>
                </div>
                <div className="mt-8 flex items-center gap-2 font-mono-data text-mono-data text-surface-variant">
                  <span className="w-2 h-2 bg-primary-fixed rounded-full animate-pulse"></span>
                  System Status: Operational &amp; Secure
                </div>
              </div>
              <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
                <img alt="" className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_40px_rgba(255,255,0,0.15)]" src="https://lh3.googleusercontent.com/aida/AP1WRLstW_6TEm479e4fAriQ3WoboM_z3svq6pF0DiL4FXHmBsHLnHOqyca9lwYIMxmUKxnEdQD4vP0OBO0GQkFTqDPia-rtYbV6BfNejgbEDUud5ViqjP_acocNrNqff3_ITtuGqAb_nmP8ScLgy54aXJWFclVGCEM59vDesvBn5C8BYEZkExbbusN95V9tI1o9K1YzjqS3DLKNo7z2qOGsWatCkI242XF6NpEBNV8H0KwCrZPsVVLZSnxwAsY" />
              </div>
            </div>
          </div>
        </section>
      }
      {/* Trust Bar Section */}
      <section className="border-y border-white/5 bg-surface-container-low py-12">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-widest">Certified Security Protocols</p>
            <img alt="" className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity duration-300" src="https://lh3.googleusercontent.com/aida/AP1WRLsjvkiAdcnTjICj6jFw1H7FaMHPG9wechCztwi5Ni1NAydzb_7_nDMkPTL2MPBXKFp-DNuvlPN8C65B3U5taLbu6gFNyP2AwFsGxpiQbEUh6UxqkASsdqEFO_5MDo4Qp_6HX0aqB4zEL7e3qU4xGJcrMYJ0YcS8bLorl_Db4mIj162_OLSjzjm8YQnND4NQ124iT9qfTWr7VifR8qB1bMlnrJrojUaEd0YonNVwbnTBdvFwNZrdP4Ek82s" />
          </div>
        </div>
      </section>
      {/* Feature Grid Section */}
      <section className="py-24 bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-16 max-w-3xl">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Engineered for Absolute Trust</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">We rebuilt password management from the ground up, prioritizing mathematical certainty over promises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="vault-card p-8 flex flex-col h-full">
              <div className="w-12 h-12 mb-6 flex items-center justify-center border border-primary-fixed/30 bg-primary-fixed/10 text-primary-fixed">
                <span className="material-symbols-outlined font-variation-settings: 'wght' 200;">visibility_off</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3 text-lg">Zero-Knowledge Architecture</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 grow">
                We can't see your data, and neither can anyone else. Your master key never leaves your device.
              </p>
              <div className="pt-4 border-t border-white/10 font-mono-data text-mono-data text-on-tertiary-container text-xs">
                PROTOCOL: ZK-PROOFS_V2
              </div>
            </div>
            {/* Feature 2 */}
            <div className="vault-card p-8 flex flex-col h-full">
              <div className="w-12 h-12 mb-6 flex items-center justify-center border border-primary-fixed/30 bg-primary-fixed/10 text-primary-fixed">
                <span className="material-symbols-outlined font-variation-settings: 'wght' 200;">security</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3 text-lg">Client-Side AES-256 Encryption</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 grow">
                Military-grade encryption happens locally on your device before a single byte hits our servers.
              </p>
              <div className="pt-4 border-t border-white/10 font-mono-data text-mono-data text-on-tertiary-container text-xs">
                CIPHER: AES-256-GCM
              </div>
            </div>
            {/* Feature 3 */}
            <div className="vault-card p-8 flex flex-col h-full">
              <div className="w-12 h-12 mb-6 flex items-center justify-center border border-primary-fixed/30 bg-primary-fixed/10 text-primary-fixed">
                <span className="material-symbols-outlined font-variation-settings: 'wght' 200;">hub</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3 text-lg">End-to-End Secure Sharing</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 grow">
                Share passwords with family or team members via encrypted tunnels, revoking access instantly when needed.
              </p>
              <div className="pt-4 border-t border-white/10 font-mono-data text-mono-data text-on-tertiary-container text-xs">
                STATE: ACTIVE_TUNNELS
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-24 bg-surface-container-low border-t border-white/5 relative overflow-hidden">
        {/* Decorative circuit lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 L200,100 L250,150 L500,150 L550,100 L1000,100" fill="none" stroke="#ffff00" strokeWidth="1"></path>
            <path d="M0,200 L150,200 L200,250 L600,250 L650,200 L1000,200" fill="none" stroke="#ffff00" strokeDasharray="4,4" strokeWidth="1"></path>
          </svg>
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">The Security Pipeline</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">A transparent look at how your data travels from your device to our vaults.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start relative">
            {/* Horizontal connection line (Desktop) */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-white/10 z-0">
              {/* Active circuit segment */}
              <div className="h-full bg-primary-fixed w-2/3 shadow-[0_0_8px_rgba(255,255,0,0.5)]"></div>
            </div>
            {/* Vertical connection line (Mobile) */}
            <div className="md:hidden absolute top-0 left-6 h-full w-px bg-white/10 z-0">
              <div className="w-full bg-primary-fixed h-2/3 shadow-[0_0_8px_rgba(255,255,0,0.5)]"></div>
            </div>
            {/* Step 1
   */}            <div className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 relative z-10 mb-12 md:mb-0 md:w-1/3 pr-8">
              <div className="w-12 h-12 bg-primary-fixed text-background flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,0,0.3)]">
                <span className="material-symbols-outlined font-variation-settings: 'wght' 600;">smartphone</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-primary-fixed mb-1 uppercase tracking-widest">Phase 01</div>
                <h4 className="font-headline-md text-headline-md text-primary text-base mb-2">Your Device</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Data is encrypted locally using AES-256 before leaving your hardware.</p>
              </div>
            </div>
            {/* Step 2
   */}            <div className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 relative z-10 mb-12 md:mb-0 md:w-1/3 pr-8">
              <div className="w-12 h-12 bg-surface border border-primary-fixed text-primary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined font-variation-settings: 'wght' 300;">sync_alt</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-primary-fixed mb-1 uppercase tracking-widest">Phase 02</div>
                <h4 className="font-headline-md text-headline-md text-primary text-base mb-2">Encrypted Tunnel</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Ciphertext traverses the network via TLS 1.3 secured connections.</p>
              </div>
            </div>
            {/* Step 3
   */}            <div className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 relative z-10 md:w-1/3">
              <div className="w-12 h-12 bg-surface border border-white/20 text-on-surface flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined font-variation-settings: 'wght' 300;">dns</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-widest">Phase 03</div>
                <h4 className="font-headline-md text-headline-md text-primary text-base mb-2">Kinetic Vault</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Encrypted blobs are stored in distributed, hardened infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section - */}
      <section className="py-24 bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="vault-card p-12 text-center max-w-4xl mx-auto border border-white/10 hover:border-primary-fixed/50">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Ready to secure your assets?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Join thousands of power users who trust WardPass with their most sensitive digital credentials.</p>
            <a className="primary-btn px-10 py-4 inline-block font-label-sm text-label-sm uppercase tracking-wider" href="#">
              Initialize Vault
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}