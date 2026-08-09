import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Package, Hash, Building2, ArrowLeft, ArrowRight, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DeliveryTimeline, type DeliveryStatus } from "@/components/delivery-timeline";
import { DriverCard, type DeliveryPerson } from "@/components/driver-card";
import i18n from "@/i18n";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: i18n.t("tracking.meta.title") },
      { name: "description", content: i18n.t("tracking.meta.description") },
    ],
  }),
  component: TrackingPage,
});

const STAGE_KEYS: DeliveryStatus[] = [0, 1, 3, 4];

// Per ERD: deliveries only stores picked_at + delivered_at.
const PICKED_AT = "2026-06-13T11:02:00";
const DELIVERED_AT: string | undefined = undefined;

interface RequestItem {
  name: string;
  unit: string;
  requested_quantity: number;
  approved_quantity: number;
  received_quantity: number;
}

function TrackingPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const loc = isRtl ? "ar-EG" : "en-US";
  const Arrow = isRtl ? ArrowRight : ArrowLeft;
  const [current, setCurrent] = useState<DeliveryStatus>(3);

  const driver: DeliveryPerson = {
    first_name: t("tracking.driver.first_name"),
    last_name: t("tracking.driver.last_name"),
    phone: t("tracking.driver.phone"),
  };

  const receiver: DeliveryPerson = {
    first_name: t("tracking.receiver.first_name"),
    last_name: t("tracking.receiver.last_name"),
    phone: t("tracking.receiver.phone"),
  };

  const items = t("tracking.items.list", { returnObjects: true }) as RequestItem[];

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <button className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <Arrow className="h-3.5 w-3.5" />
            {t("tracking.back")}
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight">{t("tracking.title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("tracking.subtitle")}</p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-2xl border border-border bg-card/70 p-1 backdrop-blur-xl">
          {STAGE_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setCurrent(key)}
              className={`relative rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors ${
                current === key ? "text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {current === key && (
                <motion.span
                  layoutId="stage-pill"
                  className="absolute inset-0 rounded-xl bg-[#1E5A46]"
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                />
              )}
              <span className="relative">{t(`tracking.stages.${key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E5A46]/10 text-[#1E5A46] dark:text-gold">
            <Hash className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted-foreground">{t("tracking.meta_card.request")}</p>
            <p className="font-mono text-sm font-bold">{t("tracking.meta_card.requestValue")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted-foreground">{t("tracking.meta_card.donation")}</p>
            <p className="text-sm font-bold">{t("tracking.meta_card.donationValue")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] dark:bg-gold/15 dark:text-gold">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted-foreground">{t("tracking.meta_card.receiver_branch")}</p>
            <p className="text-sm font-bold">{t("tracking.meta_card.receiver_branchValue")}</p>
          </div>
        </div>
      </motion.div>

      {/* Donation request items — requested / approved / received */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="border-b border-border p-5">
          <h2 className="text-base font-extrabold">{t("tracking.items.title")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("tracking.items.subtitle")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-2 text-start font-bold">{t("tracking.items.columns.item")}</th>
                <th className="px-5 py-2 text-start font-bold">{t("tracking.items.columns.requested")}</th>
                <th className="px-5 py-2 text-start font-bold">{t("tracking.items.columns.approved")}</th>
                <th className="px-5 py-2 text-start font-bold">{t("tracking.items.columns.received")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const unit = t(`enums.unit.${it.unit}`, { defaultValue: it.unit });
                return (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-5 py-3 font-semibold">{it.name}</td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-foreground">{it.requested_quantity.toLocaleString(loc)}</span>
                      <span className="ms-1 text-xs text-muted-foreground">{unit}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-[#1E5A46] dark:text-gold">{it.approved_quantity.toLocaleString(loc)}</span>
                      <span className="ms-1 text-xs text-muted-foreground">{unit}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">{it.received_quantity.toLocaleString(loc)}</span>
                      <span className="ms-1 text-xs text-muted-foreground">{unit}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8"
        >
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-lg font-extrabold">{t("tracking.stagesTitle")}</h2>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {t("tracking.live")}
            </span>
          </div>
          <DeliveryTimeline current={current} picked_at={PICKED_AT} delivered_at={DELIVERED_AT} />
        </motion.section>

        <div className="space-y-4">
          <DriverCard driver={driver} />

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="rounded-3xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-[#8a6a10] dark:text-gold">
                <User className="h-3.5 w-3.5" />
                {t("tracking.receiver.label")}
              </span>
            </div>
            <p className="mt-3 text-base font-extrabold">
              {receiver.first_name} {receiver.last_name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">
              {receiver.phone}
            </p>
          </motion.aside>
        </div>
      </div>
    </AppShell>
  );
}
