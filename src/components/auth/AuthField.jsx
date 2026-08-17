import React from "react";

function AuthField({ label, error, endAdornment, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}</span>
      <span className="relative flex items-center">
        <input
          className={[
            "h-12 w-full rounded-2xl border bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/10",
            endAdornment ? "pr-16" : "",
            error ? "border-red-400" : "border-slate-200",
          ].join(" ")}
          {...props}
        />
        {endAdornment && <span className="absolute right-4">{endAdornment}</span>}
      </span>
      {error && <span className="mt-1.5 block text-[12px] font-medium text-red-500">{error}</span>}
    </label>
  );
}

export default AuthField;
