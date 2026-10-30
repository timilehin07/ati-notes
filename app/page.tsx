
"use client";

import { useActionState, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { checkNote, type Note } from "./actions";

const STORAGE_KEY = "notes";

const initialState = {
  error: "",
  note: null,
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [state, formAction, isPending] = useActionState(
    checkNote,
    initialState,
  );

  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags)),
  ).sort();

  const visibleNotes = notes.filter((note) => {
    const matchesTag = activeTag
      ? note.tags.includes(activeTag)
      : true;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.body.toLowerCase().includes(query);

    return matchesTag && matchesSearch;
  });

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);

      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);

        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      }
    } catch (error) {
      console.error("Failed to load notes.", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes.", error);
    }
  }, [notes, isHydrated]);

  useEffect(() => {
    if (state.note) {
      setNotes((current) => [state.note as Note, ...current]);
    }
  }, [state.note]);

  const handleDelete = (indexToDelete: number) => {
    setNotes((current) =>
      current.filter((_, index) => index !== indexToDelete),
    );
  };

  const handleTagClick = (tag: string) => {
    setActiveTag((current) => (current === tag ? null : tag));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        
<a href="#" className="brand" aria-label="ATi Notes home">
  <span className="brand-mark" aria-hidden="true">
    AT<span className="brand-mark-dot">.</span>
  </span>
  <span className="brand-name">ATi Notes</span>
</a>


        <div className="topbar-right">
          <span className="saved-indicator">
            <span className="status-dot" />
            {isHydrated ? "Saved on this device" : "Loading notes"}
          </span>
         
<span className="avatar" aria-label="ATi Notes notebook">
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 3.5h9l4 4V21H6z" />
    <path d="M15 3.5V8h4" />
    <path d="M9 12h7M9 16h7" />
  </svg>
</span>

        </div>
      </header>

      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR PERSONAL SPACE</p>
          <h1>
            A home for your
            <br />
            <span>little thoughts.</span>
          </h1>
          <p className="welcome-copy">
            Keep the ideas, reminders and little things
            <br className="desktop-break" />
            you don't want to forget.
          </p>
        </div>

        <div className="welcome-decoration" aria-hidden="true">
          <svg
  className="decoration-sun"
  viewBox="0 0 100 100"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M50 8V92M8 50H92M20 20L80 80M80 20L20 80"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <circle
    cx="50"
    cy="50"
    r="23"
    stroke="currentColor"
    strokeWidth="2"
  />
  <circle cx="50" cy="50" r="5" fill="currentColor" />
</svg>
          <span className="decoration-note">ideas live here ↗</span>
        </div>
      </section>

      <section className="workspace">
        <div className="editor-panel">
          <div className="panel-heading">
            <div className="heading-icon">✎</div>
            <div>
              <h2>Start writing</h2>
              <p>A little space for whatever's on your mind.</p>
            </div>
          </div>

          <form action={formAction} className="note-form">
            <div className="field-group">
              <label htmlFor="title">Give it a title</label>
              <input
                id="title"
                name="title"
                className="field-input"
                placeholder="e.g. Things to remember..."
                autoComplete="off"
              />
            </div>

            <div className="field-group">
              <label htmlFor="body">Your thoughts</label>
              <textarea
                id="body"
                name="body"
                rows={6}
                className="field-input body-input"
                placeholder={"Start with a thought...\n\nTip: use # for headings, **bold** for emphasis, and - for lists."}
              />
              <span className="field-hint">
                Markdown supported · Make it yours
              </span>
            </div>

            <div className="field-group">
              <label htmlFor="tags">Organize with tags</label>
              <input
                id="tags"
                name="tags"
                className="field-input"
                placeholder="work, personal, ideas"
                autoComplete="off"
              />
              <span className="field-hint">
                Separate each tag with a comma.
              </span>
            </div>

            {state.error && (
              <p className="form-error" role="alert">
                <span aria-hidden="true">!</span> {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="create-button"
            >
              <span>{isPending ? "Saving your note..." : "Save this note"}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        </div>

        <aside className="side-note">
<span className="side-note-star" aria-hidden="true">
  AT.
</span>          <p className="side-note-label">A GENTLE REMINDER</p>
          <p className="side-note-quote">
            You don't have to remember everything. That's what this little
            space is for.
          </p>
          <div className="side-note-line" />
          <p className="side-note-footer">One thought at a time.</p>
        </aside>
      </section>

      <section className="library-section">
        <div className="library-header">
          <div>
            <p className="eyebrow">YOUR COLLECTION</p>
            <h2>Your notes<span className="title-period">.</span></h2>
            <p className="library-subtitle">
              {notes.length === 0
                ? "Your next great thought starts here."
                : `${notes.length} ${notes.length === 1 ? "little note" : "little notes"} saved in your space.`}
            </p>
          </div>

          <div className="note-count">
            <span>{notes.length.toString().padStart(2, "0")}</span>
            <span>NOTES</span>
          </div>
        </div>

        <div className="library-tools">
          <label className="search-box" htmlFor="search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a thought..."
              aria-label="Search notes by title or body"
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className="tag-toolbar" aria-label="Filter notes by tag">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={`filter-chip ${activeTag === null ? "filter-chip-active" : ""}`}
          >
            All notes <span>{notes.length}</span>
          </button>

          {allTags.map((tag, index) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              aria-pressed={activeTag === tag}
              className={`filter-chip tag-color-${index % 5} ${activeTag === tag ? "filter-chip-active" : ""}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {visibleNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration" aria-hidden="true">
              {search || activeTag ? "⌕" : "✳"}
            </div>
            <h3>
              {search || activeTag
                ? "No notes match"
                : "It's a blank page."}
            </h3>
            <p>
              {search || activeTag
                ? "Try another search or clear your filters to find what you're looking for."
                : "Every lovely collection starts somewhere. Write your first note above."}
            </p>

            {(search || activeTag) && (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSearch("");
                  setActiveTag(null);
                }}
              >
                Clear filters ↗
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {visibleNotes.map((note, index) => (
              <article
                key={`${note.title}-${index}`}
                className={`note-card note-card-${index % 4}`}
              >
                <div className="note-card-top">
                  <span className="note-number">
                    NOTE {String(notes.indexOf(note) + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(notes.indexOf(note))}
                    className="delete-button"
                    aria-label={`Delete note: ${note.title}`}
                    title="Delete note"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="17"
                      height="17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>
                  </button>
                </div>

                <h3 className="note-card-title">{note.title}</h3>

                <div className="markdown-content">
                  <ReactMarkdown>{note.body}</ReactMarkdown>
                </div>

                {note.tags.length > 0 && (
                  <div className="note-card-tags">
                    {note.tags.map((tag, tagIndex) => (
                      <button
                        key={`${tag}-${tagIndex}`}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className={`note-tag tag-color-${(notes.indexOf(note) + tagIndex) % 5}`}
                        aria-pressed={activeTag === tag}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <footer className="library-footer">
          <span>Made for the thoughts worth keeping.</span>
          <span>ATi Notes <span className="footer-star">✳</span></span>
        </footer>
      </section>
    </main>
  );
}
