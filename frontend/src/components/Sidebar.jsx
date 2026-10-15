export default function Sidebar({ activePage, onNavigate, stats, user, onLogout }) {
  const nav = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"tasks",     icon:"✅", label:"Tasks",        badge: stats?.pending || null },
    { id:"activity",  icon:"🕐", label:"Activity Log" },
  ];

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()
    : "TF";

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-logo">
        <div className="logo-gem">⚡</div>
        <div>
          <div className="logo-text">TaskFlux</div>
          <div className="logo-tagline">Task Management</div>
        </div>
      </div>

      <div className="nav-section">
        <span className="nav-label">Main Menu</span>
        {nav.map(n => (
          <button key={n.id}
            className={`nav-item ${activePage === n.id ? "active" : ""}`}
            onClick={() => onNavigate(n.id)}
            aria-current={activePage === n.id ? "page" : undefined}>
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
            {n.badge > 0 && <span className="nav-badge">{n.badge}</span>}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="user-name" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {user?.name || "User"}
            </div>
            <div className="user-role" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {user?.email || ""}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{width:"100%",marginTop:8,padding:"9px 14px",
            background:"rgba(244,63,94,.12)",color:"#f43f5e",
            border:"1px solid rgba(244,63,94,.2)",borderRadius:"var(--radius)",
            fontSize:13,fontWeight:600,cursor:"pointer",
            display:"flex",alignItems:"center",gap:8,justifyContent:"center",
            transition:"all .2s"}}
          onMouseEnter={e=>{e.target.style.background="rgba(244,63,94,.2)"}}
          onMouseLeave={e=>{e.target.style.background="rgba(244,63,94,.12)"}}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
