import Link from "next/link";

export default function Nav(){
  return (
    <nav className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Melamandi" className="h-8 w-8"/>
          <span className="font-bold">Melamandi</span>
        </div>
        <div className="hidden sm:flex gap-6 text-sm">
          <Link href="#how">Come funziona</Link>
          <Link href="#baskets">Cesti</Link>
          <Link href="#order">Ordina</Link>
          <Link href="#contact">Contatti</Link>
        </div>
      </div>
    </nav>
  )
}
