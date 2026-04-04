"use client";
import React from "react";
import { motion } from "framer-motion";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
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
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-8 rounded-3xl border shadow-lg bg-card/40 backdrop-blur-sm border-white/10 dark:border-zinc-800 max-w-xs w-full flex flex-col justify-between h-fit hover:border-pink-500/30 transition-colors" 
                  key={`${index}-${i}`}
                >
                  <div className="text-foreground dark:text-zinc-200 text-sm leading-relaxed italic overflow-hidden">
                    "{text}"
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <div className="h-10 w-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 text-sm font-semibold uppercase shrink-0">
                      {name.charAt(0)}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="font-semibold text-foreground dark:text-white tracking-tight text-sm leading-tight">
                        {name}
                      </div>
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
