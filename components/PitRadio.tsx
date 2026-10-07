"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { PROJECTS } from "@/lib/projects";

const EMAIL = "nazrilirfani86@gmail.com";
const WA = "https://wa.me/6287742905363";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

type Item = {
  id: string;
  group: string;
  label: string;
  tag: string;
  keywords: string;
  run: () => void;
};

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
}

export default function PitRadio() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const toastTimer = useRef<number | null>(null);

  /* ===== Buka / tutup ===== */
  const openPalette = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    setQuery("");
    setActive(0);
    setOpen(true);
    lenisRef.current?.stop();
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    document.body.style.overflow = "";
    lenisRef.current?.start();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2000);
  };

  /* ===== Aksi-aksi ===== */
  const goSection = (href: string) => {
    window.setTimeout(() => {
      // Di halaman lain: pindah ke beranda dulu
      if (pathname !== "/") {
        router.push(`/${href}`);
        return;
      }
      const l = lenisRef.current;
      if (l) l.scrollTo(href, { duration: 1.6 });
      else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const openLink = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const items: Item[] = [
    ...SECTIONS.map((s, i) => ({
      id: `nav-${s.id}`,
      group: "Navigasi",
      label: `Ke ${s.label}`,
      tag: String(i + 1).padStart(2, "0"),
      keywords: `${s.label} ${s.id} bagian section pergi`,
      run: () => goSection(`#${s.id}`),
    })),
    ...PROJECTS.map((p) => ({
      id: `prj-${p.slug}`,
      group: "Project",
      label: p.title,
      tag: p.category,
      keywords: `${p.tags.join(" ")} ${p.category} project proyek ${p.slug}`,
      run: () => router.push(`/projects/${p.slug}`),
    })),
    {
      id: "act-email",
      group: "Aksi",
      label: "Salin email",
      tag: "Clipboard",
      keywords: "email gmail surel copy salin kontak",
      run: () => {
        navigator.clipboard
          .writeText(EMAIL)
          .then(() => showToast("Email tersalin"))
          .catch(() => (window.location.href = `mailto:${EMAIL}`));
      },
    },
    {
      id: "act-wa",
      group: "Aksi",
      label: "Kirim pesan WhatsApp",
      tag: "Buka",
      keywords: "whatsapp wa chat hubungi kontak pesan",
      run: () => openLink(WA),
    },
    {
      id: "act-cv",
      group: "Aksi",
      label: "Unduh CV",
      tag: "PDF",
      keywords: "cv resume curriculum vitae download unduh",
      run: () => {
        const a = document.createElement("a");
        a.href = "/cv-nazril-irfani.pdf";
        a.download = "CV-Nazril-Irfani.pdf";
        a.click();
        showToast("Mengunduh CV");
      },
    },
    {
      id: "act-game",
      group: "Aksi",
      label: "Main Lights Out Challenge",
      tag: "Game",
      keywords: "game reaksi lampu lights out tantangan main uji",
      run: () => window.setTimeout(() => window.dispatchEvent(new Event("lights-out:open")), 200),
    },
    {
      id: "act-top",
      group: "Aksi",
      label: "Kembali ke atas",
      tag: "Scroll",
      keywords: "atas top paling atas naik",
      run: () => {
        window.setTimeout(() => {
          const l = lenisRef.current;
          if (l) l.scrollTo(0, { duration: 1.6 });
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);
      },
    },
    {
      id: "soc-github",
      group: "Sosial",
      label: "Buka GitHub",
      tag: "ForRyll",
      keywords: "github git repo kode source",
      run: () => openLink("https://github.com/ForRyll"),
    },
    {
      id: "soc-ig",
      group: "Sosial",
      label: "Buka Instagram",
      tag: "@azrllrfn",
      keywords: "instagram ig sosmed",
      run: () => openLink("https://www.instagram.com/azrllrfn/"),
    },
    {
      id: "soc-x",
      group: "Sosial",
      label: "Buka X (Twitter)",
      tag: "@azrllrfn",
      keywords: "x twitter sosmed",
      run: () => openLink("https://x.com/azrllrfn"),
    },
  ];

  /* ===== Pencarian ===== */
  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  const score = (it: Item) => {
    const l = it.label.toLowerCase();
    if (l.startsWith(q)) return 0;
    if (l.includes(q)) return 1;
    return 2;
  };

  const results =
    terms.length === 0
      ? items
      : items
          .filter((it) => {
            const hay = `${it.label} ${it.keywords} ${it.group}`.toLowerCase();
            return terms.every((t) => hay.includes(t));
          })
          .sort((a, b) => score(a) - score(b));

  const resultsRef = useRef<Item[]>(results);
  resultsRef.current = results;
  const activeRef = useRef(active);
  activeRef.current = active;

  const exec = useCallback(
    (it: Item) => {
      close();
      it.run();
    },
    [close]
  );

  /* ===== Pemicu global: Ctrl/Cmd+K, "/" , atau event dari tombol ===== */
  useEffect(() => {
    const onOpen = () => openPalette();

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && k === "k") {
        e.preventDefault();
        if (openRef.current) close();
        else openPalette();
        return;
      }

      if (k === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !openRef.current && !isTyping(e.target)) {
        e.preventDefault();
        openPalette();
      }
    };

    window.addEventListener("pit-radio:open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pit-radio:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [openPalette, close]);

  /* ===== Keyboard saat terbuka ===== */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      const list = resultsRef.current;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (list.length ? (a + 1) % list.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (list.length ? (a - 1 + list.length) % list.length : 0));
      } else if (e.key === "Enter") {
        const it = list[activeRef.current];
        if (it) {
          e.preventDefault();
          exec(it);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, exec]);

  /* ===== Animasi buka + fokus input ===== */
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".pr-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        ".pr-panel",
        { y: -24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" }
      );
      gsap.from(".pr-item", {
        y: 12,
        opacity: 0,
        duration: 0.4,
        stagger: 0.012,
        ease: "power3.out",
        delay: 0.1,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [open]);

  /* ===== Jaga item aktif tetap terlihat ===== */
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, query]);

  /* ===== Bersihkan saat dilepas ===== */
  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Toast kecil */}
      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-24 left-1/2 z-[170] -translate-x-1/2 border border-[#FF8000]/50 bg-[#0A0A0A]/90 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-[#FF8000] backdrop-blur-md"
        >
          {toast}
        </div>
      )}

      {open && (
        <div
          ref={rootRef}
          role="dialog"
          aria-modal="true"
          aria-label="Pit Radio"
          className="fixed inset-0 z-[160]"
        >
          <div
            className="pr-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          <div className="pr-panel relative mx-auto mt-[12vh] w-[min(92vw,640px)] border border-white/10 bg-[#0C0C0C] text-white shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            {/* Input */}
            <div className="flex items-center gap-4 border-b border-white/10 px-5 py-4">
              <span className="flex shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#FF8000]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8000]" />
                Pit radio
              </span>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                aria-label="Cari perintah"
                placeholder="Ketik: project, cv, email, game..."
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />

              <kbd className="hidden border border-white/15 px-1.5 py-0.5 text-[9px] text-white/40 sm:block">
                Esc
              </kbd>
            </div>

            {/* Daftar */}
            <div
              ref={listRef}
              data-lenis-prevent
              role="listbox"
              className="max-h-[52vh] overflow-y-auto overscroll-contain py-2"
            >
              {results.length === 0 && (
                <p className="px-5 py-10 text-center text-xs text-white/40">
                  Tidak ada hasil untuk “{query}”. Roger, coba kata lain.
                </p>
              )}

              {results.map((it, i) => (
                <div key={it.id}>
                  {!q && (i === 0 || results[i - 1].group !== it.group) && (
                    <div className="px-5 pb-1 pt-4 text-[9px] uppercase tracking-[0.35em] text-white/30">
                      {it.group}
                    </div>
                  )}

                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    data-active={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => exec(it)}
                    className={`pr-item relative flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${
                      i === active ? "bg-white/[0.06]" : ""
                    }`}
                  >
                    <span
                      className={`absolute inset-y-0 left-0 w-[2px] bg-[#FF8000] transition-opacity ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className={`text-sm ${i === active ? "text-white" : "text-white/70"}`}>
                      {it.label}
                    </span>
                    <span className="shrink-0 text-[9px] uppercase tracking-[0.25em] text-white/30">
                      {q ? `${it.group} · ${it.tag}` : it.tag}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Petunjuk */}
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[9px] uppercase tracking-[0.25em] text-white/30">
              <span className="flex items-center gap-4">
                <span>↑↓ pilih</span>
                <span>↵ jalankan</span>
              </span>
              <span>{results.length} perintah</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}