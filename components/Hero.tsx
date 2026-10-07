"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAME = "ZRIL"; // ganti kalau mau nama lain

const MARQUEE_WORDS = [
  "Creative Developer",
  "Front-End",
  "Motion",
  "UI Design",
  "Informatics",
];

// Mask lingkaran reveal: --x, --y, --r diupdate lewat JS (px)
const MASK =
  "radial-gradient(circle var(--r, 0.1px) at var(--x, 50%) var(--y, 30%), #000 0%, #000 62%, rgba(0,0,0,.6) 82%, transparent 100%)";

// Tekstur grain tipis (SVG noise)
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

type Setter = (v: number) => unknown;
const noop: Setter = () => {};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const portrait = portraitRef.current;
    const reveal = revealRef.current;
    if (!hero || !portrait || !reveal) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    /* =====================================================
       1. LINGKARAN REVEAL (black suit)
       ===================================================== */
    // x,y,r = posisi sekarang | tx,ty,tr = target yang dikejar
    const pos = { x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0 };

    const baseRadius = () =>
      Math.max(110, Math.min(230, reveal.offsetWidth * 0.34));

    pos.x = pos.tx = reveal.offsetWidth * 0.5;
    pos.y = pos.ty = reveal.offsetHeight * 0.3;

    const tick = () => {
      pos.x += (pos.tx - pos.x) * 0.14;
      pos.y += (pos.ty - pos.y) * 0.14;
      pos.r += (pos.tr - pos.r) * 0.12;

      reveal.style.setProperty("--x", `${pos.x}px`);
      reveal.style.setProperty("--y", `${pos.y}px`);
      reveal.style.setProperty("--r", `${Math.max(pos.r, 0.1)}px`);
    };
    gsap.ticker.add(tick);

    let demo: gsap.core.Timeline | null = null;
    const stopDemo = () => {
      demo?.kill();
      demo = null;
    };

    const moveTo = (clientX: number, clientY: number) => {
      const rect = reveal.getBoundingClientRect();
      pos.tx = clientX - rect.left;
      pos.ty = clientY - rect.top;

      if (pos.r < 1) {
        pos.x = pos.tx;
        pos.y = pos.ty;
      }
    };

    const onEnter = () => {
      stopDemo();
      pos.tr = baseRadius();
    };
    const onLeave = () => {
      pos.tr = 0;
    };
    const onMove = (e: MouseEvent) => {
      stopDemo();
      pos.tr = baseRadius();
      moveTo(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      stopDemo();
      pos.tr = baseRadius();
      moveTo(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      pos.tr = 0;
    };

    hero.addEventListener("mouseenter", onEnter);
    hero.addEventListener("mouseleave", onLeave);
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("touchstart", onTouch, { passive: true });
    hero.addEventListener("touchmove", onTouch, { passive: true });
    hero.addEventListener("touchend", onTouchEnd);

    /* =====================================================
       2. ANIMASI (dimainkan setelah loader selesai)
       ===================================================== */
    let startAnim: (() => void) | null = null;

    const ctx = gsap.context(() => {
      /* ---------- Parallax mouse + tilt 3D (desktop) ---------- */
      if (finePointer && !reduceMotion) {
        const back = hero.querySelector<HTMLElement>(".hero-back");
        const front = hero.querySelector<HTMLElement>(".hero-front");
        const glow = hero.querySelector<HTMLElement>(".hero-glow");
        const cards = gsap.utils.toArray<HTMLElement>(".hero-card");

        gsap.set(portrait, { transformPerspective: 1000 });

        const qs = (el: HTMLElement | null, prop: string): Setter =>
          el
            ? gsap.quickTo(el, prop, { duration: 0.9, ease: "power3.out" })
            : noop;

        const tiltY = qs(portrait, "rotationY");
        const tiltX = qs(portrait, "rotationX");
        const backX = qs(back, "x");
        const backY = qs(back, "y");
        const frontX = qs(front, "x");
        const frontY = qs(front, "y");
        const glowX = qs(glow, "x");
        const glowY = qs(glow, "y");

        const cardSet = cards.map((el) => ({
          depth: Number(el.dataset.depth || 30),
          x: qs(el, "x"),
          y: qs(el, "y"),
        }));

        const apply = (mx: number, my: number) => {
          tiltY(mx * 6);
          tiltX(-my * 4);
          backX(-mx * 28);
          backY(-my * 14);
          frontX(mx * 18);
          frontY(my * 8);
          glowX(mx * 80);
          glowY(my * 50);
          cardSet.forEach((c) => {
            c.x(mx * c.depth);
            c.y(my * c.depth * 0.6);
          });
        };

        const onParallax = (e: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
          apply(mx, my);
        };
        const onParallaxLeave = () => apply(0, 0);

        hero.addEventListener("mousemove", onParallax, { passive: true });
        hero.addEventListener("mouseleave", onParallaxLeave);
        cleanups.push(() => {
          hero.removeEventListener("mousemove", onParallax);
          hero.removeEventListener("mouseleave", onParallaxLeave);
        });
      }

      if (reduceMotion) return;

      /* ---------- Telemetri hidup ---------- */
      const rpmEl = hero.querySelector<HTMLElement>(".tele-rpm");
      const rpmBar = hero.querySelector<HTMLElement>(".tele-rpm-bar");
      const drsEl = hero.querySelector<HTMLElement>(".tele-drs");
      const drsDot = hero.querySelector<HTMLElement>(".tele-drs-dot");
      const gearEl = hero.querySelector<HTMLElement>(".tele-gear");
      const lapEl = hero.querySelector<HTMLElement>(".tele-lap");

      let heroActive = true;
      ScrollTrigger.create({
        trigger: hero,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          heroActive = self.isActive;
        },
      });

      const t0 = performance.now();
      let rpm = 11800;
      let drsOpen = true;
      let nextDrs = t0 + 3000;
      let nextGear = t0 + 2200;

      const teleTimer = window.setInterval(() => {
        if (!heroActive) return;
        const now = performance.now();

        rpm = Math.max(
          10200,
          Math.min(12900, rpm + (Math.random() - 0.5) * 700),
        );
        if (rpmEl) rpmEl.textContent = Math.round(rpm).toLocaleString("en-US");
        if (rpmBar) rpmBar.style.transform = `scaleX(${(rpm - 9500) / 3500})`;

        if (now > nextDrs) {
          drsOpen = !drsOpen;
          nextDrs = now + 2500 + Math.random() * 3000;
          if (drsEl) {
            drsEl.textContent = drsOpen ? "OPEN" : "CLOSED";
            drsEl.style.color = drsOpen ? "#FF8000" : "rgba(255,255,255,0.45)";
          }
          if (drsDot)
            drsDot.style.backgroundColor = drsOpen
              ? "#FF8000"
              : "rgba(255,255,255,0.3)";
        }

        if (now > nextGear && gearEl) {
          nextGear = now + 1800 + Math.random() * 2200;
          gearEl.textContent = String(6 + Math.floor(Math.random() * 3));
        }

        if (lapEl) {
          const t = ((now - t0) % 78000) / 1000;
          const m = Math.floor(t / 60);
          const s = t - m * 60;
          lapEl.textContent = `${m}:${s.toFixed(1).padStart(4, "0")}`;
        }
      }, 80);
      cleanups.push(() => window.clearInterval(teleTimer));

      /* ---------- Transisi sinematik saat scroll ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .fromTo(
          ".hero-portrait-layer",
          { scale: 1, yPercent: 0, filter: "brightness(1)" },
          {
            scale: 0.82,
            yPercent: 10,
            filter: "brightness(0.25)",
            ease: "none",
          },
          0,
        )
        .to(".hero-front", { scale: 1.4, opacity: 0, ease: "none" }, 0)
        .to(".hero-back", { scale: 1.25, opacity: 0.2, ease: "none" }, 0)
        .to(".hero-cards", { opacity: 0, ease: "none" }, 0)
        .to(".hero-info", { opacity: 0, y: -40, ease: "none" }, 0);

      /* ---------- Marquee bawah + panah scroll ---------- */
      gsap.to(".hero-marquee-track", {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".hero-arrow", {
        y: 5,
        duration: 0.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* ---------- Animasi masuk (pause sampai loader selesai) ---------- */
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .from(".hero-title-line", {
          yPercent: 110,
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
        })
        .from(
          portrait,
          { opacity: 0, scale: 0.9, duration: 1.4, ease: "expo.out" },
          "-=0.9",
        )
        .from(
          ".hero-card",
          { opacity: 0, scale: 0.9, duration: 0.8, stagger: 0.12 },
          "-=0.6",
        )
        .from(".hero-bottom", { y: 25, opacity: 0, duration: 0.8 }, "-=0.7")
        .from(".hero-marquee", { yPercent: 100, duration: 0.8 }, "<");

      // Portrait melayang pelan
      const float = gsap.to(portrait, {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      // Demo: lingkaran reveal muncul, gerak di area wajah, lalu hilang
      const w = reveal.offsetWidth;
      const h = reveal.offsetHeight;
      demo = gsap
        .timeline({ paused: true, delay: 1.8 })
        .to(pos, { tr: baseRadius(), duration: 0.8, ease: "power3.out" })
        .to(pos, {
          tx: w * 0.4,
          ty: h * 0.26,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(pos, {
          tx: w * 0.6,
          ty: h * 0.32,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(pos, { tr: 0, duration: 0.7, ease: "power3.in" });

      startAnim = () => {
        intro.play();
        float.play();
        demo?.play();
      };
    }, hero);

    const onLoaderDone = () => startAnim?.();
    if (document.documentElement.dataset.loaded === "true") onLoaderDone();
    else window.addEventListener("loader:done", onLoaderDone, { once: true });

    return () => {
      stopDemo();
      gsap.ticker.remove(tick);
      cleanups.forEach((fn) => fn());
      window.removeEventListener("loader:done", onLoaderDone);
      hero.removeEventListener("mouseenter", onEnter);
      hero.removeEventListener("mouseleave", onLeave);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("touchstart", onTouch);
      hero.removeEventListener("touchmove", onTouch);
      hero.removeEventListener("touchend", onTouchEnd);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      data-cursor-style="dot"
      className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#222_0%,#0A0A0A_48%,#050505_100%)]" />

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

      {/* Glow oranye (mengikuti kursor) */}
      <div className="hero-glow pointer-events-none absolute left-1/2 top-[45%] -ml-[260px] -mt-[260px] h-[520px] w-[520px] rounded-full bg-[#FF8000]/12 blur-[150px]" />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />

      {/* ================= PANGGUNG UTAMA ================= */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="relative h-[82vh] w-full max-w-[1500px] overflow-hidden">
          {/* Teks outline belakang */}
          <div
            aria-hidden="true"
            className="hero-back pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="overflow-hidden">
              <div
                className="hero-title-line font-display text-[34vw] font-black italic leading-[0.7] tracking-[-0.06em] text-transparent"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.14)" }}
              >
                {NAME}
              </div>
            </div>

            <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[9px] uppercase tracking-[0.5em] text-white/20 md:block">
              Creative Developer
            </div>
            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 rotate-90 text-[9px] uppercase tracking-[0.5em] text-white/20 md:block">
              Full Speed / Digital
            </div>
          </div>

          {/* ================= PORTRAIT ================= */}
          <div className="hero-portrait-layer absolute inset-0 z-10 will-change-transform">
            <div
              ref={portraitRef}
              className="absolute inset-0 flex items-end justify-center"
            >
              <div className="relative h-[82%] w-[92%] md:h-[91%] md:w-[70%] lg:w-[58%]">
                {/* Foto asli */}
                <Image
                  src="/images/me.png"
                  alt={`Foto ${NAME}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 92vw, 60vw"
                  className="object-contain object-bottom"
                  aria-hidden="true"
                />

                {/* Layer reveal (foto versi black suit) */}
                <div
                  ref={revealRef}
                  className="absolute inset-0"
                  style={{ WebkitMaskImage: MASK, maskImage: MASK }}
                >
                  <Image
                    src="/images/me-spiderman.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 92vw, 60vw"
                    className="object-contain object-bottom"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= TEKS DEPAN ================= */}
          <div className="hero-front pointer-events-none absolute inset-x-0 bottom-[13%] z-20 text-center md:bottom-[9%]">
            <div className="overflow-hidden">
              <div className="hero-title-line font-display text-[20vw] font-black uppercase italic leading-[0.75] tracking-[-0.07em] text-white md:text-[14vw] lg:text-[11vw]">
                {NAME}
              </div>
            </div>
          </div>

          {/* ================= KARTU TELEMETRI ================= */}
          <div className="hero-cards pointer-events-none absolute inset-0 z-30 hidden lg:block">
            {/* RPM */}
            <div
              className="hero-card absolute left-[7%] top-[24%]"
              data-depth="46"
            >
              <div className="w-[160px] border border-white/10 bg-[#0A0A0A]/70 px-4 py-3 backdrop-blur-md">
                <div className="mb-2 flex items-center justify-between text-[8px] uppercase tracking-[0.3em] text-white/40">
                  <span>RPM</span>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8000]" />
                </div>
                <div className="tele-rpm font-display text-3xl font-black italic leading-none tabular-nums">
                  11,820
                </div>
                <div className="mt-3 h-[3px] w-full bg-white/10">
                  <div
                    className="tele-rpm-bar h-full origin-left bg-gradient-to-r from-[#8A8A8A] to-[#FF8000]"
                    style={{ transform: "scaleX(0.66)" }}
                  />
                </div>
              </div>
            </div>

            {/* DRS + Gear */}
            <div
              className="hero-card absolute right-[7%] top-[18%]"
              data-depth="-38"
            >
              <div className="w-[150px] border border-white/10 bg-[#0A0A0A]/70 px-4 py-3 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-white/40">
                  <span className="tele-drs-dot h-1.5 w-1.5 rounded-full bg-[#FF8000]" />
                  DRS
                </div>
                <div className="tele-drs font-display text-3xl font-black italic leading-none text-[#FF8000]">
                  OPEN
                </div>
                <div className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/40">
                  Gear{" "}
                  <span className="tele-gear ml-1 text-sm font-bold text-white">
                    7
                  </span>
                </div>
              </div>
            </div>

            {/* Lap time */}
            <div
              className="hero-card absolute bottom-[30%] right-[11%]"
              data-depth="58"
            >
              <div className="w-[160px] border border-white/10 bg-[#0A0A0A]/70 px-4 py-3 backdrop-blur-md">
                <div className="mb-2 text-[8px] uppercase tracking-[0.3em] text-white/40">
                  Lap time
                </div>
                <div className="tele-lap font-display text-3xl font-black italic leading-none tabular-nums">
                  0:00.0
                </div>
                <div className="mt-3 text-[8px] uppercase tracking-[0.3em] text-[#FF8000]">
                  ▲ Personal best
                </div>
              </div>
            </div>
          </div>

          {/* ================= INFO SAMPING ================= */}
          <div className="hero-info pointer-events-none absolute inset-0 z-30">
            <div className="hero-bottom absolute bottom-5 left-0 hidden max-w-[220px] md:block">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-[#FF8000]" />
                <span className="text-[9px] uppercase tracking-[0.35em] text-[#FF8000]">
                  About me
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/45">
                Informatics student building digital experiences with code,
                motion and design.
              </p>
            </div>

            <div className="hero-bottom absolute bottom-5 right-0 hidden text-right md:block">
              <div className="mb-3 text-[9px] uppercase tracking-[0.35em] text-white/30">
                Scroll
              </div>
              <div className="flex items-center justify-end gap-3">
                <span className="h-px w-10 bg-white/20" />
                <span className="hero-arrow inline-block text-xs text-white/70">
                  ↓
                </span>
              </div>
            </div>

            {/* Info mobile */}
            <div className="hero-bottom absolute bottom-5 left-5 right-5 md:hidden">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-6 bg-[#FF8000]" />
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#FF8000]">
                  Creative Developer
                </span>
              </div>
              <div className="flex items-end justify-between">
                <p className="max-w-[210px] text-[10px] leading-relaxed text-white/45">
                  Code, design & digital experience.
                </p>
                <span className="text-xs text-white/60">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MARQUEE TIPIS ================= */}
      <div className="hero-marquee absolute inset-x-0 bottom-[2px] z-30 overflow-hidden border-t border-white/10 bg-[#0A0A0A]/60 py-2 backdrop-blur-sm">
        <div className="hero-marquee-track flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
                <span key={i} className="flex items-center whitespace-nowrap">
                  <span className="px-6 text-[9px] uppercase tracking-[0.4em] text-white/35">
                    {word}
                  </span>
                  <span className="text-[#FF8000]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[45] hidden opacity-[0.07] mix-blend-overlay md:block"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Garis aksen bawah */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[2px] bg-[#FF8000]" />
    </section>
  );
}
