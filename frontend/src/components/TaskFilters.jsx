export default function TaskFilters({
  search, setSearch,
  statusFilter, setStatusFilter,
  priorityFilter, setPriorityFilter,
  sortBy, setSortBy,
  sortOrder, setSortOrder,
  onRefresh, onExportCSV, onCreateClick,
  loading,
}) {
  return (
    <div className="filters-bar">
      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input-field"
          type="search"
          placeholder="Search by title or description…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
        {search && (
          <button className="search-clear-btn" onClick={() => setSearch("")} aria-label="Clear">✕</button>
        )}
      </div>

      {/* Status */}
      <select className="filter-select" value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)} aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option value="pending">⏳ Pending</option>
        <option value="in-progress">🔄 In Progress</option>
        <option value="completed">✅ Completed</option>
      </select>

      {/* Priority */}
      <select className="filter-select" value={priorityFilter}
        onChange={e => setPriorityFilter(e.target.value)} aria-label="Filter by priority">
        <option value="">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      {/* Sort */}
      <select className="filter-select"
        value={`${sortBy}:${sortOrder}`}
        onChange={e => { const [b,o] = e.target.value.split(":"); setSortBy(b); setSortOrder(o); }}
        aria-label="Sort tasks">
        <option value="created_at:desc">📅 Newest First</option>
        <option value="created_at:asc">📅 Oldest First</option>
        <option value="title:asc">🔤 Title A→Z</option>
        <option value="title:desc">🔤 Title Z→A</option>
        <option value="due_date:asc">⏰ Due Soonest</option>
        <option value="priority:desc">🔴 High Priority</option>
      </select>

      {/* Actions */}
      <div style={{ display:"flex", gap:8, marginLeft:"auto", flexShrink:0, flexWrap:"wrap" }}>
        <button className="btn btn-secondary btn-sm" onClick={onRefresh} disabled={loading} title="Refresh data">
          {loading ? "⌛" : "🔄"} Refresh
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onExportCSV} title="Export as CSV">
          ⬇ Export CSV
        </button>
        <button className="btn btn-primary" onClick={onCreateClick}>
          ＋ New Task
        </button>
      </div>
    </div>
  );
}
