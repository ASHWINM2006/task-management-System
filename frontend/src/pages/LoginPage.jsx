/**
 * LoginPage.jsx
 * Clean split-screen sign-in screen matching the user request:
 * - Removed "Remember for 30 days"
 * - Removed "Forgot password"
 * - Removed "Sign in with Google"
 * Left panel: Cube logo, Welcome back, email & password fields, primary Sign In,
 *             Don't have an account? Sign up toggle, and quick demo fill button.
 * Right panel: Purple vector illustration hero.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthHero from "../components/AuthHero";

export default function LoginPage({ onGoToSignup }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setField = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
    setApiErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password.trim()) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setApiErr(err?.response?.data?.detail || err.message || "Invalid credentials.");
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: "demo@taskflux.com", password: "demo123" });
    setErrors({});
    setApiErr("");
  };

  return (
    <div className="auth-split-layout">
      {/* ── LEFT PANEL (White Form) ── */}
      <div className="auth-form-side">
        {/* Brand Logo in top-left */}
        <div className="auth-brand-header">
          <div className="auth-cube-logo">
            <span className="cube-cell cube-cell-1" />
            <span className="cube-cell cube-cell-2" />
            <span className="cube-cell cube-cell-3" />
            <span className="cube-cell cube-cell-4" />
          </div>
          <span className="auth-brand-title">TaskFlux</span>
        </div>

        {/* Form Center Container */}
        <div className="auth-form-inner">
          <div className="auth-titles-block">
            <h1 className="auth-main-title">Welcome back</h1>
            <p className="auth-sub-title">Please enter your details</p>
          </div>

          {apiErr && (
            <div className="auth-inline-alert auth-alert-danger">
              <span>⚠️</span>
              <span>{apiErr}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="auth-actual-form">
            {/* Email Field */}
            <div className="auth-input-group">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                className={`auth-field-input ${errors.email ? "has-error" : ""}`}
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                autoFocus
                autoComplete="email"
              />
              {errors.email && <span className="auth-err-msg">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <label htmlFor="auth-password">Password</label>
              <div className="auth-password-wrapper">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  className={`auth-field-input ${errors.password ? "has-error" : ""}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="auth-err-msg">{errors.password}</span>}
            </div>

            {/* Sign in Primary Button */}
            <button
              type="submit"
              className="auth-btn-purple-primary"
              disabled={busy}
            >
              {busy ? (
                <>
                  <span className="auth-spinner" />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="auth-switch-footer">
            <span>Don't have an account? </span>
            <button
              type="button"
              className="auth-switch-action-btn"
              onClick={onGoToSignup}
            >
              Sign up
            </button>
          </div>

          {/* Demo helper pill */}
          <div className="auth-demo-shortcut">
            <button type="button" onClick={fillDemo} className="auth-demo-quick-btn">
              ⚡ Fill demo credentials (demo@taskflux.com)
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Purple Illustration Hero) ── */}
      <div className="auth-visual-side">
        <AuthHero />
      </div>
    </div>
  );
}
