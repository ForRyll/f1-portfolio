"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WA_NUMBER = "6287742905363"; // format internasional tanpa + / 0 di depan
const EMAIL = "nazrilirfani86@gmail.com";

const CHANNELS = [
  { label: "WhatsApp", handle: "0877 4290 5363", href: `https://wa.me/${WA_NUMBER}` },
  { label: "Email", handle: EMAIL, href: `mailto:${EMAIL}` },
  { label: "Instagram", handle: "@azrllrfn", href: "https://www.instagram.com/azrllrfn/" },
  { label: "GitHub", handle: "ForRyll", href: "https://github.com/ForRyll" },
  { label: "X", handle: "@azrllrfn", href: "https://x.com/azrllrfn" },
];

const MARQUEE_A = ["Available for work", "Open for collaboration", "Front-end developer", "Let's talk"];
const MARQUEE_B = ["Code", "Motion", "Design", "Speed", "Detail"];

/* ===== Efek teks ngacak (scramble) ===== */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";
const scrambleTweens = new WeakMap<HTMLElement, gsap.core.Tween>();

function scramble(el: HTMLElement, text: string) {
  scrambleTweens.get(el)?.kill();
  const state = { p: 0 };

  const tween = gsap.to(state, {
    p: 1,
    duration: 0.8,
    ease: "none",
    onUpdate: () => {
      const reveal = Math.floor(state.p * text.length);
      el.textContent = text
        .split("")
        .map((c, i) =>
          i < reveal || c === "@" || c === "." || c === " "
            ? c
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        )
        .join("");
    },
    onComplete: () => {
      el.textContent = text;
    },
  });

  scrambleTweens.set(el, tween);
}

