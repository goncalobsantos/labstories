"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import EnquiryForm from "@/components/EnquiryForm";
import { useLanguage } from "@/components/LanguageProvider";

/* ─── Letter-by-letter reveal ─── */
function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReduced ? 0 : 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: delay + i * stagger,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── Magnetic button ─── */
function MagneticButton({
  children,
  href,
  className = "",
  type,
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    },
    [prefersReduced]
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate(0, 0)";
    }
  }, []);

  const sharedProps = {
    ref: ref as React.RefObject<HTMLAnchorElement> & React.RefObject<HTMLButtonElement>,
    className: `magnetic-btn ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: { transition: "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)" },
  };

  if (href) {
    return (
      <a {...sharedProps} href={href} ref={ref as React.RefObject<HTMLAnchorElement>}>
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button
      {...sharedProps}
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type || "button"}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
}

/* ─── Scroll-reveal line ─── */
function ScrollRevealLine({
  children,
  progress,
  start,
  end,
}: {
  children: React.ReactNode;
  progress: import("framer-motion").MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [40, 0]);
  return (
    <motion.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </motion.div>
  );
}

/* ─── Page ─── */
export default function Home() {
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });
  const prefersReduced = useReducedMotion();
  const { t, toggle } = useLanguage();

  const marqueeItems = [
    t.marqueeEvents,
    t.marqueeWeddings,
    t.marqueePeople,
    t.marqueeBrands,
    t.marqueeEvents,
    t.marqueeWeddings,
    t.marqueePeople,
    t.marqueeBrands,
  ];

  /* Page load curtain */
  const [curtainVisible, setCurtainVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setCurtainVisible(false), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ─── Page Load Curtain ─── */}
      <motion.div
        className="page-curtain"
        initial={{ y: 0 }}
        animate={{ y: curtainVisible ? 0 : "-100%" }}
        transition={{ duration: prefersReduced ? 0 : 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />

      <div className="flex flex-col flex-1">
        {/* ─── Hero ─── */}
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-5 sm:px-6 text-center">
          {/* Language toggle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            onClick={toggle}
            className="absolute top-8 right-6 md:right-10 text-[0.65rem] uppercase tracking-[0.3em] text-taupe hover:text-charcoal transition-colors duration-300 cursor-pointer font-light z-10"
          >
            {t.langToggle}
          </motion.button>

          {/* Decorative top line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-border origin-top"
          />

          {/* Main title — letter by letter */}
          <h1 className="font-serif text-[3rem] sm:text-7xl md:text-8xl lg:text-9xl font-normal text-charcoal leading-[1.05] tracking-[-0.02em]">
            <SplitText text="LabStories" delay={0.4} stagger={0.05} />
          </h1>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 1.0 }}
            className="mt-6 flex items-center gap-4"
          >
            <span className="block w-8 h-px bg-border-dark" />
            <p className="text-sm md:text-base text-taupe font-light tracking-[0.08em]">
              {t.heroTagline}
            </p>
            <span className="block w-8 h-px bg-border-dark" />
          </motion.div>

          {/* CTA Button — magnetic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 1.4 }}
            className="mt-10 md:mt-14"
          >
            <MagneticButton
              href="#enquiry"
              className="px-10 py-4 border border-charcoal rounded-full text-xs uppercase tracking-[0.2em] font-medium text-charcoal"
            >
              {t.heroCta}
            </MagneticButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-taupe-light">
              {t.heroScroll}
            </span>
            <motion.span
              animate={prefersReduced ? {} : { y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="block w-px h-5 bg-taupe-light"
            />
          </motion.div>
        </section>

        {/* ─── Marquee ─── */}
        <div className="py-6 border-y border-border overflow-hidden">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-6 px-6 text-[0.7rem] uppercase tracking-[0.3em] text-taupe font-light whitespace-nowrap"
              >
                {item}
                <span className="block w-1 h-1 rounded-full bg-taupe-light" />
              </span>
            ))}
          </div>
        </div>

        {/* ─── Story Section ─── */}
        <section
          ref={storyRef}
          className="relative px-5 sm:px-6 text-center"
          style={{ minHeight: "300vh" }}
        >
          {/* Decorative top line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-border" />

          {/* Sticky container — centered on screen while scrolling */}
          <div className="sticky top-0 flex flex-col items-center justify-center min-h-[100dvh] py-16 md:py-24">
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
              <ScrollRevealLine progress={scrollYProgress} start={0.15} end={0.3}>
                <p className="font-serif text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-[1.1] tracking-[-0.02em]">
                  {t.storyLine1}
                </p>
              </ScrollRevealLine>

              <ScrollRevealLine progress={scrollYProgress} start={0.32} end={0.48}>
                <p className="font-serif text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-[1.1] tracking-[-0.02em]">
                  {t.storyLine2}
                </p>
              </ScrollRevealLine>

              <ScrollRevealLine progress={scrollYProgress} start={0.5} end={0.65}>
                <p className="font-serif text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-[1.1] tracking-[-0.02em]">
                  {t.storyLine3}
                </p>
              </ScrollRevealLine>
            </div>
          </div>

          {/* Decorative bottom line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-border" />
        </section>

        {/* ─── Enquiry Form ─── */}
        <section id="enquiry" className="relative py-20 md:py-32 px-5 sm:px-6 scroll-mt-8">
          {/* Top border line — expanding */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-border-dark origin-center"
          />

          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center mb-14"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.35em] text-taupe mb-4 font-light">
                {t.formSectionLabel}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-normal">
                {t.formSectionTitle}
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
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <a
                href="https://www.instagram.com/labstories.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-taupe hover:text-charcoal transition-colors duration-300"
              >
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
                <span className="text-xs uppercase tracking-[0.2em] font-light link-hover">
                  @labstories.studio
                </span>
              </a>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[0.65rem] uppercase tracking-[0.2em] text-taupe-light font-light"
            >
              &copy; {new Date().getFullYear()} LabStories. {t.footerRights}
            </motion.p>
          </div>
        </footer>
      </div>
    </>
  );
}
