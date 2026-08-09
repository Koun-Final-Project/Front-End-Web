import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  Package,
  Calendar,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Hand,
  X,
  Minus,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  Tag,
  StickyNote,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import i18n from "@/i18n";

export const Route = createFileRoute("/donations")({
  head: () => ({
    meta: [
      { title: i18n.t("donations.meta.title") },
      { name: "description", content: i18n.t("donations.meta.description") },
    ],
  }),
  component: DonationsPage,
});

type DonationStatus = -1 | 0 | 1;

interface DonationItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  remaining_quantity: number;
  item_type: string;
  unit: string;
  notes: string;
}

interface Donation {
  id: string;
  title: string;
  description: string;
  status: DonationStatus;
  notes: string;
  sent_at: string;
  sender_branch: string;
  sender_city: string;
  items: DonationItem[];
}

const STATUS_META: Record<DonationStatus, { dot: string; bg: string; text: string; ring: string; icon: typeof Clock; pulse: boolean }> = {
  0: {
    dot: "#F2C94C",
    bg: "rgba(242, 201, 76, 0.18)",
    text: "#8a6a10",
    ring: "rgba(242, 201, 76, 0.45)",
    icon: Clock,
    pulse: true,
  },
  1: {
    dot: "#1E5A46",
    bg: "rgba(30, 90, 70, 0.14)",
    text: "#0F3D2E",
    ring: "rgba(30, 90, 70, 0.35)",
    icon: CheckCircle2,
    pulse: false,
  },
  "-1": {
    dot: "#B3261E",
    bg: "rgba(179, 38, 30, 0.10)",
    text: "#8a1f1a",
    ring: "rgba(179, 38, 30, 0.35)",
    icon: XCircle,
    pulse: false,
  },
};

function localeFor(lng?: string) {
  return lng?.startsWith("ar") ? "ar-EG" : "en-US";
}

function StatusBadge({ status }: { status: DonationStatus }) {
  const { t } = useTranslation();
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold dark:text-foreground"
      style={{ backgroundColor: m.bg, color: m.text, borderColor: m.ring }}
    >
      <span className="relative flex h-2 w-2">
        {m.pulse && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
            style={{ backgroundColor: m.dot }}
          />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: m.dot }} />
      </span>
      <Icon className="h-3 w-3" />
      {t(`enums.donation_status.${status}`)}
    </span>
  );
}

function ProgressBar({ item }: { item: DonationItem }) {
  const { t, i18n } = useTranslation();
  const loc = localeFor(i18n.language);
  const fulfilled = item.quantity - item.remaining_quantity;
  const pct = item.quantity === 0 ? 0 : Math.round((fulfilled / item.quantity) * 100);
  const unit = t(`enums.unit.${item.unit}`, { defaultValue: item.unit });
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px]">
        <span className="font-bold text-foreground">
          {t("fields.donation_items.remaining_quantity")}{" "}
          <span className="text-gold">{item.remaining_quantity.toLocaleString(loc)}</span>
          <span className="text-muted-foreground"> / {item.quantity.toLocaleString(loc)} {unit}</span>
        </span>
        <span className="font-bold text-muted-foreground">{pct}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #F2C94C 0%, color-mix(in oklab, #F2C94C 70%, #1E5A46) 100%)",
            boxShadow: "0 0 12px rgba(242, 201, 76, 0.5)",
          }}
        />
      </div>
    </div>
  );
}

