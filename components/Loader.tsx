"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { session } from "@/lib/session";

gsap.registerPlugin(ScrollTrigger);

const MESSAGES = [
  { at: 0, text: "Memanaskan ban" },
  { at: 30, text: "Cek mesin" },
  { at: 60, text: "Pit crew siap" },
  { at: 90, text: "Lights out" },
];

const FILL_DURATION = 2.2; // detik minimum untuk mengisi sampai 92%

export default function Loader() {
  // Kalau loader sudah pernah tampil (pengunjung pindah halaman), langsung hilang
  const [gone, setGone] = useState(session.loaderShown);

  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLSpanElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);

  const doneRef = useRef(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  /* Kunci smooth scroll selama loading */
  useEffect(() => {
    if (!lenis || doneRef.current || session.loaderShown) return;
    lenis.stop();
  }, [lenis]);

  useEffect(() => {
    if (session.loaderShown) return;

    const root = rootRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const content = contentRef.current;
    const line = lineRef.current;
    const countEl = countRef.current;
    const bar = barRef.current;
    const car = carRef.current;
    const msgEl = msgRef.current;
    if (!root || !top || !bottom || !content || !line || !countEl || !bar || !car || !msgEl) return;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;

    /* ===== Selesai: buka kunci & kabari komponen lain ===== */
    const finish = () => {
      doneRef.current = true;
      session.loaderShown = true;
      document.body.style.overflow = "";
      document.documentElement.dataset.loaded = "true";
      lenisRef.current?.start();
      window.dispatchEvent(new Event("loader:done"));
    };

    /* ===== Tunggu font & halaman selesai dimuat ===== */
    const loaded = Promise.all([
      document.fonts.ready,
      new Promise<void>((res) => {
        if (document.readyState === "complete") res();
        else window.addEventListener("load", () => res(), { once: true });
      }),
    ]);

    /* ===== Mode reduced motion: langsung buka ===== */
    if (reduceMotion) {
      loaded.then(() => {
        if (cancelled) return;
        finish();
        setGone(true);
      });
      return () => {
        cancelled = true;
        document.body.style.overflow = "";
      };
    }

    const ctx = gsap.context(() => {
      const state = { p: 0 };
      let lastMsg = -1;
      let stageOneDone = false;
      let ready = false;
      let finishing = false;

      const render = () => {
        const p = state.p;
        countEl.textContent = String(Math.round(p)).padStart(3, "0");
        bar.style.transform = `scaleX(${p / 100})`;
        car.style.left = `${p}%`;

        const idx = MESSAGES.reduce((acc, m, i) => (p >= m.at ? i : acc), 0);
        if (idx !== lastMsg) {
          lastMsg = idx;
          msgEl.textContent = MESSAGES[idx].text;
        }
      };
      render();

      /* ===== Animasi keluar: garis menyala, layar terbelah ===== */
      const exit = () => {
        gsap
          .timeline({
            onComplete: () => {
              setGone(true);
              ScrollTrigger.refresh();
            },
          })
          .to(content, { opacity: 0, y: -20, duration: 0.35, ease: "power2.in" })
          .to(line, { scaleX: 1, duration: 0.5, ease: "expo.out" }, "-=0.05")
          .to(top, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "+=0.1")
          .to(bottom, { yPercent: 100, duration: 1, ease: "expo.inOut" }, "<")
          .to(line, { opacity: 0, duration: 0.3 }, "<0.1")
          .add(finish, "-=0.55"); // hero mulai animasi saat layar baru setengah terbuka
      };

      const tryFinish = () => {
        if (cancelled || finishing || !stageOneDone || !ready) return;
        finishing = true;
        gsap.to(state, {
          p: 100,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: render,
          onComplete: exit,
        });
      };

      /* Tahap 1: isi sampai 92% */
      gsap.to(state, {
        p: 92,
        duration: FILL_DURATION,
        ease: "power2.out",
        onUpdate: render,
        onComplete: () => {
          stageOneDone = true;
          tryFinish();
        },
      });

      /* Tahap 2: tunggu aset siap, lalu isi sampai 100% */
      loaded.then(() => {
        ready = true;
        tryFinish();
      });

      /* Pengaman: kalau aset terlalu lama, paksa lanjut */
      gsap.delayedCall(7, () => {
        ready = true;
        tryFinish();
      });
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100]"
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
    >
      {/* Dua panel yang akan terbelah */}
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-[#0A0A0A]" />
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0A0A]" />

      {/* Konten */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-white"
      >
        {/* Grid tipis */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "90px 90px",
          }}
        />

        {/* Glow oranye */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF8000]/10 blur-[140px]" />

        {/* Bar atas */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
          <div className="font-display text-xl font-bold italic tracking-[-0.04em] md:text-2xl">
            ZRIL<span className="text-[#FF8000]">.</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Portfolio 2026
          </div>
        </div>

        {/* Counter */}
        <div className="relative flex items-start font-display font-black italic leading-none tracking-[-0.06em]">
          <span ref={countRef} className="text-[30vw] tabular-nums md:text-[18vw]">
            000
          </span>
          <span className="mt-[3vw] text-[8vw] text-[#FF8000] md:mt-[2vw] md:text-[4vw]">
            %
          </span>
        </div>

        {/* Lintasan + mobil */}
        <div className="relative mt-10 w-[min(82vw,760px)]">
          <div className="relative h-[2px] w-full bg-white/15">
            {/* Garis tick */}
            <div
              className="absolute inset-x-0 -top-1.5 h-3 opacity-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 5%)",
              }}
            />

            {/* Jejak oranye */}
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 w-full origin-left bg-[#FF8000] shadow-[0_0_14px_2px_rgba(255,128,0,0.8)]"
              style={{ transform: "scaleX(0)" }}
            />

            {/* Mobil F1 menghadap kanan */}
            <span
              ref={carRef}
              className="absolute top-1/2 block -translate-x-1/2 -translate-y-1/2 rotate-90 text-white drop-shadow-[0_0_8px_rgba(255,128,0,0.9)]"
              style={{ left: "0%" }}
            >
              <svg viewBox="0 0 24 44" className="h-9 w-5" fill="currentColor" aria-hidden="true">
                <rect x="2" y="3" width="20" height="3" rx="1" />
                <path d="M12 3 L14 14 L16 20 L16 34 L8 34 L8 20 L10 14 Z" />
                <rect x="2" y="12" width="4" height="8" rx="1" />
                <rect x="18" y="12" width="4" height="8" rx="1" />
                <rect x="1.5" y="28" width="5" height="10" rx="1" />
                <rect x="17.5" y="28" width="5" height="10" rx="1" />
                <rect x="3" y="39" width="18" height="3" rx="1" />
                <circle cx="12" cy="22" r="2.2" fill="#0A0A0A" />
              </svg>
            </span>
          </div>
        </div>

        {/* Pesan status */}
        <div className="mt-12 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-white/50">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8000]" />
          <span ref={msgRef}>Memanaskan ban</span>
        </div>

        {/* Bar bawah */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-6 text-[9px] uppercase tracking-[0.3em] text-white/25 md:px-10 md:py-8">
          <span>Nazril Irfani</span>
          <span>Creative Developer</span>
        </div>
      </div>

      {/* Garis oranye di tengah (muncul saat layar akan terbelah) */}
      <div
        ref={lineRef}
        className="absolute left-0 right-0 top-1/2 -mt-px h-[2px] origin-center bg-[#FF8000] shadow-[0_0_30px_6px_rgba(255,128,0,0.7)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}