import { useState, useEffect } from "react";
import { useAuth }   from "./context/AuthContext";
import Sidebar       from "./components/Sidebar";
import Dashboard     from "./pages/Dashboard";
import LoginPage     from "./pages/LoginPage";
import SignupPage    from "./pages/SignupPage";
import { taskApi }   from "./services/api";
import "./styles/global.css";

export default function App() {
  const { user, loading, logout } = useAuth();
  const [theme,      setTheme]      = useState(() => localStorage.getItem("tf-theme") || "light");
  const [activePage, setActivePage] = useState("dashboard");
  const [stats,      setStats]      = useState(null);
  const [authPage,   setAuthPage]   = useState("login");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tf-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) return;
    taskApi.stats().then(setStats).catch(() => {});
  }, [user]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  if (loading) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",
        justifyContent:"center",background:"var(--bg-app)",flexDirection:"column",gap:16}}>
        <div style={{width:56,height:56,background:"linear-gradient(135deg,#a855f7,#6366f1)",
          borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:28,boxShadow:"0 8px 24px rgba(168,85,247,.4)"}}>⚡</div>
        <p style={{color:"var(--text-muted)",fontSize:14,fontWeight:500}}>Loading TaskFlux…</p>
      </div>
    );
  }

  if (!user) {
    return authPage === "login"
      ? <LoginPage  onGoToSignup={() => setAuthPage("signup")} />
      : <SignupPage onGoToLogin={() => setAuthPage("login")}  />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        stats={stats}
        user={user}
        onLogout={logout}
      />
      <main className="page-content">
        <Dashboard activePage={activePage} theme={theme} onToggleTheme={toggleTheme} />
      </main>
    </div>
  );
}