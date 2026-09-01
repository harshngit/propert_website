import React from "react";

function TrendChart({ values, labels }) {
  const width = 520;
  const height = 280;
  const leftPad = 40;
  const rightPad = 28;
  const topPad = 14;
  const bottomPad = 36;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;
  const maxValue = 50000;
  const minValue = 0;
  const range = maxValue - minValue;
  const xCount = Math.max(labels.length - 1, 1);
  const yTickValues = [50000, 40000, 30000, 20000, 10000];
  const yTickLabels = ["50k", "40k", "30k", "20k", "10k"];

  const points = values
    .map((value, index) => {
      const x = leftPad + (plotWidth / xCount) * index;
      const normalized = (value - minValue) / range;
      const y = topPad + plotHeight - normalized * plotHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative h-[220px] w-full sm:h-[300px]">
      <div className="absolute left-0 top-0 h-full w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {yTickValues.map((tick, index) => {
            const y = topPad + plotHeight - ((tick - minValue) / range) * plotHeight;
            return (
              <g key={tick}>
                <line x1={leftPad} y1={y} x2={width - rightPad} y2={y} stroke="#F3F4F6" strokeWidth="1" />
                <text x={leftPad - 6} y={y + 4} textAnchor="end" className="fill-[#6B7280]" fontSize="11">
                  {yTickLabels[index]}
                </text>
              </g>
            );
          })}
          {labels.map((label, index) => {
            const x = leftPad + (plotWidth / xCount) * index;
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
            const x = leftPad + (plotWidth / xCount) * index;
            const normalized = (value - minValue) / range;
            const y = topPad + plotHeight - normalized * plotHeight;
            return <circle key={`${value}-${index}`} cx={x} cy={y} r="4" fill="#E51C23" />;
          })}
          <polygon
            points={`${leftPad},${topPad + plotHeight} ${points} ${width - rightPad},${topPad + plotHeight}`}
            fill="rgba(229,28,35,0.06)"
          />
        </svg>
      </div>
    </div>
  );
}

function DemandSupplyChart({ labels, demand, supply, mobileLarge = false }) {
  const width = 520;
  const height = 230;
  const leftPad = 42;
  const rightPad = 18;
  const topPad = 14;
  const bottomPad = 34;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;
  const maxValue = 100;
  const barGroupWidth = plotWidth / labels.length;
  const barWidth = 28;
  const gap = 4;

  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <div className={`relative w-full ${mobileLarge ? "h-[204.47px] sm:h-[320px]" : "h-[320px]"}`}>
      <div className="absolute inset-0">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          {ticks.map((tick) => {
            const y = topPad + plotHeight - (tick / maxValue) * plotHeight;
            return (
              <g key={tick}>
                <line x1={leftPad} y1={y} x2={width - rightPad} y2={y} stroke="#F3F4F6" strokeWidth="1" />
                <text x={leftPad - 6} y={y + 4} textAnchor="end" className="fill-[#6B7280]" fontSize="11">
                  {tick}
                </text>
              </g>
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
  mobileCityLayout = false,
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
      <div className={`rounded-[28px] border border-[#E5E7EB] bg-white  py-8 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:px-8 sm:py-10 ${mobileCityLayout ? "rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-[28px] sm:border-[#E5E7EB] sm:bg-white sm:p-8 sm:shadow-[0_10px_24px_rgba(15,23,42,0.05)]" : ""}`}>
        <div className={`flex items-start justify-between gap-4 ${mobileCityLayout ? "flex-col sm:flex-row" : ""}`}>
          <div className={mobileCityLayout ? "min-w-0 max-w-none" : ""}>
            <h2 className={`font-black leading-tight text-[#111827] ${mobileCityLayout ? "text-[30px] sm:text-[34px]" : "text-[30px] sm:text-[34px]"}`}>
              {cityLabel} Market Insights
            </h2>
            <p className={`mt-1 leading-6 text-[#6B7280] ${mobileCityLayout ? "max-w-none text-[16px] sm:text-[16px] sm:leading-6" : "text-[16px]"}`}>{subtitle}</p>
          </div>

          <div className={`inline-flex shrink-0 rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.06)] ${mobileCityLayout ? "self-end sm:shrink-0 sm:self-auto" : ""}`}>
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

        <div className={`grid gap-6 ${mobileCityLayout ? "mt-4 sm:mt-8" : "mt-8"} lg:grid-cols-2`}>
          <article className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <h3 className="text-[16px] font-bold leading-tight text-[#111827] sm:text-[20px]">{trendTitle}</h3>
            <div className="mt-6">
              <TrendChart values={trendValues} labels={trendYears} />
            </div>
          </article>

          <article className={`rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${mobileCityLayout ? "mx-auto h-[284.44px] w-[366px] rounded-[16.36px] border-[0.68px] border-[#F3F4F6] p-[21.81px] shadow-[0_0.68px_1.36px_rgba(0,0,0,0.05)] sm:mx-0 sm:h-auto sm:w-auto sm:rounded-[24px] sm:border sm:border-[#E5E7EB] sm:p-6 sm:shadow-[0_10px_24px_rgba(15,23,42,0.05)]" : ""}`}>
            <h3 className="text-[16px] font-bold leading-tight text-[#111827] sm:text-[20px]">{comparisonTitle}</h3>
            <div className={mobileCityLayout ? "mt-[16.36px] sm:mt-6" : "mt-6"}>
              <DemandSupplyChart labels={labels} demand={demandValues} supply={supplyValues} mobileLarge={mobileCityLayout} />
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
