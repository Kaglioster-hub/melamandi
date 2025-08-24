"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { href: "#how", label: "Come funziona" },
  { href: "#baskets", label: "Cesti" },
  { href: "#order", label: "Ordina" },
  { href: "#contact", label: "Contatti" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const mobileBtnRef = useRef(null);

  // ✅ Ombra + glass più solido quando si scrolla
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Evidenziazione sezione attiva
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = SECTIONS.map((s) => document.getElementById(s.href.slice(1))).filter(Boolean);
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive("#" + visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ✅ Chiudi il menu mobile al cambio anchor
  useEffect(() => {
    const onHashChange = () => setOpen(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      {/* Skip link per tastiera */}
      <a
        href="#baskets"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-green-500 focus:text-black focus:px-3 focus:py-1 focus:rounded-lg"
      >
        Salta al contenuto
      </a>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all ${
          scrolled
            ? "backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-lg"
            : "backdrop-blur-md bg-black/30"
        }`}
        role="navigation"
        aria-label="Navigazione principale"
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-400/60 rounded-lg"
          >
            <img
              src="/logo.svg"
              alt="Melamandi"
              className="h-8 w-8"
              loading="eager"
            />
            <span className="font-bold tracking-wide">Melamandi</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-6 text-sm">
            {SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`transition-colors hover:text-green-400 ${
                  active === s.href
                    ? "text-green-400 font-semibold"
                    : "text-gray-300"
                }`}
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="#order"
              className="btn-primary whitespace-nowrap"
              prefetch={false}
            >
              Ordina ora
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={mobileBtnRef}
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-green-400/60"
            aria-label="Apri menu"
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((x) => !x)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile sheet */}
        <div
          className={`sm:hidden transition-[max-height,opacity] overflow-hidden ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 flex flex-col gap-2 text-sm">
            {SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`px-3 py-2 rounded-lg hover:bg-white/10 transition ${
                  active === s.href ? "text-green-400 font-semibold" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="#order"
              className="btn-primary text-center"
              onClick={() => setOpen(false)}
            >
              Ordina ora
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer per altezza nav */}
      <div aria-hidden="true" className="h-16 sm:h-[68px]" />
    </>
  );
}
