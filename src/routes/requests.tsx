import { Fragment, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  ChevronDown,
  Check,
  X,
  RotateCcw,
  MapPin,
  Phone,
  Mail,
  User2,
  Building2,
  Calendar,
  Package,
  StickyNote,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import i18n from "@/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: i18n.t("requests.meta.title") },
      { name: "description", content: i18n.t("requests.meta.description") },
    ],
  }),
  component: RequestsPage,
});

type RequestStatus = -1 | 0 | 1;

interface RequestItem {
  name: string;
  unit: string;
  type: string;
  requested_quantity: number;
  approved_quantity: number;
  received_quantity: number;
}
interface ReceiverUser {
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string;
}
interface DonationRequest {
  id: string;
  status: RequestStatus;
  date: string;
  notes: string;
  receiver_branch: string;
  receiver_branch_city: string;
  receiver_user: ReceiverUser;
  item: RequestItem;
}

const STATUS_TABS: Array<"all" | "0" | "1" | "-1"> = ["all", "0", "1", "-1"];

function formatDate(iso: string, lang: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatNumber(n: number, lang: string) {
  return n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
}

function StatusPill({ status }: { status: RequestStatus }) {
  const { t } = useTranslation();
  const label = t(`enums.request_status.${status}` as const);
  const styles =
    status === 1
      ? "bg-emerald-500/12 text-emerald-500 border-emerald-500/25"
      : status === -1
      ? "bg-rose-500/12 text-rose-500 border-rose-500/25"
      : "bg-[#F2C94C]/15 text-[#F2C94C] border-[#F2C94C]/30";
  const dotColor =
    status === 1
      ? "bg-emerald-500"
      : status === -1
      ? "bg-rose-500"
      : "bg-[#F2C94C]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        styles,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor, status === 0 && "animate-pulse")} />
      {label}
    </span>
  );
}

function MiniBar({
  value,
  total,
  label,
  color,
  lang,
}: {
  value: number;
  total: number;
  label: string;
  color: string;
  lang: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums">
          {formatNumber(value, lang)} / {formatNumber(total, lang)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function QuantityBlock({
  item,
  lang,
}: {
  item: RequestItem;
  lang: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex min-w-[180px] flex-col gap-2">
      <MiniBar
        value={item.approved_quantity}
        total={item.requested_quantity}
        label={t("requests.quantities.shortApproved")}
        color="bg-gradient-to-r from-[#F2C94C] to-[#E0B84A]"
        lang={lang}
      />
      <MiniBar
        value={item.received_quantity}
        total={item.approved_quantity || item.requested_quantity}
        label={t("requests.quantities.shortReceived")}
        color="bg-gradient-to-r from-[#1E5A46] to-[#0F3D2E]"
        lang={lang}
      />
    </div>
  );
}

function ActionButtons({
  status,
  onApprove,
  onReject,
  onReset,
}: {
  status: RequestStatus;
  onApprove: () => void;
  onReject: () => void;
  onReset: () => void;
}) {
  const { t } = useTranslation();
  if (status === 1) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-500"
        >
          <Check className="h-3.5 w-3.5" />
          {t("requests.actions.approved")}
        </motion.div>
        <button
          onClick={onReset}
          className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={t("requests.actions.reset")}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }
  if (status === -1) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-500"
        >
          <X className="h-3.5 w-3.5" />
          {t("requests.actions.rejected")}
        </motion.div>
        <button
          onClick={onReset}
          className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={t("requests.actions.reset")}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onApprove}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1E5A46] to-[#0F3D2E] px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-[#0F3D2E]/25 transition-shadow hover:shadow-[#0F3D2E]/40"
      >
        <Check className="h-3.5 w-3.5" />
        {t("requests.actions.approve")}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReject}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-rose-500/40 hover:text-rose-500"
      >
        <X className="h-3.5 w-3.5" />
        {t("requests.actions.reject")}
      </motion.button>
    </div>
  );
}

