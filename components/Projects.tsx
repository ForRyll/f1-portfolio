"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);


export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      /* ===== JUDUL ===== */
      gsap.from(".projects-title-line", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".projects-title", start: "top 80%", once: true },
      });

      gsap.from(".projects-fade", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects-title", start: "top 75%", once: true },
      });

      /* ===== TIAP KARTU ===== */
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });

        tl.from(card, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        }).from(
          card.querySelector(".project-media-inner"),
          { scale: 1.25, duration: 1.6, ease: "expo.out" },
          "-=0.8"
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-[#0A0A0A] px-6 py-24 text-white md:px-10 md:py-36"
    >
      {/* Angka outline di belakang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[28vw] font-black italic leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        03
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Label */}
        <div className="projects-fade mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-[#FF8000]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
            03 / Projects
          </span>
        </div>

        {/* Judul */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <h2 className="projects-title">
            <span className="block overflow-hidden">
              <span 
              data-scramble
              className="projects-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] md:text-[9vw]">
                Selected
              </span>
            </span>
            <span className="block overflow-hidden">
              <span 
                data-scramble
                className="projects-title-line block font-display text-[16vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] text-transparent md:text-[9vw]"
                style={{ WebkitTextStroke: "2px #FF8000" }}
              >
                Works
              </span>
            </span>
          </h2>

          <p className="projects-fade max-w-xs text-xs leading-relaxed text-white/40">
            Beberapa project yang pernah saya kerjakan, dari website sampai
            aplikasi mobile.
          </p>
        </div>

        {/* Grid kartu */}
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`project-card group ${i % 2 === 1 ? "md:mt-24" : ""}`}
            >
              {/* Media */}
              <Link
  href={`/projects/${p.slug}`}
  data-cursor="Lihat"
  aria-label={`Lihat detail ${p.title}`}
  className="relative block aspect-[16/10] overflow-hidden border border-white/10 bg-[#141414] transition-colors duration-500 group-hover:border-[#FF8000]/60"
>
                <div className="project-media-inner absolute inset-0">
                  <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={`Tampilan project ${p.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      /* Placeholder kalau belum ada gambar */
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#262626_0%,#141414_60%,#0d0d0d_100%)]">
                        <div
                          className="absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage: `
                              linear-gradient(to right, white 1px, transparent 1px),
                              linear-gradient(to bottom, white 1px, transparent 1px)
                            `,
                            backgroundSize: "48px 48px",
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 right-4 font-display text-[22vw] font-black italic leading-[0.8] tracking-[-0.06em] text-transparent md:text-[11vw]"
                          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.12)" }}
                        >
                          {p.id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gradient bawah */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />

                {/* Badge kategori */}
                <span className="absolute left-4 top-4 bg-[#0A0A0A]/70 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
                  {p.category}
                </span>
              </Link>

              {/* Info */}
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <div className="mb-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/35">
                    <span className="text-[#FF8000]">{p.id}</span>
                    <span className="h-px w-6 bg-white/20" />
                    <span>{p.year}</span>
                  </div>

                  <h3 className="font-display text-4xl font-black uppercase italic leading-none tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#FF8000] md:text-5xl">
                    {p.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
                {p.desc}
              </p>

              {/* Tags */}
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] text-white/50"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              {/* Tombol */}
              <Link
  href={`/projects/${p.slug}`}
  className="mt-7 inline-flex items-center gap-3 bg-[#FF8000] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white"
>
  Lihat Detail
  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}