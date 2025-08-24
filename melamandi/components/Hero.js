"use client";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const { t } = useTranslation();

  const brand = t("brand") || "Melamandi";
  const tagline =
    t("tagline") ||
    "Cesti freschi di frutta e verdura—Roma Nord entro il GRA";
  const cta = t("cta_order") || "Ordina ora";

  return (
    <header
      className="relative pt-24"
      role="banner"
      aria-labelledby="hero-title"
      aria-describedby="hero-desc"
    >
      {/* sfondo cosmico */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute inset-0 opacity-30 bg-animated" />
        <div className="absolute inset-0 bg-[radial-gradient(45rem_30rem_at_50%_10%,rgba(34,197,94,0.10),transparent),radial-gradient(60rem_40rem_at_80%_80%,rgba(251,146,60,0.08),transparent)]" />
        <div className="absolute inset-0 mix-blend-overlay opacity-10 [background:repeating-linear-gradient(0deg,transparent_0px,transparent_2px,rgba(255,255,255,.05)_3px,transparent_4px)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mb-6 h-24 w-24 relative"
          aria-hidden="true"
        >
          {/* Se /logo.svg è semplice, <img> va benissimo; altrimenti usa next/image su png/webp */}
          <Image
            src="/logo.svg"
            alt=""
            fill
            sizes="96px"
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Titolo */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-extrabold title-glow"
        >
          <span className="text-gradient">{brand}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          id="hero-desc"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: "easeOut" }}
          className="mt-3 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto"
        >
          {tagline}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: "easeOut" }}
          className="mt-8"
        >
          <a
            href="#baskets"
            className="btn-primary inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-400/70"
          >
            {cta}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m0 0-5-5m5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </header>
  );
}
