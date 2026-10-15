/**
 * SignupPage.jsx
 * Split-screen sign-up screen matching the reference image:
 * Left panel: Clean white form with Cube logo, Create an account, full name,
 *             email, password, confirm password, Create account button,
 *             and Sign in toggle.
 * Right panel: Purple vector illustration hero.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthHero from "../components/AuthHero";

export default function SignupPage({ onGoToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
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
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
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
      await register(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      setApiErr(err?.response?.data?.detail || err.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
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
            <h1 className="auth-main-title">Create an account</h1>
            <p className="auth-sub-title">Start managing your tasks today</p>
          </div>

          {apiErr && (
            <div className="auth-inline-alert auth-alert-danger">
              <span>⚠️</span>
              <span>{apiErr}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="auth-actual-form">
            {/* Full Name */}
            <div className="auth-input-group">
              <label htmlFor="su-name">Full name</label>
              <input
                id="su-name"
                type="text"
                className={`auth-field-input ${errors.name ? "has-error" : ""}`}
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                autoFocus
                autoComplete="name"
              />
              {errors.name && <span className="auth-err-msg">{errors.name}</span>}
            </div>

            {/* Email Field */}
            <div className="auth-input-group">
              <label htmlFor="su-email">Email address</label>
              <input
                id="su-email"
                type="email"
                className={`auth-field-input ${errors.email ? "has-error" : ""}`}
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                autoComplete="email"
              />
              {errors.email && <span className="auth-err-msg">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <label htmlFor="su-password">Password</label>
              <div className="auth-password-wrapper">
                <input
                  id="su-password"
                  type={showPassword ? "text" : "password"}
                  className={`auth-field-input ${errors.password ? "has-error" : ""}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="auth-input-group">
              <label htmlFor="su-confirm">Confirm password</label>
              <input
                id="su-confirm"
                type={showPassword ? "text" : "password"}
                className={`auth-field-input ${errors.confirm ? "has-error" : ""}`}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={(e) => setField("confirm", e.target.value)}
                autoComplete="new-password"
              />
              {errors.confirm && <span className="auth-err-msg">{errors.confirm}</span>}
            </div>

            {/* Create Account Primary Button */}
            <button
              type="submit"
              className="auth-btn-purple-primary"
              disabled={busy}
            >
              {busy ? (
                <>
                  <span className="auth-spinner" />
                  <span>Creating account…</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="auth-switch-footer">
            <span>Already have an account? </span>
            <button
              type="button"
              className="auth-switch-action-btn"
              onClick={onGoToLogin}
            >
              Sign in
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
