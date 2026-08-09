import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

interface Props {
  label: string;
  value: number;
  icon: ReactNode;
  delta: string;
  trend: number[];
  accent?: "gold" | "primary";
  index?: number;
}

export function StatCard({ label, value, icon, delta, trend, accent = "primary", index = 0 }: Props) {
  const positive = !delta.startsWith("-");
  const gold = accent === "gold";
  const stroke = gold ? "#F2C94C" : "#1E5A46";

  // Build smooth SVG path
  const w = 200;
  const h = 60;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  const step = w / (trend.length - 1);
  const points = trend.map((v, i) => [i * step, h - ((v - min) / range) * (h - 8) - 4] as const);
  const path = points
    .map((p, i) => {
      if (i === 0) return `M ${p[0]},${p[1]}`;
      const prev = points[i - 1];
      const cx = (prev[0] + p[0]) / 2;
      return `Q ${cx},${prev[1]} ${cx},${(prev[1] + p[1]) / 2} T ${p[0]},${p[1]}`;
    })
    .join(" ");
  const areaPath = `${path} L ${w},${h} L 0,${h} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl"
    >
      {/* trend bg */}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-60"
        aria-hidden
      >
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${label})`} />
        <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            gold
              ? "bg-gold/15 text-gold"
              : "bg-primary/10 text-primary dark:bg-primary-medium/30 dark:text-gold"
          }`}
        >
          {icon}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            positive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {delta}
        </span>
      </div>

      <div className="relative mt-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
          <AnimatedCounter value={value} />
        </p>
      </div>
    </motion.div>
  );
}
