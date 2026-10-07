"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Experience = {
  lap: string;
  period: string;
  role: string;
  place: string;
  desc: string;
  tags: string[];
};

// Isi ini contoh. Ganti "20XX" dengan tahun masuk kuliahmu, dan edit sesuai kondisi asli
const EXPERIENCES: Experience[] = [
  {
    lap: "01",
    period: "20XX — Sekarang",
    role: "Mahasiswa Informatika",
    place: "UIN Prof. K.H. Saifuddin Zuhri Purwokerto",
    desc: "Mendalami pemrograman, basis data, jaringan, dan pengembangan web. Sekarang berada di tahap akhir studi S1.",
    tags: ["Web", "Jaringan", "Basis Data"],
  },
  {
    lap: "02",
    period: "2023 — Sekarang",
    role: "Asisten Operasional",
    place: "Nazril Aluminium",
    desc: "Membantu usaha keluarga sehari-hari: merekap hasil kerja, menyusun termin pembayaran, membuat surat dan invoice, ikut survey dan pemasaran, serta sesekali membantu pembuatan kusen.",
    tags: ["Rekap", "Termin & Invoice", "Pemasaran", "Kusen"],
  },
  {
    lap: "03",
    period: "2026",
    role: "Developer & Kreator Media",
    place: "KKN Kelompok 125 — Desa Ciliang",
    desc: "Membangun website kelompok dengan Laravel 10 dan memproduksi konten visual seperti video dan poster untuk publikasi kegiatan.",
    tags: ["Laravel 10", "Video", "Desain"],
  },
  {
    lap: "04",
    period: "Sep — Des 2026",
    role: "Front-End Developer Intern",
    place: "Slameticon Digital Valley",
    desc: "Magang sebagai front-end developer, membangun antarmuka web yang responsif dan rapi bersama tim.",
    tags: ["Front-End", "Web", "Internship"],
  },
  {
    lap: "05",
    period: "2026",
    role: "Project Developer",
    place: "Personal Projects",
    desc: "Mengerjakan Banyumax (landing page Laravel + Livewire) dan merancang aplikasi Android pencatat keuangan pribadi.",
    tags: ["Laravel", "Livewire", "Android"],
  },
  {
    lap: "06",
    period: "2026",
    role: "Skripsi: SPK Bandwidth",
    place: "Tugas Akhir — Informatika",
    desc: "Membangun sistem pendukung keputusan berbasis web untuk manajemen bandwidth MikroTik dengan metode SAW.",
    tags: ["SAW", "MikroTik", "Web App"],
  },
];

