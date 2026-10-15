import { format, isPast } from "date-fns";

export const formatDate = (s) => {
  if (!s) return "—";
  try { return format(new Date(s), "MMM d, yyyy h:mm a"); } catch { return s; }
};

export const isOverdue = (task) =>
  task?.due_date && task.status !== "completed" && isPast(new Date(task.due_date));

export const isDueSoon = (task, hoursThreshold = 48) => {
  if (!task?.due_date || task.status === "completed") return false;
  const due = new Date(task.due_date).getTime();
  const now = Date.now();
  const diffHours = (due - now) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= hoursThreshold;
};

export const getCountdownLabel = (dueDate) => {
  if (!dueDate) return "";
  const diffMs = new Date(dueDate).getTime() - Date.now();
  if (diffMs < 0) {
    const hours = Math.abs(Math.round(diffMs / (1000 * 60 * 60)));
    if (hours < 24) return `Overdue by ${hours || 1}h`;
    const days = Math.round(hours / 24);
    return `Overdue by ${days}d`;
  }
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) {
    const mins = Math.max(1, Math.round(diffMs / (1000 * 60)));
    return `Due in ${mins}m`;
  }
  if (hours < 24) return `Due in ${hours}h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Due tomorrow" : `Due in ${days} days`;
};

export const statusLabel   = (s) => ({ pending: "Pending", "in-progress": "In Progress", completed: "Completed" }[s] || s);
export const priorityLabel = (p) => ({ high: "High", medium: "Medium", low: "Low" }[p] || p);

