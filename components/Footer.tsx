"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ["Z", "R", "I", "L"];

const NAV = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/azrllrfn/" },
  { label: "GitHub", href: "https://github.com/ForRyll" },
  { label: "X", href: "https://x.com/azrllrfn" },
  { label: "WhatsApp", href: "https://wa.me/6287742905363" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const rpmRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLElement>(null);
  const maxRef = useRef<HTMLElement>(null);
  const sessionRef = useRef<HTMLElement>(null);

  const [clock, setClock] = useState("--:--:--");
  const lenis = useLenis();

  /* ===== Klik link navigasi ===== */
  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(href, { duration: 1.6 });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ===== Jam live Purwokerto (WIB) ===== */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const tick = () => setClock(fmt.format(new Date()).replace(/\./g, ":"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ===== Speedometer scroll + timer sesi ===== */
  useEffect(() => {
    const speedEl = speedRef.current;
    const rpm = rpmRef.current;
    const gearEl = gearRef.current;
    const maxEl = maxRef.current;
    const sessEl = sessionRef.current;
    if (!speedEl || !rpm || !gearEl || !maxEl || !sessEl) return;

    const t0 = performance.now();
    let lastY = window.scrollY;
    let lastT = t0;
    let shown = 0;
    let max = 0;
    let lastShown = -1;
    let lastSec = -1;

    const tick = () => {
      const now = performance.now();
      const y = window.scrollY;

      // Abaikan 1,5 detik pertama (restorasi posisi scroll bisa bikin lonjakan palsu)
      const warm = now - t0 < 1500;
      const v = warm
        ? 0
        : (Math.abs(y - lastY) / Math.max(now - lastT, 1)) * 1000;
      lastY = y;
      lastT = now;

      const target = Math.min(v / 12, 360); // px/detik jadi km/h
      shown += (target - shown) * 0.12;
      if (shown < 1) shown = 0;

      const s = Math.round(shown);
      if (s !== lastShown) {
        lastShown = s;
        speedEl.textContent = String(s).padStart(3, "0");
        rpm.style.transform = `scaleX(${Math.min(shown / 360, 1)})`;
        gearEl.textContent =
          s === 0 ? "N" : String(Math.min(8, 1 + Math.floor(s / 45)));

        if (s > max) {
          max = s;
          maxEl.textContent = String(max).padStart(3, "0");
        }
      }

      const sec = Math.floor((now - t0) / 1000);
      if (sec !== lastSec) {
        lastSec = sec;
        sessEl.textContent = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  /* ===== Animasi masuk + efek huruf raksasa ===== */
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(".foot-letter");
      const title = footer.querySelector<HTMLElement>(".foot-title");

      /* Masuk */
      gsap.from(letters, {
        yPercent: 90,
        opacity: 0,
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".foot-title", start: "top 92%", once: true },
      });

      gsap.from(".foot-fade", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".foot-grid", start: "top 88%", once: true },
      });

      /* Garis finish bergerak */
      gsap.to(".foot-checker", {
        backgroundPositionX: "-48px",
        duration: 2,
        ease: "none",
        repeat: -1,
      });

      /* Huruf bereaksi ke kursor (desktop) atau bergelombang sendiri (HP) */
      if (finePointer && title) {
        let setters: Array<(v: number) => void> | null = null;
        const getSetters = () =>
          (setters ??= letters.map((l) =>
            gsap.quickTo(l, "yPercent", { duration: 0.5, ease: "power3.out" }),
          ));

        const onMove = (e: MouseEvent) => {
          const set = getSetters();
          letters.forEach((l, i) => {
            const r = l.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const d = Math.hypot(e.clientX - cx, e.clientY - cy);
            const f = Math.max(0, 1 - d / (r.width * 1.1));

            set[i](-f * 14);
            l.style.color = `rgba(255,128,0,${f.toFixed(2)})`;
          });
        };

        const onLeave = () => {
          const set = getSetters();
          letters.forEach((l, i) => {
            set[i](0);
            l.style.color = "rgba(255,128,0,0)";
          });
        };

        title.addEventListener("mousemove", onMove);
        title.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          title.removeEventListener("mousemove", onMove);
          title.removeEventListener("mouseleave", onLeave);
        });
      } else {
        gsap.to(letters, {
          yPercent: -8,
          duration: 0.7,
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5,
        });
      }
    }, footer);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#050505] text-white"
    >
      {/* Garis finish */}
      <div
        aria-hidden="true"
        className="foot-checker h-3 w-full opacity-80"
        style={{
          backgroundImage:
            "conic-gradient(#fff 25%, #050505 0 50%, #fff 0 75%, #050505 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow oranye */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#FF8000]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-8 pt-20 md:px-10 md:pt-28">
        {/* ===== GRID INFO ===== */}
        <div className="foot-grid grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Navigasi */}
          <div className="foot-fade md:col-span-2">
            <div className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
              Navigasi
            </div>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={(e) => go(e, n.href)}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#FF8000] transition-all duration-300 group-hover:w-4" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sosial */}
          <div className="foot-fade md:col-span-2">
            <div className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
              Sosial
            </div>
            <ul className="space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {s.label}
                    <span className="text-xs opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Paddock */}
          <div className="foot-fade md:col-span-3">
            <div className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
              Paddock
            </div>

            <div className="font-display text-5xl font-black italic leading-none tabular-nums tracking-[-0.02em]">
              {clock}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/35">
              WIB · Purwokerto, Jawa Tengah
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs text-white/55">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF8000] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF8000]" />
              </span>
              Terbuka untuk project &amp; kolaborasi
            </div>
          </div>

          {/* Pit board / speedometer */}
          <div className="foot-fade md:col-span-5">
            <div className="border border-white/10 bg-[#0C0C0C] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-white/35">
                <span>Pit board · Kecepatan scroll kamu</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8000]" />
                  Live
                </span>
              </div>

              <div className="flex items-end gap-3 font-display font-black italic leading-none">
                <span
                  ref={speedRef}
                  className="text-7xl tabular-nums md:text-8xl"
                >
                  000
                </span>
                <span className="pb-2 text-base text-[#FF8000]">km/h</span>
              </div>

              <div className="mt-4 h-1.5 w-full bg-white/10">
                <div
                  ref={rpmRef}
                  className="h-full origin-left bg-gradient-to-r from-[#8A8A8A] to-[#FF8000]"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-3 text-[9px] uppercase tracking-[0.25em] text-white/35">
                <div>
                  <dt>Gear</dt>
                  <dd className="mt-1">
                    <strong
                      ref={gearRef}
                      className="font-display text-2xl font-bold italic text-white"
                    >
                      N
                    </strong>
                  </dd>
                </div>
                <div>
                  <dt>Top speed</dt>
                  <dd className="mt-1">
                    <strong
                      ref={maxRef}
                      className="font-display text-2xl font-bold italic tabular-nums text-white"
                    >
                      000
                    </strong>
                  </dd>
                </div>
                <div>
                  <dt>Di paddock</dt>
                  <dd className="mt-1">
                    <strong
                      ref={sessionRef}
                      className="font-display text-2xl font-bold italic tabular-nums text-white"
                    >
                      00:00
                    </strong>
                  </dd>
                </div>
              </dl>

              <p className="mt-5 text-[10px] leading-relaxed text-white/30">
                Dihitung dari seberapa cepat kamu scroll halaman ini. Coba
                ngebut dan pecahkan rekormu.
              </p>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event("lights-out:open"))
                }
                className="mt-5 inline-flex items-center gap-3 border border-white/20 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 transition-colors hover:border-[#FF8000] hover:text-[#FF8000]"
              >
                Uji reaksimu
                <kbd className="text-[#FF8000]">L</kbd>
              </button>
            </div>
          </div>
        </div>

        {/* ===== HURUF RAKSASA ===== */}
        <div
          className="foot-title mt-20 flex select-none justify-center md:mt-28"
          data-cursor-style="dot"
          aria-label="ZRIL"
        >
          {LETTERS.map((l) => (
            <span
              key={l}
              aria-hidden="true"
              className="foot-letter inline-block font-display text-[34vw] font-black italic leading-[0.8] tracking-[-0.06em] transition-colors duration-300 md:text-[25vw]"
              style={{
                color: "rgba(255,128,0,0)",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.22)",
              }}
            >
              {l}
            </span>
          ))}
        </div>

        {/* ===== BAR BAWAH ===== */}
        <div className="foot-fade mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.25em] text-white/30 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} ZRIL. All rights reserved.</span>
          <span>Next.js · GSAP · Lenis</span>
          <div className="flex items-center gap-6">
            <span className="hidden md:block">
              Tekan{" "}
              <kbd className="mx-1 border border-white/20 px-1.5 py-0.5 text-white/60">
                T
              </kbd>{" "}
              untuk ke atas
            </span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("pit-radio:open"))}
              className="flex items-center gap-2 transition-colors hover:text-[#FF8000]"
            >
              Pit Radio
              <kbd className="border border-white/20 px-1.5 py-0.5 text-white/60">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
