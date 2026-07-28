'use client';

import { useState } from "react";
import { Eye, EyeOff, MousePointer2, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function BankCard1() {
    const [cardNumber, setCardNumber] = useState<string>("4111 2222 3333 4444");
    const [showCardNumber, setShowCardNumber] = useState<boolean>(false);
    const [editCardNumber, setEditCardNumber] = useState<boolean>(false);

    const toggleCardNumber = () => {
        setShowCardNumber(!showCardNumber);
        setTimeout(() => {
            setShowCardNumber(false);
        }, 5000);
    }

    const toggleEditCardNumber = () => {
        setEditCardNumber(!editCardNumber);
    }

    const deleteCardNumber = () => {
        if (editCardNumber) setCardNumber("");
        else {
            toast.error('Please click edit button to edit the card number before deleting.')
        };
    }

    return (
        // <!-- Card 1: Unmasked (Active) -->
        <div className="bg-card rounded-xl border hover:border-primary p-8 flex flex-col relative group transition-all duration-300 shadow-[0_0_15px_rgba(234,234,0,0.15)] overflow-hidden cursor-pointer">
            {/* <!-- CRUD Toolbar --> */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 z-10">
                <button onClick={toggleCardNumber} className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-primary flex items-center justify-center text-primary transition-colors" title="Hide Details">
                    <span className="text-[18px]">{showCardNumber ? <EyeOff /> : <Eye />}</span>
                </button>
                <button onClick={toggleEditCardNumber} className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-primary flex items-center justify-center text-primary transition-colors" title="Edit">
                    <span className="text-[18px]">{editCardNumber ? <X /> : <Pencil />}</span>
                </button>
                <button onClick={deleteCardNumber} className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-primary flex items-center justify-center text-primary transition-colors" title="Delete">
                    <span className="text-[18px]"><Trash2 /></span>
                </button>
            </div>
            {/* <!-- Card Visual --> */}
            <div className="flex-1 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-8"></div>
                    <div className="w-16 h-10 dark:bg-[#333] bg-white border border-foreground/50 rounded flex items-center justify-center text-foreground font-bold text-xs uppercase tracking-wider relative overflow-hidden">
                        <Image alt="Bank Logo" width={500} height={500} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" data-alt="Close up of a metallic visa logo reflecting bright yellow neon lights in a dark cyber setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSq79R1kU_mX5N-W57led6_Eeof630PDeuOmUDH__HUPotQGYa_9lS2iuzVMAu6AsOtSKhwesXo50LwNxOHSWENdrr7-XHIG9Z51lt402ECeOY5FoGZOWmV99xyg3F3urwQtEov-0RLPWzyrngcWxdMrbs_b6TyQYxZEit0qPzhThHJ8GUyMdoN4XITRy3cGk3UFNkt1lgFBsmTROgpySXKLfGqMGpT_fhnG-OTsfMhOsi9zCcqVzAdFTASkY5XOllLjnHFDFOOzld" />
                        <span className="relative z-10 text-foreground drop-shadow-md">BANK</span>
                    </div>
                </div>
                <div className="font-mono text-[22px] tracking-[0.15em] text-foreground mb-4 tabular-nums shadow-sm">
                    <Input type="text" value={editCardNumber ? cardNumber : showCardNumber ? cardNumber : "•••• •••• •••• ••••"} readOnly={!editCardNumber} className="border-none" onChange={(e) => setCardNumber(e.target.value)} maxLength={20} />
                </div>
                <div className="flex justify-between items-end font-mono text-mono text-foreground">
                    <div>
                        <div className="text-foreground text-[10px] uppercase mb-1">Cardholder</div>
                        <div className="uppercase tracking-wide text-foreground">Jane Doe</div>
                    </div>
                    <div className="text-right">
                        <div className="text-foreground text-[10px] uppercase mb-1">Valid Thru</div>
                        <div className="text-foreground">10/26</div>
                    </div>
                    <div className="text-right ml-4">
                        <div className="text-foreground text-[10px] uppercase mb-1">CVV</div>
                        <div className="text-foreground dark:bg-[#1A1A1A] bg-white px-2 py-0.5 rounded border border-foreground/30">123</div>
                    </div>
                </div>
            </div>
            <div className="border-t border-primary pt-4 flex justify-between items-center text-[10px] text-primary font-mono-data uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Primary Card</span>
                <span>Updated 2m ago</span>
            </div>
        </div>
    )
}

export function BankCard2() {
    return (
        // <!-- Card 2: Masked with Hover State on Reveal -->
        <div className="bg-card rounded-xl border p-8 flex flex-col relative group hover:border-primary transition-all duration-300 overflow-hidden cursor-pointer">
            {/* <!-- CRUD Toolbar --> */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 z-10">
                {/* <!-- Hovered Reveal Button --> */}
                <button className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-primary flex items-center justify-center text-primary shadow-[0_0_8px_rgba(234,234,0,0.4)] transition-all cursor-pointer relative" title="Reveal Details">
                    <span className="text-[18px]"><EyeOff /></span>
                    {/* <!-- Simulated Cursor --> */}
                    <span className="absolute -bottom-4 -right-4 text-primary fill z-50 transform -rotate-12 pointer-events-none drop-shadow-md text-[20px]"><MousePointer2 /></span>
                </button>
                <button className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-primary flex items-center justify-center text-primary transition-colors" title="Edit">
                    <span className="text-[18px]"><Pencil /></span>
                </button>
                <button className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-primary flex items-center justify-center text-primary transition-colors" title="Delete">
                    <span className="text-[18px]"><Trash2 /></span>
                </button>
            </div>
            {/* <!-- Card Visual --> */}
            <div className="flex-1 mb-8 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-8 grayscale opacity-80"></div>
                    <div className="w-16 h-10 dark:bg-[#222] bg-white rounded flex items-center justify-center text-foreground font-bold text-xs uppercase tracking-wider border border-foreground/50 relative overflow-hidden">
                        <Image width={500} height={500} alt="Corp Logo" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay grayscale" data-alt="Abstract geometric pattern resembling a modern corporate logo, deep greys and subtle silver highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7fxdSDdXdPlmIqdgr1pIHSAGDpE9r3n9cl3c1ZKbRNuLnDokYc8ecDSrCMYxOYRdZR8vhkElWYokQKtIoaxrFXj7v2kckHT3SUL2r-VjCM7DuGZlQPA2Xttz2uyASyym3zBBkQe3bNPMGAnmzG40ULUllIH30cGXaTdswnoMcEIXAtjtWWA-ElnLrS-xly839IB2ysPM9M7yM1oRFvz0YbBKySMLn_qQwKsaFSxjz-kmd9JtFx7qyNTkRasiD6ld1SkFEkiNlrJww" />
                        <span className="relative z-10 text-foreground">CORP</span>
                    </div>
                </div>
                <div className="font-mono text-[22px] tracking-[0.15em] text-foreground mb-4 tabular-nums flex items-center gap-2">
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span>8821</span>
                </div>
                <div className="flex justify-between items-end font-mono text-mono text-foreground">
                    <div>
                        <div className="text-foreground text-[10px] uppercase mb-1">Cardholder</div>
                        <div className="uppercase tracking-wide text-foreground select-none">Jane Doe</div>
                    </div>
                    <div className="text-right">
                        <div className="text-foreground text-[10px] uppercase mb-1">Valid Thru</div>
                        <div className="text-foreground blur-[2px] select-none">12/28</div>
                    </div>
                </div>
            </div>
            <div className="border-t border-foreground pt-4 flex justify-between items-center text-[10px] text-foreground font-mono uppercase tracking-wider">
                <span>Business Expense</span>
                <span>Updated 1w ago</span>
            </div>
        </div>
    )
}

export function BankCard3() {
    return (
        // <!-- Card 3: Masked (Standard) -->
        <div className="bg-card rounded-xl border p-8 flex flex-col relative group hover:border-primary transition-all duration-300 overflow-hidden cursor-pointer">
            {/* <!-- CRUD Toolbar --> */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-foreground flex items-center justify-center text-foreground transition-colors" title="Reveal Details">
                    <span className="text-[18px]"><EyeOff /></span>
                </button>
                <button className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-foreground flex items-center justify-center text-foreground transition-colors" title="Edit">
                    <span className="text-[18px]"><Pencil /></span>
                </button>
                <button className="w-8 h-8 rounded dark:bg-[#1a1c1c] bg-white border border-background hover:border-foreground flex items-center justify-center text-foreground transition-colors" title="Delete">
                    <span className="text-[18px]"><Trash2 /></span>
                </button>
            </div>
            {/* <!-- Card Visual --> */}
            <div className="flex-1 mb-8 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-8 grayscale opacity-50"></div>
                    <div className="w-16 h-10 dark:bg-[#1A1A1A] bg-white rounded flex items-center justify-center text-foreground font-bold text-xs uppercase tracking-wider border border-foreground/50">
                        CREDIT
                    </div>
                </div>
                <div className="font-mono text-[22px] tracking-[0.15em] text-foreground mb-4 tabular-nums flex items-center gap-2">
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                    </span>
                    <span>&nbsp;</span>
                    <span>0045</span>
                </div>
                <div className="flex justify-between items-end font-mono text-mono text-foreground">
                    <div>
                        <div className="text-foreground text-[10px] uppercase mb-1">Cardholder</div>
                        <div className="uppercase tracking-wide text-foreground select-none">Jane Doe</div>
                    </div>
                    <div className="text-right">
                        <div className="text-foreground text-[10px] uppercase mb-1">Valid Thru</div>
                        <div className="text-foreground blur-[2px] select-none">05/25</div>
                    </div>
                </div>
            </div>
            <div className="border-t border-foreground pt-4 flex justify-between items-center text-[10px] text-foreground font-mono uppercase tracking-wider">
                <span>Online Shopping</span>
                <span>Updated 1m ago</span>
            </div>
        </div>
    )
}