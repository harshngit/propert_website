import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";

const RESEND_COOLDOWN_SECONDS = 30;

function PasswordLoginForm({ from }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    </form>
  );
}

function OtpLoginForm({ from }) {
  const { sendLoginOtp, loginWithOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("mobile"); // mobile | otp
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const sendOtp = async (event) => {
    event?.preventDefault();
    setFormError("");
    if (!mobile.trim()) {
      setErrors({ mobile: "Enter your registered mobile number." });
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await sendLoginOtp(mobile.trim());
      setStep("otp");
      startCooldown();
    } catch (err) {
      setFormError(err.message || "Could not send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!otp.trim()) {
      setErrors({ otp: "Enter the OTP sent to your mobile." });
      return;
    }
    setErrors({});
    setVerifying(true);
    try {
      await loginWithOtp({ identifier: mobile.trim(), otp: otp.trim() });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (step === "mobile") {
    return (
      <form onSubmit={sendOtp} className="space-y-4" noValidate>
        <AuthField
          label="Mobile Number"
          type="tel"
          autoComplete="tel"
          placeholder="Enter your registered mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={errors.mobile}
        />

        {formError ? (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          className="cta-red mt-2 inline-flex h-12 w-full items-center justify-center rounded-[12px] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(229,28,35,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className="space-y-4" noValidate>
      <p className="text-[13px] text-[#6B7280]">
        OTP sent to <span className="font-semibold text-[#111827]">{mobile}</span>.{" "}
        <button
          type="button"
          onClick={() => {
            setStep("mobile");
            setOtp("");
            setFormError("");
          }}
          className="font-semibold text-[#E51C23] hover:text-red-600"
        >
          Change number
        </button>
      </p>

      <AuthField
        label="Enter OTP"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="6-digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        error={errors.otp}
      />

      {formError ? (
        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={verifying}
        className="cta-red mt-2 inline-flex h-12 w-full items-center justify-center rounded-[12px] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(229,28,35,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {verifying ? "Verifying..." : "Verify & Log In"}
      </button>

      <button
        type="button"
        onClick={sendOtp}
        disabled={cooldown > 0 || sending}
        className="w-full text-center text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] disabled:cursor-not-allowed disabled:text-[#D1D5DB]"
      >
        {cooldown > 0 ? `Resend OTP in ${cooldown}s` : sending ? "Resending..." : "Resend OTP"}
      </button>
    </form>
  );
}

function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const [mode, setMode] = useState("password"); // password | otp
  const [googleError, setGoogleError] = useState("");

  const handleGoogleCredential = async (idToken) => {
    setGoogleError("");
    try {
      await loginWithGoogle(idToken);
      navigate(from, { replace: true });
    } catch (err) {
      setGoogleError(err.message || "Could not sign in with Google.");
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
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-[12px] bg-[#F3F4F6] p-1">
        {[
          { key: "password", label: "Email & Password" },
          { key: "otp", label: "Phone & OTP" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMode(tab.key)}
            className={[
              "h-10 rounded-[10px] text-[13px] font-bold transition",
              mode === tab.key ? "bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.08)]" : "text-[#6B7280]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "password" ? <PasswordLoginForm from={from} /> : <OtpLoginForm from={from} />}

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[12px] text-[#9CA3AF]">Or login with</span>
        <span className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      {googleError ? (
        <p className="mb-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
          {googleError}
        </p>
      ) : null}

      <GoogleLoginButton onCredential={handleGoogleCredential} />
    </AuthShell>
  );
}

export default LoginPage;
