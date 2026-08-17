import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) e.identifier = "Enter your email or mobile number.";
    if (!form.password) e.password = "Enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login({ identifier: form.identifier.trim(), password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || "Could not sign in. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Pick up your saved searches, shortlists and enquiries right where you left off."
      footer={
        <>
          New to PropertySerch?{" "}
          <Link to="/register" state={location.state} className="font-bold text-red-500 hover:text-red-600">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <AuthField
          label="Email or mobile number"
          type="text"
          autoComplete="username"
          placeholder="you@email.com or 98765 43210"
          value={form.identifier}
          onChange={set("identifier")}
          error={errors.identifier}
        />

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-[12px] font-bold uppercase tracking-[0.04em] text-slate-400 hover:text-slate-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />

        {formError ? (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="cta-red mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(229,28,35,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
