import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Loader2, Sparkles } from "lucide-react";
import { useCreateDonation } from "@/hooks/useDonationsApi";

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number | string;
}

export function CreateDonationModal({ isOpen, onClose, branchId }: CreateDonationModalProps) {
  const { mutate: createDonation, isPending } = useCreateDonation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  
  // بيانات العنصر الأول متل البوست مان
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitId, setUnitId] = useState("1");
  const [donationTypeId, setDonationTypeId] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // جلب الـ user_id الحالي من الـ localStorage بأمان
    let userId = "1";
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        userId = String(parsed.id || parsed.profile?.id || parsed.user?.id || "1");
      } catch (e) {
        console.error(e);
      }
    }

    createDonation(
      {
        sender_branch_id: branchId,
        sender_user_id: userId,
        title,
        description,
        status: 0, // Pending
        notes,
        items: [
          {
            unit_id: unitId,
            donation_type_id: donationTypeId,
            name: itemName,
            quantity: quantity,
          }
        ]
      },
      {
        onSuccess: () => {
          onClose();
          setTitle("");
          setDescription("");
          setItemName("");
          setQuantity(1);
          setNotes("");
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#0F3D2E]/70 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 p-6 shadow-2xl bg-card">
            
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">تقديم تبرع جديد</h2>
                  <p className="text-xs text-muted-foreground">أدخل تفاصيل ومحتويات التبرع للفرع</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto px-1">
              <div>
                <label className="text-xs font-bold">عنوان التبرع</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: تبرع مواد غذائية" className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-gold" />
              </div>

              <div>
                <label className="text-xs font-bold">وصف التبرع</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="تفاصيل إضافية..." className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-gold resize-none" />
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3">
                <h3 className="text-xs font-extrabold text-gold uppercase tracking-wider">عنصر التبرع</h3>
                <div>
                  <label className="text-xs font-bold">اسم المادة / الصنف</label>
                  <input required value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="مثال: رز مصري" className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-gold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold">الكمية</label>
                    <input type="number" min={1} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="text-xs font-bold">رقم وحدة القياس (Unit ID)</label>
                    <input value={unitId} onChange={(e) => setUnitId(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-gold" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold">ملاحظات عامة</label>
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أي ملاحظات..." className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-gold" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2 text-xs font-bold">إلغاء</button>
                <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground dark:bg-gold dark:text-gold-foreground">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  إرسال التبرع
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}