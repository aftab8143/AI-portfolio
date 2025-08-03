"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import html from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import {
  Bold,
  Italic,
  List,
  Code,
  Table2,
  Image as ImageIcon,
  X,
} from "lucide-react";

import { useEffect } from "react";
import "highlight.js/styles/github-dark.css"; // highlight theme
import { ResizableImage } from "./ResizableImage"; // ← import here

// create lowlight instance and register languages
const lowlight = createLowlight();
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("python", python);
lowlight.register("html", html);
lowlight.register("bash", bash);

export default function TiptapEditor({ value, onChange, onClose }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      ResizableImage, // ← add ResizableImage extension
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] focus:outline-none prose dark:prose-invert text-white max-w-full",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="relative bg-slate-800 border border-white/10 rounded-xl shadow-inner px-4 py-3 space-y-4">
      <X
        onClick={onClose}
        size={20}
        className="absolute top-3 right-3 text-white hover:text-red-400 cursor-pointer z-50"
      />
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2 sticky top-0 z-10 bg-slate-800">
        <EditorButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold size={16} />}
        />
        <EditorButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic size={16} />}
        />
        <EditorButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List size={16} />}
        />
        <EditorButton
          isActive={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={<Code size={16} />}
        />
        <EditorButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          icon={<Table2 size={16} />}
        />
        <EditorButton
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          icon={<ImageIcon size={16} />}
        />
        <EditorButton
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
          icon={
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 0 0 7.5 4.33L21 15m-7-6a5 5 0 0 0-7.5-4.33L3 9m5 3h8" />
            </svg>
          }
        />
        <EditorButton
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onloadend = () => {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "resizableImage",
                    attrs: {
                      src: reader.result,
                      display: "block",
                      width: "300px",
                      height: "auto",
                    },
                  })
                  .run();
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }}
          icon={<ImageIcon size={16} />}
        />
        <EditorButton
          onClick={() => {
            const { state } = editor;
            const { selection } = state;
            const node = state.doc.nodeAt(selection.from);
            if (node?.type.name === "resizableImage") {
              const currentDisplay = node.attrs.display;
              const newDisplay =
                currentDisplay === "block" ? "inline-block" : "block";
              editor.commands.updateAttributes("resizableImage", {
                display: newDisplay,
              });
            } else {
              alert("Select an image to toggle display");
            }
          }}
          icon={<span className="text-xs">⇄</span>}
        />
      </div>

      {/* Editor Content */}
      <div
        className="prose dark:prose-invert custom-scrollbar overflow-auto max-w-full h-[50vh]
    [&_img]:max-w-[300px] [&_img]:max-h-[300px] [&_img]:rounded-lg 
    [&_img[style*='inline-block']]:align-middle [&_img[style*='inline-block']]:mr-2
    [&_img[style*='inline-block']]:!inline-block
    [&_pre]:text-slate-100 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-2 [&_pre]:leading-[1.3]
    [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words [&_pre_code]:p-0 [&_pre_code]:m-0 [&_pre_code]:leading-[1.3]
    [&_pre_code]:bg-transparent [&_pre_code]:font-mono [&_pre_code]:text-sm"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function EditorButton({ isActive, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-md hover:bg-white/10 transition ${
        isActive ? "bg-white/10 text-cyan-400" : "text-slate-300"
      }`}
    >
      {icon}
    </button>
  );
}
