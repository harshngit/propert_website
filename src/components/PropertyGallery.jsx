import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const THUMB_COUNT = 3;

function PhotoStackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#111827]" fill="none">
      <rect x="2" y="2" width="13" height="10" rx="1.6" fill="white" stroke="currentColor" strokeWidth="1.3" />
      <rect x="5" y="6.5" width="13" height="10" rx="1.6" fill="white" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8.5" cy="10" r="1" fill="currentColor" />
      <path d="m6 15 3-3.2 2.2 2 2.3-2.6L17 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="grid w-full grid-cols-1 gap-4 lg:h-[500px] lg:grid-cols-[2fr_1fr]">
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={`View photos of ${title}`}
          className="group relative h-[260px] w-full overflow-hidden rounded-[16px] bg-transparent lg:row-span-2 lg:h-[500px]"
        >
          <img
            src={hero}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          {heroOverlay}
        </button>

        <div className="grid h-[260px] grid-cols-2 grid-rows-2 gap-4 lg:col-start-2 lg:row-span-2 lg:h-[500px] lg:w-full">
          {thumbs.map((src, i) => {
            const isLast = i === thumbs.length - 1;
            const showMore = isLast && remaining > 0;
            const tileClass =
              i === 0
                ? "col-span-2 row-span-1"
                : "col-span-1 row-span-1";
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
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-[14px] font-bold text-[#111827] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                      <PhotoStackIcon />
                      {remaining}+ More
                    </span>
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
