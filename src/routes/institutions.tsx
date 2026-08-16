

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  Building2,
  Phone,
  Mail,
  Paperclip,
  X,
  ImagePlus,
  Loader2,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useCreateInstitution, useInstitutions } from "@/hooks/useInstitution";
import { BranchCard } from "@/components/ui/institutions/BranchCard";
import { BranchModal } from "@/components/ui/institutions/BranchModal";
import { DonationRequestModal } from "@/components/ui/institutions/DonationRequestModal";
import { CreateDonationModal } from "@/components/ui/institutions/CreateDonationModal";
import i18n from "@/i18n";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [{ title: i18n.t("institutions.meta.title", "المؤسسات") }],
  }),
  component: InstitutionsPage,
});

type InstitutionType = 1 | 2 | 3;

interface Branch {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  is_main_branch: boolean | number;
  address?: any;
}

interface Institution {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  email: string;
  phone: string;
  type: InstitutionType;
  is_active: boolean | number;
  owner?: { first_name: string; last_name: string };
  attachments?: any[];
  branches?: Branch[];
}

const TYPE_STYLES: Record<InstitutionType, { className: string; style: React.CSSProperties }> = {
  1: {
    className: "text-[#8a6a10] dark:text-gold",
    style: { backgroundColor: "rgba(242, 201, 76, 0.20)", borderColor: "rgba(242, 201, 76, 0.45)" },
  },
  2: {
    className: "text-[#0F3D2E] dark:text-emerald-200",
    style: { backgroundColor: "rgba(30, 90, 70, 0.10)", borderColor: "rgba(30, 90, 70, 0.30)" },
  },
  3: {
    className: "text-[#0F3D2E] dark:text-foreground",
    style: {
      backgroundImage: "linear-gradient(135deg, rgba(242,201,76,0.22), rgba(30,90,70,0.14))",
      borderColor: "rgba(15, 61, 46, 0.35)",
    },
  },
};

