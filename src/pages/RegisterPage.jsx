import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";
import { useAuth } from "../context/AuthContext";

const LEFT_FEATURES = [
  {
    title: "Save Properties",
    description: "Save your favourite properties and find them easily later",
  },
  {
    title: "Get Better Matches",
    description: "See properties that match what you're looking for",
  },
  {
    title: "Track Your Enquiries",
    description: "Keep all your property enquiries in one place",
  },
  {
    title: "Manage Site Visits",
    description: "Book and keep track of your property visits",
  },
  {
    title: "Connect Safely",
    description: "Contact property professionals without sharing your details publicly",
  },
];

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
  const [role, setRole] = useState("Buyer/Tenant/Owner");
  const [agreed, setAgreed] = useState(true);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!form.email.trim() && !form.mobile.trim()) {
      nextErrors.email = "Add an email or mobile number.";
      nextErrors.mobile = "Add an email or mobile number.";
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (form.mobile.trim() && !/^[0-9+\s-]{7,15}$/.test(form.mobile.trim())) {
      nextErrors.mobile = "Enter a valid mobile number.";
    }
    if (!form.password || form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords don't match.";
    if (!agreed) nextErrors.agreed = "Please agree to continue.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
        role,
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
      leftTitle="Log in or create your account"
      leftSubtitle="Create a free PropertySerch account to get more from every search."
      features={LEFT_FEATURES}
      cardKicker="Get started"
      cardTitle="Sign Up"
      cardBadge="Create your account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-[#E51C23] hover:text-red-600">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <div className="mb-2 text-[13px] font-semibold text-[#111827]">I am</div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[#374151]">
            {["Buyer/Tenant/Owner", "Agent", "Builder"].map((item) => (
              <label key={item} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="registerRole"
                  value={item}
                  checked={role === item}
                  onChange={() => setRole(item)}
                  className="h-4 w-4 accent-[#E51C23]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <AuthField
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={set("fullName")}
          error={errors.fullName}
        />

        <AuthField
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
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

        <AuthField
          label="Mobile Number"
          type="tel"
          autoComplete="tel"
          placeholder="Enter your mobile number"
          value={form.mobile}
          onChange={set("mobile")}
          error={errors.mobile}
        />

        {/* <AuthField
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
        /> */}

        <label className="flex items-start gap-2 pt-1 text-[12px] leading-5 text-[#6B7280]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-[3px] border-[#E51C23] accent-[#E51C23]"
          />
          <span>
            I agree to the{" "}
            <span className="text-[#E51C23]">
              Terms &amp; Conditions, Privacy and Cookie Policy
            </span>
          </span>
        </label>
        {errors.agreed ? <p className="text-[12px] font-medium text-red-500">{errors.agreed}</p> : null}

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
          {submitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;
