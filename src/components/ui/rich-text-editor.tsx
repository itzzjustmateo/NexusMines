"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Write something..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-accent hover:underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({ onClick, isActive, children, title }: { onClick: () => void; isActive?: boolean; children: React.ReactNode; title?: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        isActive && "bg-zinc-100 dark:bg-zinc-800 text-brand-accent"
      )}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Add Link">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add Image">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}