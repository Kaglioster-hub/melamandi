import { CartProvider } from './components/CartProvider';
import ProductCard from './components/ProductCard';
import CartCheckout from './components/CartCheckout';

export default function Page(){
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mela.png" alt="MelaMandi" />
          <span className="brand">MelaMandi</span>
        </div>
      </header>

      <CartProvider>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold">Catalogo</h2>
          <p className="opacity-70 mt-1">Cesti di frutta rivisitati. Consegna Roma Nord. Prezzi già scontati del 40%.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4">
          <ProductCard
            name="Base"
            listPrice={29}
            image={"https://images.unsplash.com/photo-1600486913747-55e0876a7432?q=80&w=1200&auto=format&fit=crop"}
            description="Cesto essenziale: scegli 2 frutti a piacere o Stagionale."
          />
          <ProductCard
            name="Esotico"
            listPrice={49}
            image={"https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop"}
            description="Cesto esotico: mango, ananas, papaya (o Stagionale)."
          />
          <ProductCard
            name="Deluxe"
            listPrice={55}
            image={"https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop"}
            description="Cesto completo: selezione premium con scelta 2 frutti o Stagionale."
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 rounded-2xl p-4 border border-[var(--border)] bg-[var(--panel)]">
            <h3 className="text-lg font-semibold">Note</h3>
            <p className="opacity-70 text-sm mt-1">Taglie: S/M/L moltiplicano la quantità. Consegna fissa {€4,90}. Seleziona 2 frutti (o Stagionale) e aggiungi al carrello.</p>
          </div>
          <CartCheckout />
        </section>
      </CartProvider>
    </main>
  )
}
