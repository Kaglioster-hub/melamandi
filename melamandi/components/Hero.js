import { useTranslation } from "react-i18next";

export default function Hero(){
  const { t } = useTranslation();
  return (
    <header className="relative pt-24">
      <div className="absolute inset-0 -z-10 bg-animated opacity-30"></div>
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <img src="/logo.svg" alt="Melamandi" className="mx-auto h-24 w-24 mb-6"/>
        <h1 className="text-4xl sm:text-5xl font-extrabold title-glow">{t('brand')}</h1>
        <p className="mt-3 text-gray-300">{t('tagline')}</p>
        <a href="#baskets" className="mt-8 btn-primary inline-block">{t('cta_order')}</a>
      </div>
    </header>
  )
}
