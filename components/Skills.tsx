"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Isi ini contoh. Ganti nama dan nilainya sesuai kemampuan aslimu (skala 0-100)
const SECTORS = [
  {
    id: "S1",
    title: "Frontend",
    note: "Tampilan & interaksi",
    skills: [
      { name: "HTML & CSS", value: 85 },
      { name: "JavaScript", value: 85 },
      { name: "Tailwind CSS", value: 80 },
      { name: "TypeScript", value: 75 },
      { name: "React", value: 83 },
      { name: "Next.js", value: 70 },
    ],
  },
  {
    id: "S2",
    title: "Backend",
    note: "Logika & data",
    skills: [
      { name: "PHP Native", value: 85 },
      { name: "Laravel", value: 85 },
      { name: "Livewire", value: 70 },
    ],
  },
  {
    id: "S3",
    title: "Mobile & Tools",
    note: "Pendukung kerja",
    skills: [
      { name: "Kotlin", value: 80 },
      { name: "Android Studio", value: 70 },
      { name: "Git & GitHub", value: 70 },
      { name: "MikroTik", value: 80 },
    ],
  },
];

// Pola celah antar segmen bar (20 segmen)
const SEGMENT_MASK =
  "repeating-linear-gradient(to right, transparent 0, transparent calc(5% - 3px), #141414 calc(5% - 3px), #141414 5%)";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".sector-card");

      // Mode reduced-motion: langsung tampilkan angka akhir
      if (reduceMotion) {
        gsap.utils.toArray<HTMLElement>(".skill-pct").forEach((el) => {
          el.textContent = el.dataset.value ?? "0";
        });
        return;
      }

      /* ===== JUDUL ===== */
      gsap.from(".skills-title-line", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".skills-title", start: "top 80%", once: true },
      });

      gsap.from(".skills-fade", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skills-title", start: "top 75%", once: true },
      });

      /* ===== TIAP KARTU SECTOR ===== */
      cards.forEach((card) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 82%", once: true },
        });

        tl.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });

        // Bar terisi dari kiri
        tl.from(
          card.querySelectorAll(".skill-fill"),
          {
            scaleX: 0,
            duration: 1.4,
            stagger: 0.12,
            ease: "expo.out",
          },
          "-=0.5"
        );

        // Angka persen naik
        card.querySelectorAll<HTMLElement>(".skill-pct").forEach((el, i) => {
          const obj = { n: 0 };
          tl.to(
            obj,
            {
              n: Number(el.dataset.value),
              duration: 1.4,
              ease: "expo.out",
              onUpdate: () => {
                el.textContent = String(Math.round(obj.n));
              },
            },
            0.4 + i * 0.12
          );
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative overflow-hidden bg-[#0F0F0F] px-6 py-24 text-white md:px-10 md:py-36"
    >
      {/* Angka outline di belakang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-10 select-none font-display text-[28vw] font-black italic leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        02
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Label */}
        <div className="skills-fade mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-[#FF8000]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
            02 / Skills
          </span>
        </div>

        {/* Judul */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <h2 className="skills-title">
            <span className="block overflow-hidden">
              <span 
              data-scramble
              className="skills-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] md:text-[9vw]">
                Race
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
              data-scramble
                className="skills-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] text-transparent md:text-[9vw]"
                style={{ WebkitTextStroke: "2px #FF8000" }}
              >
                Telemetry
              </span>
            </span>
          </h2>

          <div className="skills-fade max-w-xs">
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF8000]" />
              Live data
            </div>
            <p className="text-xs leading-relaxed text-white/40">
              Skala 0 sampai 100 menunjukkan seberapa nyaman saya memakainya,
              bukan ukuran mutlak. Terus bertambah seiring project berjalan.
            </p>
          </div>
        </div>

        {/* Kartu sector */}
        <div className="grid gap-5 md:grid-cols-3">
          {SECTORS.map((sector) => (
            <div
              key={sector.id}
              className="sector-card border border-white/10 bg-[#141414] p-6 transition-colors duration-300 hover:border-[#FF8000]/50 md:p-8"
            >
              {/* Header sector */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <div className="font-display text-3xl font-black uppercase italic leading-none tracking-[-0.03em] md:text-4xl">
                    {sector.title}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/35">
                    {sector.note}
                  </div>
                </div>

                <span className="bg-[#FF8000] px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-black">
                  {sector.id}
                </span>
              </div>

              {/* Daftar skill */}
              <ul className="space-y-6">
                {sector.skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                        {skill.name}
                      </span>
                      <span className="font-display text-xl font-bold italic tabular-nums text-white">
                        <span className="skill-pct" data-value={skill.value}>
                          {skill.value}
                        </span>
                        <span className="text-sm text-[#FF8000]">%</span>
                      </span>
                    </div>

                    {/* Bar bersegmen */}
                    <div className="relative h-2.5 w-full overflow-hidden bg-white/[0.07]">
                      <div
                        className="skill-fill absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-[#8A8A8A] to-[#FF8000]"
                        style={{ width: `${skill.value}%` }}
                      />
                      {/* Celah antar segmen */}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{ background: SEGMENT_MASK }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}