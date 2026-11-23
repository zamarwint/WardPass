import type { Editor } from "@tiptap/core";
import type { EditorStateSnapshot } from "@tiptap/react";

/**
 * State selector for the MenuBar component.
 * Accepts an Editor | null snapshot so it is compatible with
 * the useEditorState(Editor | null) overload.
 */
export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor | null>) {
  const editor = ctx.editor;
  if (!editor) {
    return {
      isBold: false, canBold: false,
      isItalic: false, canItalic: false,
      isStrike: false, canStrike: false,
      isCode: false, canCode: false,
      isParagraph: false,
      isHeading1: false, isHeading2: false, isHeading3: false,
      isBulletList: false, isOrderedList: false,
      isCodeBlock: false, isBlockquote: false,
      canUndo: false, canRedo: false,
    };
  }

  return {
    // Text formatting
    isBold: editor.isActive("bold") ?? false,
    canBold: editor.can().chain().toggleBold().run() ?? false,
    isItalic: editor.isActive("italic") ?? false,
    canItalic: editor.can().chain().toggleItalic().run() ?? false,
    isStrike: editor.isActive("strike") ?? false,
    canStrike: editor.can().chain().toggleStrike().run() ?? false,
    isCode: editor.isActive("code") ?? false,
    canCode: editor.can().chain().toggleCode().run() ?? false,

    // Block types
    isParagraph: editor.isActive("paragraph") ?? false,
    isHeading1: editor.isActive("heading", { level: 1 }) ?? false,
    isHeading2: editor.isActive("heading", { level: 2 }) ?? false,
    isHeading3: editor.isActive("heading", { level: 3 }) ?? false,

    // Lists and blocks
    isBulletList: editor.isActive("bulletList") ?? false,
    isOrderedList: editor.isActive("orderedList") ?? false,
    isCodeBlock: editor.isActive("codeBlock") ?? false,
    isBlockquote: editor.isActive("blockquote") ?? false,

    // History
    canUndo: editor.can().chain().undo().run() ?? false,
    canRedo: editor.can().chain().redo().run() ?? false,
  };
}

export type MenuBarState = ReturnType<typeof menuBarStateSelector>;
