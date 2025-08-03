import { NodeViewWrapper } from "@tiptap/react";

export default function ResizableImageComponent({
  node,
  updateAttributes,
  selected,
}) {
  const { src, alt, width, height, display } = node.attrs;

  const wrapperClass =
    display === "inline-block"
      ? "inline-block align-middle mr-2"
      : "block my-2";

  return (
    <NodeViewWrapper as="span" className={`relative group ${wrapperClass}`}>
      <img
        src={src}
        alt={alt}
        style={{ width, height, display }}
        className="rounded shadow max-w-full h-auto"
      />
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = e.target.parentElement.offsetWidth;

            const onMouseMove = (e) => {
              const newWidth = startWidth + (e.clientX - startX);
              updateAttributes({ width: `${newWidth}px` });
            };

            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
        />
      )}
    </NodeViewWrapper>
  );
}
