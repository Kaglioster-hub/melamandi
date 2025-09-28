import "./globals.css";
import ProductCard from "./components/ProductCard";
import CartCheckout from "./components/CartCheckout";
import { CartProvider } from "./components/CartProvider";

export default function Page(){
  return (
    <main>
      <header className="header">
        <div className="header-inner">
          <div className="flex items-center gap-2">
            <img src="/mela.png" alt="MelaMandi" className="w-6 h-6" />
            <span className="brand">MelaMandi</span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="#catalogo" className="nav">Catalogo</a>
            <a href="#carrello" className="nav">Carrello</a>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <section className="text-center mb-6">
          <div className="mx-auto inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--panel)] text-sm">
            Cesti di frutta fresca. Consegna Roma Nord (nelle zone coperte dal servizio).
          </div>
          <h1 className="sr-only">MelaMandi</h1>
          <p className="opacity-80 mt-3 text-balance">Ordini attivi ogni giorno <b>18:00–22:00</b>. Gli ordini effettuati in quella fascia vengono consegnati <b>il giorno successivo</b> tra <b>14:00–18:00</b>. Fuori orario il sito è in sola consultazione.</p>
        </section>

        <CartProvider>
          <section id="catalogo" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProductCard
              name="Base"
              listPrice={26.1}
              image="https://blog.naturlider.com/wp-content/uploads/2019/11/Productos-de-temporada-en-julio-para-tu-alimentaci%C3%B3n-1.jpg"
              description="Cesto essenziale: scegli 2 frutti a piacere o Stagionale."
              fruits={["Mele","Pere","Banane","Arance"]}
            />
            <ProductCard
              name="Esotico"
              listPrice={44.1}
              image="https://blog.naturlider.com/wp-content/uploads/2019/11/Productos-de-temporada-en-julio-para-tu-alimentaci%C3%B3n-1.jpg"
              description="Cesto esotico: mango, ananas, papaya, kiwi (o Stagionale)."
              fruits={["Mango","Ananas","Papaya","Kiwi"]}
            />
            <ProductCard
              name="Deluxe"
              listPrice={62.1}
              image="https://blog.naturlider.com/wp-content/uploads/2019/11/Productos-de-temporada-en-julio-para-tu-alimentaci%C3%B3n-1.jpg"
              description="Cesto completo: selezione premium, scegli 2 frutti o Stagionale."
              fruits={["Mele","Pere","Banane","Arance","Mango","Ananas","Papaya","Kiwi"]}
            />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-[1.2fr_.8fr] gap-6 mt-8">
            <div className="card">
              <h3 className="text-lg font-semibold">Note</h3>
              <p className="opacity-70 text-sm mt-1">
                ATTENZIONE: Le taglie dei cesti "S" (Small - 2,5kg)/ "M" (Medium - 5kg)/ "L" (Large - 8kg) moltiplicano la quantità scelta. Consegna fissa €4,90 **solo nelle zone servite**. Seleziona 2 frutti (o Stagionale) e aggiungi al carrello.
              </p>
            </div>
            <div id="carrello"><CartCheckout/></div>
          </section>
        </CartProvider>
      </div>
    </main>
  );
}
