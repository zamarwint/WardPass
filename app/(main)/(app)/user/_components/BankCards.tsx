import Image from "next/image";

export function BankCard1() {
    return (
        // <!-- Card 1: Unmasked (Active) -->
        <div className="vault-card-bg rounded-lg border border-primary-fixed p-8 flex flex-col relative group transition-all duration-300 shadow-[0_0_15px_rgba(234,234,0,0.15)] overflow-hidden">
            {/* <!-- CRUD Toolbar --> */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 z-10">
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-primary-fixed flex items-center justify-center text-primary-fixed hover:bg-primary-fixed hover:text-[#1A1A1A] transition-colors" title="Hide Details">
                    <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                </button>
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary-fixed hover:text-primary-fixed transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-error hover:text-error transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
            {/* <!-- Card Visual --> */}
            <div className="flex-1 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-8 emv-chip"></div>
                    <div className="w-16 h-10 bg-[#333] rounded flex items-center justify-center text-on-surface-variant font-bold text-xs uppercase tracking-wider relative overflow-hidden">
                        <Image alt="Bank Logo" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" data-alt="Close up of a metallic visa logo reflecting bright yellow neon lights in a dark cyber setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSq79R1kU_mX5N-W57led6_Eeof630PDeuOmUDH__HUPotQGYa_9lS2iuzVMAu6AsOtSKhwesXo50LwNxOHSWENdrr7-XHIG9Z51lt402ECeOY5FoGZOWmV99xyg3F3urwQtEov-0RLPWzyrngcWxdMrbs_b6TyQYxZEit0qPzhThHJ8GUyMdoN4XITRy3cGk3UFNkt1lgFBsmTROgpySXKLfGqMGpT_fhnG-OTsfMhOsi9zCcqVzAdFTASkY5XOllLjnHFDFOOzld" />
                        <span className="relative z-10 text-white drop-shadow-md">BANK</span>
                    </div>
                </div>
                <div className="font-mono-data text-[22px] tracking-[0.15em] text-primary-fixed mb-4 tabular-nums shadow-sm">
                    4111 2222 3333 4444
                </div>
                <div className="flex justify-between items-end font-mono-data text-mono-data text-on-surface">
                    <div>
                        <div className="text-on-surface-variant text-[10px] uppercase mb-1">Cardholder</div>
                        <div className="uppercase tracking-wide text-primary-fixed">Jane Doe</div>
                    </div>
                    <div className="text-right">
                        <div className="text-on-surface-variant text-[10px] uppercase mb-1">Valid Thru</div>
                        <div className="text-primary-fixed">10/26</div>
                    </div>
                    <div className="text-right ml-4">
                        <div className="text-on-surface-variant text-[10px] uppercase mb-1">CVV</div>
                        <div className="text-primary-fixed bg-[#1A1A1A] px-2 py-0.5 rounded border border-primary-fixed/30">123</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function BankCard2() {
    return (
        // <!-- Card 2: Masked with Hover State on Reveal -->
        <div className="vault-card-bg rounded-lg border border-outline-variant p-8 flex flex-col relative group hover:border-primary-fixed transition-all duration-300 overflow-hidden">
            {/* <!-- CRUD Toolbar --> */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 z-10">
                {/* <!-- Hovered Reveal Button --> */}
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-primary-fixed flex items-center justify-center text-primary-fixed shadow-[0_0_8px_rgba(234,234,0,0.4)] transition-all cursor-pointer relative" title="Reveal Details">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    {/* <!-- Simulated Cursor --> */}
                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-primary-fixed fill z-50 transform -rotate-12 pointer-events-none drop-shadow-md text-[20px]">arrow_selector_tool</span>
                </button>
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-outline-variant flex items-center justify-center text-on-surface-variant transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-outline-variant flex items-center justify-center text-on-surface-variant transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
            {/* <!-- Card Visual --> */}
            <div className="flex-1 mb-8 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-8 emv-chip grayscale opacity-80"></div>
                    <div className="w-16 h-10 bg-[#222] rounded flex items-center justify-center text-on-surface-variant font-bold text-xs uppercase tracking-wider border border-outline-variant/50 relative overflow-hidden">
                        <Image alt="Corp Logo" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay grayscale" data-alt="Abstract geometric pattern resembling a modern corporate logo, deep greys and subtle silver highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7fxdSDdXdPlmIqdgr1pIHSAGDpE9r3n9cl3c1ZKbRNuLnDokYc8ecDSrCMYxOYRdZR8vhkElWYokQKtIoaxrFXj7v2kckHT3SUL2r-VjCM7DuGZlQPA2Xttz2uyASyym3zBBkQe3bNPMGAnmzG40ULUllIH30cGXaTdswnoMcEIXAtjtWWA-ElnLrS-xly839IB2ysPM9M7yM1oRFvz0YbBKySMLn_qQwKsaFSxjz-kmd9JtFx7qyNTkRasiD6ld1SkFEkiNlrJww" />
                        <span className="relative z-10 text-on-surface-variant">CORP</span>
                    </div>
                </div>
                <div className="font-mono-data text-[22px] tracking-[0.15em] text-on-surface mb-4 tabular-nums flex items-center gap-2">
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span>8821</span>
                </div>
                <div className="flex justify-between items-end font-mono-data text-mono-data text-on-surface">
                    <div>
                        <div className="text-on-surface-variant text-[10px] uppercase mb-1">Cardholder</div>
                        <div className="uppercase tracking-wide text-on-surface blur-[2px] select-none">Jane Doe</div>
                    </div>
                    <div className="text-right">
                        <div className="text-on-surface-variant text-[10px] uppercase mb-1">Valid Thru</div>
                        <div className="text-on-surface blur-[2px] select-none">12/28</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function BankCard3() {
    return (
        // <!-- Card 3: Masked (Standard) -->
        <div className="vault-card-bg rounded-lg border border-outline-variant p-8 flex flex-col relative group hover:border-primary-fixed transition-all duration-300 overflow-hidden">
            {/* <!-- CRUD Toolbar --> */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary-fixed hover:text-primary-fixed transition-colors" title="Reveal Details">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                </button>
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary-fixed hover:text-primary-fixed transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button className="w-8 h-8 rounded bg-[#1a1c1c] border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-error hover:text-error transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
            {/* <!-- Card Visual --> */}
            <div className="flex-1 mb-8 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-8 emv-chip grayscale opacity-50"></div>
                    <div className="w-16 h-10 bg-[#1A1A1A] rounded flex items-center justify-center text-on-surface-variant font-bold text-xs uppercase tracking-wider border border-outline-variant/30">
                        CREDIT
                    </div>
                </div>
                <div className="font-mono-data text-[22px] tracking-[0.15em] text-on-surface mb-4 tabular-nums flex items-center gap-2">
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-on-surface rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span>0045</span>
                </div>
                <div className="flex justify-between items-end font-mono-data text-mono-data text-on-surface">
                    <div>
                        <div className="text-on-surface-variant text-[10px] uppercase mb-1">Cardholder</div>
                        <div className="uppercase tracking-wide text-on-surface blur-[2px] select-none">Jane Doe</div>
                    </div>
                    <div className="text-right">
                        <div className="text-on-surface-variant text-[10px] uppercase mb-1">Valid Thru</div>
                        <div className="text-on-surface blur-[2px] select-none">05/25</div>
                    </div>
                </div>
            </div>
        </div>
    )
}