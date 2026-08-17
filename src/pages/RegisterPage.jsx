import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ fullName: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Enter your full name.";
    if (!form.email.trim() && !form.mobile.trim()) {
      e.email = "Add an email or mobile number.";
      e.mobile = "Add an email or mobile number.";
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email address.";
    }
    if (form.mobile.trim() && !/^[0-9+\s-]{7,15}$/.test(form.mobile.trim())) {
      e.mobile = "Enter a valid mobile number.";
    }
    if (!form.password || form.password.length < 8) e.password = "Use at least 8 characters.";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        password: form.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || "Could not create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Save searches, shortlist homes and get matched with verified listings faster."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-bold text-red-500 hover:text-red-600">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <AuthField
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Karan Mehta"
          value={form.fullName}
          onChange={set("fullName")}
          error={errors.fullName}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
          />
          <AuthField
            label="Mobile number"
            type="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            value={form.mobile}
            onChange={set("mobile")}
            error={errors.mobile}
          />
        </div>

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="At least 8 characters"
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

        <AuthField
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
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
          {submitting ? "Creating your account…" : "Create account"}
        </button>

        <p className="text-center text-[12px] leading-5 text-slate-400">
          By continuing you agree to PropertySerch's Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;
