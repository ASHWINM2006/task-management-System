import { useState, useEffect } from "react";

const ALLOWED_FROM = {
  "pending":     ["pending", "in-progress"],
  "in-progress": ["in-progress", "completed"],
  "completed":   ["completed"],
};
const ALL_STATUSES = [
  { v:"pending",     l:"⏳ Pending" },
  { v:"in-progress", l:"🔄 In Progress" },
  { v:"completed",   l:"✅ Completed" },
];
const ALL_PRIORITIES = [
  { v:"high",   l:"🔴 High" },
  { v:"medium", l:"🟡 Medium" },
  { v:"low",    l:"🟢 Low" },
];
const EMPTY = { title:"", description:"", status:"pending", priority:"medium", due_date:"" };

export default function TaskFormModal({ isOpen, onClose, onSubmit, task }) {
  const isEdit = Boolean(task);
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy,   setBusy]   = useState(false);

  useEffect(() => {
    setForm(task ? {
      title:       task.title || "",
      description: task.description || "",
      status:      task.status || "pending",
      priority:    task.priority || "medium",
      due_date:    task.due_date
        ? new Date(task.due_date).toISOString().slice(0,16) : "",
    } : EMPTY);
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const allowedStatuses = isEdit
    ? ALL_STATUSES.filter(s => ALLOWED_FROM[task.status]?.includes(s.v))
    : ALL_STATUSES.filter(s => s.v === "pending");

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]:v }));
    setErrors(p => ({ ...p, [k]:undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())             e.title = "Title is required.";
    else if (form.title.trim().length > 255) e.title = "Max 255 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    const ok = await onSubmit({
      title:       form.title.trim(),
      description: form.description.trim() || null,
      status:      form.status,
      priority:    form.priority,
      due_date:    form.due_date ? new Date(form.due_date).toISOString() : null,
    });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Gradient header */}
        <div className="modal-header" style={{
          background:"var(--grad-primary)", borderRadius:"var(--radius-xl) var(--radius-xl) 0 0",
          borderBottom:"none",
        }}>
          <h2 className="modal-title" id="modal-title" style={{ color:"#fff", fontSize:17 }}>
            {isEdit ? "✏️ Edit Task" : "＋ Create New Task"}
          </h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose} aria-label="Close"
            style={{ color:"rgba(255,255,255,.8)", background:"rgba(255,255,255,.15)" }}
          >✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="t-title">
                Title <span className="form-req">*</span>
              </label>
              <input
                id="t-title"
                className={`form-input ${errors.title ? "input-error" : ""}`}
                type="text"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={e => set("title", e.target.value)}
                autoFocus maxLength={255}
              />
              {errors.title && (
                <p className="form-error">⚠ {errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="t-desc">Description</label>
              <textarea
                id="t-desc" className="form-textarea"
                placeholder="Add more details (optional)…"
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Status + Priority row */}
            <div style={{ display:"flex", gap:14 }}>
              <div className="form-group" style={{ flex:1 }}>
                <label className="form-label" htmlFor="t-status">Status</label>
                <select id="t-status" className="form-select"
                  value={form.status} onChange={e => set("status", e.target.value)}>
                  {allowedStatuses.map(s => (
                    <option key={s.v} value={s.v}>{s.l}</option>
                  ))}
                </select>
                {isEdit && (
                  <p className="form-hint">Only valid transitions shown</p>
                )}
              </div>
              <div className="form-group" style={{ flex:1 }}>
                <label className="form-label" htmlFor="t-priority">Priority</label>
                <select id="t-priority" className="form-select"
                  value={form.priority} onChange={e => set("priority", e.target.value)}>
                  {ALL_PRIORITIES.map(p => (
                    <option key={p.v} value={p.v}>{p.l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due date */}
            <div className="form-group">
              <label className="form-label" htmlFor="t-due">Due Date <span style={{color:"var(--text-muted)",fontWeight:400}}>(optional)</span></label>
              <input
                id="t-due" className="form-input" type="datetime-local"
                value={form.due_date} onChange={e => set("due_date", e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "⌛ Saving…" : isEdit ? "💾 Save Changes" : "✅ Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
