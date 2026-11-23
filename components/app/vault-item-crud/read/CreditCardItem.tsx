"use client";

import React, { useState } from "react";
import { CreditCard, User, Hash, Calendar, ShieldCheck, MapPin, Eye, EyeOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditCardJSON } from "@/lib/types/VaultItemType";
import { ItemHeader, DetailRow, SectionCard, ItemMetadata, CopyButton } from "./DetailItem";

export default function CreditCardItem({ creditCardItem }: { creditCardItem: CreditCardJSON }) {
    const [cardRevealed, setCardRevealed] = useState(false);

    // Format card number with spaces every 4 digits
    const formatCardNumber = (num: string) => {
        const clean = num.replace(/\s+/g, "");
        return clean.replace(/(\d{4})/g, "$1 ").trim();
    };

    const formattedFullNumber = formatCardNumber(creditCardItem.cardNumber);
    const maskedCardNumber = `•••• •••• •••• ${creditCardItem.cardNumber.slice(-4)}`;

    const hasBillingAddress =
        Boolean(creditCardItem.billingAddress1) ||
        Boolean(creditCardItem.city) ||
        Boolean(creditCardItem.country);

    const fullBillingAddress = [
        creditCardItem.billingAddress1,
        creditCardItem.billingAddress2,
        [creditCardItem.city, creditCardItem.state, creditCardItem.zipCode].filter(Boolean).join(", "),
        creditCardItem.country,
    ]
        .filter(Boolean)
        .join("\n");

    return (
        <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 flex flex-col gap-6">
            {/* ITEM HEADER */}
            <ItemHeader
                title={creditCardItem.cardHolderName || "Payment Card"}
                itemType="Credit Card"
                icon={CreditCard}
                iconBgColor="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
                badgeColor="text-emerald-500/90 dark:text-emerald-400/90 border-emerald-500/25 bg-emerald-500/5"
                subtitle={`Ends in •••• ${creditCardItem.cardNumber.slice(-4)}`}
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs font-semibold rounded-xl border-border/60 hover:bg-muted/80 cursor-pointer shadow-2xs"
                        onClick={() => {
                            navigator.clipboard.writeText(creditCardItem.cardNumber.replace(/\s+/g, ""));
                        }}
                    >
                        <CreditCard className="size-3.5 text-emerald-500" />
                        <span>Copy Card Number</span>
                    </Button>
                }
            />

            {/* VISUAL CREDIT CARD EMBED */}
            <div className="w-full max-w-lg mx-auto sm:mx-0">
                <div className="relative rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-neutral-800 text-white p-6 sm:p-7 shadow-xl border border-white/10 overflow-hidden flex flex-col justify-between aspect-[1.586/1] min-h-[220px]">
                    {/* Background abstract aesthetic wave */}
                    <div className="absolute -right-16 -top-16 size-60 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
                    <div className="absolute -left-16 -bottom-16 size-60 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

                    {/* Top Row: Chip & Contactless */}
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            {/* Gold EMV Chip */}
                            <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-amber-500/50 shadow-inner flex items-center justify-center relative overflow-hidden">
                                <div className="w-full h-px bg-amber-600/40 absolute top-2.5" />
                                <div className="w-full h-px bg-amber-600/40 absolute bottom-2.5" />
                                <div className="h-full w-px bg-amber-600/40 absolute left-3.5" />
                                <div className="h-full w-px bg-amber-600/40 absolute right-3.5" />
                            </div>
                            <Wifi className="size-5 text-white/70 rotate-90" />
                        </div>

                        {/* Card Reveal Button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                            onClick={() => setCardRevealed((prev) => !prev)}
                        >
                            {cardRevealed ? <EyeOff className="size-3.5 mr-1.5" /> : <Eye className="size-3.5 mr-1.5" />}
                            <span>{cardRevealed ? "Hide" : "Reveal"}</span>
                        </Button>
                    </div>

                    {/* Middle Row: Card Number */}
                    <div className="my-auto py-2 relative z-10">
                        <p className="font-mono text-xl sm:text-2xl font-bold tracking-[0.2em] text-white/95 drop-shadow-sm select-text">
                            {cardRevealed ? formattedFullNumber : maskedCardNumber}
                        </p>
                    </div>

                    {/* Bottom Row: Cardholder, Expiry, CVV */}
                    <div className="flex items-end justify-between relative z-10 text-xs text-white/90">
                        <div className="flex flex-col min-w-0 pr-4">
                            <span className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Cardholder</span>
                            <span className="font-semibold uppercase tracking-wider truncate text-sm">
                                {creditCardItem.cardHolderName || "—"}
                            </span>
                        </div>

                        <div className="flex items-center gap-5 shrink-0 font-mono">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-wider text-white/50">Expires</span>
                                <span className="font-bold text-sm tracking-wide">{creditCardItem.expiryDate || "—"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-wider text-white/50">CVV</span>
                                <span className="font-bold text-sm tracking-wide">
                                    {cardRevealed ? creditCardItem.cvv : "•••"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD DETAILS CARD */}
            <SectionCard title="Card Details" icon={CreditCard}>
                <DetailRow
                    label="Cardholder Name"
                    value={creditCardItem.cardHolderName}
                    icon={User}
                />
                <DetailRow
                    label="Card Number"
                    value={creditCardItem.cardNumber}
                    icon={Hash}
                    isSecret
                    mono
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <DetailRow
                        label="Expiration Date"
                        value={creditCardItem.expiryDate}
                        icon={Calendar}
                        mono
                    />
                    <DetailRow
                        label="Security Code (CVV)"
                        value={creditCardItem.cvv}
                        icon={ShieldCheck}
                        isSecret
                        mono
                    />
                </div>
            </SectionCard>

            {/* BILLING ADDRESS SECTION */}
            {hasBillingAddress && (
                <SectionCard title="Billing Address" icon={MapPin}>
                    <div className="relative rounded-xl border border-border/40 bg-card/40 p-4 flex flex-col gap-1 text-sm text-foreground/90 font-sans leading-relaxed">
                        {creditCardItem.billingAddress1 && <p className="font-medium">{creditCardItem.billingAddress1}</p>}
                        {creditCardItem.billingAddress2 && <p className="text-muted-foreground">{creditCardItem.billingAddress2}</p>}
                        {(creditCardItem.city || creditCardItem.state || creditCardItem.zipCode) && (
                            <p>
                                {[creditCardItem.city, creditCardItem.state, creditCardItem.zipCode]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                        )}
                        {creditCardItem.country && <p className="text-muted-foreground font-medium mt-0.5">{creditCardItem.country}</p>}

                        <div className="absolute top-2 right-2">
                            <CopyButton value={fullBillingAddress} label="Billing Address" />
                        </div>
                    </div>
                </SectionCard>
            )}

            {/* TIMESTAMPS / METADATA */}
            <ItemMetadata createdAt={creditCardItem.createdAt} updatedAt={creditCardItem.updatedAt} />
        </div>
    );
}
