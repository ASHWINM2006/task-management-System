import TaskCard from "./TaskCard";

export default function TaskList({ tasks, loading, total, onEdit, onDelete, onAdvance }) {
  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner"/>
        <p className="spinner-text">Loading tasks…</p>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{total === 0 ? "📋" : "🔍"}</div>
        <h3>{total === 0 ? "No tasks yet" : "No tasks found"}</h3>
        <p>{total === 0
          ? "Click \"＋ New Task\" to create your first task."
          : "Try adjusting your search or filter criteria."
        }</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX:"auto" }}>
      <table className="data-table" aria-label="Task list">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Info</th>
            <th>Created</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <TaskCard
              key={t.id} task={t}
              onEdit={onEdit} onDelete={onDelete} onAdvance={onAdvance}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
