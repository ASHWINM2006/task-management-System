/**
 * SignupPage.jsx  —  Attractive registration screen.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SignupPage({ onGoToLogin }) {
  const { register } = useAuth();
  const [form,   setForm]   = useState({ name:"", email:"", password:"", confirm:"" });
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
    if (!form.name.trim())       e.name    = "Full name is required.";
    if (!form.email.trim())      e.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)          e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    return e;
  };

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ["","Weak","Fair","Good","Strong","Very Strong"];
  const strengthColor = ["","#f43f5e","#f59e0b","#fbbf24","#10b981","#059669"];
  const s = strength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
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
    <div className="auth-shell">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">⚡</div>
          <h1 className="auth-brand-name">TaskFlux</h1>
          <p className="auth-brand-tag">Get started for free</p>
        </div>
        <div className="auth-illustration">
          <div className="auth-blob auth-blob-1"/>
          <div className="auth-blob auth-blob-2"/>
          <div className="auth-blob auth-blob-3"/>
          <div className="auth-features">
            {[
              { icon:"🚀", text:"Set up in under 60 seconds" },
              { icon:"🔐", text:"Secure JWT authentication" },
              { icon:"🎨", text:"Beautiful dark & light themes" },
              { icon:"📱", text:"Works on all screen sizes" },
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
            <h2>Create your account ✨</h2>
            <p>Join TaskFlux and start managing tasks</p>
          </div>

          {apiErr && (
            <div className="auth-alert auth-alert-error">⚠️ {apiErr}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="auth-form-group">
              <label htmlFor="su-name">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  id="su-name"
                  type="text"
                  className={`auth-input ${errors.name ? "auth-input-error" : ""}`}
                  placeholder="John Smith"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  autoFocus
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="auth-field-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="auth-form-group">
              <label htmlFor="su-email">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input
                  id="su-email"
                  type="email"
                  className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="auth-field-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="auth-form-group">
              <label htmlFor="su-pass">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="su-pass"
                  type={show ? "text" : "password"}
                  className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShow(v => !v)}>
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="auth-strength-bar"
                        style={{ background: i <= s ? strengthColor[s] : "var(--border)" }}/>
                    ))}
                  </div>
                  <span style={{ fontSize:11, color: strengthColor[s], fontWeight:700 }}>
                    {strengthLabel[s]}
                  </span>
                </div>
              )}
              {errors.password && <p className="auth-field-error">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="auth-form-group">
              <label htmlFor="su-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="su-confirm"
                  type={show ? "text" : "password"}
                  className={`auth-input ${errors.confirm ? "auth-input-error" : ""}`}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => set("confirm", e.target.value)}
                  autoComplete="new-password"
                />
                {form.confirm && form.confirm === form.password && (
                  <span className="auth-check">✅</span>
                )}
              </div>
              {errors.confirm && <p className="auth-field-error">{errors.confirm}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={busy}>
              {busy ? (
                <><span className="auth-btn-spinner"/>Creating account…</>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" className="auth-switch-link" onClick={onGoToLogin}>
              Sign in →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
