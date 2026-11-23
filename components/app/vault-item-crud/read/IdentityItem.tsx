"use client";

import React from "react";
import {
    IdCard,
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    Briefcase,
    Shield,
    Globe,
    Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdentityJSON } from "@/lib/types/VaultItemType";
import { ItemHeader, DetailRow, SectionCard, ItemMetadata, CopyButton } from "./DetailItem";

export default function IdentityItem({ identityItem }: { identityItem: IdentityJSON }) {
    const hasLocation = Boolean(
        identityItem.address1 ||
        identityItem.address2 ||
        identityItem.city ||
        identityItem.state ||
        identityItem.zipCode ||
        identityItem.country ||
        identityItem.floor ||
        identityItem.county ||
        identityItem.poBox
    );

    const hasIds = Boolean(
        identityItem.socialSecurityNumber ||
        identityItem.passportNumber ||
        identityItem.licenseNumber
    );

    const hasWork = Boolean(identityItem.companyName || identityItem.occupation);

    const hasSocials = Boolean(
        identityItem.x ||
        identityItem.linkedin ||
        identityItem.github ||
        identityItem.instagram ||
        identityItem.tiktok ||
        identityItem.facebook ||
        identityItem.other
    );

    const fullAddress = [
        identityItem.address1,
        identityItem.address2,
        identityItem.floor ? `Floor ${identityItem.floor}` : null,
        [identityItem.city, identityItem.county, identityItem.state, identityItem.zipCode].filter(Boolean).join(", "),
        identityItem.poBox ? `PO Box ${identityItem.poBox}` : null,
        identityItem.country,
    ]
        .filter(Boolean)
        .join("\n");

    return (
        <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 flex flex-col gap-6">
            {/* ITEM HEADER */}
            <ItemHeader
                title={identityItem.name}
                itemType="Identity"
                icon={IdCard}
                iconBgColor="bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20"
                badgeColor="text-purple-500/90 dark:text-purple-400/90 border-purple-500/25 bg-purple-500/5"
                subtitle={
                    [identityItem.occupation, identityItem.companyName, identityItem.email]
                        .filter(Boolean)
                        .join(" • ") || undefined
                }
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs font-semibold rounded-xl border-border/60 hover:bg-muted/80 cursor-pointer shadow-2xs"
                        onClick={() => {
                            const summary = [
                                identityItem.name,
                                identityItem.email,
                                identityItem.phoneNumber ? String(identityItem.phoneNumber) : null,
                            ]
                                .filter(Boolean)
                                .join(" | ");
                            navigator.clipboard.writeText(summary);
                        }}
                    >
                        <User className="size-3.5 text-purple-500" />
                        <span>Copy Profile</span>
                    </Button>
                }
            />

            {/* PERSONAL & CONTACT */}
            <SectionCard title="Personal & Contact" icon={User}>
                <DetailRow label="Full Name" value={identityItem.name} icon={User} />
                <DetailRow
                    label="Email Address"
                    value={identityItem.email}
                    icon={Mail}
                    href={`mailto:${identityItem.email}`}
                    mono
                />
                {identityItem.phoneNumber && (
                    <DetailRow
                        label="Phone Number"
                        value={identityItem.phoneNumber}
                        icon={Phone}
                        href={`tel:${identityItem.phoneNumber}`}
                        mono
                    />
                )}
            </SectionCard>

            {/* GOVERNMENT IDENTIFIERS (IF ANY) */}
            {hasIds && (
                <SectionCard title="Government Identification" icon={Shield}>
                    {identityItem.socialSecurityNumber && (
                        <DetailRow
                            label="Social Security Number (SSN)"
                            value={identityItem.socialSecurityNumber}
                            icon={Shield}
                            isSecret
                            mono
                        />
                    )}
                    {identityItem.passportNumber && (
                        <DetailRow
                            label="Passport Number"
                            value={identityItem.passportNumber}
                            icon={IdCard}
                            isSecret
                            mono
                        />
                    )}
                    {identityItem.licenseNumber && (
                        <DetailRow
                            label="Driver's License Number"
                            value={identityItem.licenseNumber}
                            icon={IdCard}
                            isSecret
                            mono
                        />
                    )}
                </SectionCard>
            )}

            {/* LOCATION & MAILING ADDRESS */}
            {hasLocation && (
                <SectionCard title="Address & Location" icon={MapPin}>
                    <div className="relative rounded-xl border border-border/40 bg-card/40 p-4 flex flex-col gap-1 text-sm text-foreground/90 font-sans leading-relaxed">
                        {identityItem.address1 && <p className="font-medium">{identityItem.address1}</p>}
                        {identityItem.address2 && <p className="text-muted-foreground">{identityItem.address2}</p>}
                        {identityItem.floor && <p className="text-xs text-muted-foreground font-mono">Floor / Suite: {identityItem.floor}</p>}
                        {(identityItem.city || identityItem.state || identityItem.zipCode) && (
                            <p>
                                {[identityItem.city, identityItem.county, identityItem.state, identityItem.zipCode]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                        )}
                        {identityItem.poBox && <p className="text-xs text-muted-foreground font-mono">PO Box: {identityItem.poBox}</p>}
                        {identityItem.country && <p className="text-muted-foreground font-medium mt-0.5">{identityItem.country}</p>}

                        <div className="absolute top-2 right-2">
                            <CopyButton value={fullAddress} label="Address" />
                        </div>
                    </div>
                </SectionCard>
            )}

            {/* EMPLOYMENT & WORK */}
            {hasWork && (
                <SectionCard title="Employment Details" icon={Briefcase}>
                    {identityItem.companyName && (
                        <DetailRow
                            label="Company Name"
                            value={identityItem.companyName}
                            icon={Building2}
                        />
                    )}
                    {identityItem.occupation && (
                        <DetailRow
                            label="Occupation / Title"
                            value={identityItem.occupation}
                            icon={Briefcase}
                        />
                    )}
                </SectionCard>
            )}

            {/* SOCIALS & ONLINE PROFILES */}
            {hasSocials && (
                <SectionCard title="Online & Social Profiles" icon={Share2}>
                    {identityItem.x && (
                        <DetailRow
                            label="X (Twitter)"
                            value={identityItem.x}
                            icon={Globe}
                            href={identityItem.x}
                        />
                    )}
                    {identityItem.linkedin && (
                        <DetailRow
                            label="LinkedIn"
                            value={identityItem.linkedin}
                            icon={Globe}
                            href={identityItem.linkedin}
                        />
                    )}
                    {identityItem.github && (
                        <DetailRow
                            label="GitHub"
                            value={identityItem.github}
                            icon={Globe}
                            href={identityItem.github}
                        />
                    )}
                    {identityItem.instagram && (
                        <DetailRow
                            label="Instagram"
                            value={identityItem.instagram}
                            icon={Globe}
                            href={identityItem.instagram}
                        />
                    )}
                    {identityItem.tiktok && (
                        <DetailRow
                            label="TikTok"
                            value={identityItem.tiktok}
                            icon={Globe}
                            href={identityItem.tiktok}
                        />
                    )}
                    {identityItem.facebook && (
                        <DetailRow
                            label="Facebook"
                            value={identityItem.facebook}
                            icon={Globe}
                            href={identityItem.facebook}
                        />
                    )}
                    {identityItem.other && (
                        <DetailRow
                            label="Other Link"
                            value={identityItem.other}
                            icon={Globe}
                            href={identityItem.other}
                        />
                    )}
                </SectionCard>
            )}

            {/* TIMESTAMPS / METADATA */}
            <ItemMetadata createdAt={identityItem.createdAt} updatedAt={identityItem.updatedAt} />
        </div>
    );
}
