"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import type { Project } from "@/lib/projects";
import { session } from "@/lib/session";

gsap.registerPlugin(ScrollTrigger);

type Props = { project: Project; next: Project };

/* Satu blok konten bernomor */
function Block({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pd-reveal border-t border-white/10 pt-8">
      <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em]">
        <span className="text-[#FF8000]">{index}</span>
        <span className="h-px w-8 bg-white/20" />
        <span className="text-white/50">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* Satu baris info di sidebar */
function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pd-meta">
      <div className="mb-2 text-[9px] uppercase tracking-[0.35em] text-white/35">
        {label}
      </div>
      <div className="text-sm text-white/80">{children}</div>
    </div>
  );
}

const PARAGRAPH = "text-base leading-relaxed text-white/60 md:text-lg";

export default function ProjectDetail({ project: p, next }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  /* Pengunjung sudah melewati intro: jangan tampilkan loader lagi */
  useEffect(() => {
    session.loaderShown = true;
    document.documentElement.dataset.loaded = "true";
  }, []);

  /* Selalu mulai dari atas */
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  /* Animasi */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".pd-back", { x: -20, opacity: 0, duration: 0.6 })
        .from(".pd-title-line", { yPercent: 110, duration: 1.1, ease: "expo.out" }, "-=0.3")
        .from(".pd-chip", { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.6")
        .from(
          ".pd-cover",
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "expo.out" },
          "-=0.7"
        )
        .from(".pd-cover-inner", { scale: 1.2, duration: 1.6, ease: "expo.out" }, "<");

      /* Blok konten muncul saat di-scroll */
      gsap.utils.toArray<HTMLElement>(".pd-reveal").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.from(".pd-meta", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pd-grid", start: "top 80%", once: true },
      });

      /* Angka besar bergerak pelan */
      gsap.to(".pd-bignum", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* Susun blok yang datanya ada */
  const blocks: { title: string; body: ReactNode }[] = [
    { title: "Ringkasan", body: <p className={PARAGRAPH}>{p.desc}</p> },
  ];

  if (p.context)
    blocks.push({ title: "Konteks", body: <p className={PARAGRAPH}>{p.context}</p> });
  if (p.problem)
    blocks.push({ title: "Masalah", body: <p className={PARAGRAPH}>{p.problem}</p> });
  if (p.solution)
    blocks.push({ title: "Solusi", body: <p className={PARAGRAPH}>{p.solution}</p> });

  if (p.features?.length)
    blocks.push({
      title: "Fitur utama",
      body: (
        <ul className="space-y-4">
          {p.features.map((f, i) => (
            <li
              key={f}
              className="flex gap-4 border-b border-white/10 pb-4 text-sm leading-relaxed text-white/60 md:text-base"
            >
              <span className="font-display text-xl font-black italic text-[#FF8000]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ),
    });

  if (p.gallery?.length)
    blocks.push({
      title: "Galeri",
      body: (
        <div className="grid gap-4 md:grid-cols-2">
          {p.gallery.map((src) => (
            <div
              key={src}
              className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#141414]"
            >
              <Image
                src={src}
                alt={`Tampilan ${p.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ),
    });

  return (
    <main ref={rootRef} className="relative overflow-hidden bg-[#0A0A0A] text-white">
      {/* Angka outline di belakang */}
      <div
        aria-hidden="true"
        className="pd-bignum pointer-events-none absolute -right-6 top-24 select-none font-display text-[42vw] font-black italic leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        {p.id}
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
        {/* Kembali */}
        <Link
          href="/#projects"
          className="pd-back group mb-10 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-[#FF8000]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Semua project
        </Link>

        {/* Judul */}
        <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
          <span className="h-px w-10 bg-[#FF8000]" />
          Project {p.id}
        </div>

        <h1 className="overflow-hidden pb-2">
          <span className="pd-title-line block font-display text-[13vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] md:text-[7.5vw]">
            {p.title}
          </span>
        </h1>

        {/* Chip */}
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="pd-chip bg-[#FF8000] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-black">
            {p.category}
          </span>
          {p.tags.map((t) => (
            <span
              key={t}
              className="pd-chip border border-white/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] text-white/55"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Cover */}
        <div className="pd-cover relative mt-14 aspect-[16/9] w-full overflow-hidden border border-white/10 bg-[#141414] md:mt-20">
          {p.image ? (
            <Image
              src={p.image}
              alt={`Tampilan project ${p.title}`}
              fill
              priority
              sizes="100vw"
              className="pd-cover-inner object-cover"
            />
          ) : (
            <div className="pd-cover-inner absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#262626_0%,#141414_60%,#0d0d0d_100%)]">
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
                className="absolute bottom-0 right-6 font-display text-[34vw] font-black italic leading-[0.8] tracking-[-0.06em] text-transparent md:text-[20vw]"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.14)" }}
              >
                {p.id}
              </span>
            </div>
          )}
        </div>

        {/* Isi */}
        <div className="pd-grid mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-12">
          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="space-y-8 md:sticky md:top-28">
              <Meta label="Kategori">{p.category}</Meta>
              {p.role && <Meta label="Peran">{p.role}</Meta>}
              <Meta label="Sumber">Repositori GitHub</Meta>
              <Meta label="Teknologi">
                <ul className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Meta>

              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-meta group inline-flex w-full items-center justify-between gap-3 bg-[#FF8000] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white"
              >
                Lihat Repo
                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            </div>
          </aside>

          {/* Konten */}
          <div className="space-y-14 md:col-span-8">
            {blocks.map((b, i) => (
              <Block key={b.title} index={String(i + 1).padStart(2, "0")} title={b.title}>
                {b.body}
              </Block>
            ))}
          </div>
        </div>
      </div>

      {/* Project berikutnya */}
      <Link
        href={`/projects/${next.slug}`}
        data-cursor="Next"
        className="group relative block overflow-hidden border-t border-white/10"
      >
        <span className="absolute inset-0 translate-y-full bg-[#FF8000] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0" />

        <span className="relative z-10 mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-6 py-14 md:px-10 md:py-20">
          <span>
            <span className="block text-[10px] uppercase tracking-[0.35em] text-[#FF8000] transition-colors duration-300 group-hover:text-black">
              Project berikutnya · {next.id}
            </span>
            <span className="mt-3 block font-display text-5xl font-black uppercase italic leading-[0.9] tracking-[-0.04em] transition-colors duration-300 group-hover:text-black md:text-8xl">
              {next.title}
            </span>
          </span>
          <span className="text-4xl transition-all duration-500 group-hover:translate-x-2 group-hover:text-black md:text-6xl">
            →
          </span>
        </span>
      </Link>

      {/* Footer tipis */}
      <div className="border-t border-white/10 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 text-[10px] uppercase tracking-[0.25em] text-white/30 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} ZRIL. All rights reserved.</span>
          <Link href="/#home" className="transition-colors hover:text-[#FF8000]">
            Kembali ke beranda ↑
          </Link>
        </div>
      </div>
    </main>
  );
}