import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Lock, User, Phone, AtSign, Cake, ArrowLeft, ArrowRight } from "lucide-react";
import { FloatingInput } from "@/components/floating-input";
import { KawnLogo } from "@/components/kawn-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import i18n from "@/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: i18n.t("auth.meta.title") },
      { name: "description", content: i18n.t("auth.meta.description") },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "register";

function AuthPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [mode, setMode] = useState<Mode>("login");
  const [gender, setGender] = useState<"male" | "female">("male");
  const navigate = useNavigate();
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const stats = [
    { k: "1,245", l: t("auth.hero.stats.donors") },
    { k: "8,732", l: t("auth.hero.stats.beneficiaries") },
    { k: "12,540", l: t("auth.hero.stats.delivered") },
  ];

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative flex items-center justify-center px-6 py-12 sm:px-12 lg:py-16">
          <div className="absolute top-6 end-6 flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3">
              <KawnLogo size={48} />
              <div>
                <h1 className="text-2xl font-extrabold leading-none text-foreground">{t("brand.name")}</h1>
                <p className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                  {t("brand.tagline")}
                </p>
              </div>
            </div>

            <div className="relative mb-8 inline-flex rounded-full border border-border bg-muted p-1">
              {(["login", "register"] as Mode[]).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="relative z-10 rounded-full px-6 py-2 text-sm font-semibold transition-colors"
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-pill"
                        className="absolute inset-0 rounded-full bg-primary shadow-[0_8px_24px_-8px_rgba(15,61,46,0.5)] dark:bg-gold"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative ${active ? "text-primary-foreground dark:text-gold-foreground" : "text-muted-foreground"}`}
                    >
                      {t(`auth.tabs.${m}`)}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-extrabold tracking-tight text-start">
                  {t(`auth.${mode}.title`)}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground text-start">
                  {t(`auth.${mode}.subtitle`)}
                </p>

                <form
                  className="mt-8 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate({ to: "/dashboard" });
                  }}
                >
                  {mode === "register" ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <FloatingInput label={t("fields.users.first_name")} icon={<User className="h-4 w-4" />} autoComplete="given-name" />
                        <FloatingInput label={t("fields.users.last_name")} icon={<User className="h-4 w-4" />} autoComplete="family-name" />
                      </div>
                      <FloatingInput label={t("fields.users.username")} icon={<AtSign className="h-4 w-4" />} autoComplete="username" />
                      <FloatingInput
                        label={t("fields.users.email")}
                        type="email"
                        icon={<Mail className="h-4 w-4" />}
                        autoComplete="email"
                      />
                      <FloatingInput label={t("fields.users.phone")} type="tel" icon={<Phone className="h-4 w-4" />} />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-muted-foreground ps-1">
                            {t("fields.users.gender")}
                          </label>
                          <div className="flex h-12 items-center gap-1 rounded-xl border border-border bg-card p-1">
                            {(["male", "female"] as const).map((g) => {
                              const active = gender === g;
                              return (
                                <button
                                  type="button"
                                  key={g}
                                  onClick={() => setGender(g)}
                                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition-all ${
                                    active
                                      ? "bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {t(`enums.gender.${g}`)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <FloatingInput
                          label={t("fields.users.birthday")}
                          type="date"
                          icon={<Cake className="h-4 w-4" />}
                        />
                      </div>
                      <FloatingInput
                        label={t("fields.users.password")}
                        type="password"
                        icon={<Lock className="h-4 w-4" />}
                        autoComplete="new-password"
                      />
                    </>
                  ) : (
                    <>
                      <FloatingInput
                        label={t("auth.login.identifier")}
                        icon={<AtSign className="h-4 w-4" />}
                        autoComplete="username"
                      />
                      <FloatingInput
                        label={t("fields.users.password")}
                        type="password"
                        icon={<Lock className="h-4 w-4" />}
                        autoComplete="current-password"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <label className="inline-flex items-center gap-2 text-muted-foreground">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border accent-[var(--gold)]"
                          />
                          {t("auth.login.remember")}
                        </label>
                        <a
                          href="#"
                          className="font-semibold text-primary-medium hover:text-primary dark:text-gold dark:hover:text-gold/80"
                        >
                          {t("auth.login.forgot")}
                        </a>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold tracking-wide text-primary-foreground shadow-[0_12px_30px_-12px_rgba(15,61,46,0.7)] transition-all duration-200 hover:scale-[1.02] hover:bg-primary-medium active:scale-95 dark:bg-gold dark:text-gold-foreground dark:shadow-[0_12px_30px_-12px_rgba(242,201,76,0.5)] dark:hover:bg-gold/90"
                  >
                    {t(`auth.${mode}.submit`)}
                    <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </button>

                  <div className="relative my-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{t("common.or")}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  <button
                    type="button"
                    className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-all hover:scale-[1.01] hover:border-gold active:scale-95"
                  >
                    <GoogleIcon />
                    {t("auth.google")}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t("auth.terms")}{" "}
              <a href="#" className="font-semibold text-foreground hover:text-primary-medium">
                {t("auth.termsLink")}
              </a>{" "}
              {t("auth.and")}{" "}
              <a href="#" className="font-semibold text-foreground hover:text-primary-medium">
                {t("auth.privacyLink")}
              </a>
              .
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 mesh-kawn" />
          <motion.div
            aria-hidden
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: [0.8, 1.05, 0.85], opacity: [0.5, 0.8, 0.55] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -end-24 h-[420px] w-[420px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(242,201,76,0.55), transparent 70%)" }}
          />
          <motion.div
            aria-hidden
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: [0.9, 1.1, 0.95], opacity: [0.4, 0.7, 0.5] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-32 -start-20 h-[460px] w-[460px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(30,90,70,0.9), transparent 70%)" }}
          />

          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #F2C94C 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, #F2C94C 1px, transparent 1.5px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-[#F8F6F0]">
            <div className="flex items-center justify-end">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-[#F2C94C] backdrop-blur">
                {t("auth.hero.badge")}
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="glass-card relative w-full max-w-sm rounded-3xl p-10 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
              >
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0F3D2E]/40 ring-1 ring-[#F2C94C]/30">
                  <KawnLogo size={64} />
                </div>
                <h3 className="text-4xl font-extrabold tracking-tight text-[#F8F6F0]">{t("brand.name")}</h3>
                <p className="mt-2 text-sm font-medium text-[#F2C94C]">{t("brand.tagline")}</p>
                <div className="mt-6 h-px w-12 mx-auto bg-[#F2C94C]/40" />
                <p className="mt-6 text-sm leading-relaxed text-[#F8F6F0]/80">{t("brand.description")}</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {stats.map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="text-2xl font-extrabold text-[#F2C94C]">{s.k}</div>
                  <div className="mt-1 text-[11px] text-[#F8F6F0]/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.4 35 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2C41 35.3 44 30.1 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
