import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { KawnLogo } from "@/components/kawn-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useCheckOtp, useSendOtp } from "@/hooks/useAuth";
import { toast } from "sonner";
import i18n from "@/i18n";

type VerifyOtpSearch = {
  login_field: string;
};

export const Route = createFileRoute("/verify-otp")({
  validateSearch: (search: Record<string, unknown>): VerifyOtpSearch => {
    return {
      login_field: (search.login_field as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: i18n.t("auth.verify_title", "توثيق الحساب") },
    ],
  }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();

  const { login_field } = Route.useSearch();

  const [code, setCode] = useState("");
  const { mutate: checkOtp, isPending: isChecking } = useCheckOtp();
  const { mutate: sendOtp, isPending: isSending } = useSendOtp();

  useEffect(() => {
    if (login_field) {
      sendOtp({ login_field });
    }
  }, [login_field, sendOtp]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      checkOtp({ login_field, code });
    }
  };

  const handleResend = () => {
    sendOtp({ login_field });
  };

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative flex items-center justify-center px-6 py-12 sm:px-12 lg:py-16">
          <div className="absolute top-6 end-6 flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="w-full max-w-md">
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {t("common.back", "رجوع")}
            </button>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              
              <h2 className="text-3xl font-extrabold tracking-tight text-start">
                {t("auth.verify.title", "توثيق الحساب")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground text-start leading-relaxed">
                {t("auth.verify.subtitle", "قمنا بإرسال رمز تحقق (OTP) مكون من 6 أرقام إلى:")}
                <br />
                <span className="font-bold text-foreground mt-1 block" dir="ltr">{login_field}</span>
              </p>

              <form onSubmit={handleVerify} className="mt-8 space-y-6">
                
                {/* مكون إدخال الـ OTP */}
                <div dir="ltr" className="flex justify-center w-full">
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot 
                          key={index} 
                          index={index} 
                          className="w-12 h-14 text-lg font-bold rounded-xl border-border bg-card shadow-sm transition-all focus-within:ring-1 focus-within:ring-primary dark:focus-within:ring-gold"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <button
                  type="submit"
                  disabled={isChecking || code.length < 6}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold tracking-wide text-primary-foreground shadow-[0_12px_30px_-12px_rgba(15,61,46,0.7)] transition-all duration-200 hover:scale-[1.02] hover:bg-primary-medium active:scale-95 disabled:opacity-70 disabled:hover:scale-100 dark:bg-gold dark:text-gold-foreground dark:shadow-[0_12px_30px_-12px_rgba(242,201,76,0.5)] dark:hover:bg-gold/90"
                >
                  {isChecking ? t("common.loading", "جاري التحقق...") : t("auth.verify.submit", "تأكيد الحساب")}
                  {!isChecking && <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />}
                </button>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  {t("auth.verify.didnt_receive", "لم يصلك الرمز؟")}{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isSending}
                    className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary dark:hover:text-gold disabled:opacity-50"
                  >
                    {isSending ? t("common.loading", "جاري الإرسال...") : t("auth.verify.resend", "إعادة إرسال الرمز")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* القسم الجانبي (نفس تصميم صفحة الـ Auth للتماسك البصري) */}
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
                SECURE VERIFICATION
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
          </div>
        </section>
      </div>
    </main>
  );
}