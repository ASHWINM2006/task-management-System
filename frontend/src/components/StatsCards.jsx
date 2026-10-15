export default function StatsCards({ stats }) {
  if (!stats) {
    return (
      <div className="stats-row">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="stat-card" style={{ minHeight:130, background:"var(--bg-hover)", animation:"skeletonPulse 1.5s ease infinite" }}/>
        ))}
        <style>{`@keyframes skeletonPulse{0%,100%{opacity:.6}50%{opacity:.3}}`}</style>
      </div>
    );
  }

  const cards = [
    { cls:"s-total",  dot:"#a855f7", label:"Total Tasks",      value:stats.total,       trend:"+10%", up:true, sub:"All tasks in system" },
    { cls:"s-inprog", dot:"#0ea5e9", label:"In Progress",      value:stats.in_progress, trend:"+20%", up:true, sub:"Currently being worked on" },
    { cls:"s-pending",dot:"#f59e0b", label:"Pending",          value:stats.pending,     trend:"+5%",  up:true, sub:"Waiting to start" },
    { cls:"s-done",   dot:"#10b981", label:"Completed",        value:stats.completed,   trend:"+15%", up:true, sub:"Successfully finished" },
    { cls:"s-overdue",dot:"#f43f5e", label:"Overdue",          value:stats.overdue,     trend: stats.overdue > 0 ? "+"+stats.overdue : "0", up:false, sub:"Passed due date" },
  ];

  return (
    <>
      <div className="stats-row">
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.cls}`}>
            <div className="stat-card-head">
              <div className="stat-card-label">
                <span className="stat-dot" style={{ background:c.dot }}/>
                {c.label}
              </div>
              <button className="stat-menu">⋯</button>
            </div>
            <div className="stat-value">{c.value}</div>
            <div className={`stat-trend ${c.up ? "up" : "down"}`}>
              {c.up ? "↑" : "↓"} {c.trend}
            </div>
            <div className="stat-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div className="card" style={{ marginBottom:26, padding:"18px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:13 }}>
          <span style={{ fontWeight:700, color:"var(--text-primary)" }}>Overall Completion Progress</span>
          <span style={{ fontWeight:800, color:"#a855f7" }}>{stats.completion_rate}%</span>
        </div>
        <div className="progress-wrap">
          <div className="progress-fill" style={{ width:`${stats.completion_rate}%` }}
            role="progressbar" aria-valuenow={stats.completion_rate} aria-valuemin={0} aria-valuemax={100}/>
        </div>
        <div style={{ display:"flex", gap:20, marginTop:10, fontSize:11.5, color:"var(--text-muted)", flexWrap:"wrap" }}>
          <span>✅ {stats.completed} completed</span>
          <span>🔄 {stats.in_progress} in progress</span>
          <span>⏳ {stats.pending} pending</span>
          {stats.overdue > 0 && <span style={{color:"#f43f5e"}}>⚠️ {stats.overdue} overdue</span>}
        </div>
      </div>
    </>
  );
}
