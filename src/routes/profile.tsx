import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Camera,
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  VenetianMask,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  BadgeCheck,
  Save,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import i18n from "@/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: i18n.t("profile.meta.title") },
      { name: "description", content: i18n.t("profile.meta.description") },
    ],
  }),
  component: ProfilePage,
});

type FieldKey = "first_name" | "last_name" | "username" | "email" | "phone" | "gender" | "birthday";

function ProfilePage() {
  const { t } = useTranslation();

  const [form, setForm] = useState<Record<FieldKey, string>>({
    first_name: "Abdullah",
    last_name: "Al-Rashed",
    username: "abdullah.rashed",
    email: "abdullah@kawn.sa",
    phone: "+966 55 412 0987",
    gender: "male",
    birthday: "1995-04-12",
  });

  const update = (k: FieldKey, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const fieldsLeft: { k: FieldKey; icon: any; type?: string }[] = [
    { k: "first_name", icon: User },
    { k: "username", icon: AtSign },
    { k: "phone", icon: Phone },
    { k: "birthday", icon: Calendar, type: "date" },
  ];
  const fieldsRight: { k: FieldKey; icon: any; type?: string }[] = [
    { k: "last_name", icon: User },
    { k: "email", icon: Mail, type: "email" },
    { k: "gender", icon: VenetianMask },
  ];

  // Password section
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const strength = useMemo(() => scorePassword(pw.next), [pw.next]);
  const strengthLabels = [
    t("profile.security.strength.veryWeak"),
    t("profile.security.strength.weak"),
    t("profile.security.strength.fair"),
    t("profile.security.strength.strong"),
    t("profile.security.strength.veryStrong"),
  ];
  const strengthColors = ["#EF4444", "#F59E0B", "#F2C94C", "#10B981", "#1E5A46"];

  const institutions = t("profile.institutions.list", { returnObjects: true }) as Array<{
    id: string;
    name: string;
    type: 1 | 2 | 3;
    role: "admin" | "staff";
    city: string;
    joined: string;
  }>;

  return (
    <AppShell>
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div
          className="h-44 w-full sm:h-56"
          style={{
            backgroundImage:
              "radial-gradient(at 15% 30%, color-mix(in oklab, #1E5A46 65%, transparent), transparent 55%), radial-gradient(at 80% 20%, color-mix(in oklab, #F2C94C 45%, transparent), transparent 50%), radial-gradient(at 60% 90%, color-mix(in oklab, #0F3D2E 80%, transparent), transparent 60%), linear-gradient(135deg, #0B2A20, #1E5A46)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.35),transparent_55%)]" />
      </div>

      {/* Avatar + Identity */}
      <div className="relative -mt-16 mb-8 flex flex-col items-start gap-5 px-2 sm:flex-row sm:items-end sm:px-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="group relative"
        >
          <div className="h-32 w-32 rounded-full ring-4 ring-background shadow-[0_20px_50px_-20px_rgba(30,90,70,0.6)] sm:h-36 sm:w-36">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0F3D2E] text-4xl font-extrabold text-primary-foreground">
              {form.first_name.charAt(0)}
              {form.last_name.charAt(0)}
            </div>
          </div>
          <button
            type="button"
            aria-label={t("profile.changeAvatar")}
            className="absolute bottom-1 end-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-transform duration-200 hover:scale-110 hover:border-gold active:scale-95"
          >
            <Camera className="h-4.5 w-4.5" />
          </button>
        </motion.div>

        <div className="flex-1 pb-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-start sm:text-3xl">
            {form.first_name} {form.last_name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-start">
            @{form.username} · {form.email}
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(30,90,70,0.6)] transition-all hover:scale-[1.02] hover:shadow-[0_15px_30px_-10px_rgba(30,90,70,0.8)] active:scale-[0.98]">
          <Save className="h-4 w-4" />
          {t("profile.save")}
        </button>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal info */}
        <section className="lg:col-span-2 rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <header className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-start">{t("profile.personal.title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground text-start">
                {t("profile.personal.subtitle")}
              </p>
            </div>
            <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary sm:inline-flex">
              {t("profile.personal.badge")}
            </span>
          </header>

          <div className="grid gap-5 sm:grid-cols-2">
            {fieldsLeft.map((f) => (
              <ProfileField
                key={f.k}
                label={t(`fields.users.${f.k}`)}
                icon={<f.icon className="h-4 w-4" />}
                type={f.type}
                value={form[f.k]}
                onChange={(v) => update(f.k, v)}
                k={f.k}
                t={t}
              />
            ))}
            {fieldsRight.map((f) => (
              <ProfileField
                key={f.k}
                label={t(`fields.users.${f.k}`)}
                icon={<f.icon className="h-4 w-4" />}
                type={f.type}
                value={form[f.k]}
                onChange={(v) => update(f.k, v)}
                k={f.k}
                t={t}
              />
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <header className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-start">{t("profile.security.title")}</h2>
              <p className="text-xs text-muted-foreground text-start">
                {t("profile.security.subtitle")}
              </p>
            </div>
          </header>

          <div className="space-y-4">
            <PwField
              label={t("profile.security.current")}
              value={pw.current}
              onChange={(v) => setPw((p) => ({ ...p, current: v }))}
              show={showPw}
              onToggle={() => setShowPw((s) => !s)}
            />
            <PwField
              label={t("profile.security.new")}
              value={pw.next}
              onChange={(v) => setPw((p) => ({ ...p, next: v }))}
              show={showPw}
              onToggle={() => setShowPw((s) => !s)}
            />

            {/* Strength bar */}
            <div>
              <div className="flex h-1.5 gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-muted transition-colors duration-300"
                    style={{
                      backgroundColor:
                        i < strength ? strengthColors[strength - 1] : undefined,
                    }}
                  />
                ))}
              </div>
              <p
                className="mt-2 text-xs font-semibold text-start"
                style={{
                  color: pw.next ? strengthColors[Math.max(0, strength - 1)] : undefined,
                }}
              >
                {pw.next ? strengthLabels[Math.max(0, strength - 1)] : t("profile.security.tip")}
              </p>
            </div>

            <PwField
              label={t("profile.security.confirm")}
              value={pw.confirm}
              onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
              show={showPw}
              onToggle={() => setShowPw((s) => !s)}
            />

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99]">
              <Lock className="h-4 w-4" />
              {t("profile.security.update")}
            </button>
          </div>
        </section>

        {/* Institutions */}
        <section className="lg:col-span-3 rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <header className="mb-6 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-start">
                {t("profile.institutions.title")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground text-start">
                {t("profile.institutions.subtitle")}
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
              {institutions.length}
            </span>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((ins, i) => (
              <motion.article
                key={ins.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
              >
                <div
                  aria-hidden
                  className="absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-20 transition-opacity group-hover:opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklab, #1E5A46 70%, transparent), transparent 70%)",
                  }}
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold text-start">{ins.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground text-start">
                      {ins.city} · {t(`enums.institution_type.${ins.type}`)}
                    </p>
                  </div>
                </div>

                <div className="relative mt-5 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      ins.role === "admin"
                        ? "bg-gold/15 text-[#8a6a00] dark:text-gold"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {t(`profile.institutions.roles.${ins.role}`)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t("profile.institutions.joined")}: {ins.joined}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ProfileField({
  label,
  icon,
  value,
  onChange,
  type = "text",
  k,
  t,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  k: FieldKey;
  t: (k: string) => string;
}) {
  if (k === "gender") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold text-muted-foreground text-start">
          {label}
        </span>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-border bg-background ps-10 pe-4 text-sm font-semibold text-start shadow-sm outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/15"
          >
            <option value="male">{t("enums.gender.male")}</option>
            <option value="female">{t("enums.gender.female")}</option>
          </select>
        </div>
      </label>
    );
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted-foreground text-start">
        {label}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-background ps-10 pe-4 text-sm font-semibold text-start shadow-sm outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </div>
    </label>
  );
}

function PwField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted-foreground text-start">
        {label}
      </span>
      <div className="relative">
        <Lock className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-background ps-10 pe-11 text-sm font-semibold text-start shadow-sm outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 end-2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(5, score);
}
