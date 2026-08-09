import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ShieldCheck, HeartHandshake, Building2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRole, type InstitutionType } from "@/hooks/use-role";

const ROLE_ICONS: Record<InstitutionType, typeof HeartHandshake> = {
  1: HeartHandshake,
  2: Building2,
  3: Sparkles,
};

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const ActiveIcon = ROLE_ICONS[role];
  const roles: InstitutionType[] = [1, 2, 3];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("role.label")}
        className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full border border-gold/40 bg-gold/10 px-3 text-xs font-bold text-foreground backdrop-blur-xl transition-all hover:scale-[1.03] hover:border-gold active:scale-95"
      >
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-gold/10 via-transparent to-primary-medium/10 opacity-60" />
        <ShieldCheck className="h-3.5 w-3.5 text-gold" />
        <span className="hidden sm:inline">{t("role.demo")}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-0.5">
          <ActiveIcon className="h-3.5 w-3.5 text-primary-medium dark:text-gold" />
          <span>{t(`enums.institution_type.${role}`)}</span>
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute end-0 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover/90 p-2 shadow-[0_20px_60px_-20px_rgba(15,61,46,0.45)] backdrop-blur-2xl"
          >
            <div className="border-b border-border/60 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("role.demoBadge")}
              </p>
              <p className="mt-1 text-sm font-bold">{t("role.title")}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t("role.subtitle")}</p>
            </div>
            <div className="mt-1 space-y-1">
              {roles.map((r) => {
                const Icon = ROLE_ICONS[r];
                const active = r === role;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setOpen(false);
                    }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-all ${
                      active
                        ? "bg-gradient-to-r from-gold/20 to-primary-medium/10 text-foreground"
                        : "hover:bg-muted/70"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        active
                          ? "border-gold bg-gold/20 text-gold"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">
                        {t(`enums.institution_type.${r}`)}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {t(`role.descriptions.${r}`)}
                      </span>
                    </span>
                    {active && (
                      <motion.span
                        layoutId="role-check"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
