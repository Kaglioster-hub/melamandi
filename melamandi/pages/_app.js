import "../styles/globals.css";
import "../lib/i18n";
import Head from "next/head";

export default function App({ Component, pageProps }){
  return (<>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Melamandi · Cesti di frutta e verdura · Roma Nord</title>
      <meta name="description" content="Ordini giornalieri 18:00–22:00 · Consegna domani 10:00–14:00 · Solo Roma Nord entro il GRA" />
      <link rel="icon" href="/logo.svg" />
      <link rel="manifest" href="/manifest.json" />
      <meta property="og:title" content="Melamandi" />
      <meta property="og:description" content="Cesti freschi · Roma Nord entro il GRA" />
      <meta property="og:image" content="/logo.svg" />
      <meta name="theme-color" content="#0f1115" />
      <script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ""} src={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?`https://plausible.io/js/script.js`:""} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"LocalBusiness",
        "name":"Melamandi",
        "image":"/logo.svg",
        "areaServed":"Roma Nord (entro GRA: Boccea–Nomentana)",
        "address":{"@type":"PostalAddress","addressLocality":"Roma","addressRegion":"Lazio","addressCountry":"IT"},
        "openingHours":"Mo-Su 18:00-22:00",
        "url":"https://melamandi.it"
      })}}/>
    </Head>
    <Component {...pageProps} />
  </>);
}
