import React from "react";

function TrendChart({ values, labels }) {
  const width = 520;
  const height = 230;
  const leftPad = 22;
  const rightPad = 12;
  const topPad = 12;
  const bottomPad = 32;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(maxValue - minValue, 1);

  const points = values
    .map((value, index) => {
      const x = leftPad + (plotWidth / (values.length - 1 || 1)) * index;
      const normalized = (value - minValue) / range;
      const y = topPad + plotHeight - normalized * plotHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const tickLabels = ["0", "10k", "20k", "30k", "40k"];

  return (
    <div className="relative h-[320px] w-full">
      <div className="absolute left-0 top-0 h-full w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 flex-col justify-between pb-8 pt-8 text-[11px] text-[#6B7280]">
          {tickLabels.map((label) => (
            <span key={label} className="block text-right">
              {label}
            </span>
          ))}
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {yTicks.map((tick, index) => {
            const y = topPad + plotHeight - tick * plotHeight;
            return (
              <line
                key={tick}
                x1={leftPad}
                y1={y}
                x2={width - rightPad}
                y2={y}
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            );
          })}
          {labels.map((label, index) => {
            const x = leftPad + (plotWidth / (labels.length - 1 || 1)) * index;
            return (
              <g key={label}>
                <line
                  x1={x}
                  y1={topPad}
                  x2={x}
                  y2={height - bottomPad}
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <text x={x} y={height - 10} textAnchor="middle" className="fill-[#6B7280]" fontSize="11">
                  {label}
                </text>
              </g>
            );
          })}
          <polyline
            fill="none"
            stroke="#E51C23"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {values.map((value, index) => {
            const x = leftPad + (plotWidth / (values.length - 1 || 1)) * index;
            const normalized = (value - minValue) / range;
            const y = topPad + plotHeight - normalized * plotHeight;
            return <circle key={`${value}-${index}`} cx={x} cy={y} r="4" fill="#E51C23" />;
          })}
          <polygon
            points={`${leftPad},${topPad + plotHeight} ${points.replace(/\s+/g, " ").split(" ").join(" ")} ${width - rightPad},${
              topPad + plotHeight
            }`}
            fill="rgba(229,28,35,0.06)"
          />
        </svg>
      </div>
    </div>
  );
}

function DemandSupplyChart({ labels, demand, supply }) {
  const width = 520;
  const height = 230;
  const leftPad = 26;
  const rightPad = 18;
  const topPad = 14;
  const bottomPad = 34;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;
  const maxValue = Math.max(...demand, ...supply, 1);
  const barGroupWidth = plotWidth / labels.length;
  const barWidth = 28;
  const gap = 4;

  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="relative h-[320px] w-full">
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-8 flex-col justify-between pb-8 pt-7 text-[11px] text-[#6B7280]">
          {ticks.map((tick) => (
            <span key={tick} className="block text-right">
              {tick}
            </span>
          ))}
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {ticks.map((tick) => {
            const y = topPad + plotHeight - (tick / maxValue) * plotHeight;
            return (
              <line
                key={tick}
                x1={leftPad}
                y1={y}
                x2={width - rightPad}
                y2={y}
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            );
          })}
          {labels.map((label, index) => {
            const groupCenter = leftPad + barGroupWidth * index + barGroupWidth / 2;
            const demandHeight = (demand[index] / maxValue) * plotHeight;
            const supplyHeight = (supply[index] / maxValue) * plotHeight;
            const baseY = topPad + plotHeight;
            return (
              <g key={label}>
                <rect
                  x={groupCenter - barWidth - gap / 2}
                  y={baseY - demandHeight}
                  width={barWidth}
                  height={demandHeight}
                  fill="#111827"
                />
                <rect
                  x={groupCenter + gap / 2}
                  y={baseY - supplyHeight}
                  width={barWidth}
                  height={supplyHeight}
                  fill="#E51C23"
                />
                <text x={groupCenter} y={height - 10} textAnchor="middle" className="fill-[#6B7280]" fontSize="11">
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function MarketInsightsSection({
  cityLabel,
  subtitle = "Real-time data for informed investment decisions",
  trendTitle = "Price Appreciation Trend (Past 5 Years)",
  comparisonTitle = "Demand vs Supply Index (By Locality)",
  toggleOptions = ["Commercial", "Residential"],
  localityLabels = [],
  trendYears = ["2019", "2020", "2021", "2022", "2023", "2024"],
  trendValues = [32000, 31500, 34000, 38500, 42000, 48500],
  demandValues = [85, 95, 78, 88, 70],
  supplyValues = [60, 82, 55, 75, 88],
  stats = [
    { label: "Annual Appreciation", value: "+8.4%" },
    { label: "Estimated Rent", value: "₹1.2L / mo" },
    { label: "Locality Rating", value: "4.5 ★" },
  ],
}) {
  const [activeTab, setActiveTab] = React.useState("Residential");
  const labels = localityLabels.length ? localityLabels.slice(0, 5) : ["Worli", "Andheri", "Bandra", "Powai", "Malad"];

  return (
    <section className="mx-auto w-full max-w-[1440px]">
      <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:px-8 sm:py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[30px] font-black leading-tight text-[#111827] sm:text-[34px]">
              {cityLabel} Market Insights
            </h2>
            <p className="mt-1 text-[16px] leading-6 text-[#6B7280]">{subtitle}</p>
          </div>

          <div className="inline-flex rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            {toggleOptions.map((option) => {
              const active = activeTab === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveTab(option)}
                  className={[
                    "rounded-[8px] px-3 py-2 text-[13px] font-medium transition",
                    active ? "bg-[#F3F4F6] text-[#111827]" : "bg-transparent text-[#475569]",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <h3 className="text-[20px] font-bold leading-tight text-[#111827]">{trendTitle}</h3>
            <div className="mt-6">
              <TrendChart values={trendValues} labels={trendYears} />
            </div>
          </article>

          <article className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <h3 className="text-[20px] font-bold leading-tight text-[#111827]">{comparisonTitle}</h3>
            <div className="mt-6">
              <DemandSupplyChart labels={labels} demand={demandValues} supply={supplyValues} />
              <div className="mt-3 flex items-center gap-6 pl-2 text-[12px] text-[#6B7280]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 bg-[#111827]" aria-hidden="true" />
                  Demand
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 bg-[#E51C23]" aria-hidden="true" />
                  Supply
                </span>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}

export default MarketInsightsSection;
