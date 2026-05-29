import { useState, useEffect, useRef } from "react";
import { PlusIcon, SearchIcon, NotepadIcon } from "./Icons";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import EmptyState from "./EmptyState";
import "./App.css";

const STORAGE_KEY = "inkwell_notes";

export default function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const handleSave = (noteData) => {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...n, ...noteData, updatedAt: Date.now() }
            : n
        )
      );
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        ...noteData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    closeEditor();
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setDeleteConfirm(null);
  };

  const openEditor = (note = null) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingNote(null);
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* Ambient background */}
      <div className="ambient" aria-hidden="true">
        <div className="ambient__orb ambient__orb--1" />
        <div className="ambient__orb ambient__orb--2" />
      </div>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__brand">
            <NotepadIcon />
            <span>Inkwell</span>
          </div>

          <button className="btn-new" onClick={() => openEditor()}>
            <PlusIcon />
            <span>New Note</span>
          </button>

          <div className="sidebar__meta">
            <span className="sidebar__count">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>
        </aside>

        {/* Main content */}
        <main className="main">
          <header className="topbar">
            <div className="topbar__left">
              <h1 className="topbar__title">My Notes</h1>
              <p className="topbar__sub">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="search-wrap">
              <SearchIcon />
              <input
                ref={searchRef}
                className="search-input"
                type="text"
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </header>

          <div className="notes-grid">
            {filtered.length === 0 ? (
              <EmptyState hasSearch={!!search} onNew={() => openEditor()} />
            ) : (
              filtered.map((note, i) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={i}
                  onEdit={() => openEditor(note)}
                  onDelete={() => setDeleteConfirm(note.id)}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* Editor modal */}
      {editorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onClose={closeEditor}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-dialog__title">Delete this note?</p>
            <p className="confirm-dialog__sub">This action cannot be undone.</p>
            <div className="confirm-dialog__actions">
              <button
                className="btn btn--ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button className="fab" onClick={() => openEditor()} aria-label="New note">
        <PlusIcon />
      </button>
    </div>
  );
}
