


import { useMemo, useState, useEffect } from "react";
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
  BadgeCheck,
  Save,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile"; 
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

  const { data: profileData, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  
  const user = profileData?.data?.profile;

  const [form, setForm] = useState<Record<FieldKey, string>>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    gender: "1", 
    birthday: "",
  });

  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender?.toString() || "1",
        birthday: user.birthday || "",
      });
    }
  }, [user]);

  const update = (k: FieldKey, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    const payload: any = {
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
      email: form.email,
      phone: form.phone,
      gender: Number(form.gender),
    };

    if (form.birthday) payload.birthday = form.birthday;
    if (password) payload.password = password;
    if (avatarFile) payload.avatar = avatarFile;

    updateProfile(payload);
  };

  const fieldsLeft: { k: FieldKey; icon: any; type?: string }[] = [
    { k: "first_name", icon: User },
    { k: "username", icon: AtSign },
    { k: "phone", icon: Phone, type: "tel" },
    { k: "birthday", icon: Calendar, type: "date" },
  ];
  const fieldsRight: { k: FieldKey; icon: any; type?: string }[] = [
    { k: "last_name", icon: User },
    { k: "email", icon: Mail, type: "email" },
    { k: "gender", icon: VenetianMask },
  ];

  const strength = useMemo(() => scorePassword(password), [password]);
  const strengthLabels = [
    t("profile.security.strength.veryWeak", "ضعيفة جداً"),
    t("profile.security.strength.weak", "ضعيفة"),
    t("profile.security.strength.fair", "متوسطة"),
    t("profile.security.strength.strong", "قوية"),
    t("profile.security.strength.veryStrong", "قوية جداً"),
  ];
  const strengthColors = ["#EF4444", "#F59E0B", "#F2C94C", "#10B981", "#1E5A46"];

  if (isLoading && !user) {
    return (
      <AppShell>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

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
          <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-background shadow-[0_20px_50px_-20px_rgba(30,90,70,0.6)] sm:h-36 sm:w-36">
            {avatarFile ? (
              <img src={URL.createObjectURL(avatarFile)} alt="Avatar" className="h-full w-full object-cover" />
            ) : user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0F3D2E] text-4xl font-extrabold text-primary-foreground uppercase">
                {form.first_name?.charAt(0) || ""}
                {form.last_name?.charAt(0) || ""}
              </div>
            )}
          </div>
          
          {/* زر اختيار الصورة */}
          <label
            aria-label={t("profile.changeAvatar", "تغيير الصورة")}
            className="absolute bottom-1 end-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-transform duration-200 hover:scale-110 hover:border-gold active:scale-95"
          >
            <Camera className="h-4.5 w-4.5" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} 
            />
          </label>
        </motion.div>

        <div className="flex-1 pb-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-start sm:text-3xl">
            {form.first_name} {form.last_name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-start" dir="ltr">
            @{form.username} · {form.email}
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isUpdating}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(30,90,70,0.6)] transition-all hover:scale-[1.02] hover:shadow-[0_15px_30px_-10px_rgba(30,90,70,0.8)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t("profile.save", "حفظ التعديلات")}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <header className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-start">{t("profile.personal.title", "المعلومات الشخصية")}</h2>
              <p className="mt-1 text-sm text-muted-foreground text-start">
                {t("profile.personal.subtitle", "قم بتحديث بياناتك الشخصية للظهور بشكل أفضل.")}
              </p>
            </div>
          </header>

          <div className="grid gap-5 sm:grid-cols-2">
            {fieldsLeft.map((f) => (
              <ProfileField
                key={f.k}
                label={t(`fields.users.${f.k}`, f.k)}
                icon={<f.icon className="h-4 w-4" />}
                type={f.type}
                value={form[f.k]}
                onChange={(v) => update(f.k, v)}
                k={f.k}
            
              />
            ))}
            {fieldsRight.map((f) => (
              <ProfileField
                key={f.k}
                label={t(`fields.users.${f.k}`, f.k)}
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
        <section className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-md sm:p-8 h-fit">
          <header className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-start">{t("profile.security.title", "الأمان")}</h2>
              <p className="text-xs text-muted-foreground text-start">
                {t("profile.security.subtitle", "تغيير كلمة المرور الخاصة بك")}
              </p>
            </div>
          </header>

          <div className="space-y-4">
            <PwField
              label={t("profile.security.new", "كلمة المرور الجديدة")}
              value={password}
              onChange={(v) => setPassword(v)}
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
                  color: password ? strengthColors[Math.max(0, strength - 1)] : undefined,
                }}
              >
                {password ? strengthLabels[Math.max(0, strength - 1)] : t("profile.security.tip", "اكتب كلمة مرور معقدة")}
              </p>
            </div>
          </div>
        </section>

        {/* Roles (بديلاً عن الـ Institutions الوهمية) */}
        <section className="lg:col-span-3 rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <header className="mb-6 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-start">
                {t("profile.roles.title", "صلاحيات الحساب")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground text-start">
                {t("profile.roles.subtitle", "المهام والصلاحيات الموكلة إليك في النظام")}
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
              {user?.roles?.length || 0}
            </span>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {user?.roles?.map((role: string, i: number) => (
              <motion.article
                key={role}
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
                <div className="relative flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <BadgeCheck className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-extrabold text-start capitalize">{role}</h3>
                  </div>
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
  t: (k: string, fb?: string) => string;
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
            <option value="1">{t("enums.gender.male", "ذكر")}</option>
            <option value="2">{t("enums.gender.female", "أنثى")}</option>
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
          dir={type === 'email' || type === 'tel' ? 'ltr' : 'auto'}
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
          dir="ltr"
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