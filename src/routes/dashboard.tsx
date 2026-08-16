

import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api/axios"; 
import {
  HeartHandshake,
  Building2,
  FileClock,
  PackageCheck,
  ArrowUpRight,
  Plus,
  Send,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { RoleGate } from "@/components/role-gate";
import i18n from "@/i18n";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: i18n.t("dashboard.meta.title") },
      { name: "description", content: i18n.t("dashboard.meta.description") },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: async () => {
      const response = await api.get("/donation/statistics");
      return response.data.data;
    },
  });

  const stats = [
    {
      label: t("dashboard.stats.totalDonations"),
      value: statsData?.total_donations || 0,
      icon: <HeartHandshake className="h-5 w-5" />,
      delta: "",
      accent: "gold" as const,
      trend: [0, 0, 0, 0, 0],
    },
    {
      label: t("dashboard.stats.activeInstitutions"),
      value: statsData?.active_institutions || 0,
      icon: <Building2 className="h-5 w-5" />,
      delta: "",
      accent: "primary" as const,
      trend: [0, 0, 0, 0, 0],
    },
    {
      label: t("dashboard.stats.pendingRequests"),
      value: statsData?.pending_donation_requests || 0,
      icon: <FileClock className="h-5 w-5" />,
      delta: "",
      accent: "primary" as const,
      trend: [0, 0, 0, 0, 0],
    },
    {
      label: t("dashboard.stats.delivered"),
      value: statsData?.delivered_donations || 0,
      icon: <PackageCheck className="h-5 w-5" />,
      delta: "",
      accent: "gold" as const,
      trend: [0, 0, 0, 0, 0],
    },
  ];

  const activity = t("dashboard.activity.items", { returnObjects: true }) as { t: string; s: string }[];
  const colors = ["gold", "primary", "primary", "gold"];

  const maxGraphCount = statsData?.graph ? Math.max(...statsData.graph.map((g: any) => g.count)) : 1;

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-muted-foreground">{t("dashboard.welcome")}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{t("dashboard.title")}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RoleGate allow={[1, 3]}>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/15 px-4 py-3 text-sm font-bold text-foreground transition-all hover:scale-105 hover:bg-gold/25 active:scale-95">
              <Plus className="h-4 w-4" />
              {t("dashboard.cta.postDonation")}
            </button>
          </RoleGate>
          <RoleGate allow={[2, 3]}>
            <button className="inline-flex items-center gap-2 rounded-xl border border-primary-medium/30 bg-primary-medium/10 px-4 py-3 text-sm font-bold text-foreground transition-all hover:scale-105 hover:bg-primary-medium/20 active:scale-95">
              <Send className="h-4 w-4" />
              {t("dashboard.cta.makeRequest")}
            </button>
          </RoleGate>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_12px_24px_-12px_rgba(15,61,46,0.6)] transition-all hover:scale-105 active:scale-95 dark:bg-gold dark:text-gold-foreground">
            {t("dashboard.dailyReport")}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{t("dashboard.chart.title")}</h2>
            <span className="text-xs text-muted-foreground">{t("dashboard.chart.range")}</span>
          </div>
          
          {/* 3. إنشاء المخطط البياني الديناميكي (Bar Chart) */}
      {/* 3. إنشاء المخطط البياني الخطي المتقدم (Advanced Area Chart) */}
      {isLoading ? (
            <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="mt-6 h-72 w-full rounded-xl border border-dashed border-border bg-muted/5 p-4 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={statsData?.graph || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  {/* تعريف التدرج اللوني تحت الخط */}
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F2C94C" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#F2C94C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  
                  <XAxis
                    dataKey="period"
                    tickFormatter={(val) => val.split(" - ")[0]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    dy={10}
                  />
                  
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#F2C94C", fontWeight: "bold" }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                    formatter={(value) => [value, "التبرعات"]}
                  />
                  
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#F2C94C"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    activeDot={{ r: 6, fill: "#F2C94C", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-bold">{t("dashboard.activity.title")}</h2>
          <ul className="mt-5 space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                    colors[i] === "gold" ? "bg-gold" : "bg-primary-medium"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{a.t}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.s}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div> */}
      </div>
    </AppShell>
  );
}