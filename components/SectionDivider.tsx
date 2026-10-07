"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Props = {
  sector: string; // contoh: "S2"
  label: string; // contoh: "Skills"
  delta: string; // contoh: "Δ −0.214"
};

export default function SectionDivider({ sector, label, delta }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const textEl = root.querySelector<HTMLElement>(".div-text");

      gsap.set(".div-line", { scaleX: 0 });
      gsap.set(".div-chip", { opacity: 0, scale: 0.85 });
      gsap.set(".div-glow", { opacity: 0 });

      /* Garis melebar dari tengah, mengikuti scroll */
      gsap.to(".div-line", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 95%",
          end: "top 45%",
          scrub: 0.5,
        },
      });

      /* Chip muncul + kilatan + teks ngacak (sekali saja) */
      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".div-chip", { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" });
          gsap.fromTo(
            ".div-glow",
            { opacity: 0 },
            { opacity: 1, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" }
          );

          if (textEl) {
            const final = label;
            const st = { p: 0 };
            gsap.to(st, {
              p: 1,
              duration: 0.8,
              ease: "none",
              onUpdate: () => {
                const reveal = Math.floor(st.p * final.length);
                textEl.textContent = Array.from(final)
                  .map((c, i) =>
                    i < reveal || c === " "
                      ? c
                      : POOL[Math.floor(Math.random() * POOL.length)]
                  )
                  .join("");
              },
              onComplete: () => {
                textEl.textContent = final;
              },
            });
          }
        },
      });
    }, root);

    return () => ctx.revert();
  }, [label]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none relative z-20 h-0"
    >
      {/* Kilatan cahaya */}
      <div className="div-glow absolute inset-x-0 -top-8 h-16 bg-[radial-gradient(ellipse_at_center,rgba(255,128,0,0.5),transparent_70%)]" />

      {/* Garis oranye */}
      <div className="div-line absolute inset-x-0 top-0 h-[2px] origin-center bg-[#FF8000] shadow-[0_0_16px_2px_rgba(255,128,0,0.7)]" />

      {/* Chip sektor */}
      <div className="div-chip absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 whitespace-nowrap border border-white/10 bg-[#0A0A0A] px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] md:text-[10px]">
        <span className="bg-[#FF8000] px-2 py-0.5 font-bold text-black">{sector}</span>
        <span className="div-text text-white">{label}</span>
        <span className="hidden text-[#FF8000] sm:inline">{delta}</span>
      </div>
    </div>
  );
}