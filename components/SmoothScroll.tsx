"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Sinkronkan posisi scroll Lenis ke ScrollTrigger
function SyncScrollTrigger() {
  useLenis(ScrollTrigger.update);
  return null;
}

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Instance Lenis dibaca tiap tick, karena baru tersedia setelah ReactLenis siap
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false, // loop raf dijalankan manual lewat GSAP ticker
        lerp: 0.08,
      }}
    >
      <SyncScrollTrigger />
      {children}
    </ReactLenis>
  );
}