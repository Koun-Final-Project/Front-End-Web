
import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useDonationsList, useCreateDonationRequest } from "@/hooks/useDonationsApi";
import { CreateDonationModal } from "@/components/ui/institutions/CreateDonationModal"; 
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
  Tag,
  StickyNote,
  Loader2,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import i18n from "@/i18n";

export const Route = createFileRoute("/donations")({
  head: () => ({
    meta: [
      { title: i18n.t("donations.meta.title", "التبرعات المتاحة") },
      { name: "description", content: i18n.t("donations.meta.description") },
    ],
  }),
  component: DonationsPage,
});

type DonationStatus = -1 | 0 | 1;

interface DonationItem {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  remaining_quantity: number;
  notes: string | null;
  unit: {
    id: number;
    name: string;
    description: string;
  };
  donation_type: {
    id: number;
    name: string;
  };
}

interface Donation {
  id: string;
  title: string;
  description: string | null;
  status: DonationStatus;
  notes: string | null;
  sent_at: string | null;
  sender_branch: string;
  sender_city: string;
  items: DonationItem[];
}

const STATUS_META: Record<DonationStatus, { dot: string; bg: string; text: string; ring: string; icon: typeof Clock; pulse: boolean }> = {
  0: { dot: "#F2C94C", bg: "rgba(242, 201, 76, 0.18)", text: "#8a6a10", ring: "rgba(242, 201, 76, 0.45)", icon: Clock, pulse: true },
  1: { dot: "#1E5A46", bg: "rgba(30, 90, 70, 0.14)", text: "#0F3D2E", ring: "rgba(30, 90, 70, 0.35)", icon: CheckCircle2, pulse: false },
  "-1": { dot: "#B3261E", bg: "rgba(179, 38, 30, 0.10)", text: "#8a1f1a", ring: "rgba(179, 38, 30, 0.35)", icon: XCircle, pulse: false },
};

function localeFor(lng?: string) {
  return lng?.startsWith("ar") ? "ar-EG" : "en-US";
}

function StatusBadge({ status }: { status: DonationStatus }) {
  const { t } = useTranslation();
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold dark:text-foreground" style={{ backgroundColor: m.bg, color: m.text, borderColor: m.ring }}>
      <span className="relative flex h-2 w-2">
        {m.pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ backgroundColor: m.dot }} />}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: m.dot }} />
      </span>
      <Icon className="h-3 w-3" />
      {t(`enums.donation_status.${status}`, status === 0 ? "قيد الانتظار" : status === 1 ? "مقبول" : "مرفوض")}
    </span>
  );
}

