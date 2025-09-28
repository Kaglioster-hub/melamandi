import ProductCard from "./components/ProductCard";
import {CartProvider} from "./components/CartProvider";
import CartCheckout from "./components/CartCheckout";

const NORMAL = ["Mele","Pere","Banane","Arance"];
const EXOTIC = ["Mango","Ananas","Papaya","Kiwi"];
const MIX = Array.from(new Set([...NORMAL, ...EXOTIC]));

export default function Page(){
  return (
    <main className="container">
      <header className="site-header">
        <div className="brand-wrap">
          <img src="/mela.png" alt="MelaMandi" className="brand-logo" />
          <span className="brand">MelaMandi</span>
        </div>
        <nav className="nav">
          <a href="#catalogo">Catalogo</a>
          <a href="#preventivo" className="muted">Preventivo</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Cesti di frutta rivisitati. Consegna Roma Nord.</h1>
        <p>Prezzi già scontati del 40%. Scegli 2 frutti o “Stagionale”.</p>
      </section>

      <CartProvider>
        <section id="catalogo" className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4">
          <ProductCard
            name="Base"
            listPrice={29}
            image="https://tse4.mm.bing.net/th/id/OIP.BYMZEWZTB4eXmh9rsjKmcAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3"
            description="Cesto essenziale: scegli 2 frutti a piacere o Stagionale."
            fruits={NORMAL}
          />
          <ProductCard
            name="Esotico"
            listPrice={49}
            image="https://tse4.mm.bing.net/th/id/OIP.BYMZEWZTB4eXmh9rsjKmcAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3"
            description="Cesto esotico: mango, ananas, papaya (o Stagionale)."
            fruits={EXOTIC}
          />
          <ProductCard
            name="Deluxe"
            listPrice={69}
            image="https://tse4.mm.bing.net/th/id/OIP.BYMZEWZTB4eXmh9rsjKmcAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3"
            description="Cesto completo: selezione premium con scelta 2 frutti o Stagionale."
            fruits={MIX}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 rounded-2xl p-4 border border-[var(--border)] bg-[var(--panel)]">
            <h3 className="text-lg font-semibold">Note</h3>
            <p className="opacity-70 text-sm mt-1">
              Taglie: S/M/L moltiplicano la quantità. Consegna fissa €4,90.
              Seleziona 2 frutti (o Stagionale) e aggiungi al carrello.
            </p>
          </div>
          <CartCheckout />
        </section>
      </CartProvider>
    </main>
  );
}
