/**
 * LoginPage.jsx  —  Attractive sign-in screen.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onGoToSignup }) {
  const { login } = useAuth();
  const [form,   setForm]   = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [busy,   setBusy]   = useState(false);
  const [show,   setShow]   = useState(false);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
    setApiErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = "Email is required.";
    if (!form.password.trim()) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      // AuthContext will update user → App re-renders to Dashboard
    } catch (err) {
      setApiErr(err?.response?.data?.detail || err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">⚡</div>
          <h1 className="auth-brand-name">TaskFlux</h1>
          <p className="auth-brand-tag">Manage tasks beautifully</p>
        </div>
        <div className="auth-illustration">
          <div className="auth-blob auth-blob-1"/>
          <div className="auth-blob auth-blob-2"/>
          <div className="auth-blob auth-blob-3"/>
          <div className="auth-features">
            {[
              { icon:"✅", text:"Track tasks with strict status rules" },
              { icon:"📊", text:"Beautiful analytics dashboard" },
              { icon:"🔄", text:"Real-time activity feed" },
              { icon:"📥", text:"CSV export & priority levels" },
            ].map(f => (
              <div key={f.text} className="auth-feature-item">
                <span className="auth-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back 👋</h2>
            <p>Sign in to your TaskFlux account</p>
          </div>

          {apiErr && (
            <div className="auth-alert auth-alert-error">
              ⚠️ {apiErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-form-group">
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  autoFocus
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="auth-field-error">{errors.email}</p>}
            </div>

            <div className="auth-form-group">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label htmlFor="login-pass">Password</label>
                <button type="button" className="auth-link-sm">Forgot password?</button>
              </div>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="login-pass"
                  type={show ? "text" : "password"}
                  className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShow(v => !v)}>
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="auth-field-error">{errors.password}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={busy}>
              {busy ? (
                <><span className="auth-btn-spinner"/>Signing in…</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="auth-demo-box">
            <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:8 }}>
              Try demo credentials:
            </p>
            <button
              type="button"
              className="auth-demo-btn"
              onClick={() => {
                setForm({ email:"demo@taskflux.com", password:"demo123" });
                setErrors({}); setApiErr("");
              }}
            >
              Use Demo Account
            </button>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button type="button" className="auth-switch-link" onClick={onGoToSignup}>
              Create one free →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
