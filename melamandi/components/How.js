"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const variants = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
};

export default function How() {
  const { t } = useTranslation();

  const title = t("how_title") || "Come funziona";
  const steps = [
    { emoji: "🥗", text: t("how_1") || "Scegli il cesto che preferisci: classico, family o detox." },
    { emoji: "⏰", text: t("how_2") || "Ordina tra le 18:00 e le 22:00: ci metti 30 secondi." },
    { emoji: "🚚", text: t("how_3") || "Consegna domani 10:00–14:00 (Roma Nord entro il GRA)." },
  ];

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Come ordinare Melamandi",
    description: "Seleziona il cesto, ordina la sera, ricevi il giorno dopo",
    step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.text })),
  };

  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="how-title">
      {/* JSON-LD SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <h2 id="how-title" className="text-center text-3xl font-bold mb-10 title-glow">
        {title}
      </h2>

      <motion.ol
        className="grid sm:grid-cols-3 gap-6"
        variants={variants.container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        role="list"
      >
        {steps.map((s, idx) => (
          <motion.li key={idx} variants={variants.item}>
            <article
              className="glass p-6 rounded-2xl hover-float transition-all h-full flex flex-col items-center text-center"
              aria-label={`Step ${idx + 1}: ${s.text}`}
            >
              <div className="text-4xl mb-3" aria-hidden="true">
                {s.emoji}
              </div>
              <p className="text-sm sm:text-base text-gray-200">{s.text}</p>
              <div className="mt-4 text-xs opacity-70">Step {idx + 1}</div>
            </article>
          </motion.li>
        ))}
      </motion.ol>

      {/* micro CTA opzionale */}
      <div className="mt-10 text-center">
        <a href="#baskets" className="btn-ghost">
          Vai ai cesti
        </a>
      </div>
    </section>
  );
}
