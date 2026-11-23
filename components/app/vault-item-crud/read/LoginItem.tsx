"use client";

import React from "react";
import { Globe, User, Mail, Lock, Link as LinkIcon, FileText, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginJSON } from "@/lib/types/VaultItemType";
import { ItemHeader, DetailRow, SectionCard, ItemMetadata, CopyButton } from "./DetailItem";

export default function LoginItem({ loginItem }: { loginItem: LoginJSON }) {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 flex flex-col gap-6">
            {/* ITEM HEADER */}
            <ItemHeader
                title={loginItem.name}
                itemType="Login"
                icon={Globe}
                iconBgColor="bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20"
                badgeColor="text-blue-500/90 dark:text-blue-400/90 border-blue-500/25 bg-blue-500/5"
                subtitle={loginItem.email || loginItem.username || loginItem.url || undefined}
                actions={
                    loginItem.password ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-xs font-semibold rounded-xl border-border/60 hover:bg-muted/80 cursor-pointer shadow-2xs"
                            onClick={() => {
                                navigator.clipboard.writeText(loginItem.password);
                            }}
                        >
                            <KeyRound className="size-3.5 text-blue-500" />
                            <span>Copy Password</span>
                        </Button>
                    ) : null
                }
            />

            {/* CREDENTIALS SECTION */}
            <SectionCard title="Account Credentials" icon={Lock}>
                {loginItem.username && (
                    <DetailRow
                        label="Username"
                        value={loginItem.username}
                        icon={User}
                        mono
                    />
                )}
                {loginItem.email && (
                    <DetailRow
                        label="Email Address"
                        value={loginItem.email}
                        icon={Mail}
                        mono
                    />
                )}
                <DetailRow
                    label="Password"
                    value={loginItem.password}
                    icon={KeyRound}
                    isSecret
                    mono
                />
                {loginItem.url && (
                    <DetailRow
                        label="Website"
                        value={loginItem.url}
                        icon={LinkIcon}
                        href={loginItem.url}
                    />
                )}
            </SectionCard>

            {/* SECURE NOTES (IF ANY) */}
            {loginItem.note && (
                <SectionCard title="Notes" icon={FileText}>
                    <div className="relative rounded-xl border border-border/40 bg-card/40 p-4 text-sm text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed">
                        {loginItem.note}
                        <div className="absolute top-2 right-2">
                            <CopyButton value={loginItem.note} label="Note" />
                        </div>
                    </div>
                </SectionCard>
            )}

            {/* TIMESTAMPS / METADATA */}
            <ItemMetadata createdAt={loginItem.createdAt} updatedAt={loginItem.updatedAt} />
        </div>
    );
}
