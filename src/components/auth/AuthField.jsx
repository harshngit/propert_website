import React from "react";

function AuthField({ label, error, endAdornment, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-bold text-[#111827]">{label}</span>
      <span className="relative flex items-center">
        <input
          className={[
            "h-10 w-full rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[14px] text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-red-400 focus:ring-4 focus:ring-red-500/10",
            endAdornment ? "pr-16" : "",
            error ? "border-red-400" : "",
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
