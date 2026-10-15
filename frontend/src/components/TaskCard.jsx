import { isOverdue, isDueSoon, getCountdownLabel, formatDate, statusLabel, priorityLabel } from "../utils/helpers";

const NEXT       = { "pending":"in-progress", "in-progress":"completed" };
const NEXT_LABEL = { "pending":"▶ Start", "in-progress":"✔ Complete" };
const NEXT_CLS   = { "pending":"btn-success btn-xs", "in-progress":"btn-primary btn-xs" };

const AVATAR_BG  = ["#a855f7","#0ea5e9","#10b981","#f59e0b","#f43f5e","#ec4899","#6366f1"];
const getAvatarBg = id => AVATAR_BG[id % AVATAR_BG.length];
const initials    = s  => (s||"T").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

export default function TaskCard({ task, onEdit, onDelete, onAdvance }) {
  const overdue = isOverdue(task);
  const dueSoon = !overdue && isDueSoon(task);

  return (
    <tr className={overdue ? "tr-overdue" : dueSoon ? "tr-due-soon" : ""}>
      {/* Task name */}
      <td>
        <div className="task-name">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
      </td>

      {/* Assignee / ID */}
      <td>
        <div className="avatar-cell">
          <div className="t-avatar" style={{ background:getAvatarBg(task.id) }}>
            {initials(task.title)}
          </div>
          <div>
            <div className="assignee-n">Task #{task.id}</div>
            <div className="assignee-r">{task.priority} priority</div>
          </div>
        </div>
      </td>

      {/* Created */}
      <td style={{ fontSize:12, color:"var(--text-muted)", whiteSpace:"nowrap" }}>
        {formatDate(task.created_at)}
      </td>

      {/* Priority */}
      <td><span className={`badge badge-${task.priority}`}>{priorityLabel(task.priority)}</span></td>

      {/* Due date */}
      <td style={{ fontSize:12, whiteSpace:"nowrap" }}>
        {task.due_date ? (
          <div>
            <span style={{ color: overdue ? "#f43f5e" : dueSoon ? "#f59e0b" : "var(--text-muted)" }}>
              {formatDate(task.due_date)}
            </span>
            {overdue && (
              <span className="badge badge-due-overdue" style={{ marginLeft: 6 }}>
                ⚠ {getCountdownLabel(task.due_date)}
              </span>
            )}
            {dueSoon && (
              <span className="badge badge-due-soon" style={{ marginLeft: 6 }}>
                ⏰ {getCountdownLabel(task.due_date)}
              </span>
            )}
          </div>
        ) : "—"}
      </td>

      {/* Status */}
      <td><span className={`badge badge-${task.status}`}>{statusLabel(task.status)}</span></td>

      {/* Actions */}
      <td>
        <div className="row-actions">
          {NEXT[task.status] && (
            <button
              className={`btn ${NEXT_CLS[task.status]}`}
              onClick={() => onAdvance(task.id, NEXT[task.status])}
              title={`Move to ${NEXT[task.status]}`}
            >
              {NEXT_LABEL[task.status]}
            </button>
          )}
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label={`Edit "${task.title}"`}
          >✏️</button>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label={`Delete "${task.title}"`}
            style={{ color:"#f43f5e" }}
          >🗑️</button>
        </div>
      </td>
    </tr>
  );
}
