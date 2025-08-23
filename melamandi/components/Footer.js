import { useTranslation } from "react-i18next";

export default function Footer(){
  const { t, i18n } = useTranslation();
  const y = new Date().getFullYear();
  return (
    <footer id="contact" className="mt-12 py-8 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm opacity-80">{t('footer_rights', {year: y})}</p>
        <div className="flex items-center gap-4 text-sm">
          <a href="mailto:ordini@melamandi.it" className="underline">ordini@melamandi.it</a>
          <button onClick={()=>i18n.changeLanguage(i18n.language==='it'?'en':'it')}
                  className="btn-ghost">{i18n.language.toUpperCase()}</button>
        </div>
      </div>
    </footer>
  )
}
