import { formatDate, getCountdownLabel, priorityLabel, statusLabel } from "../utils/helpers";

const NEXT = { "pending": "in-progress", "in-progress": "completed" };
const NEXT_LABEL = { "pending": "▶ Start", "in-progress": "✔ Complete" };
const NEXT_CLS = { "pending": "btn-success btn-xs", "in-progress": "btn-primary btn-xs" };

export default function DueDateAlertModal({ isOpen, onClose, tasks = [], stats, onEdit, onAdvance }) {
  if (!isOpen) return null;

  // Collect urgent tasks from stats or from task list
  const urgentFromStats = stats?.urgent_tasks || [];
  
  // Also scan any active tasks in memory that are overdue or due soon (within 48h)
  const now = Date.now();
  const in48h = now + 48 * 60 * 60 * 1000;
  
  const activeUrgentMap = new Map();
  
  // Insert from stats first
  urgentFromStats.forEach(t => {
    activeUrgentMap.set(t.id, t);
  });

  // Supplement with any tasks currently loaded in hook
  tasks.forEach(t => {
    if (t.status !== "completed" && t.due_date) {
      const dueTime = new Date(t.due_date).getTime();
      if (dueTime <= in48h) {
        if (!activeUrgentMap.has(t.id)) {
          activeUrgentMap.set(t.id, {
            id: t.id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            due_date: t.due_date,
            is_overdue: dueTime < now,
          });
        }
      }
    }
  });

  const allUrgent = Array.from(activeUrgentMap.values());
  const overdueTasks = allUrgent.filter(t => t.is_overdue || (t.due_date && new Date(t.due_date).getTime() < now));
  const dueSoonTasks = allUrgent.filter(t => !overdueTasks.some(o => o.id === t.id));

  const totalAlerts = overdueTasks.length + dueSoonTasks.length;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="alert-modal-title" onClick={onClose}>
      <div className="modal alert-modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header alert-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🔔</span>
            <div>
              <h2 className="modal-title" id="alert-modal-title" style={{ fontSize: 18 }}>
                Deadline & Due Date Alerts
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                {totalAlerts === 0
                  ? "All task deadlines are up to date"
                  : `${totalAlerts} task${totalAlerts === 1 ? "" : "s"} requiring attention`}
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: "65vh", overflowY: "auto", padding: "18px 24px" }}>
          {totalAlerts === 0 ? (
            <div className="empty-state" style={{ padding: "40px 10px" }}>
              <div className="empty-icon">🎉</div>
              <h3 style={{ marginTop: 8, fontSize: 16 }}>All Caught Up!</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 360, margin: "6px auto 0" }}>
                No tasks are overdue or due within the next 48 hours. Keep up the great work!
              </p>
            </div>
          ) : (
            <>
              {/* Overdue Section */}
              {overdueTasks.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div className="alert-section-title overdue-title">
                    <span>🚨 Overdue Tasks ({overdueTasks.length})</span>
                  </div>
                  <div className="alert-cards-list">
                    {overdueTasks.map(t => (
                      <div key={t.id} className="alert-card overdue-card">
                        <div className="alert-card-left">
                          <div className="alert-card-title">{t.title}</div>
                          <div className="alert-card-meta">
                            <span className={`badge badge-${t.priority}`}>{priorityLabel(t.priority)}</span>
                            <span className={`badge badge-${t.status}`}>{statusLabel(t.status)}</span>
                            <span className="alert-countdown overdue-pill">
                              ⚠ {getCountdownLabel(t.due_date)}
                            </span>
                          </div>
                          <div className="alert-due-raw">
                            Due date: {formatDate(t.due_date)}
                          </div>
                        </div>
                        <div className="alert-card-actions">
                          {NEXT[t.status] && (
                            <button
                              className={`btn ${NEXT_CLS[t.status]}`}
                              onClick={() => { onAdvance(t.id, NEXT[t.status]); }}
                              title={`Advance to ${NEXT[t.status]}`}
                            >
                              {NEXT_LABEL[t.status]}
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => { onClose(); onEdit(t); }}
                            title="Edit task"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Due Soon Section */}
              {dueSoonTasks.length > 0 && (
                <div>
                  <div className="alert-section-title soon-title">
                    <span>⏰ Due Soon — Next 48 Hours ({dueSoonTasks.length})</span>
                  </div>
                  <div className="alert-cards-list">
                    {dueSoonTasks.map(t => (
                      <div key={t.id} className="alert-card soon-card">
                        <div className="alert-card-left">
                          <div className="alert-card-title">{t.title}</div>
                          <div className="alert-card-meta">
                            <span className={`badge badge-${t.priority}`}>{priorityLabel(t.priority)}</span>
                            <span className={`badge badge-${t.status}`}>{statusLabel(t.status)}</span>
                            <span className="alert-countdown soon-pill">
                              ⏳ {getCountdownLabel(t.due_date)}
                            </span>
                          </div>
                          <div className="alert-due-raw">
                            Due date: {formatDate(t.due_date)}
                          </div>
                        </div>
                        <div className="alert-card-actions">
                          {NEXT[t.status] && (
                            <button
                              className={`btn ${NEXT_CLS[t.status]}`}
                              onClick={() => { onAdvance(t.id, NEXT[t.status]); }}
                              title={`Advance to ${NEXT[t.status]}`}
                            >
                              {NEXT_LABEL[t.status]}
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => { onClose(); onEdit(t); }}
                            title="Edit task"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            ⚡ Alerts refresh automatically as deadlines approach
          </span>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

