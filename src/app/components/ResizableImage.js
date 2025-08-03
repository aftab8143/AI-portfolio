// ResizableImage.js
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "./ResizableImageComponent";

export const ResizableImage = Node.create({
  name: "resizableImage",
  inline: true, // ✅ make it behave like inline content
  group: "inline", // ✅ place it inside paragraphs
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: "300px" },
      height: { default: "auto" },
      display: { default: "inline-block" }, // default to inline if desired
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
