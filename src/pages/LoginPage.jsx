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
  const [role, setRole] = useState("Buyer/Tenant/Owner");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.identifier.trim()) nextErrors.identifier = "Enter your email or mobile number.";
    if (!form.password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login({ identifier: form.identifier.trim(), password: form.password, role });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || "Could not sign in. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      leftTitle="Log in or create your account"
      leftSubtitle="Create a free PropertySerch account to get more from every search."
      cardKicker="Welcome back"
      cardTitle="Log In"
      cardBadge="Quick access"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" state={location.state} className="font-semibold text-[#E51C23] hover:text-red-600">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <div className="mb-2 text-[13px] font-semibold text-[#111827]">Are you</div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[#374151]">
            {["Buyer/Tenant/Owner", "Agent", "Builder"].map((item) => (
              <label key={item} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="loginRole"
                  value={item}
                  checked={role === item}
                  onChange={() => setRole(item)}
                  className="h-[18px] w-[18px] accent-[#E51C23] sm:h-4 sm:w-4"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <AuthField
          label="Email ID or Mobile Number"
          type="text"
          autoComplete="username"
          placeholder="Enter your email address or mobile number"
          value={form.identifier}
          onChange={set("identifier")}
          error={errors.identifier}
        />

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] hover:text-[#6B7280]"
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
          className="cta-red mt-2 inline-flex h-12 w-full items-center justify-center rounded-[12px] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(229,28,35,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-[12px] text-[#9CA3AF]">Or login with</span>
          <span className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#374151]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M21.8 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h5.48a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.06-4.4 3.06-7.66Z"
              fill="#4285F4"
            />
            <path
              d="M12 22c2.75 0 5.06-.91 6.75-2.47l-3.3-2.56c-.91.61-2.08.98-3.45.98-2.65 0-4.9-1.79-5.71-4.2H2.88v2.64A10 10 0 0 0 12 22Z"
              fill="#34A853"
            />
            <path
              d="M6.29 13.75A5.99 5.99 0 0 1 6 12c0-.61.1-1.2.29-1.75V7.61H2.88A10 10 0 0 0 2 12c0 1.61.38 3.13 1.04 4.39l3.25-2.64Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.99c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.05 2.92 14.74 2 12 2A10 10 0 0 0 2.88 7.61l3.41 2.64C7.09 7.78 9.35 5.99 12 5.99Z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
