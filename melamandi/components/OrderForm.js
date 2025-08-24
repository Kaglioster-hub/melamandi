"use client";
import { useState } from "react";
import { FORMSPREE } from "../lib/config.mjs";
import { ROME_ZIP_RE, addressLooksInRomaNord } from "../lib/zone.mjs";
import { tomorrowDeliveryWindowText } from "../lib/time.mjs";
import { useTranslation } from "react-i18next";

export default function OrderForm() {
  const { t } = useTranslation();
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const windowText = tomorrowDeliveryWindowText();

  const validate = () => {
    const zipOk = ROME_ZIP_RE.test(zip || "");
    const distOk = addressLooksInRomaNord(address || "");
    const good = zipOk && distOk;
    setOk(good);
    return good;
  };

  const onSubmit = (e) => {
    if (!FORMSPREE) {
      e.preventDefault();
      alert("⚠️ Configura FORMSPREE in .env");
      return;
    }
    if (!validate()) {
      e.preventDefault();
      return;
    }
    setLoading(true);
    // lascia al browser il POST verso Formspree
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <section id="order" className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="text-3xl font-bold mb-4 title-glow">{t("order_title")}</h2>
      <p className="text-gray-300 mb-6">
        {t("order_desc", { window: windowText })}
      </p>

      {submitted ? (
        <div className="glass p-6 text-center">
          <h3 className="text-xl font-semibold text-green-400 mb-2">
            ✅ {t("order_success") || "Ordine ricevuto!"}
          </h3>
          <p className="text-sm opacity-80">
            {t("order_followup") || "Ti ricontatteremo a breve per confermare."}
          </p>
        </div>
      ) : (
        <form
          method="POST"
          action={FORMSPREE || "#"}
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="delivery_window" value={windowText} />
          {/* Honeypot antispam */}
          <input
            type="text"
            name="_gotcha"
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder={t("name")}
              required
              className="glass p-3 w-full focus:ring-2 focus:ring-green-400/60"
            />
            <input
              name="email"
              type="email"
              placeholder={t("email")}
              required
              className="glass p-3 w-full focus:ring-2 focus:ring-green-400/60"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="address"
              placeholder={t("address")}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={validate}
              aria-invalid={!ok}
              aria-describedby={!ok ? "address-error" : undefined}
              className={`glass p-3 w-full focus:ring-2 ${
                !ok
                  ? "border border-red-400 focus:ring-red-400"
                  : "focus:ring-green-400/60"
              }`}
            />
            <input
              name="zip"
              placeholder={t("zip")}
              required
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              onBlur={validate}
              aria-invalid={!ok}
              aria-describedby={!ok ? "zip-error" : undefined}
              className={`glass p-3 w-full focus:ring-2 ${
                !ok
                  ? "border border-red-400 focus:ring-red-400"
                  : "focus:ring-green-400/60"
              }`}
            />
          </div>

          {!ok && (
            <p
              id="address-error"
              className="text-red-400 text-sm mt-1"
            >
              {t("zone_error") ||
                "Al momento consegniamo solo entro il GRA · Roma Nord (da Boccea a Nomentana)."}
            </p>
          )}

          <textarea
            name="notes"
            placeholder={t("notes")}
            className="glass p-3 w-full min-h-[100px] focus:ring-2 focus:ring-green-400/60"
          ></textarea>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("sending") || "Invio…" : t("send")}
            </button>
            {!FORMSPREE && (
              <span className="text-red-400 text-sm">
                Configura FORMSPREE in .env
              </span>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
