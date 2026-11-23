"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { MenuBar } from "./MenuBar";
import { cn } from "@/lib/utils";

// ─── Editable editor (Create / Update) ───────────────────────────────────────

interface TiptapEditorProps {
    value: string;
    onChange: (html: string) => void;
    onBlur?: () => void;
    className?: string;
}

export function SecureNoteTiptapEditor({
    value,
    onChange,
    onBlur,
    className,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false, // Prevents SSR hydration mismatches
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none min-h-[200px] focus:outline-none px-3 py-2",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onBlur: () => {
            onBlur?.();
        },
    });

    // Sync external resets (e.g., form.reset()) back into the editor
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className={cn("rounded-md border border-input", className)}>
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className="rounded-b-md bg-background [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:focus:outline-none"
            />
        </div>
    );
}

// ─── Read-only viewer ─────────────────────────────────────────────────────────

interface TiptapViewerProps {
    content: string;
    className?: string;
}

export function SecureNoteTiptapViewer({ content, className }: TiptapViewerProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: false,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2",
            },
        },
    });

    // Sync content changes from outside (e.g., switching items)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || "");
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div
            className={cn(
                "rounded-md border border-input bg-muted/30",
                className
            )}
        >
            <EditorContent
                editor={editor}
                className="[&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:focus:outline-none"
            />
        </div>
    );
}
