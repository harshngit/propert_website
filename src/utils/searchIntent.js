// Turns the home hero's free-text inputs into API filters.

const TYPE_KEYWORDS = [
  [/flat|apartment|bhk|condo/i, "apartment"],
  [/villa|bungalow/i, "villa"],
  [/house|floor|kothi|independent/i, "independent_house"],
  [/plot|land/i, "plot"],
  [/farm/i, "farmhouse"],
  [/commercial|office|shop|retail|warehouse|showroom/i, "commercial"],
];

export function toPropertyType(text) {
  if (!text) return undefined;
  const hit = TYPE_KEYWORDS.find(([re]) => re.test(text));
  return hit ? hit[1] : undefined;
}

// "2 Cr", "85 L", "85 lakh", "5000000", "1-2 Cr" -> max budget in INR.
export function toMaxBudget(text) {
  if (!text) return undefined;
  const cleaned = String(text).toLowerCase().replace(/[₹,\s]|rs\.?|inr/g, "");
  const parts = cleaned.split(/-|to/);
  const last = parts[parts.length - 1];
  const unit = (last.match(/[a-z]+$/) || cleaned.match(/[a-z]+$/) || [""])[0];
  const n = parseFloat(last);
  if (!Number.isFinite(n)) return undefined;
  if (/^(cr|crore|crores)$/.test(unit)) return Math.round(n * 1e7);
  if (/^(l|lac|lacs|lakh|lakhs)$/.test(unit)) return Math.round(n * 1e5);
  if (/^(k|thousand)$/.test(unit)) return Math.round(n * 1e3);
  return Math.round(n);
}
