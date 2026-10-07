"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Mode = "default" | "hover" | "label" | "text" | "dot";

// Tampilan cincin & titik untuk tiap mode
const CONFIG: Record<
  Mode,
  {
    w: number;
    h: number;
    bg: string;
    border: string;
    radius: number;
    ringOpacity: number;
    dotScale: number;
    labelOpacity: number;
  }
> = {
  default: {
    w: 38, h: 38,
    bg: "rgba(255,128,0,0)",
    border: "rgba(255,255,255,0.5)",
    radius: 999,
    ringOpacity: 1, dotScale: 1, labelOpacity: 0,
  },
  hover: {
    w: 64, h: 64,
    bg: "rgba(255,128,0,0.14)",
    border: "rgba(255,128,0,0.9)",
    radius: 999,
    ringOpacity: 1, dotScale: 0, labelOpacity: 0,
  },
  label: {
    w: 96, h: 96,
    bg: "rgba(255,128,0,1)",
    border: "rgba(255,128,0,1)",
    radius: 999,
    ringOpacity: 1, dotScale: 0, labelOpacity: 1,
  },
  text: {
    w: 2, h: 30,
    bg: "rgba(255,128,0,1)",
    border: "rgba(255,128,0,1)",
    radius: 2,
    ringOpacity: 1, dotScale: 0, labelOpacity: 0,
  },
  dot: {
    w: 0, h: 0,
    bg: "rgba(255,128,0,0)",
    border: "rgba(255,255,255,0)",
    radius: 999,
    ringOpacity: 0, dotScale: 1.6, labelOpacity: 0,
  },
};

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotWrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  /* Aktif hanya untuk perangkat dengan mouse */
  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    const ringWrap = ringWrapRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const dotWrap = dotWrapRef.current;
    const dot = dotRef.current;
    if (!root || !ringWrap || !ring || !label || !dotWrap || !dot) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-custom-cursor");

    const mouse = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };
    let first = true;
    let mode: Mode = "default";
    let modeKey = "default";

    /* ===== Ganti tampilan sesuai elemen di bawah kursor ===== */
    const setMode = (next: Mode, text = "") => {
      const key = `${next}:${text}`;
      if (key === modeKey) return;
      modeKey = key;
      mode = next;

      const c = CONFIG[next];
      const d = reduceMotion ? 0.01 : 0.45;

      label.textContent = next === "label" ? text : "";

      gsap.to(ring, {
        width: c.w,
        height: c.h,
        backgroundColor: c.bg,
        borderColor: c.border,
        borderRadius: c.radius,
        opacity: c.ringOpacity,
        duration: d,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(dot, { scale: c.dotScale, duration: d * 0.7, ease: "power3.out", overwrite: "auto" });
      gsap.to(label, {
        opacity: c.labelOpacity,
        scale: c.labelOpacity ? 1 : 0.6,
        duration: d * 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    /* ===== Event ===== */
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (first) {
        first = false;
        pos.x = mouse.x;
        pos.y = mouse.y;
        gsap.to(root, { opacity: 1, duration: 0.3 });
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;

      if (t.closest("[data-cursor-style='dot']")) return setMode("dot");

      const labeled = t.closest<HTMLElement>("[data-cursor]");
      if (labeled) return setMode("label", labeled.dataset.cursor ?? "");

      if (t.closest("input, textarea, select")) return setMode("text");

      if (t.closest("a, button, [role='button'], label, summary")) return setMode("hover");

      setMode("default");
    };

    const onDown = (e: MouseEvent) => {
      if (reduceMotion) return;

      // Riak saat klik
      const b = document.createElement("span");
      b.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:14px;height:14px;margin:-7px 0 0 -7px;border:1.5px solid #FF8000;border-radius:9999px;`;
      root.appendChild(b);

      gsap.fromTo(
        b,
        { scale: 0.4, opacity: 0.9 },
        { scale: 5, opacity: 0, duration: 0.7, ease: "power3.out", onComplete: () => b.remove() }
      );
    };

    const onLeaveWindow = () => {
      if (!first) gsap.to(root, { opacity: 0, duration: 0.25 });
    };
    const onEnterWindow = () => {
      if (!first) gsap.to(root, { opacity: 1, duration: 0.25 });
    };

    /* ===== Loop: titik langsung, cincin mengejar + melar ===== */
    const tick = () => {
      const k = reduceMotion ? 1 : 0.2;
      const vx = mouse.x - pos.x;
      const vy = mouse.y - pos.y;

      pos.x += vx * k;
      pos.y += vy * k;

      dotWrap.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      ringWrap.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      if (mode === "default" && !reduceMotion) {
        const s = Math.min(Math.hypot(vx, vy) / 90, 0.5);
        const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
        ring.style.transform = `rotate(${angle}deg) scale(${1 + s}, ${1 - s * 0.4})`;
      } else {
        ring.style.transform = "none";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
      gsap.ticker.remove(tick);
      gsap.killTweensOf([root, ring, dot, label]);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] h-0 w-0"
      style={{ opacity: 0 }}
    >
      {/* Cincin */}
      <div ref={ringWrapRef} className="absolute left-0 top-0 h-0 w-0">
        <div
          ref={ringRef}
          className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-solid"
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            backgroundColor: "rgba(255,128,0,0)",
            borderColor: "rgba(255,255,255,0.5)",
          }}
        >
          <span
            ref={labelRef}
            className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-black"
            style={{ opacity: 0 }}
          />
        </div>
      </div>

      {/* Titik */}
      <div ref={dotWrapRef} className="absolute left-0 top-0 h-0 w-0">
        <div
          ref={dotRef}
          className="absolute left-0 top-0 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        />
      </div>
    </div>
  );
}