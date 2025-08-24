import "../styles/globals.css";
import "../lib/i18n";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Base meta */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <title>Melamandi · Cesti di frutta e verdura · Roma Nord</title>
        <meta
          name="description"
          content="Ordini giornalieri 18:00–22:00 · Consegna domani 10:00–14:00 · Solo Roma Nord entro il GRA"
        />
        <meta name="theme-color" content="#0f1115" />

        {/* Icons */}
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.svg" />

        {/* OpenGraph */}
        <meta property="og:title" content="Melamandi" />
        <meta
          property="og:description"
          content="Cesti freschi di frutta e verdura · Roma Nord entro il GRA"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://melamandi.it" />
        <meta property="og:image" content="/logo.svg" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Melamandi" />
        <meta
          name="twitter:description"
          content="Ordini giornalieri 18–22 · Consegna domani 10–14 · Roma Nord"
        />
        <meta name="twitter:image" content="/logo.svg" />

        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Plausible Analytics */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Melamandi",
              image: "https://melamandi.it/logo.svg",
              url: "https://melamandi.it",
              telephone: "+39-333-1234567",
              email: "info@melamandi.it",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Roma Nord entro il GRA (Boccea–Nomentana)",
                addressLocality: "Roma",
                addressRegion: "Lazio",
                postalCode: "00100",
                addressCountry: "IT",
              },
              openingHours: "Mo-Su 18:00-22:00",
              priceRange: "€€",
              servesCuisine: "Prodotti freschi · Frutta · Verdura",
              areaServed: "Roma Nord (entro il GRA: Boccea–Nomentana)",
            }),
          }}
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
