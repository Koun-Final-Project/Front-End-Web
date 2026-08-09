import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";

const LANGS = [
  { code: "ar", label: "العربية", short: "AR", flag: "🇸🇦" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const switchTo = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("lang.label")}
        className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full border border-border bg-card/70 px-3 backdrop-blur-xl transition-all hover:scale-105 hover:border-gold active:scale-95"
      >
        <Languages className="h-4 w-4 text-gold" />
        <span className="text-sm font-bold tracking-wider">{current.short}</span>
        <span className="text-base leading-none">{current.flag}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="absolute end-0 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-popover/80 p-1.5 shadow-xl backdrop-blur-xl"
          >
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("lang.label")}
            </p>
            {LANGS.map((l) => {
              const active = l.code === i18n.language;
              return (
                <button
                  key={l.code}
                  onClick={() => switchTo(l.code)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-gold/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <span className="text-lg leading-none">{l.flag}</span>
                  <span className="flex-1 text-start">{l.label}</span>
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
                    {l.short}
                  </span>
                  {active && <Check className="h-4 w-4 text-gold" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
