import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}

export function AnimatedCounter({ value, duration = 1.6, format }: Props) {
  const { i18n } = useTranslation();
  const loc = i18n.language?.startsWith("ar") ? "ar-EG" : "en-US";
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => {
    const n = Math.round(latest);
    return format ? format(n) : n.toLocaleString(loc);
  });
  const [display, setDisplay] = useState(format ? format(0) : (0).toLocaleString(loc));

  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(String(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, duration, mv, rounded]);

  return <motion.span>{display}</motion.span>;
}
