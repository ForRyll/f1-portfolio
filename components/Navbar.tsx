"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";

const NAME = "Nazril Irfani";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

// Ganti dengan link aslimu
const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  // di dalam export default function Navbar() { ...
  const pathname = usePathname();
  const router = useRouter();

  /* ========== BUKA / TUTUP MENU ========== */
  const toggle = useCallback((next: boolean) => {
    const header = headerRef.current;
    const tl = tlRef.current;
    if (!tl) return;

    openRef.current = next;
    setOpen(next);
    document.body.style.overflow = next ? "hidden" : "";

    if (next) {
      // Pastikan header kelihatan saat menu terbuka
      if (header)
        gsap.to(header, { yPercent: 0, duration: 0.3, overwrite: true });
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.6).reverse();
    }
  }, []);

  /* ========== TIMELINE OVERLAY ========== */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(overlay, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(".menu-link-inner", { yPercent: 110 });
      gsap.set(".menu-fade", { opacity: 0, y: 20 });

      tlRef.current = gsap
        .timeline({ paused: true })
        .to(overlay, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "expo.inOut",
        })
        .to(
          ".menu-link-inner",
          { yPercent: 0, duration: 1, stagger: 0.07, ease: "expo.out" },
          "-=0.35",
        )
        .to(
          ".menu-fade",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.7",
        );

      if (reduceMotion) tlRef.current.timeScale(50);
    }, overlay);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  /* ========== SCROLL: HIDE/SHOW + BLUR + PROGRESS ========== */
  useEffect(() => {
    const header = headerRef.current;
    const bar = progressRef.current;
    if (!header || !bar) return;

    let lastY = window.scrollY;
    let hidden = false;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      // Progress bar
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

      // Background blur setelah scroll sedikit
      setSolid(y > 24);

      // Hide/show header
      const delta = y - lastY;
      if (Math.abs(delta) < 4 || openRef.current) {
        lastY = y;
        return;
      }

      if (delta > 0 && y > 120 && !hidden) {
        hidden = true;
        gsap.to(header, {
          yPercent: -100,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      } else if ((delta < 0 || y <= 120) && hidden) {
        hidden = false;
        gsap.to(header, {
          yPercent: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      }

      lastY = y;
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

  /* ========== TOMBOL ESC UNTUK TUTUP ========== */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, toggle]);

  /* ========== KLIK LINK MENU ========== */
  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    toggle(false);

    // Di halaman lain (misal detail project): pindah ke beranda dulu
    if (pathname !== "/") {
      setTimeout(() => router.push(`/${href}`), 450);
      return;
    }

    setTimeout(() => {
      if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }, 450);
  };

  return (
    <>
      {/* Progress bar scroll */}
      <div
        ref={progressRef}
        className="pointer-events-none fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-[#FF8000]"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Header */}
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-[70] flex items-center justify-between px-6 py-5 transition-colors duration-500 md:px-10 md:py-6 ${
          solid && !open
            ? "border-b border-white/5 bg-[#0A0A0A]/60 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <a
          href="#home"
          onClick={(e) => go(e, "#home")}
          className="font-display text-xl font-bold italic tracking-[-0.04em] text-white md:text-2xl"
        >
          {NAME}
          <span className="text-[#FF8000]">.</span>
        </a>

        <div className="hidden items-center gap-8 text-[10px] font-medium uppercase tracking-[0.3em] text-white/50 md:flex">
          <span>Portfolio</span>
          <span>2026</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("pit-radio:open"))}
            className="flex items-center gap-2 border border-white/15 px-3 py-1.5 tracking-[0.25em] transition-colors hover:border-[#FF8000] hover:text-[#FF8000]"
          >
            Pit Radio <kbd className="text-[#FF8000]">Ctrl K</kbd>
          </button>
        </div>

        <button
          type="button"
          onClick={() => toggle(!open)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-white"
        >
          <span className="hidden md:block">{open ? "Close" : "Menu"}</span>

          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-[#FF8000]">
            <span
              className={`absolute h-px w-3 bg-white transition-transform duration-500 ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-px w-3 bg-white transition-transform duration-500 ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </span>
        </button>
      </header>

      {/* Overlay fullscreen */}
      <div
        ref={overlayRef}
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] bg-[#0A0A0A] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Glow oranye tipis */}
        <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[#FF8000]/10 blur-[150px]" />

        <div className="relative flex h-full flex-col justify-between px-6 pb-8 pt-28 md:px-16 md:pb-10">
          <nav aria-label="Menu utama">
            <ul className="flex flex-col">
              {LINKS.map((link, i) => (
                <li key={link.href} className="overflow-hidden py-[0.35vh]">
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    tabIndex={open ? 0 : -1}
                    className="group block"
                  >
                    <span className="menu-link-inner flex items-center gap-4 md:gap-8">
                      <span className="w-6 text-xs font-medium tracking-[0.2em] text-[#FF8000] md:w-10 md:text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="font-display text-[min(14vw,9vh)] font-black uppercase italic leading-[0.95] tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-[#FF8000] md:text-[min(8vw,10.5vh)]">
                        {link.label}
                      </span>

                      {/* Garis aksen saat hover */}
                      <span className="hidden h-[3px] w-0 bg-[#FF8000] transition-all duration-500 ease-out group-hover:w-24 md:block" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer overlay */}
          <div className="menu-fade flex flex-col gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40 md:flex-row md:items-center md:justify-between">
            <span>Based in Purwokerto, ID</span>

            <div className="flex gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="transition-colors hover:text-[#FF8000]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
