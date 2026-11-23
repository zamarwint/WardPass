"use client";

import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
    Bold,
    Code,
    Code2,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Minus,
    Pilcrow,
    Quote,
    Redo2,
    Strikethrough,
    Undo2,
    WrapText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { menuBarStateSelector } from "./menuBarState";

interface ToolbarButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isActive?: boolean;
    title: string;
    children: React.ReactNode;
}

function ToolbarButton({ onClick, disabled, isActive, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault(); // Prevents editor blur on toolbar click
                onClick();
            }}
            disabled={disabled}
            title={title}
            className={cn(
                "inline-flex items-center justify-center rounded-md p-1.5 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:pointer-events-none disabled:opacity-40",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isActive && "bg-accent text-accent-foreground font-semibold"
            )}
        >
            {children}
        </button>
    );
}

function ToolbarSeparator() {
    return <div className="mx-1 h-5 w-px bg-border" />;
}

export function MenuBar({ editor }: { editor: Editor | null }) {
    const editorState = useEditorState({
        editor,
        selector: menuBarStateSelector,
    });

    if (!editor || !editorState) return null;

    return (
        <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-b-0 border-input bg-muted/40 px-2 py-1.5">
            {/* Text formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editorState.canBold}
                isActive={editorState.isBold}
                title="Bold (Ctrl+B)"
            >
                <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editorState.canItalic}
                isActive={editorState.isItalic}
                title="Italic (Ctrl+I)"
            >
                <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editorState.canStrike}
                isActive={editorState.isStrike}
                title="Strikethrough"
            >
                <Strikethrough className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editorState.canCode}
                isActive={editorState.isCode}
                title="Inline Code"
            >
                <Code className="size-4" />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                isActive={editorState.isParagraph}
                title="Paragraph"
            >
                <Pilcrow className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editorState.isHeading1}
                title="Heading 1"
            >
                <Heading1 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editorState.isHeading2}
                title="Heading 2"
            >
                <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editorState.isHeading3}
                title="Heading 3"
            >
                <Heading3 className="size-4" />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editorState.isBulletList}
                title="Bullet List"
            >
                <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editorState.isOrderedList}
                title="Numbered List"
            >
                <ListOrdered className="size-4" />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Blocks */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editorState.isCodeBlock}
                title="Code Block"
            >
                <Code2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editorState.isBlockquote}
                title="Blockquote"
            >
                <Quote className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setHardBreak().run()}
                title="Hard Break"
            >
                <WrapText className="size-4" />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* History */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editorState.canUndo}
                title="Undo (Ctrl+Z)"
            >
                <Undo2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editorState.canRedo}
                title="Redo (Ctrl+Y)"
            >
                <Redo2 className="size-4" />
            </ToolbarButton>
        </div>
    );
}
