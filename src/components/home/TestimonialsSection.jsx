import React from "react";
import TestimonialCard from "../TestimonialCard";
import { testimonialCards } from "../../data/homeContent";

function TestimonialsSection() {
  return (
    <>
      <div className="h-10" />

      <div>
        <h3 className="text-[34px] font-black text-red-500">Testimonials</h3>
        <p className="mt-1 text-slate-500">Trusted by owners, buyers and institutions</p>
        <div className="mt-4 flex flex-wrap gap-4">
          {testimonialCards.map((item) => (
            <div key={item.name} className="min-w-[220px] flex-1">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TestimonialsSection;
