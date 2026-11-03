import React, { useEffect, useRef, useState } from "react";
import { loadLeaflet, TILES } from "./MapPicker";

// The real listings on the map view. Positions are the approximate public
// coordinates (exact addresses stay private). Clicking a pin opens its listing.
export default function ResultsMap({ items = [] }) {
  const box = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const [failed, setFailed] = useState(false);
  const pinned = items.filter((p) => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)) && p.latitude != null);

  useEffect(() => {
    let gone = false;
    loadLeaflet()
      .then((L) => {
        if (gone || !box.current) return;
        if (!map.current) {
          map.current = L.map(box.current, { scrollWheelZoom: false }).setView([22.6, 79.0], 5);
          L.tileLayer(TILES, { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(map.current);
          layer.current = L.layerGroup().addTo(map.current);
        }
        layer.current.clearLayers();
        const points = pinned.map((p) => [Number(p.latitude), Number(p.longitude)]);
        pinned.forEach((p, i) => {
          const icon = L.divIcon({
            className: "",
            html: `<span style="display:inline-block;transform:translate(-50%,-50%);white-space:nowrap;border-radius:999px;background:#fff;padding:3px 9px;font:700 12px sans-serif;color:#111827;box-shadow:0 1px 4px rgba(0,0,0,.3)">${String(p.price || "").replace(/[<>&]/g, "")}</span>`,
          });
          L.marker(points[i], { icon, title: p.title }).on("click", () => { window.location.assign(`/properties/${p.id}`); }).addTo(layer.current);
        });
        if (points.length) map.current.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
      })
      .catch(() => !gone && setFailed(true));
    return () => {
      gone = true;
    };
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    if (map.current) map.current.remove();
    map.current = null;
  }, []);

  if (failed) return <div className="flex min-h-[400px] items-center justify-center rounded-[12px] bg-[#F3F4F6] text-[14px] text-[#6B7280]">The map could not be loaded.</div>;
  return (
    <div className="relative min-h-[600px] w-full overflow-hidden rounded-[12px] xl:min-h-[821px]">
      <div ref={box} className="absolute inset-0" />
      {!pinned.length && <div className="absolute inset-x-0 top-4 z-[500] mx-auto w-fit rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#374151] shadow">None of these listings has a map location yet</div>}
    </div>
  );
}
