import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HandPlatter, X, Loader2, Package } from "lucide-react";
import { useDonationsList, useCreateDonationRequest } from "@/hooks/useDonationsApi";

interface DonationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
}

export function DonationRequestModal({ isOpen, onClose, branchId }: DonationRequestModalProps) {
  // 1. جلب التبرعات المتاحة من الـ API
  const { data: donationsData, isLoading: isLoadingDonations } = useDonationsList();
  const { mutate: createRequest, isPending: isSubmitting } = useCreateDonationRequest();

  const [selectedDonationId, setSelectedDonationId] = useState<string>("");
  const [requestedQty, setRequestedQty] = useState<number>(1);
  const [notes, setNotes] = useState("");

  // استخراج مصفوفة التبرعات بأمان
  let donations: any[] = [];
  if (Array.isArray(donationsData?.data?.items)) {
    donations = donationsData.data.items;
  } else if (Array.isArray(donationsData?.data)) {
    donations = donationsData.data;
  } else if (Array.isArray(donationsData)) {
    donations = donationsData;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationId) return;

    // استخراج الـ user_id الحالي من الـ localStorage
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

    const selectedDonation = donations.find((d) => String(d.id) === selectedDonationId);
    const donationItemId = selectedDonation?.items?.[0]?.id || selectedDonationId;

    createRequest(
      {
        receiver_branch_id: branchId,
        receiver_user_id: userId,
        status: 0, // Pending
        notes,
        items: [
          {
            donation_item_id: donationItemId,
            requested_quantity: requestedQty,
          }
        ]
      },
      {
        onSuccess: () => {
          onClose();
          setSelectedDonationId("");
          setRequestedQty(1);
          setNotes("");
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            {/* الهيدر */}
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <HandPlatter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">تقديم طلب تبرع</h2>
                  <p className="text-xs text-muted-foreground">اختر التبرع والكمية التي تحتاجها للفرع</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {isLoadingDonations ? (
                <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm font-bold text-muted-foreground">جاري جلب التبرعات المتاحة من السيرفر...</p>
                </div>
              ) : donations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                  لا توجد تبرعات متاحة حالياً للطلب.
                </div>
              ) : (
                <form id="donation-request-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">اختر التبرع المتاح</label>
                    <select
                      required
                      value={selectedDonationId}
                      onChange={(e) => setSelectedDonationId(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                    >
                      <option value="">-- اختر من قائمة التبرعات --</option>
                      {donations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title} {d.sender_branch ? `(${d.sender_branch?.name || d.sender_branch})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">الكمية المطلوبة</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={requestedQty}
                      onChange={(e) => setRequestedQty(Number(e.target.value))}
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">ملاحظات الطلب (اختياري)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أضف أي ملاحظات للجهة المتبرعة..."
                      className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm font-semibold outline-none focus:border-gold"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* الفوتر */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
              <button onClick={onClose} type="button" className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted">
                إلغاء
              </button>
              {donations.length > 0 && !isLoadingDonations && (
                <button
                  form="donation-request-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandPlatter className="h-4 w-4" />}
                  إرسال الطلب
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}