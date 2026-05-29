import { useState, useEffect, useRef } from "react";

export default function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = () => {
    if (!title.trim() && !body.trim()) return;
    onSave({ title: title.trim(), body: body.trim() });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="editor-panel" onClick={(e) => e.stopPropagation()}>
        <div className="editor-panel__header">
          <span className="editor-panel__title">
            {note ? "Edit note" : "New note"}
          </span>
          <button className="editor-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="editor-panel__body">
          <div className="field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a name…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("note-body")?.focus();
                }
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="note-body">Content</label>
            <textarea
              id="note-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write something…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
              }}
            />
          </div>
          <div className="editor-panel__actions">
            <button className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={!title.trim() && !body.trim()}
            >
              {note ? "Save changes" : "Create note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
