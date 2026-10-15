import { useState } from "react";
import { useTasks }       from "../hooks/useTasks";
import StatsCards         from "../components/StatsCards";
import TaskCharts         from "../components/TaskCharts";
import TaskFilters        from "../components/TaskFilters";
import TaskList           from "../components/TaskList";
import TaskFormModal      from "../components/TaskFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import DueDateAlertModal  from "../components/DueDateAlertModal";
import Pagination         from "../components/Pagination";
import ActivityLog        from "../components/ActivityLog";
import Notification       from "../components/Notification";

function ThemeBtn({ theme, onToggle }) {
  return (
    <button
      className="btn btn-secondary btn-icon-sq"
      onClick={onToggle}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
      style={{ fontSize: 17 }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

export default function Dashboard({ activePage, theme, onToggleTheme }) {
  const hook = useTasks();
  const [formOpen,   setFormOpen]   = useState(false);
  const [editTask,   setEditTask]   = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [alertOpen,  setAlertOpen]  = useState(false);

  const urgentCount = (hook.stats?.overdue || 0) + (hook.stats?.due_soon || 0);

  const openCreate    = ()  => { setEditTask(null); setFormOpen(true); };
  const openEdit      = (t) => { setEditTask(t);    setFormOpen(true); };
  const handleSubmit  = (d) => editTask
    ? hook.updateTask(editTask.id, d)
    : hook.createTask(d);
  const handleAdvance = (id, next) => hook.updateTask(id, { status: next });
  const confirmDelete = async () => {
    await hook.deleteTask(deleteTask.id);
    setDeleteTask(null);
  };

  /* ── Modals shared across all pages ───────────────────── */
  const modals = (
    <>
      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        task={editTask}
      />
      <DeleteConfirmModal
        task={deleteTask}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTask(null)}
      />
      <DueDateAlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        tasks={hook.tasks}
        stats={hook.stats}
        onEdit={openEdit}
        onAdvance={handleAdvance}
      />
    </>
  );

  /* ── Activity Log page ─────────────────────────────────── */
  if (activePage === "activity") {
    return (
      <div>
        <Notification notification={hook.notification} />
        <div className="topbar">
          <div className="topbar-left">
            <h1>Activity Log</h1>
            <p>Complete history of every task action</p>
          </div>
          <div className="topbar-actions">
            <button
              className={`btn btn-secondary btn-sm btn-alert ${urgentCount > 0 ? "has-urgent" : ""}`}
              onClick={() => setAlertOpen(true)}
              title="View deadline and due date alerts"
            >
              🔔 Alerts
              {urgentCount > 0 && <span className="alert-count-pill">{urgentCount}</span>}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={hook.refresh}>
              🔄 Refresh
            </button>
            <ThemeBtn theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
        <div className="card">
          <ActivityLog logs={hook.activityLogs} />
        </div>
        {modals}
      </div>
    );
  }

  /* ── Tasks page ────────────────────────────────────────── */
  if (activePage === "tasks") {
    return (
      <div>
        <Notification notification={hook.notification} />
        <div className="topbar">
          <div className="topbar-left">
            <h1>Task Review</h1>
            <p>
              {hook.total} task{hook.total !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="topbar-actions">
            <button
              className={`btn btn-secondary btn-sm btn-alert ${urgentCount > 0 ? "has-urgent" : ""}`}
              onClick={() => setAlertOpen(true)}
              title="View deadline and due date alerts"
            >
              🔔 Alerts
              {urgentCount > 0 && <span className="alert-count-pill">{urgentCount}</span>}
            </button>
            <ThemeBtn theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>

        <TaskFilters
          search={hook.search}                 setSearch={hook.setSearch}
          statusFilter={hook.statusFilter}     setStatusFilter={hook.setStatusFilter}
          priorityFilter={hook.priorityFilter} setPriorityFilter={hook.setPriorityFilter}
          sortBy={hook.sortBy}                 setSortBy={hook.setSortBy}
          sortOrder={hook.sortOrder}           setSortOrder={hook.setSortOrder}
          onRefresh={hook.refresh}             onExportCSV={hook.exportCSV}
          onCreateClick={openCreate}           loading={hook.loading}
        />

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <TaskList
            tasks={hook.tasks} loading={hook.loading} total={hook.total}
            onEdit={openEdit} onDelete={setDeleteTask} onAdvance={handleAdvance}
          />
        </div>

        <Pagination
          page={hook.page}           totalPages={hook.totalPages}
          total={hook.total}         pageSize={hook.pageSize}
          onPageChange={hook.setPage}
        />
        {modals}
      </div>
    );
  }

  /* ── Dashboard page (default) ──────────────────────────── */
  return (
    <div>
      <Notification notification={hook.notification} />

      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <h1>Dashboard</h1>
          <p>Welcome back — here's your task overview</p>
        </div>
        <div className="topbar-actions">
          <button
            className={`btn btn-secondary btn-sm btn-alert ${urgentCount > 0 ? "has-urgent" : ""}`}
            onClick={() => setAlertOpen(true)}
            title="View deadline and due date alerts"
          >
            🔔 Alerts
            {urgentCount > 0 ? (
              <span className="alert-count-pill">{urgentCount}</span>
            ) : (
              <span className="alert-dot-ok">✓</span>
            )}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={hook.refresh}
            disabled={hook.loading}
          >
            {hook.loading ? "⌛" : "🔄"} Refresh
          </button>
          <button className="btn btn-secondary btn-sm" onClick={hook.exportCSV}>
            ⬇ Export CSV
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            ＋ New Task
          </button>
          <ThemeBtn theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Due Date Alert Notice Banner if there are urgent tasks */}
      {urgentCount > 0 && (
        <div className="dashboard-alert-banner" onClick={() => setAlertOpen(true)} role="alert">
          <div className="dash-alert-content">
            <span className="dash-alert-icon">⚠️</span>
            <div>
              <strong>Due Date Alert:</strong> You have{" "}
              {hook.stats?.overdue > 0 && (
                <span className="alert-hl-overdue">{hook.stats.overdue} overdue task{hook.stats.overdue > 1 ? "s" : ""}</span>
              )}
              {hook.stats?.overdue > 0 && hook.stats?.due_soon > 0 && " and "}
              {hook.stats?.due_soon > 0 && (
                <span className="alert-hl-soon">{hook.stats.due_soon} task{hook.stats.due_soon > 1 ? "s" : ""} due soon (within 48h)</span>
              )}
              . Click to view and take action.
            </div>
          </div>
          <button className="btn btn-alert-banner btn-xs" onClick={(e) => { e.stopPropagation(); setAlertOpen(true); }}>
            Review Alerts ›
          </button>
        </div>
      )}

      {/* Stats cards + progress bar */}
      <StatsCards stats={hook.stats} />

      {/* Charts */}
      <TaskCharts stats={hook.stats} />

      {/* Filters */}
      <TaskFilters
        search={hook.search}                 setSearch={hook.setSearch}
        statusFilter={hook.statusFilter}     setStatusFilter={hook.setStatusFilter}
        priorityFilter={hook.priorityFilter} setPriorityFilter={hook.setPriorityFilter}
        sortBy={hook.sortBy}                 setSortBy={hook.setSortBy}
        sortOrder={hook.sortOrder}           setSortOrder={hook.setSortOrder}
        onRefresh={hook.refresh}             onExportCSV={hook.exportCSV}
        onCreateClick={openCreate}           loading={hook.loading}
      />

      {/* Task table */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 4 }}>
        <div style={{
          padding: "16px 22px 12px",
          borderBottom: "1px solid var(--border)",
          fontWeight: 700,
          fontSize: 15,
          color: "var(--text-primary)",
        }}>
          📋 Task Review List
          <span style={{
            marginLeft: 10, fontSize: 12, fontWeight: 500,
            color: "var(--text-muted)",
          }}>
            {hook.total} task{hook.total !== 1 ? "s" : ""}
          </span>
        </div>
        <TaskList
          tasks={hook.tasks} loading={hook.loading} total={hook.total}
          onEdit={openEdit} onDelete={setDeleteTask} onAdvance={handleAdvance}
        />
      </div>

      <Pagination
        page={hook.page}           totalPages={hook.totalPages}
        total={hook.total}         pageSize={hook.pageSize}
        onPageChange={hook.setPage}
      />

      {modals}
    </div>
  );
}