function DonationCard({ d, onRequest, index, isNormalUser }: { d: Donation; onRequest: (d: Donation) => void; index: number, isNormalUser: boolean }) {
  const { t, i18n } = useTranslation();
  const loc = localeFor(i18n.language);
  const hasItems = d.items && d.items.length > 0;
  const allExhausted = hasItems ? d.items.every(i => i.remaining_quantity === 0) : true;
  
  let sentAtFormatted = "قيد المعالجة / غير محدد";
  try {
    if (d.sent_at) {
      sentAtFormatted = new Intl.DateTimeFormat(loc, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(d.sent_at));
    }
  } catch (e) {}

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 opacity-70" style={{ backgroundImage: "linear-gradient(90deg, transparent, #F2C94C, transparent)" }} />
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
            <Package className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold">{d.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
              <span className="rounded bg-muted px-1.5 py-0.5">#{d.id}</span>
              <span>·</span>
              <span>{d.items.length} مواد متبرع بها</span>
            </p>
          </div>
        </div>
        <StatusBadge status={d.status} />
      </div>

      {d.description && <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{d.description}</p>}

      <div className="mb-3 space-y-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-gold" />
          <span className="font-semibold text-foreground">{d.sender_branch}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gold" /> {d.sender_city}
          <span className="mx-1 text-border">|</span>
          <Calendar className="h-3.5 w-3.5 text-gold" /> {sentAtFormatted}
        </p>
      </div>

      <div className="my-3 space-y-3 rounded-xl bg-muted/30 p-3">
        {hasItems ? (
          d.items.map((item) => {
            const fulfilled = item.quantity - item.remaining_quantity;
            const pct = item.quantity === 0 ? 0 : Math.round((fulfilled / item.quantity) * 100);
            return (
              <div key={item.id} className="border-b border-border/50 pb-2.5 last:border-0 last:pb-0">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1 text-foreground">
                    <Tag className="h-3 w-3 text-gold" />
                    {item.name} <span className="text-[10px] text-muted-foreground">({item.donation_type.name})</span>
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    المتبقي: <strong className="text-gold">{item.remaining_quantity}</strong> / {item.quantity} {item.unit.name}
                  </span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[#F2C94C] to-[#1E5A46]"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-xs text-muted-foreground">لا توجد مواد مضافة لهذا التبرع</p>
        )}
      </div>

      {d.notes && (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground">
          <StickyNote className="mt-0.5 h-3 w-3 flex-shrink-0 text-gold" />
          <span>{d.notes}</span>
        </p>
      )}

      {/* يتم إخفاء أزرار أو حقول الإجراءات تماماً إذا كان المستخدم عادي */}
      {!isNormalUser && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            disabled={allExhausted || d.status === -1 || !hasItems}
            onClick={() => onRequest(d)}
            className="group/btn relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gold dark:text-gold-foreground"
          >
            <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
            <Hand className="h-3.5 w-3.5" />
            <span>
              {!hasItems ? "غير متاح" : allExhausted ? t("donations.card.exhausted", "نفذت الكمية") : d.status === -1 ? t("donations.card.unavailable", "غير متاح") : t("donations.card.request", "تقديم طلب")}
            </span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

function RequestModal({ donation, branchId, onClose }: { donation: Donation | null; branchId: number | string; onClose: () => void }) {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const { mutate: createRequest, isPending } = useCreateDonationRequest();

  const items = donation?.items || [];

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
      setQty(Math.min(10, items[0].remaining_quantity || 1));
      setNote("");
    }
  }, [donation]);

  const activeItem = items.find(i => i.id === selectedItemId) || items[0];

  const handleSubmitRequest = () => {
    if (!activeItem) return;
    let userId = "1";
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        userId = String(parsed.id || parsed.profile?.id || parsed.user?.id || "1");
      } catch (e) {}
    }

    createRequest(
      {
        receiver_branch_id: branchId,
        receiver_user_id: userId,
        status: 0,
        notes: note,
        items: [{ donation_item_id: activeItem.id, requested_quantity: qty }]
      },
      { onSuccess: () => onClose() }
    );
  };

  const max = activeItem?.remaining_quantity ?? 0;
  const unitLabel = activeItem?.unit?.name || "";

  return (
    <AnimatePresence>
      {donation && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div onClick={onClose} className="absolute inset-0 bg-[#0F3D2E]/70 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 p-6 shadow-2xl bg-card">
            <button type="button" onClick={onClose} className="absolute top-4 end-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/60 text-foreground transition-all hover:scale-105"><X className="h-4 w-4" /></button>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">طلب تبرع جديد</p>
              <h2 className="mt-1 text-xl font-extrabold">{donation.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">من فرع: <span className="font-bold">{donation.sender_branch}</span></p>

              {items.length > 1 && (
                <div className="mt-4">
                  <label className="text-xs font-bold">اختر المادة المطلوبة</label>
                  <select 
                    value={selectedItemId} 
                    onChange={(e) => {
                      setSelectedItemId(e.target.value);
                      const chosen = items.find(i => i.id === e.target.value);
                      if (chosen) setQty(Math.min(10, chosen.remaining_quantity || 1));
                    }}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold outline-none focus:border-gold"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.donation_type.name}) - متبقي: {i.remaining_quantity} {i.unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeItem && (
                <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-3 text-xs">
                  <p className="font-bold">المادة: {activeItem.name} ({activeItem.donation_type.name})</p>
                  <p className="text-muted-foreground mt-0.5">الكمية المتاحة للطلب: {max} {unitLabel}</p>
                </div>
              )}

              <div className="mt-5">
                <label className="text-xs font-bold">الكمية المراد طلبها</label>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-background p-2">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground"><Minus className="h-4 w-4" /></button>
                  <input type="number" value={qty} min={1} max={max} onChange={(e) => setQty(Math.max(1, Math.min(max, Number(e.target.value) || 1)))} className="h-10 w-full bg-transparent text-center text-2xl font-extrabold outline-none" />
                  <span className="text-xs font-bold text-muted-foreground">{unitLabel}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-foreground"><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold">ملاحظات الطلب</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="ملاحظات إضافية للطلب..." className="mt-2 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-gold" />
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold">إلغاء</button>
                <button type="button" onClick={handleSubmitRequest} disabled={isPending || max === 0} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg dark:bg-gold dark:text-gold-foreground disabled:opacity-50">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  تأكيد وإرسال الطلب
                </button>
              </div>
            </div>
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const { data: apiData, isLoading } = useDonationsList();
  
  const [isNormalUser] = useState<boolean>(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return true;
      const parsed = JSON.parse(userStr);
      
      const roles = parsed.roles || parsed.user?.roles || parsed.profile?.roles || [];
      const role = parsed.role || parsed.user?.role || parsed.profile?.role;
      const isAdmin = parsed.is_admin || parsed.user?.is_admin;
      
      if (isAdmin || role === 'admin' || roles.includes('admin') || roles.includes('delivery')) {
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  });

  const userBranchId = useMemo(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return 1;
      const parsed = JSON.parse(userStr);
      return Number(parsed.branch_id || parsed.user?.branch_id || parsed.profile?.branch_id || 1);
    } catch (e) {
      return 1;
    }
  }, []);

  const mappedDonations: Donation[] = useMemo(() => {
    const rawDonations = Array.isArray(apiData?.data?.items) ? apiData.data.items : Array.isArray(apiData?.data) ? apiData.data : Array.isArray(apiData) ? apiData : [];
    
    return rawDonations.map((d: any) => {
      let statusVal: DonationStatus = 0;
      const s = String(d.status).toLowerCase();
      if (s === "pending") statusVal = 0;
      else if (s === "approved") statusVal = 1;
      else if (s === "rejected") statusVal = -1;
      else statusVal = (Number(d.status) || 0) as DonationStatus;

      const dItems = d.donation_items || d.items || [];
      const items = dItems.map((i: any) => ({
        id: String(i.id),
        name: i.name || "عنصر",
        description: i.description || null,
        quantity: Number(i.quantity) || 0,
        remaining_quantity: Number(i.remaining_quantity ?? i.quantity) || 0,
        notes: i.notes || null,
        unit: {
          id: i.unit?.id || 1,
          name: i.unit?.name || "UNIT",
          description: i.unit?.description || ""
        },
        donation_type: {
          id: i.donation_type?.id || 1,
          name: i.donation_type?.name || "نوع عام"
        }
      }));

      return {
        id: String(d.id),
        title: d.title || "بدون عنوان",
        description: d.description || "",
        status: statusVal,
        notes: d.notes || "",
        sent_at: d.sent_at || null,
        sender_branch: d.sender_branch?.name || "فرع غير محدد",
        sender_city: d.sender_branch?.address?.city || d.sender_branch?.institution?.name || "موقع غير محدد",
        items: items
      };
    });
  }, [apiData]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return mappedDonations.filter(
      (d) => !query || d.title.toLowerCase().includes(q) || d.sender_branch.toLowerCase().includes(q) || d.sender_city.toLowerCase().includes(q)
    );
  }, [query, mappedDonations]);

  const columns: { key: DonationStatus; label: string; hint: string }[] = [
    { key: 0, label: t("donations.columns.pending", "قيد الانتظار"), hint: t("donations.columns.pendingHint", "بانتظار المراجعة") },
    { key: 1, label: t("donations.columns.approved", "مقبولة"), hint: t("donations.columns.approvedHint", "متاحة للطلب") },
    { key: -1, label: t("donations.columns.rejected", "مرفوضة"), hint: t("donations.columns.rejectedHint", "تم رفضها") },
  ];

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{t("donations.eyebrow", "بنك التبرعات")}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{t("donations.title", "التبرعات المتاحة")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("donations.subtitle", "استعرض واطلب التبرعات المتوفرة")}</p>
        </div>
        {!isNormalUser && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary-medium active:scale-95 dark:bg-gold dark:text-gold-foreground dark:shadow-gold/20"
          >
            <Plus className="h-4 w-4" />
            {t("donations.new", "تقديم تبرع جديد")}
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("donations.searchPlaceholder", "ابحث باسم التبرع، أو الفرع...")} className="h-11 w-full rounded-xl border border-border bg-background ps-10 pe-4 text-sm outline-none transition-all focus:border-gold focus:ring-4 focus:ring-gold/15" />
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
          {[
            { key: "kanban" as const, icon: LayoutGrid, label: t("donations.view.kanban", "لوحة") },
            { key: "list" as const, icon: ListIcon, label: t("donations.view.list", "قائمة") },
          ].map((v) => {
            const Icon = v.icon;
            const isActive = view === v.key;
            return (
              <button key={v.key} type="button" onClick={() => setView(v.key)} className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {isActive && <motion.span layoutId="don-view" className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-gold/40" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative inline-flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : view === "kanban" ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map((col) => {
            const items = filtered.filter((d) => d.status === col.key);
            const m = STATUS_META[col.key];
            return (
              <section key={col.key} className="flex flex-col rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm">
                <header className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.dot }} />
                    <h2 className="text-sm font-extrabold">{col.label}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{items.length}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-muted-foreground">{col.hint}</p>
                </header>
                <div className="space-y-3">
                  {items.map((d, i) => <DonationCard key={d.id} d={d} index={i} onRequest={setActive} isNormalUser={isNormalUser} />)}
                  {items.length === 0 && <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">لا يوجد تبرعات في هذا القسم حالياً</div>}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d, i) => <DonationCard key={d.id} d={d} index={i} onRequest={setActive} isNormalUser={isNormalUser} />)}
        </div>
      )}

      <RequestModal donation={active} branchId={userBranchId} onClose={() => setActive(null)} />
      <CreateDonationModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} branchId={userBranchId} />
    </AppShell>
  );
}