import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Search,
  ChevronDown,
  MapPin,
  Building2,
  Phone,
  Mail,
  Star,
  Map as MapIcon,
  HeartHandshake,
  Users,
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
import i18n from "@/i18n";

export const Route = createFileRoute("/beneficiaries")({
  head: () => ({
    meta: [
      { title: i18n.t("beneficiaries.meta.title") },
      { name: "description", content: i18n.t("beneficiaries.meta.description") },
    ],
  }),
  component: BeneficiariesPage,
});

interface Address {
  city: string;
  state: string;
  street: string;
  latitude: number;
  longitude: number;
  details: string;
}
interface Branch {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  is_main_branch: boolean;
  address: Address;
}
interface Institution {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  owner: string;
  email: string;
  phone: string;
  type: 1 | 2 | 3;
  is_active: boolean;
  attachments: string[];
  branches: Branch[];
}

function initialsOf(name: string) {
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");
}

function Logo({ name }: { name: string }) {
  return (
    <span
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold text-white shadow-md ring-2 ring-white/40 dark:ring-white/10"
      style={{
        backgroundImage: "linear-gradient(135deg, #1E5A46, #0F3D2E)",
      }}
    >
      {initialsOf(name)}
    </span>
  );
}

function StatusPill({ active }: { active: boolean }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
        active
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"
        }`}
      />
      {active ? t("common.active") : t("common.inactive")}
    </span>
  );
}

function BranchCard({ b }: { b: Branch }) {
  const { t } = useTranslation();
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <h5 className="flex flex-wrap items-center gap-1.5 text-sm font-bold leading-tight">
              {b.name}
              {b.is_main_branch && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold text-[#8a6a10] dark:text-gold">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  {t("beneficiaries.mainBranchBadge")}
                </span>
              )}
            </h5>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {b.address.city} · {b.address.state}
            </p>
          </div>
        </div>
        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {b.id}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <p className="flex items-start gap-1.5 text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
          <span className="leading-relaxed">
            {b.address.street}
            {b.address.details && (
              <span className="text-muted-foreground/70"> · {b.address.details}</span>
            )}
          </span>
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
          <Phone className="h-3.5 w-3.5 flex-shrink-0 text-gold" />
          <span className="font-semibold tracking-wide">{b.phone}</span>
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="h-3.5 w-3.5 flex-shrink-0 text-gold" />
          <span className="break-all">{b.email}</span>
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
          <MapIcon className="h-3.5 w-3.5 flex-shrink-0 text-gold" />
          <span className="font-mono text-[10px]">
            {b.address.latitude.toFixed(4)}, {b.address.longitude.toFixed(4)}
          </span>
        </p>
      </div>
    </div>
  );
}

function BeneficiaryRow({ inst, index }: { inst: Institution; index: number }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const mainBranch = inst.branches.find((b) => b.is_main_branch) ?? inst.branches[0];

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="border-b border-border/70 transition-colors hover:bg-[color-mix(in_oklab,#1E5A46_5%,transparent)]"
      >
        <TableCell className="w-14">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("beneficiaries.collapse") : t("beneficiaries.expand")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-gold hover:text-foreground focus:outline-none focus:ring-4 focus:ring-gold/25"
          >
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-3">
            <Logo name={inst.name} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold">{inst.name}</span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {inst.id}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                {inst.description}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
            <Mail className="h-3.5 w-3.5 text-gold" />
            <span className="break-all">{inst.email}</span>
          </span>
        </TableCell>

        <TableCell>
          <span className="inline-flex items-center gap-1.5 text-xs text-foreground" dir="ltr">
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span className="font-semibold tracking-wide">{inst.phone}</span>
          </span>
        </TableCell>

        <TableCell>
          {mainBranch ? (
            <div className="text-xs">
              <p className="font-semibold text-foreground">{mainBranch.address.city}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                {mainBranch.address.street}
              </p>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </TableCell>

        <TableCell>
          <StatusPill active={inst.is_active} />
        </TableCell>
      </motion.tr>

      <AnimatePresence initial={false}>
        {open && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[color-mix(in_oklab,#1E5A46_4%,transparent)]"
          >
            <TableCell colSpan={6} className="p-0">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-dashed border-border px-5 py-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-1.5 w-6 rounded-full bg-gold" />
                    <h4 className="text-sm font-extrabold">
                      {t("beneficiaries.branchesTitle")}
                    </h4>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {inst.branches.length}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {inst.branches.map((b) => (
                      <BranchCard key={b.id} b={b} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </TableCell>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function BeneficiariesPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const all = t("institutions.list", { returnObjects: true }) as Institution[];
  const beneficiaries = useMemo(() => all.filter((i) => i.type === 2), [all]);

  const filtered = beneficiaries.filter((i) => {
    const q = query.toLowerCase();
    const matchesQ =
      !query ||
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.phone.toLowerCase().includes(q) ||
      i.branches.some((b) => b.address.city.toLowerCase().includes(q));
    const matchesS =
      status === "all" || (status === "active" ? i.is_active : !i.is_active);
    return matchesQ && matchesS;
  });

  const counts = {
    all: beneficiaries.length,
    active: beneficiaries.filter((i) => i.is_active).length,
    inactive: beneficiaries.filter((i) => !i.is_active).length,
  } as const;

  const tabs: { key: "all" | "active" | "inactive"; label: string; n: number }[] = [
    { key: "all", label: t("beneficiaries.tabs.all"), n: counts.all },
    { key: "active", label: t("beneficiaries.tabs.active"), n: counts.active },
    { key: "inactive", label: t("beneficiaries.tabs.inactive"), n: counts.inactive },
  ];

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            <HeartHandshake className="h-3.5 w-3.5" />
            {t("beneficiaries.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
            {t("beneficiaries.title")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("beneficiaries.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-2xl border border-border bg-card px-4 py-2.5 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-[#8a6a10] dark:text-gold">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("beneficiaries.totalLabel")}
            </p>
            <p className="text-lg font-extrabold leading-none">{counts.all}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("beneficiaries.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-border bg-background ps-10 pe-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-muted/60 p-1">
          {tabs.map((tab) => {
            const active = status === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatus(tab.key)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="benef-tab"
                    className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-gold/40"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {tab.label}
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {tab.n}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-14" />
              <TableHead className="text-start">
                {t("beneficiaries.columns.institution")}
              </TableHead>
              <TableHead className="text-start">{t("beneficiaries.columns.email")}</TableHead>
              <TableHead className="text-start">{t("beneficiaries.columns.phone")}</TableHead>
              <TableHead className="text-start">{t("beneficiaries.columns.city")}</TableHead>
              <TableHead className="text-start">{t("beneficiaries.columns.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  {t("beneficiaries.empty")}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inst, i) => (
                <BeneficiaryRow key={inst.id} inst={inst} index={i} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