const SPEED_LINES = [12, 34, 58, 80];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".exp-item");
      const hud = section.querySelector<HTMLElement>(".exp-hud");
      const hudLap = section.querySelector<HTMLElement>(".hud-lap");

      const setLap = (n: number) => {
        if (!hudLap) return;
        hudLap.textContent = String(n).padStart(2, "0");
        if (!reduceMotion) {
          gsap.fromTo(
            hudLap,
            { yPercent: -60, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
          );
        }
      };

      /* ===== MODE REDUCED MOTION: tampil statis ===== */
      if (reduceMotion) {
        gsap.set(".exp-progress", { scaleY: 1 });
        gsap.set(".exp-car", { autoAlpha: 0 });
        gsap.set(".exp-dot", {
          backgroundColor: "#FF8000",
          borderColor: "#FF8000",
        });
        return;
      }

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      /* ===== JUDUL ===== */
      gsap.from(".exp-title-line", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".exp-title", start: "top 80%", once: true },
      });

      gsap.from(".exp-fade", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".exp-title", start: "top 75%", once: true },
      });

      /* ===== SPEED LINES: melesat berulang ===== */
      gsap.utils.toArray<HTMLElement>(".speed-line").forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: -100 },
          {
            xPercent: 400,
            duration: 1.6 + Math.random() * 1.2,
            ease: "power2.in",
            repeat: -1,
            repeatDelay: 1.5 + Math.random() * 3,
            delay: i * 0.8,
          }
        );
      });

      /* ===== GARIS PROGRES + MOBIL (scrub mengikuti scroll) ===== */
      const lineTrigger = {
        trigger: ".exp-track",
        start: "top 60%",
        end: "bottom 60%",
        scrub: 0.6,
      };

      gsap.fromTo(
        ".exp-progress",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: lineTrigger }
      );

      gsap.fromTo(
        ".exp-car",
        { top: "0%" },
        { top: "100%", ease: "none", scrollTrigger: lineTrigger }
      );

      /* ===== HUD: muncul hanya saat di area timeline ===== */
      if (hud) {
        gsap.set(hud, { autoAlpha: 0, y: 20 });
        ScrollTrigger.create({
          trigger: ".exp-track",
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            gsap.to(hud, {
              autoAlpha: self.isActive ? 1 : 0,
              y: self.isActive ? 0 : 20,
              duration: 0.4,
              ease: "power3.out",
            });
          },
        });
      }

      /* ===== TIAP LAP ===== */
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        const card = item.querySelector(".exp-card");
        const streak = item.querySelector(".exp-streak");
        const lines = item.querySelectorAll(".exp-line-in");
        const dot = item.querySelector(".exp-dot");
        const wrap = item.querySelector(".exp-dot-wrap");
        const ring = item.querySelector(".exp-ring");
        const big = item.querySelector(".exp-bignum");

        // Kartu masuk + garis kilat menyapu
        gsap
          .timeline({
            scrollTrigger: { trigger: item, start: "top 78%", once: true },
          })
          .from(card, {
            x: isDesktop ? (isLeft ? -120 : 120) : 0,
            y: 60,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
          })
          .from(
            streak,
            { scaleX: 0, duration: 1.1, ease: "expo.out" },
            "-=0.8"
          )
          .from(
            lines,
            {
              y: 20,
              opacity: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.8"
          );

        // Angka besar parallax
        gsap.fromTo(
          big,
          { yPercent: 25 },
          {
            yPercent: -25,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // Titik menyala saat mobil lewat (maju & mundur)
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          onEnter: () => {
            setLap(i + 1);
            gsap.to(dot, {
              backgroundColor: "#FF8000",
              borderColor: "#FF8000",
              duration: 0.3,
            });
            gsap.fromTo(
              wrap,
              { scale: 1 },
              { scale: 1.5, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" }
            );
            gsap.fromTo(
              ring,
              { scale: 1, opacity: 0.8 },
              { scale: 3.6, opacity: 0, duration: 1, ease: "power2.out" }
            );
          },
          onLeaveBack: () => {
            setLap(i);
            gsap.to(dot, {
              backgroundColor: "#0A0A0A",
              borderColor: "rgba(255,255,255,0.3)",
              duration: 0.3,
            });
          },
        });
      });

      /* ===== BENDERA FINISH ===== */
      gsap.from(".exp-flag", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".exp-finish", start: "top 90%", once: true },
      });

      // Pola kotak-kotak bergerak terus (24px = satu siklus pola)
      gsap.to(".exp-flag", {
        backgroundPositionX: "-48px",
        duration: 1.6,
        ease: "none",
        repeat: -1,
      });

      gsap.from(".exp-finish-fade", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".exp-finish", start: "top 80%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-hidden bg-[#0F0F0F] px-6 py-24 text-white md:px-10 md:py-36"
    >
      {/* Speed lines */}
      {SPEED_LINES.map((top) => (
        <span
          key={top}
          aria-hidden="true"
          className="speed-line pointer-events-none absolute left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[#FF8000]/50 to-transparent"
          style={{ top: `${top}%` }}
        />
      ))}

      {/* Angka outline di belakang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-10 select-none font-display text-[28vw] font-black italic leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        04
      </div>

      {/* HUD current lap (hanya desktop) */}
      <div
        className="exp-hud pointer-events-none fixed bottom-6 left-6 z-40 hidden border border-white/10 bg-[#0A0A0A]/85 px-5 py-4 backdrop-blur-md md:block"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-white/40">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8000]" />
          Current lap
        </div>
        <div className="flex items-baseline gap-2 font-display font-black italic leading-none">
          <span className="hud-lap inline-block text-5xl tabular-nums text-[#FF8000]">
            00
          </span>
          <span className="text-xl text-white/30">
            / {String(EXPERIENCES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Label */}
        <div className="exp-fade mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-[#FF8000]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
            04 / Experience
          </span>
        </div>

        {/* Judul */}
        <div className="mb-20 flex flex-col justify-between gap-8 md:mb-32 md:flex-row md:items-end">
          <h2 className="exp-title">
            <span className="block overflow-hidden">
              <span 
              data-scramble
              className="exp-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] md:text-[9vw]">
                Lap by
              </span>
            </span>
            <span className="block overflow-hidden">
              <span 
                data-scramble
                className="exp-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] text-transparent md:text-[9vw]"
                style={{ WebkitTextStroke: "2px #FF8000" }}
              >
                Lap
              </span>
            </span>
          </h2>

          <p className="exp-fade max-w-xs text-xs leading-relaxed text-white/40">
            Perjalanan saya sejauh ini, dicatat per lap. Tiap lap mengajarkan
            sesuatu yang baru.
          </p>
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="exp-track relative">
          {/* Garis lintasan */}
          <div className="pointer-events-none absolute inset-y-0 left-4 w-0 md:left-1/2">
            <div className="absolute inset-y-0 -left-px w-[2px] bg-white/10" />
            <div className="exp-progress absolute inset-y-0 -left-px w-[2px] origin-top bg-gradient-to-b from-[#FF8000]/30 to-[#FF8000] shadow-[0_0_18px_rgba(255,128,0,0.7)]" />

            {/* "Mobil" yang berjalan di ujung garis */}
            <div
              className="exp-car absolute left-0 z-20 h-6 w-4 -translate-x-1/2 -translate-y-full bg-[#FF8000] drop-shadow-[0_0_10px_#FF8000]"
              style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
            />
          </div>

          <ol className="relative">
            {EXPERIENCES.map((e, i) => {
              const isLeft = i % 2 === 0;

              return (
                <li
                  key={e.lap}
                  className="exp-item relative pb-16 pl-12 last:pb-0 md:grid md:grid-cols-2 md:pb-32 md:pl-0"
                >
                  {/* Titik lap */}
                  <span className="absolute left-4 top-3 z-10 -translate-x-1/2 md:left-1/2">
                    <span className="exp-dot-wrap relative block h-4 w-4">
                      <span className="exp-ring absolute inset-0 rounded-full border border-[#FF8000] opacity-0" />
                      <span className="exp-dot absolute inset-0 rotate-45 border border-white/30 bg-[#0A0A0A]" />
                    </span>
                  </span>

                  {/* Kartu */}
                  <div
                    className={`exp-card relative ${
                      isLeft
                        ? "md:col-start-1 md:pr-20 md:text-right"
                        : "md:col-start-2 md:pl-20"
                    }`}
                  >
                    {/* Angka lap besar */}
                    <span
                      aria-hidden="true"
                      className={`exp-bignum pointer-events-none absolute -top-10 select-none font-display text-[30vw] font-black italic leading-none tracking-[-0.06em] text-transparent md:text-[13vw] ${
                        isLeft ? "right-0 md:right-20" : "right-0 md:left-20 md:right-auto"
                      }`}
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
                    >
                      {e.lap}
                    </span>

                    <div className="exp-body group relative z-10 overflow-hidden border border-white/10 bg-[#141414]/90 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#FF8000]/50 md:p-8">
                      {/* Garis kilat */}
                      <span
                        className={`exp-streak absolute inset-x-0 top-0 h-[2px] bg-[#FF8000] ${
                          isLeft ? "origin-left md:origin-right" : "origin-left"
                        }`}
                      />

                      <div
                        className={`exp-line-in mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#FF8000] ${
                          isLeft ? "md:justify-end" : ""
                        }`}
                      >
                        <span>Lap {e.lap}</span>
                        <span className="h-px w-6 bg-white/20" />
                        <span className="text-white/50">{e.period}</span>
                      </div>

                      <h3 className="exp-line-in font-display text-3xl font-black uppercase italic leading-[0.95] tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#FF8000] md:text-4xl">
                        {e.role}
                      </h3>

                      <div className="exp-line-in mt-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
                        {e.place}
                      </div>

                      <p
                        className={`exp-line-in mt-5 text-sm leading-relaxed text-white/45 ${
                          isLeft ? "md:ml-auto" : ""
                        } max-w-md`}
                      >
                        {e.desc}
                      </p>

                      <ul
                        className={`exp-line-in mt-5 flex flex-wrap gap-2 ${
                          isLeft ? "md:justify-end" : ""
                        }`}
                      >
                        {e.tags.map((t) => (
                          <li
                            key={t}
                            className="border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] text-white/50"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ================= FINISH ================= */}
        <div className="exp-finish mt-24 md:mt-36">
          <div
            className="exp-flag h-6 w-full opacity-90 md:h-8"
            style={{
              backgroundImage:
                "conic-gradient(#fff 25%, #0A0A0A 0 50%, #fff 0 75%, #0A0A0A 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="exp-finish-fade text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
                Finish line
              </div>
              <h3 className="exp-finish-fade mt-3 font-display text-5xl font-black uppercase italic leading-[0.9] tracking-[-0.04em] md:text-7xl">
                Lap berikutnya
                <br />
                bisa bareng kamu
              </h3>
            </div>

            <a
              href="#contact"
              className="exp-finish-fade group inline-flex items-center gap-3 bg-[#FF8000] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white"
            >
              Ajak Kolaborasi
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}