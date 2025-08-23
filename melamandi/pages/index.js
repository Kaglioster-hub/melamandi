import Nav from "../components/Nav";
import Hero from "../components/Hero";
import How from "../components/How";
import BasketCard from "../components/BasketCard";
import OrderForm from "../components/OrderForm";
import Footer from "../components/Footer";
import OrderGate from "../components/OrderGate";
import { CATALOG } from "../lib/config.mjs";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <OrderGate>
      <Nav />
      <main>
        <Hero />
        <section id="baskets" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">
            {t("baskets_title") || "I nostri cesti"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {Object.values(CATALOG).map((item) => (
              <BasketCard item={item} key={item.key} />
            ))}
          </div>
        </section>
        <How />
        <OrderForm />
      </main>
      <Footer />
    </OrderGate>
  );
}
