/**
 * hooks/useTasks.js
 * Central state: tasks, stats, activity log, CRUD, CSV export, polling.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { taskApi, activityApi } from "../services/api";

const POLL_MS = 30000;

export function useTasks() {
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy,         setSortBy]         = useState("created_at");
  const [sortOrder,      setSortOrder]      = useState("desc");
  const [page,           setPage]           = useState(1);
  const pageSize = 10;

  const [tasks,         setTasks]         = useState([]);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [stats,         setStats]         = useState(null);
  const [activityLogs,  setActivityLogs]  = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [notification,  setNotification]  = useState(null);

  const pollRef = useRef(null);

  const notify = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const fetchTasks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = { page, page_size: pageSize, sort_by: sortBy, sort_order: sortOrder };
      if (search)         params.search   = search;
      if (statusFilter)   params.status   = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const data = await taskApi.list(params);
      setTasks(data.tasks);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      if (!silent) notify("error", err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, priorityFilter, sortBy, sortOrder, notify]);

  const fetchStats = useCallback(async () => {
    try { setStats(await taskApi.stats()); } catch (_) {}
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const d = await activityApi.list({ limit: 50 });
      setActivityLogs(d.logs);
    } catch (_) {}
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchTasks(), fetchStats(), fetchLogs()]);
  }, [fetchTasks, fetchStats, fetchLogs]);

  useEffect(() => { fetchTasks(); fetchStats(); fetchLogs(); },
    [fetchTasks, fetchStats, fetchLogs]);

  useEffect(() => {
    pollRef.current = setInterval(() => { fetchTasks(true); fetchStats(); }, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [fetchTasks, fetchStats]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, statusFilter, priorityFilter, sortBy, sortOrder]);

  const createTask = useCallback(async (data) => {
    try { await taskApi.create(data); notify("success", "Task created."); await refresh(); return true; }
    catch (err) { notify("error", err.message); return false; }
  }, [notify, refresh]);

  const updateTask = useCallback(async (id, data) => {
    try { const r = await taskApi.update(id, data); notify("success", "Task updated."); await refresh(); return r; }
    catch (err) { notify("error", err.message); return null; }
  }, [notify, refresh]);

  const deleteTask = useCallback(async (id) => {
    try { await taskApi.delete(id); notify("success", "Task deleted."); await refresh(); return true; }
    catch (err) { notify("error", err.message); return false; }
  }, [notify, refresh]);

  const exportCSV = useCallback(async () => {
    try {
      const data = await taskApi.list({ page: 1, page_size: 100, sort_by: "created_at", sort_order: "desc" });
      const hdr = ["ID","Title","Description","Status","Priority","Due Date","Created At"];
      const esc = (v) => `"${String(v ?? "").replace(/"/g,'""')}"`;
      const csv = [hdr.join(","),
        ...data.tasks.map((t) => [
          t.id, esc(t.title), esc(t.description||""),
          t.status, t.priority,
          t.due_date ? new Date(t.due_date).toISOString() : "",
          new Date(t.created_at).toISOString(),
        ].join(","))
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: `tasks_${new Date().toISOString().slice(0,10)}.csv` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify("success", "CSV exported.");
    } catch (err) { notify("error", "Export failed: " + err.message); }
  }, [notify]);

  return {
    tasks, total, totalPages, stats, activityLogs,
    search, setSearch, statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    sortBy, setSortBy, sortOrder, setSortOrder,
    page, setPage, pageSize,
    loading, notification,
    createTask, updateTask, deleteTask, refresh, exportCSV,
  };
}
