"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function SectionRail() {
  const wrapRef = useRef<HTMLElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  /* ===== Klik titik: loncat ke section ===== */
  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(`#${id}`, { duration: 1.6 });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ===== Deteksi section aktif ===== */
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  /* ===== Persentase scroll ===== */
  useEffect(() => {
    const el = pctRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.textContent = String(Math.round(p * 100)).padStart(3, "0");
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ===== Muncul setelah loader selesai ===== */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    gsap.set(wrap, { opacity: 0, x: 24 });

    const show = () =>
      gsap.to(wrap, { opacity: 1, x: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });

    if (document.documentElement.dataset.loaded === "true") show();
    else window.addEventListener("loader:done", show, { once: true });

    return () => window.removeEventListener("loader:done", show);
  }, []);

  const progress = active / (SECTIONS.length - 1);

  return (
    <nav
      ref={wrapRef}
      aria-label="Navigasi section"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:right-8"
      style={{ opacity: 0 }}
    >
      <ul className="group/rail relative flex flex-col items-end gap-3">
        {/* Garis rel */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-[3px] top-3 w-px bg-white/15"
        />
        {/* Garis rel yang terisi */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-[3px] top-3 w-px origin-top bg-[#FF8000] shadow-[0_0_10px_rgba(255,128,0,0.8)] transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)]"
          style={{ transform: `scaleY(${progress})` }}
        />

        {SECTIONS.map((s, i) => {
          const isActive = i === active;
          const isPassed = i < active;

          return (
            <li key={s.id} className="h-6">
              <a
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id)}
                aria-label={`Ke ${s.label}`}
                aria-current={isActive ? "true" : undefined}
                className="group/item relative flex h-6 items-center gap-3"
              >
                {/* Label */}
                <span
                  className={`flex items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${
                    isActive
                      ? "translate-x-0 text-white opacity-100"
                      : "translate-x-2 text-white/60 opacity-0 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-hover/item:text-white"
                  }`}
                >
                  <span className="text-[#FF8000]">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.label}</span>
                </span>

                {/* Titik */}
                <span className="relative flex h-[7px] w-[7px] items-center justify-center">
                  {isActive && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#FF8000]/60" />
                  )}
                  <span
                    className={`relative block rounded-full border transition-all duration-500 ${
                      isActive
                        ? "h-[9px] w-[9px] border-[#FF8000] bg-[#FF8000] shadow-[0_0_12px_rgba(255,128,0,0.9)]"
                        : isPassed
                          ? "h-[7px] w-[7px] border-[#FF8000]/70 bg-[#0A0A0A]"
                          : "h-[7px] w-[7px] border-white/30 bg-[#0A0A0A] group-hover/item:border-white"
                    }`}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Persentase scroll */}
      <div className="mt-5 text-right font-display text-xs font-bold italic tabular-nums tracking-[0.1em] text-white/40">
        <span ref={pctRef}>000</span>
        <span className="text-[#FF8000]">%</span>
      </div>
    </nav>
  );
}