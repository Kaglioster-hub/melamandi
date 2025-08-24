import Nav from "../components/Nav";
import Hero from "../components/Hero";
import How from "../components/How";
import BasketCard from "../components/BasketCard";
import OrderForm from "../components/OrderForm";
import Footer from "../components/Footer";
import OrderGate from "../components/OrderGate";
import { CATALOG } from "../lib/config.mjs";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Home() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  try {
    return (
      <OrderGate>
        <Nav />
        <main className="min-h-screen">
          <Hero />

          {/* Section Cesti */}
          <section id="baskets" className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-3xl font-bold mb-10 title-glow text-center">
              {t("baskets_title") || "🌱 I nostri cesti freschi"}
            </h2>

            {CATALOG && Object.values(CATALOG).length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {Object.values(CATALOG).map((item) => (
                  <div key={item.key} className="card hover-float">
                    <BasketCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">
                ⚠️ Nessun cesto disponibile al momento.
              </p>
            )}
          </section>

          {/* Come funziona */}
          <How />

          {/* Modulo ordine */}
          <OrderForm />
        </main>

        <Footer />
      </OrderGate>
    );
  } catch (e) {
    console.error("Errore rendering Home:", e);
    setError(e.message);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          ❌ Errore temporaneo
        </h1>
        <p className="text-gray-400">
          Qualcosa è andato storto. Riprova più tardi!
        </p>
      </div>
    );
  }
}
