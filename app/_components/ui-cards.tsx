import { CardSim, CopyIcon, LandmarkIcon } from "lucide-react"

export function PaymentCard() {
    return (
        <div className="group flex flex-col justify-center items-center p-4 md:p-8 bg-black border border-neutral-800 rounded-xl">
            <div className="text-sm mb-6 uppercase tracking-widest w-full text-center">Payment Card</div>
            <div className="w-full max-w-[380px] aspect-[1.586/1] bg-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between border border-neutral-800 transition-all duration-300">
                {/* Top Row */}
                <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col gap-3">
                        <span className="text-primary text-3xl"><LandmarkIcon /> </span>
                        <span className="text-4xl"><CardSim color="gray" /> </span>
                    </div>
                    <button aria-label="Copy Card Number" className="text-primary hover:brightness-110 transition-all opacity-0 group-hover:opacity-100 p-2 -mr-2 -mt-2 rounded hover:bg-neutral-900">
                        <span><CopyIcon /> </span>
                    </button>
                </div>
                {/* Middle Row: Number */}
                <div className="z-10 mt-auto mb-6">
                    <div className="font-mono text-xl md:text-2xl tracking-[0.2em] flex items-center">
                        <span className="mr-4">••••</span>
                        <span className="mr-4">••••</span>
                        <span className="mr-4">••••</span>
                        <span className="text-primary font-medium tracking-widest">4242</span>
                    </div>
                </div>
                {/* Bottom Row: Details */}
                <div className="flex justify-between items-end z-10 font-mono text-xs uppercase">
                    <div className="flex flex-col">
                        <span className="opacity-70 text-[10px] mb-1">Cardholder Name</span>
                        <span className="font-medium tracking-wide">ALEX THORNE</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="opacity-70 text-[10px] mb-1">Valid Thru</span>
                        <span className="font-medium tracking-wide">10/26</span>
                    </div>
                </div>
                {/* Decorative Background Element */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
            </div>
        </div>
    )
}

export function WebsiteCredentialCard() {
    return (
        <div className="group flex flex-col justify-center items-center p-8 bg-surface border border-surface-container-high rounded-xl">
            <div className="text-sm font-label-sm text-on-surface-variant mb-6 uppercase tracking-widest w-full text-center">Website Credential</div>
            <div className="w-full max-w-[380px] bg-surface-container-low rounded-xl p-6 border border-surface-variant card-hover transition-all duration-300 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-surface-container-high shrink-0">
                        Using generic icon as placeholder for Google G
                        <span className="material-symbols-outlined text-primary text-2xl">language</span>
                    </div>
                    <div>
                        <h3 className="font-headline-md text-primary m-0">Google</h3>
                        <p className="font-label-sm text-on-surface-variant mt-1">google.com</p>
                    </div>
                </div>
                {/* Fields */}
                <div className="space-y-4 relative z-10">
                    Email
                    <div className="group/field relative">
                        <label className="block font-label-sm text-on-surface-variant mb-1 ml-1 opacity-70">Username / Email</label>
                        <div className="flex items-center justify-between bg-surface/50 border border-surface-variant rounded-lg p-3 group-hover/field:border-outline transition-colors">
                            <span className="font-mono-data text-on-surface truncate pr-4">alex.thorne@gmail.com</span>
                            <button aria-label="Copy Email" className="text-primary-fixed opacity-0 group-hover/field:opacity-100 hover:brightness-110 transition-all shrink-0">
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                            </button>
                        </div>
                    </div>
                    {/* Password */}
                    <div className="group/field relative">
                        <label className="block font-label-sm text-on-surface-variant mb-1 ml-1 opacity-70">Password</label>
                        <div className="flex items-center justify-between bg-surface/50 border border-surface-variant rounded-lg p-3 group-hover/field:border-outline transition-colors">
                            <span className="font-mono-data text-on-surface tracking-widest text-lg leading-none mt-1">••••••••••••</span>
                            <div className="flex items-center gap-2 shrink-0">
                                <button aria-label="Toggle Visibility" className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover/field:opacity-100">
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                </button>
                                <button aria-label="Copy Password" className="text-primary-fixed opacity-0 group-hover/field:opacity-100 hover:brightness-110 transition-all">
                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 blur-2xl rounded-bl-full pointer-events-none group-hover:bg-primary-fixed/10 transition-colors duration-500"></div>
            </div>
        </div>
    )
}