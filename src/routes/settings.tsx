


import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api/axios"; 
import {
  Settings as SettingsIcon,
  Sliders,
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
  Loader2,
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

type TabKey = "general" | "units" | "regions";

function SettingsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("general");

  const tabs: { key: TabKey; icon: typeof Sliders }[] = [
    { key: "general", icon: Sliders },
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

/* ---------------- CRUD list generic component ---------------- */

type Item = { id: string; name: string; extra?: string };

function CrudTab({
  icon,
  titleKey,
  subtitleKey,
  addKey,
  placeholderKey,
  extraLabelKey,
  extraPlaceholderKey,
  emptyKey,
  queryKey,
  fetchData,
  createItem,
  updateItem,
  deleteItem,
}: {
  icon: typeof Ruler;
  titleKey: string;
  subtitleKey: string;
  addKey: string;
  placeholderKey: string;
  extraLabelKey?: string;
  extraPlaceholderKey?: string;
  emptyKey: string;
  queryKey: string[];
  fetchData: () => Promise<Item[]>;
  createItem: (data: { name: string; extra?: string }) => Promise<any>;
  updateItem: (id: string, data: { name: string; extra?: string }) => Promise<any>;
  deleteItem: (id: string) => Promise<any>;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // State
  const [name, setName] = useState("");
  const [extra, setExtra] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editExtra, setEditExtra] = useState("");

  const canAdd = name.trim().length > 0;

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    queryFn: fetchData,
  });

  const createMut = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setName("");
      setExtra("");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; extra?: string } }) => updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditingId(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const add = () => {
    if (!canAdd || createMut.isPending) return;
    createMut.mutate({ name: name.trim(), extra: extra.trim() || undefined });
  };

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setEditName(it.name);
    setEditExtra(it.extra ?? "");
  };

  const saveEdit = () => {
    if (!editingId || updateMut.isPending) return;
    updateMut.mutate({
      id: editingId,
      data: { name: editName.trim(), extra: editExtra.trim() || undefined },
    });
  };

  const remove = (id: string) => {
    if (deleteMut.isPending) return;
    deleteMut.mutate(id);
  };

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
          disabled={!canAdd || createMut.isPending}
          whileHover={{ scale: canAdd ? 1.03 : 1 }}
          whileTap={{ scale: canAdd ? 0.97 : 1 }}
          className={cn(
            "relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-bold text-gold-foreground transition-all",
            "bg-gradient-to-r from-gold to-[#E5B93A]",
            canAdd && !createMut.isPending
              ? "shadow-[0_10px_30px_-8px_color-mix(in_oklab,#F2C94C_60%,transparent)] hover:shadow-[0_16px_40px_-8px_color-mix(in_oklab,#F2C94C_75%,transparent)]"
              : "opacity-50 cursor-not-allowed",
          )}
        >
          {createMut.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {t(addKey)}
        </motion.button>
      </div>

      {/* Items grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
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
                            disabled={updateMut.isPending}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                          >
                            {updateMut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            {t("common.save")}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={updateMut.isPending}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                          >
                            <X className="h-3.5 w-3.5" />
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
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => remove(it.id)}
                              disabled={deleteMut.isPending}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-destructive hover:border-destructive hover:bg-destructive/10 disabled:opacity-50"
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

/* ---------------- API Integrations ---------------- */

function UnitsTab() {
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
      queryKey={["api-units"]}
      fetchData={async () => {
        const res = await api.get('/unit');
        return res.data.data.map((u: any) => ({
          id: String(u.id),
          name: u.name,
          extra: u.description || "",
        }));
      }}
      createItem={async (data) => {
        const fd = new FormData();
        fd.append('name', data.name);
        if (data.extra) fd.append('description', data.extra);
        return await api.post('/unit/create', fd);
      }}
      updateItem={async (id, data) => {
        const fd = new FormData();
        fd.append('name', data.name);
        if (data.extra) fd.append('description', data.extra);
        return await api.post(`/unit/update/${id}`, fd);
      }}
      deleteItem={async (id) => {
        return await api.delete(`/unit/delete/${id}`);
      }}
    />
  );
}

function RegionsTab() {
  return (
    <CrudTab
      icon={MapPin}
      titleKey="settingsPage.regions.title"
      subtitleKey="settingsPage.regions.subtitle"
      addKey="settingsPage.regions.add"
      placeholderKey="settingsPage.regions.name"
      emptyKey="settingsPage.regions.empty"
      queryKey={["api-cities"]}
      fetchData={async () => {
        const res = await api.get('/city');
        return res.data.data.map((c: any) => ({
          id: String(c.id),
          name: c.name,
        }));
      }}
      createItem={async (data) => {
        const fd = new FormData();
        fd.append('name', data.name);
        return await api.post('/city/create', fd);
      }}
      updateItem={async (id, data) => {
        const fd = new FormData();
        fd.append('name', data.name);
        return await api.post(`/city/update/${id}`, fd);
      }}
      deleteItem={async (id) => {
        return await api.delete(`/city/delete/${id}`);
      }}
    />
  );
}