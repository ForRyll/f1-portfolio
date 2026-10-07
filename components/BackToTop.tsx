"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

const R = 28;
const CIRC = 2 * Math.PI * R;
const SHOW_AFTER = 500; // px scroll sebelum tombol muncul

export default function BackToTop() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const carRef = useRef<HTMLSpanElement>(null);
  const flameRef = useRef<HTMLSpanElement>(null);

  const visibleRef = useRef(false);
  const busyRef = useRef(false);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  /* ========== ANIMASI PELUNCURAN ========== */
  const launch = useCallback(() => {
    const wrap = wrapRef.current;
    const car = carRef.current;
    const flame = flameRef.current;
    if (!wrap || !car || !flame || busyRef.current) return;

    const goTop = (duration: number) => {
      const l = lenisRef.current;
      if (l) l.scrollTo(0, { duration });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      window.scrollTo(0, 0);
      return;
    }

    busyRef.current = true;

    // Makin jauh scroll-nya, makin lama perjalanannya (maks 3 detik)
    const duration = Math.min(3, 1.4 + window.scrollY / 7000);
    const streaks = wrap.querySelectorAll(".btt-streak");

    gsap
      .timeline()
      // 1. Mobil getar (ngegas)
      .to(car, { x: 1.5, duration: 0.04, repeat: 9, yoyo: true, ease: "none" })
      .set(car, { x: 0 })
      // 2. Api knalpot menyala
      .to(flame, { opacity: 1, scaleY: 1.6, duration: 0.15, ease: "power2.out" }, 0.1)
      // 3. Halaman mulai scroll ke atas
      .add(() => goTop(duration), 0.38)
      // 4. Mobil melesat keluar
      .to(car, { y: -90, duration: 0.7, ease: "power3.in" }, 0.38)
      .to(car, { opacity: 0, duration: 0.2 }, 0.88)
      // 5. Speed lines turun
      .fromTo(
        streaks,
        { yPercent: -130, opacity: 0.9 },
        {
          yPercent: 130,
          opacity: 0,
          duration: 0.45,
          stagger: 0.07,
          repeat: 2,
          ease: "power1.in",
        },
        0.38
      );

    // 6. Setelah sampai atas, mobil muncul lagi dari bawah
    gsap.delayedCall(duration * 0.9, () => {
      gsap.set(flame, { opacity: 0, scaleY: 0.4 });
      gsap.fromTo(
        car,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            busyRef.current = false;
          },
        }
      );
    });
  }, []);

  /* ========== SCROLL: PROGRES CINCIN + MUNCUL/HILANG ========== */
  useEffect(() => {
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    if (!wrap || !ring) return;

    gsap.set(wrap, { y: 100, autoAlpha: 0 });
    gsap.set(carRef.current, { clearProps: "all" });
    gsap.set(flameRef.current, { opacity: 0, scaleY: 0.4 });

    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(y / max, 1) : 0;

      ring.style.strokeDashoffset = String(CIRC * (1 - p));

      const show = y > SHOW_AFTER;
      if (show !== visibleRef.current) {
        visibleRef.current = show;
        gsap.to(wrap, {
          y: show ? 0 : 100,
          autoAlpha: show ? 1 : 0,
          duration: 0.5,
          ease: show ? "back.out(1.6)" : "power3.in",
          overwrite: "auto",
        });
      }
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

  /* ========== SHORTCUT KEYBOARD: tekan T ========== */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "t") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);
      if (typing) return;

      if (window.scrollY > 200) launch();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launch]);

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-5 right-5 z-50 md:bottom-8 md:right-8"
      style={{ visibility: "hidden" }}
    >
      <button
        type="button"
        onClick={launch}
        aria-label="Kembali ke atas"
        className="group relative block h-16 w-16 rounded-full"
      >
        {/* Label tooltip (desktop) */}
        <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap border border-white/10 bg-[#0A0A0A]/90 px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
          Ke atas <span className="ml-1 text-[#FF8000]">T</span>
        </span>

        {/* Lingkaran dasar */}
        <span className="absolute inset-0 overflow-hidden rounded-full border border-white/15 bg-[#0A0A0A]/85 backdrop-blur-md transition-colors duration-300 group-hover:border-[#FF8000]/60">
          {/* Speed lines */}
          <span className="btt-streak absolute left-[22%] top-0 h-6 w-px bg-[#FF8000] opacity-0" />
          <span className="btt-streak absolute left-1/2 top-0 h-8 w-px bg-white opacity-0" />
          <span className="btt-streak absolute left-[78%] top-0 h-6 w-px bg-[#FF8000] opacity-0" />
        </span>

        {/* Cincin progres scroll */}
        <svg
          viewBox="0 0 64 64"
          className="pointer-events-none absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <circle
            ref={ringRef}
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="#FF8000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
          />
        </svg>

        {/* Mobil F1 (tampak atas, menghadap ke atas) */}
        <span
          ref={carRef}
          className="absolute left-1/2 top-1/2 -ml-[9px] -mt-[17px] block h-[34px] w-[18px] text-white transition-colors duration-300 group-hover:text-[#FF8000]"
        >
          <svg viewBox="0 0 24 44" className="h-full w-full" fill="currentColor" aria-hidden="true">
            {/* sayap depan */}
            <rect x="2" y="3" width="20" height="3" rx="1" />
            {/* badan + hidung */}
            <path d="M12 3 L14 14 L16 20 L16 34 L8 34 L8 20 L10 14 Z" />
            {/* ban depan */}
            <rect x="2" y="12" width="4" height="8" rx="1" />
            <rect x="18" y="12" width="4" height="8" rx="1" />
            {/* ban belakang */}
            <rect x="1.5" y="28" width="5" height="10" rx="1" />
            <rect x="17.5" y="28" width="5" height="10" rx="1" />
            {/* sayap belakang */}
            <rect x="3" y="39" width="18" height="3" rx="1" />
            {/* kokpit */}
            <circle cx="12" cy="22" r="2.2" fill="#0A0A0A" />
          </svg>

          {/* Api knalpot */}
          <span
            ref={flameRef}
            className="absolute left-1/2 top-full -ml-[3px] h-4 w-[6px] origin-top rounded-b-full bg-gradient-to-b from-[#FF8000] via-[#FF8000]/60 to-transparent"
            style={{ opacity: 0 }}
          />
        </span>
      </button>
    </div>
  );
}