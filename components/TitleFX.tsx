"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";

/**
 * Cara pakai: tambahkan atribut data-scramble ke elemen teks mana pun.
 * Teksnya akan dipecah per huruf lalu dianimasikan saat masuk layar.
 */
export default function TitleFX() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scramble]"));
    const timelines = new Map<HTMLElement, gsap.core.Timeline>();
    const triggers: ScrollTrigger[] = [];
    const cleanups: Array<() => void> = [];

    els.forEach((el) => {
      if (el.dataset.split === "done") return;

      const text = el.textContent ?? "";
      el.dataset.split = "done";
      el.setAttribute("aria-label", text);
      el.textContent = "";

      /* ===== Pecah jadi kata -> huruf ===== */
      const chars: HTMLElement[] = [];
      const words = text.split(" ");

      words.forEach((w, wi) => {
        const word = document.createElement("span");
        word.setAttribute("aria-hidden", "true");
        word.style.cssText = "display:inline-block;white-space:nowrap";

        Array.from(w).forEach((c) => {
          const s = document.createElement("span");
          s.textContent = c;
          s.dataset.char = c;
          s.style.display = "inline-block";
          word.appendChild(s);
          chars.push(s);
        });

        el.appendChild(word);
        if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
      });

      gsap.set(chars, { opacity: 0 });

      /* ===== Animasi: tiap huruf ngacak lalu mendarat ===== */
      const play = (step: number, dur: number) => {
        timelines.get(el)?.kill();
        const tl = gsap.timeline();

        chars.forEach((c, i) => {
          const final = c.dataset.char ?? "";
          const scramblable = /[A-Za-z0-9]/.test(final);
          const st = { p: 0 };

          tl.set(c, { opacity: 1 }, i * step);
          tl.fromTo(
            c,
            { yPercent: 35 },
            { yPercent: 0, duration: 0.6, ease: "expo.out" },
            i * step
          );
          tl.to(
            st,
            {
              p: 1,
              duration: dur,
              ease: "none",
              onUpdate: () => {
                c.textContent =
                  st.p >= 1 || !scramblable
                    ? final
                    : POOL[Math.floor(Math.random() * POOL.length)];
              },
              onComplete: () => {
                c.textContent = final;
              },
            },
            i * step
          );
        });

        timelines.set(el, tl);
      };

      let played = false;

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            played = true;
            play(0.045, 0.55);
          },
        })
      );

      /* Hover: efeknya main lagi (lebih cepat) */
      const onEnter = () => {
        if (played) play(0.025, 0.4);
      };
      el.addEventListener("mouseenter", onEnter);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        timelines.get(el)?.kill();
        el.textContent = text; // kembalikan teks asli
        el.removeAttribute("aria-label");
        delete el.dataset.split;
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}