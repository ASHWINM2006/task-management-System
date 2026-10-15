export default function DeleteConfirmModal({ task, onConfirm, onCancel }) {
  if (!task) return null;
  return (
    <div className="overlay" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
      <div className="modal" style={{ maxWidth:440 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" id="del-title">🗑️ Delete Task</h2>
          <button className="btn btn-ghost btn-icon" onClick={onCancel} aria-label="Cancel">✕</button>
        </div>
        <div className="modal-body">
          <div style={{
            background:"rgba(244,63,94,.06)", border:"1px solid rgba(244,63,94,.2)",
            borderRadius:"var(--radius)", padding:"14px 16px", marginBottom:14,
          }}>
            <p style={{ fontSize:15, fontWeight:600, color:"var(--text-primary)" }}>
              "{task.title}"
            </p>
          </div>
          <p style={{ fontSize:14, color:"var(--text-second)", lineHeight:1.65 }}>
            Are you sure you want to permanently delete this task?
            This action <strong>cannot be undone</strong>. The task's activity log will be preserved.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger"    onClick={onConfirm}>🗑️ Delete Task</button>
        </div>
      </div>
    </div>
  );
}
