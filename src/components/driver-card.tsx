import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, MessageCircle, Truck, BadgeCheck } from "lucide-react";

// Per ERD `deliveries.delivery_id` references a user — only user fields exist.
export interface DeliveryPerson {
  first_name: string;
  last_name: string;
  phone: string;
  avatar?: string | null;
}

export function DriverCard({ driver }: { driver: DeliveryPerson }) {
  const { t } = useTranslation();
  const fullName = `${driver.first_name} ${driver.last_name}`.trim();
  const initials = (driver.first_name.charAt(0) + (driver.last_name.charAt(0) || "")).toUpperCase();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -end-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, #F2C94C 55%, transparent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -start-12 h-52 w-52 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, #1E5A46 65%, transparent), transparent 70%)" }}
      />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E5A46]/10 px-2.5 py-1 text-[11px] font-bold text-[#0F3D2E] dark:text-gold">
            <Truck className="h-3.5 w-3.5" />
            {t("tracking.driver.badge")}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="relative">
            {driver.avatar ? (
              <img
                src={driver.avatar}
                alt={fullName}
                className="h-16 w-16 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #1E5A46, #0F3D2E)" }}
              >
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full bg-card ring-2 ring-card">
              <BadgeCheck className="h-5 w-5 text-[#1E5A46] dark:text-gold" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("fields.users.first_name")} & {t("fields.users.last_name")}
            </p>
            <h3 className="mt-0.5 truncate text-lg font-extrabold">{fullName}</h3>
            <p className="mt-1 truncate text-xs font-medium text-muted-foreground" dir="ltr">
              {driver.phone}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <a
            href={`tel:${driver.phone}`}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E5A46] px-4 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-[#0F3D2E] active:scale-95"
          >
            <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" />
            {t("tracking.driver.call")}
          </a>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:scale-[1.02] hover:border-gold active:scale-95">
            <MessageCircle className="h-4 w-4" />
            {t("tracking.driver.chat")}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
