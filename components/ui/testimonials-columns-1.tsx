"use client";
import React from "react";
import { motion } from "framer-motion"; // Changed to framer-motion as it's more stable for version 12
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map((t, i) => (
                <div 
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 max-w-xs w-full"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-black">{t.initials}</span>
                    </div>
                    <div>
                      <div className="text-brand-primary font-bold text-xs">{t.name}</div>
                      <div className="text-gray-400 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