function RequestsPage() {
  const { t, i18n: i18nInst } = useTranslation();
  const lang = i18nInst.language.startsWith("ar") ? "ar" : "en";

  const initialList = useMemo(
    () => t("requests.list", { returnObjects: true }) as DonationRequest[],
    [t],
  );

  const [rows, setRows] = useState<DonationRequest[]>(initialList);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "0" | "1" | "-1">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => setRows(initialList), [initialList]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (tab !== "all" && String(r.status) !== tab) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.receiver_branch.toLowerCase().includes(q) ||
        r.item.name.toLowerCase().includes(q)
      );
    });
  }, [rows, tab, query]);

  const updateStatus = (id: string, status: RequestStatus) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (status === 1) {
          const approved = r.item.approved_quantity || r.item.requested_quantity;
          return { ...r, status, item: { ...r.item, approved_quantity: approved } };
        }
        if (status === -1) {
          return { ...r, status, item: { ...r.item, approved_quantity: 0, received_quantity: 0 } };
        }
        return { ...r, status };
      }),
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
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
                {t("requests.eyebrow")}
              </div>
              <h1 className="mt-3 text-2xl font-bold md:text-3xl">{t("requests.title")}</h1>
              <p className="mt-1 max-w-xl text-sm text-white/70">{t("requests.subtitle")}</p>
            </div>
            <Button className="gap-2 bg-[#F2C94C] text-[#0F3D2E] hover:bg-[#E0B84A]">
              <Plus className="h-4 w-4" />
              {t("requests.new")}
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("requests.searchPlaceholder")}
              className="ps-9"
            />
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              {STATUS_TABS.map((k) => (
                <TabsTrigger key={k} value={k}>
                  {t(`requests.tabs.${k}` as const)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-10" />
                <TableHead>{t("requests.columns.beneficiary")}</TableHead>
                <TableHead>{t("requests.columns.item")}</TableHead>
                <TableHead>{t("requests.columns.date")}</TableHead>
                <TableHead>{t("requests.columns.progress")}</TableHead>
                <TableHead>{t("requests.columns.status")}</TableHead>
                <TableHead className="text-end">{t("requests.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    {t("requests.empty")}
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r) => {
                const isOpen = expanded === r.id;
                const unitLabel = t(`enums.unit.${r.item.unit}` as const, r.item.unit);
                const typeLabel = t(`enums.item_type.${r.item.type}` as const, r.item.type);
                return (
                  <Fragment key={r.id}>
                    <TableRow
                      className={cn(
                        "cursor-pointer transition-colors",
                        isOpen && "bg-[#0F3D2E]/[0.03] dark:bg-[#F2C94C]/[0.04]",
                      )}
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                    >
                      <TableCell>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </motion.div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#1E5A46] text-white">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-foreground">
                              {r.receiver_branch}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {r.receiver_branch_city}
                              <span className="mx-1">·</span>
                              <span className="font-mono">{r.id}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2C94C]/15 text-[#B8901F]">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{r.item.name}</div>
                            <div className="text-[11px] text-muted-foreground">{typeLabel} · {unitLabel}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(r.date, lang)}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[220px]">
                        <QuantityBlock item={r.item} lang={lang} />
                      </TableCell>
                      <TableCell>
                        <StatusPill status={r.status} />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()} className="text-end">
                        <div className="flex justify-end">
                          <ActionButtons
                            status={r.status}
                            onApprove={() => updateStatus(r.id, 1)}
                            onReject={() => updateStatus(r.id, -1)}
                            onReset={() => updateStatus(r.id, 0)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={7} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-4 border-t border-border/60 bg-gradient-to-br from-[#0F3D2E]/[0.03] to-transparent p-5 md:grid-cols-3">
                                {/* Notes */}
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <StickyNote className="h-3.5 w-3.5 text-[#F2C94C]" />
                                    {t("requests.details.notesTitle")}
                                  </div>
                                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                                    {r.notes || (
                                      <span className="italic text-muted-foreground">
                                        {t("requests.details.notesEmpty")}
                                      </span>
                                    )}
                                  </p>
                                </div>

                                {/* Receiver User */}
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <User2 className="h-3.5 w-3.5 text-[#F2C94C]" />
                                    {t("requests.details.receiverTitle")}
                                  </div>
                                  <div className="mt-3 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1E5A46] to-[#0F3D2E] text-sm font-semibold text-white">
                                      {r.receiver_user.first_name.charAt(0)}
                                      {r.receiver_user.last_name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold">
                                        {r.receiver_user.first_name} {r.receiver_user.last_name}
                                      </div>
                                      <div className="text-[11px] text-muted-foreground">
                                        {r.receiver_user.role}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-3 w-3" />
                                      <span dir="ltr">{r.receiver_user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-3 w-3" />
                                      <span dir="ltr">{r.receiver_user.email}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Full quantity breakdown */}
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <Package className="h-3.5 w-3.5 text-[#F2C94C]" />
                                    {t("requests.columns.progress")}
                                  </div>
                                  <div className="mt-3 space-y-2.5">
                                    <MiniBar
                                      value={r.item.requested_quantity}
                                      total={r.item.requested_quantity}
                                      label={t("requests.quantities.requested")}
                                      color="bg-muted-foreground/40"
                                      lang={lang}
                                    />
                                    <MiniBar
                                      value={r.item.approved_quantity}
                                      total={r.item.requested_quantity}
                                      label={t("requests.quantities.approved")}
                                      color="bg-gradient-to-r from-[#F2C94C] to-[#E0B84A]"
                                      lang={lang}
                                    />
                                    <MiniBar
                                      value={r.item.received_quantity}
                                      total={r.item.approved_quantity || r.item.requested_quantity}
                                      label={t("requests.quantities.received")}
                                      color="bg-gradient-to-r from-[#1E5A46] to-[#0F3D2E]"
                                      lang={lang}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
