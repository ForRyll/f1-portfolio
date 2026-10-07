"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

type Phase = "idle" | "countdown" | "hold" | "go" | "result" | "jump" | "late";

const BEST_KEY = "zril-lights-best";
const LIGHT_STEP = 800; // ms antara lampu menyala
const LATE_AFTER = 3000; // ms setelah lampu padam sebelum dianggap terlalu lambat

function rate(ms: number) {
  if (ms < 150)
    return {
      tag: "Mencurigakan",
      text: "Di bawah 150 ms biasanya tebakan, bukan reaksi. Coba lagi tanpa menebak.",
    };
  if (ms < 200)
    return { tag: "Level F1", text: "Reaksi sekelas start pembalap F1. Ini bagus banget." };
  if (ms < 250)
    return { tag: "Sangat cepat", text: "Di atas kebanyakan orang. Pembalap F1 kira-kira di kisaran 0,2 detik." };
  if (ms < 300)
    return { tag: "Rata-rata", text: "Normal. Rata-rata orang biasanya di kisaran 250 ms." };
  if (ms < 400)
    return { tag: "Santai", text: "Masih aman buat jalan kaki, belum buat balapan." };
  return { tag: "Pit stop dulu?", text: "Lampunya sudah padam dari tadi. Coba lagi dan fokus ke lampunya." };
}

