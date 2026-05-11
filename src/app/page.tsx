"use client";

import { motion } from "framer-motion";
import EnquiryForm from "@/components/EnquiryForm";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      delay,
    },
  }),
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-5 sm:px-6 text-center">
        {/* Decorative thin line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-border origin-top"
        />

        <motion.p
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[0.7rem] uppercase tracking-[0.35em] text-taupe mb-6 font-light"
        >
          Life Creation Studio
        </motion.p>

        <motion.h1
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl font-normal text-charcoal leading-[1.1] tracking-[-0.02em]"
        >
          LabStories
        </motion.h1>

        <motion.div
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 flex items-center gap-4"
        >
          <span className="block w-8 h-px bg-border-dark" />
          <p className="text-sm md:text-base text-taupe font-light tracking-[0.08em]">
            Building our story
          </p>
          <span className="block w-8 h-px bg-border-dark" />
        </motion.div>

        {/* Scroll indicator — clickable */}
        <motion.a
          href="#enquiry"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-taupe-light group-hover:text-taupe transition-colors duration-300">
            Enquire
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="block w-px h-5 bg-taupe-light group-hover:bg-taupe transition-colors duration-300"
          />
        </motion.a>
      </section>

      {/* ─── Enquiry Form ─── */}
      <section id="enquiry" className="relative py-20 md:py-32 px-5 sm:px-6 scroll-mt-8">
        {/* Top border line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-border-dark" />

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-14"
          >
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-taupe mb-4 font-light">
              Get in touch
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-normal">
              Drop your enquiry below
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <EnquiryForm />
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-10 md:py-12 px-5 sm:px-6 border-t border-border">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <a
            href="https://www.instagram.com/labstories.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-taupe hover:text-charcoal transition-colors duration-300"
          >
            {/* Instagram icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:scale-105"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-xs uppercase tracking-[0.2em] font-light">
              @labstories.studio
            </span>
          </a>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-taupe-light font-light">
            &copy; {new Date().getFullYear()} LabStories. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
