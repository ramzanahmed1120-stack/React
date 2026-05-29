import { EditIcon, TrashIcon } from "./Icons";

function formatDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NoteCard({ note, index, onEdit, onDelete }) {
  return (
    <article
      className="note-card"
      style={{ "--i": index }}
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onEdit()}
    >
      <div className="note-card__accent" />
      <h2 className="note-card__title">{note.title || "Untitled"}</h2>
      {note.body && <p className="note-card__body">{note.body}</p>}
      <div className="note-card__footer">
        <time className="note-card__date">{formatDate(note.updatedAt)}</time>
        <div className="note-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="icon-btn"
            onClick={onEdit}
            title="Edit"
            aria-label="Edit note"
          >
            <EditIcon />
          </button>
          <button
            className="icon-btn icon-btn--danger"
            onClick={onDelete}
            title="Delete"
            aria-label="Delete note"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
