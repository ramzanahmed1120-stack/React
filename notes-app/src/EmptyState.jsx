import { NotepadIcon } from "./Icons";

export default function EmptyState({ hasSearch, onNew }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <NotepadIcon size={24} />
      </div>
      {hasSearch ? (
        <>
          <p className="empty-state__title">No results found</p>
          <p className="empty-state__sub">Try a different search term.</p>
        </>
      ) : (
        <>
          <p className="empty-state__title">Your canvas is empty</p>
          <p className="empty-state__sub">
            Start capturing your ideas, tasks, or anything worth remembering.
          </p>
          <button className="btn btn--primary" onClick={onNew} style={{ marginTop: 8 }}>
            Create your first note
          </button>
        </>
      )}
    </div>
  );
}
