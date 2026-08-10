import React from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";

function RoutePage({ title, description }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white px-8 py-14 shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-red-500">PropertySerch</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">{description}</p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "Premium listings and curated inventory",
              "Transparent contact and verified details",
              "Faster decisions with structured deal flow",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-slate-700">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-extrabold text-white">
              Back to Home
            </Link>
            <Link to="/buy" className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-extrabold text-slate-700">
              Explore Buy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RoutePage;
