"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ganti angka & label kalau datanya berubah
const STATS = [
  { value: 9, suffix: "", label: "Projects", sub: "Repo di GitHub" },
  { value: 3, suffix: "", label: "Years", sub: "Belajar ngoding sejak 2023" },
  { value: 10, suffix: "", label: "Tech Stack", sub: "Teknologi yang dipakai" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      /* ===== COUNTER: angka naik saat masuk layar ===== */
      const counters = gsap.utils.toArray<HTMLElement>(".stat-number");

      counters.forEach((el) => {
        const target = Number(el.dataset.value);

        if (reduceMotion) {
          el.textContent = String(target);
          return;
        }

        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.n));
          },
        });
      });

      if (reduceMotion) return;

      /* ===== JUDUL: slide-up per baris ===== */
      gsap.from(".about-title-line", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-title",
          start: "top 80%",
          once: true,
        },
      });

      /* ===== FOTO: muncul dengan clip-path ===== */
      gsap.from(".about-photo", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-photo",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".about-photo img", {
        scale: 1.25,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-photo",
          start: "top 80%",
          once: true,
        },
      });

      /* ===== TEKS & KARTU STATS: fade + naik ===== */
      gsap.from(".about-fade", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-content",
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".stat-card", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stats-grid", start: "top 88%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-[#0A0A0A] px-6 py-24 text-white md:px-10 md:py-36"
    >
      {/* Teks outline besar di belakang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[28vw] font-black italic leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        01
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Label section */}
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-[#FF8000]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
            01 / About
          </span>
        </div>

        {/* Judul */}
        <h2 className="about-title mb-16 md:mb-24">
          <span className="block overflow-hidden">
            <span
              data-scramble
              className="about-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] md:text-[9vw]"
            >
              Driven by
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              data-scramble
              className="about-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] text-transparent md:text-[9vw]"
              style={{ WebkitTextStroke: "2px #FF8000" }}
            >
              Code &amp; Speed
            </span>
          </span>
        </h2>

        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          {/* ===== FOTO ===== */}
          <div className="md:col-span-5">
            <div
              className="about-photo relative aspect-[4/5] w-full overflow-hidden bg-[#1A1A1A]"
              data-cursor="Hai"
            >
              <Image
                src="/images/me.png"
                alt="Foto Zril"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top grayscale"
              />

              {/* Gradient bawah */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />

              {/* Sudut oranye ala frame */}
              <span className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-[#FF8000]" />
              <span className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-[#FF8000]" />

              {/* Tag kecil */}
              <div className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.3em] text-white/70">
                Driver #01
              </div>
            </div>
          </div>

          {/* ===== KONTEN ===== */}
          <div className="about-content flex flex-col justify-between gap-12 md:col-span-7 md:pl-10">
            <div className="max-w-xl space-y-6">
              <p className="about-fade font-display text-2xl font-bold uppercase italic leading-tight tracking-[-0.02em] md:text-3xl">
                Mahasiswa Informatika yang suka bikin hal digital yang cepat,
                rapi, dan enak dilihat.
              </p>

              <p className="about-fade text-sm leading-relaxed text-white/50 md:text-base">
                Saya Nazril Irfani, biasa dipanggil Zril. Saat ini menempuh
                studi Informatika di UIN Prof. K.H. Saifuddin Zuhri Purwokerto.
                Saya senang membangun website dan aplikasi, dari sisi tampilan
                sampai logikanya, dengan fokus pada pengalaman yang halus dan
                animasi yang terasa hidup.
              </p>

              <p className="about-fade text-sm leading-relaxed text-white/50 md:text-base">
                Seperti di lintasan balap, saya percaya detail kecil menentukan
                hasil akhir. Itu yang saya bawa di setiap project.
              </p>

              {/* Tombol aksi */}
              <div className="about-fade flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 bg-[#FF8000] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white"
                >
                  Hubungi Saya
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>

                <a
                  href="/cv-nazril-irfani.pdf"
                  download="CV-Nazril-Irfani.pdf"
                  className="group inline-flex items-center gap-3 border border-white/25 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-[#FF8000] hover:text-[#FF8000]"
                >
                  Unduh CV
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">
                    ↓
                  </span>
                </a>
              </div>
            </div>

            {/* ===== RACE STATS ===== */}
            <div className="stats-grid grid grid-cols-3 gap-3 md:gap-5">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="stat-card border border-white/10 bg-[#141414] p-4 transition-colors duration-300 hover:border-[#FF8000]/60 md:p-6"
                >
                  <div className="flex items-baseline font-display font-black italic leading-none tracking-[-0.04em]">
                    <span
                      className="stat-number text-5xl md:text-7xl"
                      data-value={s.value}
                    >
                      0
                    </span>
                    <span className="text-3xl text-[#FF8000] md:text-5xl">
                      {s.suffix}
                    </span>
                  </div>

                  <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                    {s.label}
                  </div>
                  <div className="mt-1 text-[10px] leading-snug text-white/35">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}