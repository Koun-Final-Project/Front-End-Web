import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Search,
  PackageCheck,
  MapPin,
  Building2,
  Package,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import i18n from "@/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/delivered")({
  head: () => ({
    meta: [
      { title: i18n.t("delivered.meta.title") },
      { name: "description", content: i18n.t("delivered.meta.description") },
    ],
  }),
  component: DeliveredPage,
});

interface DeliveredItem {
  id: string;
  beneficiary_name: string;
  beneficiary_branch: string;
  beneficiary_city: string;
  item_name: string;
  item_type: string;
  unit: string;
  requested_quantity: number;
  received_quantity: number;
  picked_at: string;
  delivered_at: string;
}

function formatDateTime(iso: string, lang: string) {
  const d = new Date(iso);
  return d.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(n: number, lang: string) {
  return n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
}

function DeliveredCard({
  item,
  index,
  lang,
}: {
  item: DeliveredItem;
  index: number;
  lang: string;
}) {
  const { t } = useTranslation();
  const unitLabel = t(`enums.unit.${item.unit}` as const, item.unit);
  const typeLabel = t(`enums.item_type.${item.item_type}` as const, item.item_type);
  const pct =
    item.requested_quantity > 0
      ? Math.min(100, Math.round((item.received_quantity / item.requested_quantity) * 100))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_10px_40px_-10px_color-mix(in_oklab,#F2C94C_25%,transparent)]"
    >
      {/* subtle gold glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, color-mix(in oklab, #F2C94C 12%, transparent), transparent 60%)",
        }}
      />

      <div className="relative">
        {/* Top row: badge + id */}
        <div className="flex items-start justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.08 + 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("delivered.statusBadge")}
          </motion.div>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {item.id}
          </span>
        </div>

        {/* Beneficiary */}
        <div className="mt-5 flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#1E5A46] text-white shadow-md">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-foreground">
              {item.beneficiary_name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {item.beneficiary_branch} · {item.beneficiary_city}
              </span>
            </div>
          </div>
        </div>

        {/* Item */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gold/15 text-[#8a6a10] dark:text-gold">
            <Package className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{item.item_name}</p>
            <p className="text-[11px] text-muted-foreground">
              {typeLabel} · {unitLabel}
            </p>
          </div>
        </div>

        {/* Quantity progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span>{t("delivered.quantityLabel")}</span>
            <span className="tabular-nums">
              {formatNumber(item.received_quantity, lang)} /{" "}
              {formatNumber(item.requested_quantity, lang)}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted/70">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: index * 0.08 + 0.2 }}
              className={cn(
                "h-full rounded-full",
                pct >= 100
                  ? "bg-gradient-to-r from-[#F2C94C] to-[#E0B84A]"
                  : "bg-gradient-to-r from-[#1E5A46] to-[#0F3D2E]"
              )}
            />
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("delivered.pickedAtLabel")}
              </p>
              <p className="text-xs font-semibold text-foreground">
                {formatDateTime(item.picked_at, lang)}
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-2 overflow-hidden rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 dark:bg-gold/15">
            <div
              aria-hidden
              className="pointer-events-none absolute -end-6 -top-6 h-16 w-16 rounded-full bg-gold/20 blur-xl"
            />
            <CalendarCheck className="relative h-4 w-4 flex-shrink-0 text-[#8a6a10] dark:text-gold" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6a10] dark:text-gold">
                {t("delivered.deliveredAtLabel")}
              </p>
              <p className="text-xs font-extrabold text-[#0F3D2E] dark:text-gold">
                {formatDateTime(item.delivered_at, lang)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DeliveredPage() {
  const { t, i18n: i18nInst } = useTranslation();
  const lang = i18nInst.language.startsWith("ar") ? "ar" : "en";

  const allItems = useMemo(
    () => t("delivered.list", { returnObjects: true }) as DeliveredItem[],
    [t]
  );

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.trim().toLowerCase();
    return allItems.filter(
      (it) =>
        it.beneficiary_name.toLowerCase().includes(q) ||
        it.beneficiary_branch.toLowerCase().includes(q) ||
        it.item_name.toLowerCase().includes(q) ||
        it.id.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[#0F3D2E] via-[#1E5A46] to-[#0F3D2E] p-6 text-white shadow-lg shadow-[#0F3D2E]/20"
        >
          <div className="pointer-events-none absolute -end-16 -top-16 h-52 w-52 rounded-full bg-[#F2C94C]/20 blur-3xl" />
          <div className="pointer-events-none absolute -start-10 -bottom-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-[#F2C94C]" />
                {t("delivered.eyebrow")}
              </div>
              <h1 className="mt-3 text-2xl font-bold md:text-3xl">{t("delivered.title")}</h1>
              <p className="mt-1 max-w-xl text-sm text-white/70">{t("delivered.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2C94C]/20 text-[#F2C94C]">
                <PackageCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  {t("delivered.totalLabel")}
                </p>
                <p className="text-lg font-extrabold leading-none">{allItems.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("delivered.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-border bg-card ps-10 pe-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-card/60 py-16 text-center backdrop-blur"
          >
            <PackageCheck className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">{t("delivered.empty")}</p>
          </motion.div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item, i) => (
              <DeliveredCard key={item.id} item={item} index={i} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
