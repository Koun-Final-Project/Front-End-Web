import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Settings as SettingsIcon,
  Sliders,
  Boxes,
  Ruler,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Sun,
  Moon,
  Languages,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useTheme } from "@/components/theme-provider";
import { FloatingInput } from "@/components/floating-input";
import { cn } from "@/lib/utils";
import i18n from "@/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: i18n.t("settingsPage.meta.title") },
      { name: "description", content: i18n.t("settingsPage.meta.description") },
    ],
  }),
  component: SettingsPage,
});

type TabKey = "general" | "itemTypes" | "units" | "regions";

function SettingsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("general");

  const tabs: { key: TabKey; icon: typeof Sliders }[] = [
    { key: "general", icon: Sliders },
    { key: "itemTypes", icon: Boxes },
    { key: "units", icon: Ruler },
    { key: "regions", icon: MapPin },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg dark:from-gold dark:to-gold/70 dark:text-gold-foreground">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t("settingsPage.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("settingsPage.subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Vertical tabs */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="rounded-2xl border border-border bg-card/70 p-2 backdrop-blur-xl">
              {tabs.map(({ key, icon: Icon }) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={cn(
                      "relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="settings-tab-active"
                        className="absolute inset-0 -z-10 rounded-xl"
                        style={{
                          backgroundImage:
                            "linear-gradient(to left, color-mix(in oklab, #1E5A46 22%, transparent), transparent)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon className={cn("h-5 w-5", active && "text-gold")} strokeWidth={active ? 2.4 : 2} />
                    <span className="truncate text-start">{t(`settingsPage.tabs.${key}`)}</span>
                    {active && (
                      <motion.span
                        layoutId="settings-tab-bar"
                        className="ms-auto h-6 w-[3px] rounded-full bg-gold"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content — glassmorphism */}
          <section>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {tab === "general" && <GeneralTab />}
                {tab === "itemTypes" && <ItemTypesTab />}
                {tab === "units" && <UnitsTab />}
                {tab === "regions" && <RegionsTab />}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------------- Glass card ---------------- */

function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-xl backdrop-blur-2xl",
        "border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/[0.04]",
        className,
      )}
      style={{
        boxShadow:
          "0 10px 40px -12px color-mix(in oklab, #1E5A46 22%, transparent), inset 0 1px 0 color-mix(in oklab, #ffffff 30%, transparent)",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: typeof Sliders; title: string; description?: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

/* ---------------- GENERAL ---------------- */

function GeneralTab() {
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();

  const setLang = (lng: "ar" | "en") => i18n.changeLanguage(lng);

  return (
    <GlassCard>
      <SectionHeader
        icon={Sliders}
        title={t("settingsPage.general.title")}
        description={t("settingsPage.general.subtitle")}
      />

      {/* Theme */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("settingsPage.general.theme")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t("settingsPage.general.themeHint")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["light", "dark"] as const).map((mode) => {
              const active = theme === mode;
              const Icon = mode === "light" ? Sun : Moon;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    if (theme !== mode) toggle();
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                    active
                      ? "border-gold bg-gold/10 text-foreground ring-4 ring-gold/15"
                      : "border-border bg-card hover:border-gold/60",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "text-gold")} />
                  {t(`settingsPage.general.themes.${mode}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div className="rounded-xl border border-border/70 bg-card/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("settingsPage.general.language")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t("settingsPage.general.languageHint")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["ar", "en"] as const).map((lng) => {
              const active = i18n.language?.startsWith(lng);
              return (
                <button
                  key={lng}
                  onClick={() => setLang(lng)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                    active
                      ? "border-gold bg-gold/10 text-foreground ring-4 ring-gold/15"
                      : "border-border bg-card hover:border-gold/60",
                  )}
                >
                  <Languages className={cn("h-4 w-4", active && "text-gold")} />
                  {t(`lang.${lng}`)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

/* ---------------- CRUD list generic ---------------- */

type Item = { id: string; name: string; extra?: string };

function CrudTab({
  icon,
  titleKey,
  subtitleKey,
  addKey,
  initial,
  placeholderKey,
  extraLabelKey,
  extraPlaceholderKey,
  emptyKey,
}: {
  icon: typeof Boxes;
  titleKey: string;
  subtitleKey: string;
  addKey: string;
  initial: Item[];
  placeholderKey: string;
  extraLabelKey?: string;
  extraPlaceholderKey?: string;
  emptyKey: string;
}) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>(initial);
  const [name, setName] = useState("");
  const [extra, setExtra] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editExtra, setEditExtra] = useState("");

  const canAdd = name.trim().length > 0;

  const add = () => {
    if (!canAdd) return;
    setItems((xs) => [
      ...xs,
      { id: crypto.randomUUID(), name: name.trim(), extra: extra.trim() || undefined },
    ]);
    setName("");
    setExtra("");
  };

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setEditName(it.name);
    setEditExtra(it.extra ?? "");
  };
  const saveEdit = () => {
    if (!editingId) return;
    setItems((xs) =>
      xs.map((x) => (x.id === editingId ? { ...x, name: editName.trim() || x.name, extra: editExtra.trim() || undefined } : x)),
    );
    setEditingId(null);
  };
  const remove = (id: string) => setItems((xs) => xs.filter((x) => x.id !== id));

  return (
    <GlassCard>
      <SectionHeader icon={icon} title={t(titleKey)} description={t(subtitleKey)} />

      {/* Add form */}
      <div className={cn("grid gap-3", extraLabelKey ? "md:grid-cols-[1fr_1fr_auto]" : "md:grid-cols-[1fr_auto]")}>
        <FloatingInput
          label={t(placeholderKey)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        {extraLabelKey && extraPlaceholderKey && (
          <FloatingInput
            label={t(extraPlaceholderKey)}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
          />
        )}
        <motion.button
          type="button"
          onClick={add}
          disabled={!canAdd}
          whileHover={{ scale: canAdd ? 1.03 : 1 }}
          whileTap={{ scale: canAdd ? 0.97 : 1 }}
          className={cn(
            "relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-bold text-gold-foreground transition-all",
            "bg-gradient-to-r from-gold to-[#E5B93A]",
            canAdd
              ? "shadow-[0_10px_30px_-8px_color-mix(in_oklab,#F2C94C_60%,transparent)] hover:shadow-[0_16px_40px_-8px_color-mix(in_oklab,#F2C94C_75%,transparent)]"
              : "opacity-50",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background:
                "radial-gradient(120% 60% at 50% 0%, color-mix(in oklab, #ffffff 45%, transparent), transparent 60%)",
            }}
          />
          <Plus className="h-4 w-4" />
          {t(addKey)}
          <Sparkles className="h-3.5 w-3.5 opacity-80" />
        </motion.button>
      </div>

      {/* Items grid */}
      <div className="mt-6">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t(emptyKey)}
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {items.map((it) => {
                const editing = editingId === it.id;
                return (
                  <motion.li
                    key={it.id}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/70 p-4 backdrop-blur-md transition-all hover:border-gold/60 hover:shadow-lg"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-8 -end-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-60"
                      style={{ background: "color-mix(in oklab, #F2C94C 35%, transparent)" }}
                    />
                    {editing ? (
                      <div className="space-y-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-gold focus:ring-4 focus:ring-gold/15"
                        />
                        {extraLabelKey && (
                          <input
                            value={editExtra}
                            onChange={(e) => setEditExtra(e.target.value)}
                            placeholder={t(extraPlaceholderKey!)}
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-gold focus:ring-4 focus:ring-gold/15"
                          />
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={saveEdit}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            <Check className="h-3.5 w-3.5" /> {t("common.save")}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                          >
                            <X className="h-3.5 w-3.5" /> {t("common.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">{it.name}</p>
                            {it.extra && (
                              <p className="mt-1 truncate text-xs text-muted-foreground">{it.extra}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => startEdit(it)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:border-gold hover:text-gold"
                              aria-label={t("common.edit")}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => remove(it.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-destructive hover:border-destructive hover:bg-destructive/10"
                              aria-label={t("common.delete")}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </GlassCard>
  );
}

function ItemTypesTab() {
  const { t } = useTranslation();
  const initial: Item[] = useMemo(
    () => [
      { id: "1", name: t("settingsPage.itemTypes.samples.food") },
      { id: "2", name: t("settingsPage.itemTypes.samples.clothes") },
      { id: "3", name: t("settingsPage.itemTypes.samples.medicine") },
      { id: "4", name: t("settingsPage.itemTypes.samples.school") },
    ],
    [t],
  );
  return (
    <CrudTab
      icon={Boxes}
      titleKey="settingsPage.itemTypes.title"
      subtitleKey="settingsPage.itemTypes.subtitle"
      addKey="settingsPage.itemTypes.add"
      placeholderKey="settingsPage.itemTypes.name"
      emptyKey="settingsPage.itemTypes.empty"
      initial={initial}
    />
  );
}

function UnitsTab() {
  const { t } = useTranslation();
  const initial: Item[] = useMemo(
    () => [
      { id: "1", name: t("settingsPage.units.samples.box.name"), extra: t("settingsPage.units.samples.box.abbr") },
      { id: "2", name: t("settingsPage.units.samples.kg.name"), extra: t("settingsPage.units.samples.kg.abbr") },
      { id: "3", name: t("settingsPage.units.samples.piece.name"), extra: t("settingsPage.units.samples.piece.abbr") },
      { id: "4", name: t("settingsPage.units.samples.liter.name"), extra: t("settingsPage.units.samples.liter.abbr") },
    ],
    [t],
  );
  return (
    <CrudTab
      icon={Ruler}
      titleKey="settingsPage.units.title"
      subtitleKey="settingsPage.units.subtitle"
      addKey="settingsPage.units.add"
      placeholderKey="settingsPage.units.name"
      extraLabelKey="settingsPage.units.abbr"
      extraPlaceholderKey="settingsPage.units.abbr"
      emptyKey="settingsPage.units.empty"
      initial={initial}
    />
  );
}

function RegionsTab() {
  const { t } = useTranslation();
  const initial: Item[] = useMemo(
    () => [
      { id: "1", name: t("settingsPage.regions.samples.riyadh") },
      { id: "2", name: t("settingsPage.regions.samples.mecca") },
      { id: "3", name: t("settingsPage.regions.samples.eastern") },
      { id: "4", name: t("settingsPage.regions.samples.madinah") },
    ],
    [t],
  );
  return (
    <CrudTab
      icon={MapPin}
      titleKey="settingsPage.regions.title"
      subtitleKey="settingsPage.regions.subtitle"
      addKey="settingsPage.regions.add"
      placeholderKey="settingsPage.regions.name"
      extraLabelKey="settingsPage.regions.code"
      extraPlaceholderKey="settingsPage.regions.code"
      emptyKey="settingsPage.regions.empty"
      initial={initial}
    />
  );
}
