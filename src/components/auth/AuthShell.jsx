import React from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../SiteHeader";

function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-[440px] rounded-[28px] border border-slate-200 bg-white px-7 py-9 shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:px-9 sm:py-10">
          <Link
            to="/"
            className="inline-flex items-center font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold tracking-[-0.6px] text-[#E51C23]"
          >
            PropertySerch
          </Link>

          <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.24em] text-red-500">{eyebrow}</p>
          <h1 className="mt-2 text-[28px] font-black tracking-tight text-slate-950 sm:text-[32px]">{title}</h1>
          {subtitle ? <p className="mt-2 text-[14px] leading-6 text-slate-500">{subtitle}</p> : null}

          <div className="mt-7">{children}</div>

          {footer ? (
            <div className="mt-7 border-t border-slate-100 pt-5 text-center text-[14px] text-slate-500">{footer}</div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default AuthShell;
