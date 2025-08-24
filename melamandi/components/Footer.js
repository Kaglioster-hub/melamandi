import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const y = new Date().getFullYear();

  const toggleLang = () => {
    const next = i18n.language === "it" ? "en" : "it";
    i18n.changeLanguage(next);
  };

  return (
    <footer
      id="contact"
      className="mt-16 py-10 border-t border-white/10 glass relative z-10"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-xs sm:text-sm opacity-80 text-center sm:text-left">
          © {y} Melamandi · {t("footer_rights", { year: y })}
        </p>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <a
            href="mailto:ordini@melamandi.it"
            className="underline hover:text-green-400 transition"
            aria-label="Contatta Melamandi via email"
          >
            ordini@melamandi.it
          </a>

          {/* Social icons (esempio) */}
          <a
            href="https://instagram.com/melamandi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Melamandi"
            className="hover:text-pink-400 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .4 1.5.9.5.5.7.9.9 1.5.2.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.4 1-.9 1.5-.5.5-.9.7-1.5.9-.4.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.4-1.5-.9-.5-.5-.7-.9-.9-1.5-.2-.4-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.4-1 .9-1.5.5-.5.9-.7 1.5-.9.4-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 0 5.7.1 4.7.2 4 .4c-.8.2-1.5.5-2.1 1.1C1.3 1.9 1 2.6.8 3.4c-.2.7-.3 1.7-.4 3C.3 7.7.2 8.7.2 12c0 3.3.1 4.3.2 5.6.1 1.3.2 2.3.4 3 .2.8.5 1.5 1.1 2.1.6.6 1.3.9 2.1 1.1.7.2 1.7.3 3 .4 1.3.1 1.7.2 5.6.2s4.3 0 5.6-.2c1.3-.1 2.3-.2 3-.4.8-.2 1.5-.5 2.1-1.1.6-.6.9-1.3 1.1-2.1.2-.7.3-1.7.4-3 .1-1.3.2-1.7.2-5.6s0-4.3-.2-5.6c-.1-1.3-.2-2.3-.4-3-.2-.8-.5-1.5-1.1-2.1-.6-.6-1.3-.9-2.1-1.1-.7-.2-1.7-.3-3-.4-1.3-.1-1.7-.2-5.6-.2z" />
              <circle cx="12" cy="12" r="3.2" />
            </svg>
          </a>

          {/* Language switch */}
          <button
            onClick={toggleLang}
            className="btn-ghost px-3 py-1 text-xs sm:text-sm"
            aria-label="Cambia lingua"
          >
            {i18n.language.toUpperCase()}
          </button>
        </div>
      </div>
    </footer>
  );
}