function DonationCard({ d, onRequest, index }: { d: Donation; onRequest: (d: Donation) => void; index: number }) {
  const { t, i18n } = useTranslation();
  const loc = localeFor(i18n.language);
  const item = d.items[0];
  const exhausted = item.remaining_quantity === 0;
  const sentAt = new Intl.DateTimeFormat(loc, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(d.sent_at));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 opacity-70"
        style={{ backgroundImage: "linear-gradient(90deg, transparent, #F2C94C, transparent)" }}
      />

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
            <Package className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold">{d.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
              <span className="rounded bg-muted px-1.5 py-0.5">{d.id}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-0.5"><Tag className="h-2.5 w-2.5" />{t(`enums.item_type.${item.item_type}`, { defaultValue: item.item_type })}</span>
            </p>
          </div>
        </div>
        <StatusBadge status={d.status} />
      </div>

      {d.description && (
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{d.description}</p>
      )}

      <div className="mb-3 space-y-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-gold" />
          <span className="font-semibold text-foreground">{d.sender_branch}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          {d.sender_city}
          <span className="mx-1 text-border">|</span>
          <Calendar className="h-3.5 w-3.5 text-gold" />
          {sentAt}
        </p>
      </div>

      <ProgressBar item={item} />

      {d.notes && (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground">
          <StickyNote className="mt-0.5 h-3 w-3 flex-shrink-0 text-gold" />
          <span>{d.notes}</span>
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          disabled={exhausted || d.status === -1}
          onClick={() => onRequest(d)}
          className="group/btn relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-medium active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:bg-gold dark:text-gold-foreground dark:shadow-gold/20"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
          />
          <Hand className="h-3.5 w-3.5" />
          <span>
            {exhausted ? t("donations.card.exhausted") : d.status === -1 ? t("donations.card.unavailable") : t("donations.card.request")}
          </span>
        </button>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-gold hover:text-foreground">
          <Sparkles className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function RequestModal({ donation, onClose }: { donation: Donation | null; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const loc = localeFor(i18n.language);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const item = donation?.items[0];

  useEffect(() => {
    if (item) {
      setQty(Math.min(10, item.remaining_quantity));
      setNote("");
      setSubmitted(false);
    }
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const max = item?.remaining_quantity ?? 0;
  const pct = item ? Math.round((qty / item.quantity) * 100) : 0;
  const unitLabel = item ? t(`enums.unit.${item.unit}`, { defaultValue: item.unit }) : "";

  return (
    <AnimatePresence>
      {donation && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0F3D2E]/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 p-6 shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(248,246,240,0.85) 0%, rgba(248,246,240,0.65) 100%)",
              backdropFilter: "blur(28px) saturate(160%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -end-20 h-48 w-48 rounded-full opacity-50 blur-3xl"
              style={{ backgroundColor: "#F2C94C" }}
            />

            <button
              onClick={onClose}
              aria-label={t("donations.modal.close")}
              className="absolute top-4 end-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#0F3D2E]/15 bg-white/60 text-[#0F3D2E] transition-all hover:scale-105 hover:bg-white active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="relative"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a6a10]">
                    {t("donations.modal.eyebrow")}
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-[#0F3D2E]">{donation.title}</h2>
                  <p className="mt-1 text-xs text-[#0F3D2E]/70">
                    {t("donations.modal.from")} <span className="font-bold">{donation.sender_branch}</span> · {donation.sender_city}
                  </p>

                  <div className="mt-4 rounded-2xl border border-white/40 bg-white/40 p-3 text-xs text-[#0F3D2E]/80">
                    <p className="font-bold text-[#0F3D2E]">{t("donations.modal.item")}: {item.name}</p>
                    {item.description && <p className="mt-0.5">{item.description}</p>}
                  </div>

                  <div className="mt-5">
                    <label className="text-xs font-bold text-[#0F3D2E]">
                      {t("donations.modal.requested_quantity")}
                    </label>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/50 p-2 backdrop-blur-sm">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F3D2E] text-[#F8F6F0] transition-all hover:scale-105 hover:bg-[#1E5A46] active:scale-95"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={qty}
                        min={1}
                        max={max}
                        onChange={(e) => setQty(Math.max(1, Math.min(max, Number(e.target.value) || 1)))}
                        className="h-10 w-full bg-transparent text-center text-2xl font-extrabold text-[#0F3D2E] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="text-xs font-bold text-[#0F3D2E]/70">{unitLabel}</span>
                      <button
                        onClick={() => setQty((q) => Math.min(max, q + 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2C94C] text-[#0F3D2E] transition-all hover:scale-105 active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={max}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="mt-4 w-full accent-[#F2C94C]"
                    />
                    <div className="mt-1 flex justify-between text-[10px] font-semibold text-[#0F3D2E]/60">
                      <span>1</span>
                      <span>{t("donations.modal.ofTotal", { pct })}</span>
                      <span>{max.toLocaleString(loc)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-bold text-[#0F3D2E]">
                      {t("donations.modal.notes")}{" "}
                      <span className="font-normal text-[#0F3D2E]/50">{t("donations.modal.optional")}</span>
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder={t("donations.modal.notesPlaceholder")}
                      className="mt-2 w-full resize-none rounded-2xl border border-white/40 bg-white/50 p-3 text-sm text-[#0F3D2E] outline-none backdrop-blur-sm transition-all placeholder:text-[#0F3D2E]/40 focus:border-[#F2C94C] focus:ring-4 focus:ring-[#F2C94C]/25"
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-[#0F3D2E]/15 bg-white/40 px-4 py-2.5 text-sm font-bold text-[#0F3D2E] transition-all hover:bg-white/70"
                    >
                      {t("donations.modal.cancel")}
                    </button>
                    <button
                      onClick={() => setSubmitted(true)}
                      className="group flex-1 rounded-xl bg-[#0F3D2E] px-4 py-2.5 text-sm font-bold text-[#F8F6F0] shadow-lg shadow-[#0F3D2E]/30 transition-all hover:scale-[1.02] hover:bg-[#1E5A46] active:scale-95"
                    >
                      {t("donations.modal.submit")}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2C94C] text-[#0F3D2E]"
                  >
                    <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="mt-4 text-xl font-extrabold text-[#0F3D2E]">{t("donations.modal.successTitle")}</h3>
                  <p className="mt-1 text-sm text-[#0F3D2E]/70">
                    {t("donations.modal.successBody", {
                      qty: qty.toLocaleString(loc),
                      unit: unitLabel,
                      title: donation.title,
                    })}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 rounded-xl bg-[#0F3D2E] px-6 py-2.5 text-sm font-bold text-[#F8F6F0] transition-all hover:scale-105 hover:bg-[#1E5A46] active:scale-95"
                  >
                    {t("common.done")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DonationsPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [active, setActive] = useState<Donation | null>(null);
  const seed = t("donations.list", { returnObjects: true }) as Donation[];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return seed.filter(
      (d) =>
        !query ||
        d.title.toLowerCase().includes(q) ||
        d.sender_branch.toLowerCase().includes(q) ||
        d.sender_city.toLowerCase().includes(q),
    );
  }, [query, seed]);

  const columns: { key: DonationStatus; label: string; hint: string }[] = [
    { key: 0, label: t("donations.columns.pending"), hint: t("donations.columns.pendingHint") },
    { key: 1, label: t("donations.columns.approved"), hint: t("donations.columns.approvedHint") },
    { key: -1, label: t("donations.columns.rejected"), hint: t("donations.columns.rejectedHint") },
  ];

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{t("donations.eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{t("donations.title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("donations.subtitle")}</p>
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary-medium active:scale-95 dark:bg-gold dark:text-gold-foreground dark:shadow-gold/20">
          <Plus className="h-4 w-4" />
          {t("donations.new")}
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("donations.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-border bg-background ps-10 pe-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
          {[
            { key: "kanban" as const, icon: LayoutGrid, label: t("donations.view.kanban") },
            { key: "list" as const, icon: ListIcon, label: t("donations.view.list") },
          ].map((v) => {
            const Icon = v.icon;
            const isActive = view === v.key;
            return (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="don-view"
                    className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-gold/40"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" /> {v.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map((col) => {
            const items = filtered.filter((d) => d.status === col.key);
            const m = STATUS_META[col.key];
            return (
              <section
                key={col.key}
                className="flex flex-col rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm"
              >
                <header className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.dot }} />
                    <h2 className="text-sm font-extrabold">{col.label}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-muted-foreground">{col.hint}</p>
                </header>
                <div className="space-y-3">
                  {items.map((d, i) => (
                    <DonationCard key={d.id} d={d} index={i} onRequest={setActive} />
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      {t("donations.emptyColumn")}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d, i) => (
            <DonationCard key={d.id} d={d} index={i} onRequest={setActive} />
          ))}
        </div>
      )}

      <RequestModal donation={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
