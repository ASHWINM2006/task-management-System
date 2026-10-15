import { formatDistanceToNow } from "date-fns";

const META = {
  created:        { icon:"🆕", label:"Created",        bg:"rgba(168,85,247,.1)",  color:"#a855f7" },
  updated:        { icon:"✏️",  label:"Updated",        bg:"rgba(14,165,233,.1)",  color:"#0ea5e9" },
  status_changed: { icon:"🔄", label:"Status Changed", bg:"rgba(245,158,11,.1)",  color:"#f59e0b" },
  deleted:        { icon:"🗑️", label:"Deleted",        bg:"rgba(244,63,94,.1)",   color:"#f43f5e" },
};

export default function ActivityLog({ logs }) {
  if (!logs?.length) {
    return (
      <div className="empty-state" style={{ padding:"40px 20px" }}>
        <div className="empty-icon">🕐</div>
        <h3>No activity yet</h3>
        <p>Task actions will appear here in real time.</p>
      </div>
    );
  }

  return (
    <ul className="activity-list" aria-label="Activity log">
      {logs.map(l => {
        const m = META[l.action] || { icon:"📌", label:l.action, bg:"rgba(168,85,247,.1)", color:"#a855f7" };
        return (
          <li key={l.id} className="activity-item">
            <div className="activity-icon-wrap" style={{ background:m.bg }}>
              <span>{m.icon}</span>
            </div>
            <div className="activity-content">
              <p className="activity-title">
                <span style={{ color:m.color }}>{m.label}</span>
                {" — "}
                <span className="activity-task">{l.task_title}</span>
              </p>
              {l.detail && <p className="activity-detail">{l.detail}</p>}
              <p className="activity-time">
                {formatDistanceToNow(new Date(l.created_at), { addSuffix:true })}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
