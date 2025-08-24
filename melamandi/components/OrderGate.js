"use client";
import { useEffect, useState, useRef } from "react";
import { isOrderingOpen, nextOpeningCountdown } from "../lib/time.mjs";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderGate({ children }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [cd, setCd] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const closeBtnRef = useRef(null);

  // aggiorna stato ogni secondo
  useEffect(() => {
    const tick = () => {
      const ok = isOrderingOpen();
      setOpen(ok);
      if (!ok) setCd(nextOpeningCountdown());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (open) return children;

  // formattazione countdown
  const fmt = (n) => String(n).padStart(2, "0");
  const countdown = `${fmt(cd.hours)}:${fmt(cd.minutes)}:${fmt(cd.seconds)}`;

  return (
    <>
      {/* JSON-LD SEO sugli orari */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FoodEstablishment",
            name: "Melamandi",
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "18:00",
                closes: "22:00",
              },
            ],
          }),
        }}
      />

      <AnimatePresence>
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 text-white p-6"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="closed-title"
          aria-describedby="closed-msg"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass max-w-md w-full mx-auto p-8 text-center rounded-2xl"
          >
            <h2 id="closed-title" className="text-2xl font-bold mb-3 title-glow">
              {t("out_closed_title") || "Ordini chiusi"}
            </h2>
            <p id="closed-msg" className="mb-2 text-gray-300">
              {t("out_closed_msg") ||
                "Al momento non stiamo raccogliendo ordini."}
            </p>
            <p className="mb-6 text-sm opacity-80">
              {t("out_reopen", { h: cd.hours, m: cd.minutes }) ||
                `Riapriamo tra ${countdown}`}
            </p>

            <a
              ref={closeBtnRef}
              href="#order"
              className="btn-primary inline-block"
            >
              {t("out_cta") || "Lascia i tuoi dati per un promemoria"}
            </a>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
