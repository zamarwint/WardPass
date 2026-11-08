import { useId } from "react";

type SecureVaultProps = { className?: string; ariaLabel?: string };

/** Theme-aware technical illustration for the WardPass landing hero. */
export function SecureVault({ className, ariaLabel = "A WardPass vault stores an encrypted login credential" }: SecureVaultProps) {
  const id = `vault-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return <div className={className}>
    <svg viewBox="0 0 680 540" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} xmlns="http://www.w3.org/2000/svg" className="vault-art h-auto w-full overflow-visible">
      <title id={`${id}-title`}>{ariaLabel}</title>
      <desc id={`${id}-description`}>A credential card settles into a layered, encrypted vault. Fine lines trace the data path and a gold lock mark signals protection.</desc>
      <defs>
        <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="var(--vault-grid)" strokeOpacity=".075" /></pattern>
        <linearGradient id={`${id}-surface`} x1="0" y1="0" x2="1" y2="1"><stop className="vault-surface-light" stopColor="#fffdf8" /><stop className="vault-surface-dark" offset="1" stopColor="#faebcd" /></linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#434343" floodOpacity=".12" /></filter>
      </defs>
      <style>{`
        .${id}-credential { transform-box: fill-box; transform-origin: center; animation: ${id}-settle 7s cubic-bezier(.2,.7,.2,1) infinite; }
        .${id}-signal { transform-box: fill-box; transform-origin: center; animation: ${id}-signal 7s ease-out infinite; }
        @keyframes ${id}-settle { 0%,12% { transform: translateY(-15px); opacity:.65; } 28%,78% { transform: translateY(0); opacity:1; } 92%,100% { transform: translateY(-15px); opacity:.65; } }
        @keyframes ${id}-signal { 0%,32% { transform: scale(.82); opacity:0; } 44% { opacity:.55; } 76%,100% { transform: scale(1.12); opacity:0; } }
        @media (prefers-reduced-motion: reduce) { .${id}-credential,.${id}-signal { animation:none !important; } .${id}-credential { opacity:1; transform:none; } .${id}-signal { opacity:0; } }
      `}</style>

      <rect className="vault-panel" x="18" y="18" width="644" height="504" fill="#fcfbf8" stroke="#434343" strokeOpacity=".24" />
      <rect x="18" y="18" width="644" height="504" fill={`url(#${id}-grid)`} />
      <text className="vault-label" x="48" y="54" fill="#716b60" fontFamily="monospace" fontSize="9" letterSpacing="1.8">WARDPASS / SECURE STORAGE</text>
      <text className="vault-label" x="632" y="54" fill="#716b60" fontFamily="monospace" fontSize="9" textAnchor="end" letterSpacing="1.6">DATA MODEL / 01</text>

      {/* Quiet connector lines make the storage layers read as a system. */}
      <path className="vault-wire" d="M117 285H182L213 301M563 285H498L467 301M340 113V162M340 392V431" fill="none" stroke="#434343" strokeOpacity=".3" strokeWidth="1" strokeDasharray="2 5" />
      <circle className="vault-node" cx="117" cy="285" r="3" fill="#f7c873" /><circle className="vault-node" cx="563" cy="285" r="3" fill="#f7c873" />
      <text className="vault-label" x="86" y="270" fill="#716b60" fontFamily="monospace" fontSize="8" letterSpacing="1">CLIENT</text>
      <text className="vault-label" x="594" y="270" fill="#716b60" fontFamily="monospace" fontSize="8" textAnchor="end" letterSpacing="1">CIPHERTEXT</text>

      {/* Three precisely aligned planes suggest the vault key and item layers. */}
      <g className="vault-stack" filter={`url(#${id}-shadow)`}>
        <path className="vault-base" d="m340 370 150-76v24l-150 78-150-78v-24z" fill="#e6dece" stroke="#aa8b51" strokeOpacity=".65" />
        <path className="vault-plane vault-plane-back" d="m340 344 150-76v24l-150 78-150-78v-24z" fill="#f4eee1" stroke="#aa8b51" strokeOpacity=".65" />
        <path className="vault-plane vault-plane-front" d="m340 318 150-76v24l-150 78-150-78v-24z" fill="#fcfbf8" stroke="#aa8b51" strokeOpacity=".8" />
        <path className="vault-top" d="m340 216 150 76-150 76-150-76z" fill={`url(#${id}-surface)`} stroke="#c49b53" strokeWidth="1.4" />
        <path d="m340 236 111 56-111 56-111-56z" fill="none" stroke="#aa8b51" strokeOpacity=".42" />
        <path d="M340 236v112M229 292h222" stroke="#aa8b51" strokeOpacity=".18" strokeDasharray="2 5" />
      </g>

      <g className={`${id}-credential`} filter={`url(#${id}-shadow)`}>
        <rect className="vault-card" x="274" y="142" width="132" height="82" rx="2" fill="#fffdf8" stroke="#aa8b51" strokeWidth="1.2" />
        <rect x="288" y="156" width="22" height="22" rx="1" fill="#faebcd" />
        <path d="M294 167v-2a5 5 0 0 1 10 0v2m-12 0h14v8h-14z" fill="none" stroke="#8c6b32" strokeWidth="1.3" strokeLinecap="round" />
        <text className="vault-card-label" x="320" y="166" fill="#434343" fontFamily="monospace" fontSize="7" fontWeight="700" letterSpacing=".8">LOGIN / ENCRYPTED</text>
        <path d="M288 190h104" stroke="#434343" strokeOpacity=".18" />
        <path d="M288 202h60" stroke="#434343" strokeOpacity=".38" strokeWidth="2" strokeDasharray="2 4" />
        <circle cx="386" cy="202" r="3" fill="#c49b53" />
      </g>
      <circle className={`${id}-signal`} cx="340" cy="292" r="113" fill="none" stroke="#f7c873" strokeWidth="1.5" />

      <rect className="vault-status" x="246" y="438" width="188" height="34" fill="#fbf8f1" stroke="#aa8b51" strokeOpacity=".6" />
      <circle cx="264" cy="455" r="4" fill="#c49b53" />
      <text className="vault-status-label" x="278" y="458" fill="#434343" fontFamily="monospace" fontSize="8" fontWeight="700" letterSpacing="1.1">VAULT / SEALED</text>
      <text className="vault-label" x="48" y="484" fill="#827968" fontFamily="monospace" fontSize="8" letterSpacing="1.2">ENCRYPTED STORAGE</text>
      <text className="vault-label" x="632" y="484" fill="#827968" fontFamily="monospace" fontSize="8" textAnchor="end" letterSpacing="1.2">ITEM KEY / WRAPPED</text>
    </svg>
  </div>;
}

export default SecureVault;