/* ===== Satu kelompok teks marquee ===== */
function MarqueeGroup({
  words,
  outline = false,
}: {
  words: string[];
  outline?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center">
      {[...words, ...words].map((w, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span
            className={`px-6 font-display text-4xl font-black uppercase italic tracking-[-0.02em] md:px-10 md:text-6xl ${
              outline ? "text-transparent" : "text-black"
            }`}
            style={outline ? { WebkitTextStroke: "1px rgba(255,255,255,0.45)" } : undefined}
          >
            {w}
          </span>
          <span className={outline ? "text-[#FF8000]" : "text-black"}>✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLSpanElement>(null);

  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  /* ===== Salin email ===== */
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  /* ===== Kirim form lewat WhatsApp ===== */
  const sendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const text = `Halo Zril, saya ${name.trim() || "pengunjung portfolio"}.\n\n${message.trim()}`;
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      /* ===== KURSOR: cahaya oranye + tombol magnetik ===== */
      if (finePointer && !reduceMotion) {
        const spot = section.querySelector<HTMLElement>(".contact-spot");

        if (spot) {
          const sx = gsap.quickTo(spot, "x", { duration: 0.9, ease: "power3.out" });
          const sy = gsap.quickTo(spot, "y", { duration: 0.9, ease: "power3.out" });

          const onMove = (e: MouseEvent) => {
            const r = section.getBoundingClientRect();
            sx(e.clientX - r.left);
            sy(e.clientY - r.top);
          };
          const onEnter = () => gsap.to(spot, { opacity: 1, duration: 0.6 });
          const onLeave = () => gsap.to(spot, { opacity: 0, duration: 0.6 });

          section.addEventListener("mousemove", onMove);
          section.addEventListener("mouseenter", onEnter);
          section.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            section.removeEventListener("mousemove", onMove);
            section.removeEventListener("mouseenter", onEnter);
            section.removeEventListener("mouseleave", onLeave);
          });
        }

        gsap.utils.toArray<HTMLElement>(".magnetic").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.4)" });

          const move = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };

          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", leave);
          });
        });
      }

      if (reduceMotion) return;

      /* ===== KEADAAN AWAL ===== */
      const lights = gsap.utils.toArray<HTMLElement>(".light");
      gsap.set(lights, { boxShadow: "0 0 0px 0px rgba(255,128,0,0)" });
      gsap.set(".contact-title-line", { yPercent: 110 });
      gsap.set(".contact-fade", { y: 30, opacity: 0 });

      /* ===== LAMPU START: nyala satu-satu, padam, judul meledak ===== */
      const start = gsap.timeline({
        scrollTrigger: { trigger: ".lights", start: "top 80%", once: true },
      });

      lights.forEach((l, i) => {
        start.to(
          l,
          {
            backgroundColor: "#FF8000",
            boxShadow: "0 0 28px 6px rgba(255,128,0,0.75)",
            duration: 0.12,
          },
          i * 0.4
        );
      });

      start
        .to(
          lights,
          {
            backgroundColor: "#1a1a1a",
            boxShadow: "0 0 0px 0px rgba(255,128,0,0)",
            duration: 0.08,
          },
          "+=0.7"
        )
        .fromTo(
          ".contact-flash",
          { opacity: 0.22 },
          { opacity: 0, duration: 0.8, ease: "power2.out" },
          "<"
        )
        .to(
          ".contact-title-line",
          { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" },
          "<0.05"
        )
        .to(
          ".contact-fade",
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" },
          "<0.3"
        );

      /* ===== BARIS KONTAK + FORM ===== */
      gsap.from(".channel", {
        x: -60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".channels", start: "top 82%", once: true },
      });

      gsap.from(".contact-form", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-form", start: "top 85%", once: true },
      });

      /* ===== MARQUEE: ngebut saat scroll cepat, balik arah saat scroll ke atas ===== */
      const makeMarquee = (selector: string, reverse: boolean) => {
        const tween = reverse
          ? gsap.fromTo(selector, { xPercent: -50 }, { xPercent: 0, duration: 30, ease: "none", repeat: -1 })
          : gsap.to(selector, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });

        const sign = reverse ? -1 : 1;

        ScrollTrigger.create({
          trigger: ".marquees",
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 250, 8);
            gsap.to(tween, {
              timeScale: self.direction * sign * (1 + boost),
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(tween, {
                  timeScale: self.direction * sign,
                  duration: 1.2,
                  ease: "power2.out",
                });
              },
            });
          },
        });
      };

      makeMarquee(".marquee-a", false);
      makeMarquee(".marquee-b", true);
    }, section);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-[#0A0A0A] px-6 pt-24 text-white md:px-10 md:pt-36"
    >
      {/* Cahaya oranye mengikuti kursor */}
      <div
        aria-hidden="true"
        className="contact-spot pointer-events-none absolute left-0 top-0 -ml-[260px] -mt-[260px] h-[520px] w-[520px] rounded-full bg-[#FF8000]/15 blur-[120px]"
        style={{ opacity: 0 }}
      />

      {/* Kilatan putih saat lampu padam */}
      <div
        aria-hidden="true"
        className="contact-flash pointer-events-none absolute inset-0 z-30 bg-white"
        style={{ opacity: 0 }}
      />

      {/* Angka outline di belakang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[28vw] font-black italic leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        05
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Label */}
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-[#FF8000]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#FF8000]">
            05 / Contact
          </span>
        </div>

        {/* Lampu start */}
        <div className="mb-12 flex flex-wrap items-center gap-5 md:mb-16">
          <div
            aria-hidden="true"
            className="lights inline-flex gap-3 border border-white/10 bg-[#101010] p-3 md:gap-4 md:p-4"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className="light h-6 w-6 rounded-full border border-white/10 bg-[#1a1a1a] md:h-9 md:w-9"
              />
            ))}
          </div>

          <span className="contact-fade text-[10px] uppercase tracking-[0.35em] text-white/40">
            Lights out and away we go
          </span>
        </div>

        {/* Judul */}
        <h2 className="mb-10 md:mb-14">
          <span className="block overflow-hidden">
            <span className="contact-title-line block font-display text-[13vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] md:text-[9vw]">
              Let&apos;s Build
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="contact-title-line block font-display text-[13vw] font-black uppercase italic leading-[0.9] tracking-[-0.05em] text-transparent md:text-[9vw]"
              style={{ WebkitTextStroke: "2px #FF8000" }}
            >
              Something Fast
            </span>
          </span>
        </h2>

        <p className="contact-fade mb-12 max-w-md text-sm leading-relaxed text-white/45 md:mb-16">
          Punya project, ide, atau tawaran kerja? Hubungi saya. Biasanya saya
          balas cepat, secepat pit stop.
        </p>

        {/* Email raksasa */}
        <div className="contact-fade mb-20 md:mb-28">
          <div className="mb-3 text-[10px] uppercase tracking-[0.35em] text-white/35">
            Kirim email langsung
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <a
              href={`mailto:${EMAIL}`}
              onMouseEnter={() => emailRef.current && scramble(emailRef.current, EMAIL)}
              className="group inline-block break-all font-display text-[7vw] font-black italic leading-none tracking-[-0.03em] transition-colors duration-300 hover:text-[#FF8000] md:text-[4.6vw]"
            >
              <span ref={emailRef}>{EMAIL}</span>
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="magnetic w-fit border border-white/20 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 transition-colors hover:border-[#FF8000] hover:text-[#FF8000]"
            >
              {copied ? "Tersalin ✓" : "Salin email"}
            </button>
          </div>
        </div>

        {/* Kontak + form */}
        <div className="grid gap-16 md:grid-cols-12 md:gap-12">
          {/* Daftar kanal */}
          <div className="md:col-span-7">
            <ul className="channels border-t border-white/10">
              {CHANNELS.map((c, i) => {
                const external = c.href.startsWith("http");

                return (
                  <li key={c.label} className="channel border-b border-white/10">
                    <a
                      href={c.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group relative flex items-center justify-between gap-6 overflow-hidden px-2 py-6 md:px-4 md:py-7"
                    >
                      {/* Sapuan oranye saat hover */}
                      <span className="absolute inset-0 translate-y-full bg-[#FF8000] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0" />

                      <span className="relative z-10 flex items-baseline gap-4 md:gap-6">
                        <span className="text-[10px] tracking-[0.25em] text-[#FF8000] transition-colors duration-300 group-hover:text-black">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-3xl font-black uppercase italic tracking-[-0.03em] transition-colors duration-300 group-hover:text-black md:text-5xl">
                          {c.label}
                        </span>
                      </span>

                      <span className="relative z-10 flex items-center gap-4">
                        <span className="hidden max-w-[40vw] truncate text-xs tracking-[0.15em] text-white/45 transition-colors duration-300 group-hover:text-black sm:block">
                          {c.handle}
                        </span>
                        <span className="text-2xl transition-all duration-500 group-hover:rotate-45 group-hover:text-black">
                          ↗
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Form */}
          <form
            onSubmit={sendWhatsApp}
            className="contact-form border border-white/10 bg-[#111] p-6 md:col-span-5 md:p-8"
          >
            <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF8000]" />
              Radio check
            </div>

            <label className="group relative mb-8 block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Nama</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Siapa nama kamu?"
                autoComplete="name"
                className="mt-2 w-full border-b border-white/15 bg-transparent pb-3 text-sm text-white outline-none placeholder:text-white/25"
              />
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#FF8000] transition-transform duration-500 group-focus-within:scale-x-100" />
            </label>

            <label className="group relative mb-10 block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Pesan</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                placeholder="Ceritakan project atau idemu..."
                className="mt-2 w-full resize-none border-b border-white/15 bg-transparent pb-3 text-sm text-white outline-none placeholder:text-white/25"
              />
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#FF8000] transition-transform duration-500 group-focus-within:scale-x-100" />
            </label>

            <button
              type="submit"
              className="magnetic group inline-flex w-full items-center justify-between gap-3 bg-[#FF8000] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white"
            >
              Kirim lewat WhatsApp
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            <p className="mt-4 text-[10px] leading-relaxed text-white/30">
              Pesan akan dibuka di WhatsApp, tinggal kamu tekan kirim.
            </p>
          </form>
        </div>
      </div>

      {/* ===== MARQUEE ===== */}
      <div className="marquees relative -mx-6 mt-28 pb-16 md:-mx-10 md:mt-40 md:pb-24">
        <div className="relative z-10 -rotate-2 overflow-hidden bg-[#FF8000] py-4 md:py-5">
          <div className="marquee-a flex w-max">
            <MarqueeGroup words={MARQUEE_A} />
            <MarqueeGroup words={MARQUEE_A} />
          </div>
        </div>

        <div className="relative -mt-3 rotate-1 overflow-hidden border-y border-white/10 bg-[#0F0F0F] py-4 md:-mt-4 md:py-5">
          <div className="marquee-b flex w-max">
            <MarqueeGroup words={MARQUEE_B} outline />
            <MarqueeGroup words={MARQUEE_B} outline />
          </div>
        </div>
      </div>
    </section>
  );
}