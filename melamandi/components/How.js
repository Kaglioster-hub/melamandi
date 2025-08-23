import { useTranslation } from "react-i18next";

export default function How(){
  const { t } = useTranslation();
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">{t('how_title')}</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="glass p-6"><div className="text-3xl mb-3">🥗</div><p>{t('how_1')}</p></div>
        <div className="glass p-6"><div className="text-3xl mb-3">⏰</div><p>{t('how_2')}</p></div>
        <div className="glass p-6"><div className="text-3xl mb-3">🚚</div><p>{t('how_3')}</p></div>
      </div>
    </section>
  )
}
