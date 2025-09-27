import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "MelaMandi – Cesti di Frutta Super Deluxe",
  description: "Cesti di frutta artigianali con consegna a Roma Nord (Riano, Castelnuovo, Morlupo, ecc.).",
  openGraph: {
    title: "MelaMandi",
    description: "Cesti di frutta artigianali • Roma Nord",
    images: ["/mela.png"],
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "MelaMandi",
    description: "Cesti di frutta artigianali • Roma Nord",
    images: ["/mela.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <header className="border-b border-[var(--border)] sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 light:supports-[backdrop-filter]:bg-white/60">
            <div className="container flex items-center gap-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand.green to-brand.purple text-[var(--bg)] font-bold">M</span>
                <div className="leading-tight">
                  <div className="font-semibold text-lg">MelaMandi</div>
                  <div className="text-xs opacity-60">Cesti di frutta • Roma Nord</div>
                </div>
              </div>
              <nav className="ml-auto flex items-center gap-2">
                <a className="btn btn-ghost" href="#catalogo">Catalogo</a>
                <a className="btn btn-ghost" href="#preventivo">Preventivo</a>
                <a className="btn btn-ghost" href="#carrello">Carrello</a>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          {children}
          <footer className="mt-24 border-t border-[var(--border)]">
            <div className="container py-10 grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <div className="font-semibold mb-2">MelaMandi</div>
                <p className="opacity-70">Cesti di frutta artigianali con consegna nelle zone servite.</p>
              </div>
              <div>
                <div className="font-semibold mb-2">Contatti</div>
                <p><a href="mailto:melamandi@vrabo.it" className="underline">melamandi@vrabo.it</a></p>
                <p><a href="https://wa.me/393805834799" className="underline">+39 380 583 4799</a></p>
              </div>
              <div>
                <div className="font-semibold mb-2">Legali</div>
                <a className="underline" href="/privacy">Privacy & Cookie</a><br/>
                <a className="underline" href="/terms">Termini & Condizioni</a>
                <div className="opacity-60 mt-2">© 2025 MelaMandi</div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