function TypePill({ type }: { type: InstitutionType }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES[1];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${s.className}`}
      style={s.style}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {type === 1 ? "جهة متبرعة" : type === 2 ? "جمعية خيرية" : "كلاهما"}
    </span>
  );
}

function StatusDot({ active }: { active: boolean | number }) {
  const isActive = active === true || active === 1;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
        isActive
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
      {isActive ? "نشط (مقبولة)" : "قيد الانتظار"}
    </span>
  );
}

function initialsOf(name: string) {
  if (!name) return "م";
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");
}

function hueOf(type: InstitutionType) {
  return type === 1 ? "#F2C94C" : type === 2 ? "#1E5A46" : "#0F3D2E";
}

function Avatar({ name, type, logo }: { name: string; type: InstitutionType; logo: string | null }) {
  if (logo) {
    return (
      <img src={logo} alt={name} className="flex h-12 w-12 flex-shrink-0 rounded-2xl border border-border object-cover shadow-md" />
    );
  }
  const hue = hueOf(type);
  return (
    <span
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-base font-extrabold text-white shadow-md"
      style={{ backgroundImage: `linear-gradient(135deg, ${hue}, color-mix(in oklab, ${hue} 60%, #0F3D2E))` }}
    >
      {initialsOf(name)}
    </span>
  );
}

function CreateInstitutionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutate: createInstitution, isPending } = useCreateInstitution();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    type: "1" as "1" | "2" | "3",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    createInstitution(
      {
        ...formData,
        type: Number(formData.type) as 1 | 2 | 3,
        logo,
        attachments,
      },
      {
        onSuccess: () => {
          setSuccessMsg("تم إرسال طلب تسجيل المؤسسة بنجاح! بانتظار موافقة الإدارة.");
          setTimeout(() => {
            onClose();
            setFormData({ name: "", description: "", email: "", phone: "", type: "1" });
            setLogo(null);
            setAttachments([]);
            setSuccessMsg(null);
          }, 1500);
        },
        onError: (error: any) => {
          const validationErrors = error.response?.data?.errors || error.response?.data?.data?.errors;
          if (validationErrors) {
            const firstErrorKey = Object.keys(validationErrors)[0];
            setServerError(`خطأ في الإدخال: ${validationErrors[firstErrorKey][0]}`);
          } else {
            setServerError(error.response?.data?.message || "حدث خطأ أثناء إرسال الطلب.");
          }
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-extrabold">تسجيل مؤسسة جديدة</h2>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              {serverError && (
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-bold">{serverError}</p>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-bold">{successMsg}</p>
                </div>
              )}

              <form id="create-inst-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex flex-col items-center gap-2">
                    <label className="relative flex h-28 w-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                      {logo ? (
                        <img src={URL.createObjectURL(logo)} alt="Logo" className="h-full w-full object-cover" />
                      ) : (
                        <>
                          <ImagePlus className="mb-2 h-6 w-6 text-muted-foreground" />
                          <span className="text-[10px] font-bold text-muted-foreground">شعار المؤسسة</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-start text-xs font-bold text-muted-foreground">اسم المؤسسة</label>
                      <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold shadow-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-start text-xs font-bold text-muted-foreground">نوع المؤسسة</label>
                      <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as "1" | "2" | "3" })} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold shadow-sm outline-none focus:border-primary">
                        <option value="1">جهة متبرعة</option>
                        <option value="2">جمعية خيرية</option>
                        <option value="3">كلاهما</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-start text-xs font-bold text-muted-foreground">البريد الإلكتروني</label>
                    <input required type="email" dir="ltr" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold shadow-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-start text-xs font-bold text-muted-foreground">رقم الهاتف</label>
                    <input required type="tel" dir="ltr" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold shadow-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-start text-xs font-bold text-muted-foreground">نبذة عن المؤسسة</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm font-semibold shadow-sm outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="mb-1.5 block text-start text-xs font-bold text-muted-foreground">المرفقات الإضافية</label>
                  <label className="flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-2 transition-colors hover:bg-muted/60">
                    <input type="file" multiple className="hidden" onChange={(e) => setAttachments(Array.from(e.target.files || []))} />
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">{attachments.length > 0 ? `تم اختيار ${attachments.length} ملفات` : "اضغط لاختيار الملفات"}</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
              <button onClick={onClose} type="button" className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted">إلغاء</button>
              <button form="create-inst-form" type="submit" disabled={isPending || !!successMsg} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary-medium disabled:opacity-70">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
                إرسال الطلب
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function InstitutionRow({
  inst,
  index,
  onAddBranch,
  onEditBranch,
  onOfferDonation,
  onRequestDonation,
}: {
  inst: Institution;
  index: number;
  onAddBranch: (instId: number) => void;
  onEditBranch: (instId: number, branch: any) => void;
  onOfferDonation: (branchId: number) => void;
  onRequestDonation: (branchId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = inst.is_active === true || inst.is_active === 1;
  const ownerName = inst.owner ? `${inst.owner.first_name} ${inst.owner.last_name}` : "غير محدد";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-lg ${
        isActive ? "border-border hover:border-gold/60" : "border-dashed border-amber-500/30 opacity-80"
      }`}
    >
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-4">
          <Avatar name={inst.name} type={inst.type} logo={inst.logo} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold">{inst.name}</h3>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">#{inst.id}</span>
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{inst.description}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {inst.email}</span>
              <span className="inline-flex items-center gap-1" dir="ltr"><Phone className="h-3 w-3" /> {inst.phone}</span>
            </div>
          </div>
        </div>

        <div className="hidden min-w-[160px] flex-col md:flex">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">المالك</span>
          <span className="mt-0.5 text-sm font-semibold">{ownerName}</span>
        </div>

        <div className="hidden min-w-[140px] md:block">
          <TypePill type={inst.type} />
        </div>

        <div className="hidden min-w-[120px] md:block">
          <StatusDot active={inst.is_active} />
        </div>

        <div className="hidden min-w-[110px] items-center gap-1.5 text-sm text-muted-foreground md:flex">
          <Building2 className="h-4 w-4 text-gold" />
          <span className="font-bold text-foreground">{inst.branches?.length || 0}</span>
          <span>فرع</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground dark:bg-gold/15 dark:text-gold"
          >
            <span>{open ? "إخفاء الفروع" : "عرض الفروع"}</span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="border-t border-dashed border-border px-5 py-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-6 rounded-full bg-gold" />
                  <h4 className="text-sm font-extrabold">فروع المؤسسة</h4>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{inst.branches?.length || 0}</span>
                </div>

                <button
                  disabled={!isActive}
                  onClick={() => onAddBranch(inst.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    isActive ? "border border-dashed border-gold/60 bg-gold/10 text-foreground hover:bg-gold/20" : "cursor-not-allowed border border-border bg-muted/50 text-muted-foreground"
                  }`}
                  title={!isActive ? "لا يمكنك إضافة فرع لمؤسسة قيد الانتظار" : "إضافة فرع جديد"}
                >
                  {isActive ? <Plus className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  إضافة فرع
                </button>
              </div>
              {!inst.branches || inst.branches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/50 py-6 text-center text-sm text-muted-foreground">
                  لا يوجد فروع مسجلة لهذه المؤسسة بعد.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {inst.branches.map((b: any, i: number) => (
                    <BranchCard 
                      key={b.id} 
                      branch={b} 
                      index={i} 
                      institutionType={inst.type} 
                      onEdit={(branch) => onEditBranch(inst.id, branch)}
                      onOfferDonation={onOfferDonation} 
                      onRequestDonation={onRequestDonation} 
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InstitutionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | InstitutionType>("all");

  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedInstId, setSelectedInstId] = useState<number | null>(null);
  const [branchToEdit, setBranchToEdit] = useState<any | null>(null);

  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [activeBranchIdForDonation, setActiveBranchIdForDonation] = useState<number | null>(null);

  const handleOpenOfferDonation = (branchId: number) => {
    setActiveBranchIdForDonation(branchId);
    setDonationModalOpen(true);
  };

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [activeBranchIdForRequest, setActiveBranchIdForRequest] = useState<number | null>(null);

  const handleOpenRequestDonation = (branchId: number) => {
    setActiveBranchIdForRequest(branchId);
    setRequestModalOpen(true);
  };

  const { data, isLoading } = useInstitutions(1);

  let institutions: Institution[] = [];
  if (Array.isArray(data?.data?.items)) {
    institutions = data.data.items;
  } else if (Array.isArray(data?.data)) {
    institutions = data.data;
  } else if (Array.isArray(data)) {
    institutions = data;
  }

  const handleOpenAddBranch = (instId: number) => {
    setSelectedInstId(instId);
    setBranchToEdit(null);
    setBranchModalOpen(true);
  };

  const handleOpenEditBranch = (instId: number, branch: any) => {
    setSelectedInstId(instId);
    setBranchToEdit(branch);
    setBranchModalOpen(true);
  };

  const filtered = institutions.filter((i) => {
    const q = query.toLowerCase();
    const ownerName = i.owner ? `${i.owner.first_name} ${i.owner.last_name}`.toLowerCase() : "";
    const matchesQ = !query || i.name.toLowerCase().includes(q) || ownerName.includes(q) || i.email.toLowerCase().includes(q);
    const matchesT = filter === "all" || i.type === filter;
    return matchesQ && matchesT;
  });

  const counts = {
    all: institutions.length,
    1: institutions.filter((i) => i.type === 1).length,
    2: institutions.filter((i) => i.type === 2).length,
    3: institutions.filter((i) => i.type === 3).length,
  } as const;

  const tabs: { key: "all" | InstitutionType; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: 1, label: "الجهات المتبرعة" },
    { key: 2, label: "الجمعيات الخيرية" },
    { key: 3, label: "كلاهما" },
  ];

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">النظام البيئي</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">مؤسساتي</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">إدارة الجهات المتبرعة والجمعيات التابعة لك</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary-medium active:scale-95 dark:bg-gold dark:text-gold-foreground dark:shadow-gold/20"
        >
          <Plus className="h-4 w-4" />
          تسجيل مؤسسة
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث باسم المؤسسة..."
            className="h-11 w-full rounded-xl border border-border bg-background pe-4 ps-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-muted/60 p-1">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={String(tab.key)}
                onClick={() => setFilter(tab.key)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span layoutId="inst-tab" className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-gold/40" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative flex items-center gap-1.5">
                  {tab.label}
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{counts[tab.key]}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:border-gold hover:text-foreground">
          <Filter className="h-3.5 w-3.5" /> تصفية متقدمة
        </button>
      </div>

      <div className="mb-2 hidden grid-cols-[1fr_160px_140px_120px_110px_auto] gap-4 px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:grid">
        <span>المؤسسة</span>
        <span>المالك</span>
        <span>النوع</span>
        <span>الحالة</span>
        <span>الفروع</span>
        <span className="text-end">إجراءات</span>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inst, i) => (
            <InstitutionRow
              key={inst.id}
              inst={inst}
              index={i}
              onAddBranch={handleOpenAddBranch}
              onEditBranch={handleOpenEditBranch}
              onOfferDonation={handleOpenOfferDonation}
              onRequestDonation={handleOpenRequestDonation}
            />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              لا يوجد مؤسسات تابعة لك مطابقة للبحث
            </div>
          )}
        </div>
      )}

      {/* المودالات والنافذ المنبثقة */}
      <CreateInstitutionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {selectedInstId && (
        <BranchModal
          isOpen={branchModalOpen}
          onClose={() => setBranchModalOpen(false)}
          institutionId={selectedInstId}
          branchToEdit={branchToEdit}
        />
      )}

      {activeBranchIdForDonation && (
        <CreateDonationModal
          isOpen={donationModalOpen}
          onClose={() => setDonationModalOpen(false)}
          branchId={activeBranchIdForDonation}
        />
      )}

      {activeBranchIdForRequest && (
        <DonationRequestModal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          branchId={activeBranchIdForRequest}
        />
      )}
    </AppShell>
  );
}