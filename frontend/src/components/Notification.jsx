export default function Notification({ notification }) {
  if (!notification) return null;
  const icons = { success: "✅", error: "❌" };
  return (
    <div className={`toast toast-${notification.type}`} role="alert" aria-live="polite">
      <span className="toast-icon">{icons[notification.type]}</span>
      <span>{notification.message}</span>
    </div>
  );
}
