import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const THUMB_COUNT = 3;

function GridIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

// 1 large hero + up to 4 thumbnails, matching the site's card visual
// language (rounded corners, soft grey placeholders). Clicking any tile
// opens the full set in yet-another-react-lightbox's carousel/zoom viewer -
// the static grid here is just our own layout, the library owns the
// full-screen browsing experience.
function PropertyGallery({ images, title, heroOverlay }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const gallery = images && images.length ? images : [];
  if (gallery.length === 0) return null;

  const hero = gallery[0];
  const thumbs = gallery.slice(1, 1 + THUMB_COUNT);
  const remaining = Math.max(gallery.length - (1 + THUMB_COUNT), 0);

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 sm:h-[500px] sm:grid-cols-[816px_400px]">
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={`View photos of ${title}`}
          className="group relative h-[500px] overflow-hidden rounded-[16px] bg-transparent sm:row-span-2 sm:h-[500px] sm:w-[816px]"
        >
          <img
            src={hero}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          {heroOverlay}
        </button>

        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:col-start-2 sm:row-span-2 sm:h-[500px] sm:w-[400px]">
          {thumbs.map((src, i) => {
            const isLast = i === thumbs.length - 1;
            const showMore = isLast && remaining > 0;
            const tileClass =
              i === 0
                ? "sm:col-span-2 sm:row-span-1"
                : "sm:col-span-1 sm:row-span-1";
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => openAt(i + 1)}
                aria-label={showMore ? `View all ${gallery.length} photos` : `View photo ${i + 2} of ${title}`}
                className={`group relative h-full overflow-hidden rounded-[16px] bg-[#F3F4F6] ${tileClass}`}
              >
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                {showMore && (
                  <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-900/55 text-[13px] font-bold text-white">
                    <GridIcon />
                    {remaining}+ More
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={gallery.map((src) => ({ src, alt: title }))}
      />
    </>
  );
}

export default PropertyGallery;
