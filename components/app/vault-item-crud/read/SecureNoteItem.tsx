"use client";

import React, { useMemo } from "react";
import { NotebookPen, FileText } from "lucide-react";
import { SecureNoteJSON } from "@/lib/types/VaultItemType";
import { SecureNoteTiptapViewer } from "@/components/tiptap/SecureNoteTiptapEditor";
import { ItemHeader, ItemMetadata, CopyButton } from "./DetailItem";

export default function SecureNoteItem({ secureNoteItem }: { secureNoteItem: SecureNoteJSON }) {
    // Calculate plain text preview and stats
    const { plainText, wordCount, charCount } = useMemo(() => {
        const text = secureNoteItem.content
            ? secureNoteItem.content.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim()
            : "";
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        return {
            plainText: text,
            wordCount: words,
            charCount: text.length,
        };
    }, [secureNoteItem.content]);

    return (
        <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 flex flex-col gap-6">
            {/* ITEM HEADER */}
            <ItemHeader
                title={secureNoteItem.title}
                itemType="Secure Note"
                icon={NotebookPen}
                iconBgColor="bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20"
                badgeColor="text-amber-500/90 dark:text-amber-400/90 border-amber-500/25 bg-amber-500/5"
                subtitle={`${wordCount} word${wordCount !== 1 ? "s" : ""} • ${charCount} characters`}
                actions={
                    <div className="flex items-center gap-2">
                        <CopyButton value={plainText} label="Note content" />
                    </div>
                }
            />

            {/* NOTE VIEWER CARD */}
            <div className="rounded-2xl border border-border/40 bg-card/25 shadow-xs overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-muted/30 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <FileText className="size-3.5 text-amber-500" />
                        <span>Formatted Content</span>
                    </div>
                    <span>{wordCount} words</span>
                </div>

                <div className="p-6 min-h-[360px] bg-card/10">
                    <SecureNoteTiptapViewer
                        content={secureNoteItem.content}
                        className="border-none bg-transparent p-0"
                    />
                </div>
            </div>

            {/* TIMESTAMPS / METADATA */}
            <ItemMetadata createdAt={secureNoteItem.createdAt} updatedAt={secureNoteItem.updatedAt} />
        </div>
    );
}