export default function LightsOut() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState(0);
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [record, setRecord] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const timers = useRef<number[]>([]);
  const startRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const openRef = useRef(false);
  const bestRef = useRef<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const changePhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  /* ===== Mulai satu ronde ===== */
  const begin = useCallback(() => {
    clearTimers();
    setMs(0);
    setLit(0);
    setRecord(false);
    changePhase("countdown");

    // Lampu menyala satu per satu
    for (let i = 1; i <= 5; i++) {
      timers.current.push(window.setTimeout(() => setLit(i), i * LIGHT_STEP));
    }
    timers.current.push(
      window.setTimeout(() => changePhase("hold"), 5 * LIGHT_STEP + 1)
    );

    // Jeda acak, lalu semua padam dan stopwatch mulai
    const out = 5 * LIGHT_STEP + 400 + Math.random() * 2400;
    timers.current.push(
      window.setTimeout(() => {
        setLit(0);
        startRef.current = performance.now();
        changePhase("go");

        if (flashRef.current) {
          gsap.fromTo(
            flashRef.current,
            { opacity: 0.12 },
            { opacity: 0, duration: 0.5, ease: "power2.out" }
          );
        }

        timers.current.push(
          window.setTimeout(() => {
            if (phaseRef.current === "go") changePhase("late");
          }, LATE_AFTER)
        );
      }, out)
    );
  }, [changePhase, clearTimers]);

  /* ===== Klik / tap / Spasi di arena ===== */
  const press = useCallback(() => {
    const p = phaseRef.current;

    // Terlalu cepat: jump start
    if (p === "countdown" || p === "hold") {
      clearTimers();
      changePhase("jump");
      return;
    }

    if (p === "go") {
      const t = Math.round(performance.now() - startRef.current);
      clearTimers();

      const prev = bestRef.current;
      const isRecord = prev === null || t < prev;
      if (isRecord) {
        bestRef.current = t;
        setBest(t);
        try {
          localStorage.setItem(BEST_KEY, String(t));
        } catch {
          /* penyimpanan tidak tersedia, abaikan */
        }
      }

      setRecord(isRecord);
      setMs(t);
      setHistory((h) => [t, ...h].slice(0, 5));
      changePhase("result");
    }
  }, [changePhase, clearTimers]);

  /* ===== Buka / tutup ===== */
  const openGame = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;

    try {
      const saved = Number(localStorage.getItem(BEST_KEY));
      if (saved > 0) {
        bestRef.current = saved;
        setBest(saved);
      }
    } catch {
      /* abaikan */
    }

    setLit(0);
    setMs(0);
    setRecord(false);
    changePhase("idle");
    setOpen(true);

    lenisRef.current?.stop();
    document.body.style.overflow = "hidden";
  }, [changePhase]);

  const close = useCallback(() => {
    clearTimers();
    openRef.current = false;
    setOpen(false);
    document.body.style.overflow = "";
    lenisRef.current?.start();
  }, [clearTimers]);

  /* ===== Pemicu global: event dari tombol, atau tombol L ===== */
  useEffect(() => {
    const onOpen = () => openGame();

    const onKey = (e: KeyboardEvent) => {
      if (openRef.current) return;
      if (e.key.toLowerCase() !== "l") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);
      if (typing) return;

      openGame();
    };

    window.addEventListener("lights-out:open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("lights-out:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [openGame]);

  /* ===== Keyboard saat game terbuka ===== */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.code === "Space" || e.key === "Enter") {
        if (e.repeat) return;
        e.preventDefault();

        // Lepas fokus supaya Spasi/Enter tidak ikut menekan tombol yang sedang fokus
        (document.activeElement as HTMLElement | null)?.blur();

        const p = phaseRef.current;
        if (p === "countdown" || p === "hold" || p === "go") press();
        else begin();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, press, begin, close]);

  /* ===== Animasi angka hasil ===== */
  useEffect(() => {
    if (phase === "result" && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" }
      );
    }
  }, [phase]);

  /* ===== Bersihkan saat komponen dilepas ===== */
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      document.body.style.overflow = "";
    };
  }, []);

  /* ===== Salin hasil ===== */
  const share = async () => {
    const text = `Aku dapet ${ms} ms di Lights Out Challenge ZRIL. Bisa ngalahin? ${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* abaikan */
    }
  };

  if (!open) return null;

  const rating = phase === "result" ? rate(ms) : null;
  const playing = phase === "countdown" || phase === "hold" || phase === "go";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lights Out Challenge"
      className="fixed inset-0 z-[150] flex select-none flex-col bg-[#0A0A0A]/95 text-white backdrop-blur-md"
    >
      {/* Kilatan saat lampu padam */}
      <div
        ref={flashRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: 0 }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-white/50">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8000]" />
          Lights Out Challenge
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Tutup game"
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-[#FF8000]"
        >
          <span className="hidden md:inline">Esc</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-base">
            ✕
          </span>
        </button>
      </div>

      {/* Arena: klik di mana saja saat ronde berjalan */}
      <div
        onPointerDown={playing ? press : undefined}
        className={`relative flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-10 ${
          playing ? "cursor-pointer" : ""
        }`}
      >
        {/* Gantry lampu */}
        <div
          aria-hidden="true"
          className="flex gap-3 border border-white/10 bg-[#101010] p-4 md:gap-5 md:p-6"
        >
          {[1, 2, 3, 4, 5].map((col) => (
            <div key={col} className="flex flex-col gap-3 md:gap-4">
              {[0, 1].map((row) => (
                <span
                  key={row}
                  className={`block h-10 w-10 rounded-full border transition-all duration-100 md:h-16 md:w-16 ${
                    lit >= col
                      ? "border-[#FF8000] bg-[#FF8000] shadow-[0_0_40px_8px_rgba(255,128,0,0.6)]"
                      : "border-white/10 bg-[#1a1a1a]"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Konten sesuai fase */}
        <div className="flex min-h-[260px] w-full max-w-xl flex-col items-center text-center">
          {phase === "idle" && (
            <>
              <h2 className="font-display text-5xl font-black uppercase italic leading-[0.9] tracking-[-0.04em] md:text-7xl">
                Lights out
                <br />
                <span className="text-[#FF8000]">and away</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
                Tunggu semua lampu padam, lalu klik, tap, atau tekan Spasi
                secepat mungkin. Jangan curi start.
              </p>
              {best !== null && (
                <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Rekor terbaikmu <span className="text-[#FF8000]">{best} ms</span>
                </p>
              )}
              <button
                type="button"
                onClick={begin}
                className="mt-8 bg-[#FF8000] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-black transition-colors hover:bg-white"
              >
                Start <span className="ml-2 opacity-60">Spasi</span>
              </button>
            </>
          )}

          {phase === "countdown" && (
            <p className="mt-8 text-[11px] uppercase tracking-[0.4em] text-white/50">
              Tunggu lampu padam...
            </p>
          )}

          {phase === "hold" && (
            <p className="mt-8 animate-pulse text-[11px] uppercase tracking-[0.4em] text-[#FF8000]">
              Siap...
            </p>
          )}

          {phase === "go" && (
            <p className="mt-2 animate-pulse font-display text-[20vw] font-black uppercase italic leading-none tracking-[-0.05em] text-[#FF8000] md:text-[10vw]">
              Go!
            </p>
          )}

          {phase === "result" && rating && (
            <div ref={resultRef} className="flex w-full flex-col items-center">
              {record && (
                <span className="mb-3 bg-[#FF8000] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-black">
                  Rekor baru
                </span>
              )}

              <div className="flex items-end gap-3 font-display font-black italic leading-none tracking-[-0.04em]">
                <span className="text-[22vw] tabular-nums md:text-[11vw]">{ms}</span>
                <span className="pb-3 text-2xl text-[#FF8000] md:pb-5 md:text-4xl">ms</span>
              </div>

              <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#FF8000]">
                {rating.tag}
              </div>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
                {rating.text}
              </p>

              <div className="mt-6 flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/40">
                <span>
                  Terbaik <span className="text-white">{best} ms</span>
                </span>
                <span className="hidden sm:inline">
                  Terakhir{" "}
                  <span className="text-white">{history.join(" · ")}</span>
                </span>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={begin}
                  className="bg-[#FF8000] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white"
                >
                  Coba lagi
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="border border-white/25 px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-[#FF8000] hover:text-[#FF8000]"
                >
                  {copied ? "Tersalin ✓" : "Salin hasil"}
                </button>
              </div>

              <p className="mt-6 text-[10px] leading-relaxed text-white/25">
                Hasil sudah termasuk jeda layar dan perangkat inputmu.
              </p>
            </div>
          )}

          {phase === "jump" && (
            <>
              <h2 className="font-display text-6xl font-black uppercase italic leading-[0.9] tracking-[-0.04em] text-[#FF8000] md:text-8xl">
                Jump start!
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
                Kamu klik sebelum lampu padam. Di balapan sungguhan, ini berarti
                penalti. Sabar, tunggu semuanya mati.
              </p>
              <button
                type="button"
                onClick={begin}
                className="mt-8 bg-[#FF8000] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-black transition-colors hover:bg-white"
              >
                Coba lagi
              </button>
            </>
          )}

          {phase === "late" && (
            <>
              <h2 className="font-display text-6xl font-black uppercase italic leading-[0.9] tracking-[-0.04em] md:text-8xl">
                Terlalu lambat
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
                Lampu sudah padam lebih dari 3 detik. Ketiduran di grid?
              </p>
              <button
                type="button"
                onClick={begin}
                className="mt-8 bg-[#FF8000] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-black transition-colors hover:bg-white"
              >
                Coba lagi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}