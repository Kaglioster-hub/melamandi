export default function CancelPage(){
  return (
    <main className="container py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">Pagamento annullato</h1>
        <p className="opacity-80 mt-2">
          Nessun addebito è stato effettuato. Puoi riprovare il checkout quando vuoi.
        </p>
        <a className="btn btn-primary mt-6 inline-block" href="/">Torna alla home</a>
      </div>
    </main>
  );
}
