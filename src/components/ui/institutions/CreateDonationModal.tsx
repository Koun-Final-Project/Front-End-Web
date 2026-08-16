// // import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { X, Package, Loader2, HeartHandshake, AlertCircle } from "lucide-react";
// // import { useCreateDonation } from "@/hooks/useDonationsApi";
// // import { useQuery } from "@tanstack/react-query";
// // import { lookupService } from "@/lib/api/lookupService";

// // interface CreateDonationModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   branchId: number | string;
// // }

// // export function CreateDonationModal({ isOpen, onClose, branchId }: CreateDonationModalProps) {
// //   const { mutate: createDonation, isPending } = useCreateDonation();

// //   // جلب وحدات القياس وأنواع التبرعات ديناميكياً من الباك إند
// //   const { data: unitsData } = useQuery({ queryKey: ['units'], queryFn: lookupService.getUnits });
// //   const { data: typesData } = useQuery({ queryKey: ['donation-types'], queryFn: lookupService.getDonationTypes });

// //   let units: any[] = Array.isArray(unitsData?.data?.items) ? unitsData.data.items : Array.isArray(unitsData?.data) ? unitsData.data : unitsData || [];
// //   let donationTypes: any[] = Array.isArray(typesData?.data?.items) ? typesData.data.items : Array.isArray(typesData?.data) ? typesData.data : typesData || [];

// //   const [title, setTitle] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
  
// //   // تفاصيل عنصر التبرع (Items[0])
// //   const [itemName, setItemName] = useState("");
// //   const [quantity, setQuantity] = useState(1);
// //   const [unitId, setUnitId] = useState("");
// //   const [donationTypeId, setDonationTypeId] = useState("");
// //   const [itemNotes, setItemNotes] = useState("");
// //   const [errorMsg, setErrorMsg] = useState<string | null>(null);

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setErrorMsg(null);

// //     // استخراج الـ user_id الحالي من الـ localStorage بأمان
// //     let userId = "1";
// //     const userStr = localStorage.getItem('user');
// //     if (userStr) {
// //       try {
// //         const parsed = JSON.parse(userStr);
// //         userId = String(parsed.id || parsed.profile?.id || parsed.user?.id || "1");
// //       } catch (e) {
// //         console.error(e);
// //       }
// //     }

// //     createDonation(
// //       {
// //         sender_branch_id: branchId,
// //         sender_user_id: userId,
// //         title,
// //         description,
// //         status: 0, // 0 => Pending (قيد الانتظار)
// //         notes,
// //         items: [
// //           {
// //             unit_id: unitId || (units[0]?.id ?? 1),
// //             donation_type_id: donationTypeId || (donationTypes[0]?.id ?? 1),
// //             name: itemName,
// //             quantity: quantity,
// //             notes: itemNotes,
// //           }
// //         ]
// //       },
// //       {
// //         onSuccess: () => {
// //           onClose();
// //           setTitle("");
// //           setDescription("");
// //           setItemName("");
// //           setQuantity(1);
// //           setNotes("");
// //           setItemNotes("");
// //         },
// //         onError: (err: any) => {
// //           setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء تقديم التبرع");
// //         }
// //       }
// //     );
// //   };

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
// //           <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            
// //             <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
// //               <div className="flex items-center gap-3">
// //                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
// //                   <HeartHandshake className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <h2 className="text-lg font-extrabold">تقديم تبرع جديد</h2>
// //                   <p className="text-xs text-muted-foreground">عرض مواد وكميات للتبرع من الفرع رقم {branchId}</p>
// //                 </div>
// //               </div>
// //               <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted">
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
// //               {errorMsg && (
// //                 <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-600 dark:text-red-400">
// //                   <AlertCircle className="h-4 w-4 shrink-0" />
// //                   <span>{errorMsg}</span>
// //                 </div>
// //               )}

// //               <form id="donation-form" onSubmit={handleSubmit} className="space-y-4">
// //                 <div>
// //                   <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">عنوان التبرع (Title)</label>
// //                   <input
// //                     required
// //                     value={title}
// //                     onChange={(e) => setTitle(e.target.value)}
// //                     placeholder="مثال: حملة مواد غذائية عاجلة"
// //                     className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">وصف التبرع (Description)</label>
// //                   <textarea
// //                     rows={2}
// //                     value={description}
// //                     onChange={(e) => setDescription(e.target.value)}
// //                     placeholder="تفاصيل إضافية عن حالة المواد..."
// //                     className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm font-semibold outline-none focus:border-gold"
// //                   />
// //                 </div>

// //                 {/* صندوق بيانات العنصر الأول Items[0] */}
// //                 <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
// //                   <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
// //                     <Package className="h-4 w-4 text-gold" />
// //                     <span>محتوى المادة المتبرع بها (Item)</span>
// //                   </div>

// //                   <div>
// //                     <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">اسم المادة</label>
// //                     <input
// //                       required
// //                       value={itemName}
// //                       onChange={(e) => setItemName(e.target.value)}
// //                       placeholder="مثال: أرز ممتاز"
// //                       className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
// //                     />
// //                   </div>

// //                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
// //                     <div>
// //                       <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">الكمية</label>
// //                       <input
// //                         type="number"
// //                         min={1}
// //                         required
// //                         value={quantity}
// //                         onChange={(e) => setQuantity(Number(e.target.value))}
// //                         className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
// //                       />
// //                     </div>

// //                     <div>
// //                       <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">نوع التبرع</label>
// //                       <select
// //                         value={donationTypeId}
// //                         onChange={(e) => setDonationTypeId(e.target.value)}
// //                         className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
// //                       >
// //                         <option value="">-- اختر النوع --</option>
// //                         {donationTypes.map((t) => (
// //                           <option key={t.id} value={t.id}>{t.name}</option>
// //                         ))}
// //                       </select>
// //                     </div>

// //                     <div>
// //                       <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">وحدة القياس</label>
// //                       <select
// //                         value={unitId}
// //                         onChange={(e) => setUnitId(e.target.value)}
// //                         className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
// //                       >
// //                         <option value="">-- اختر الوحدة --</option>
// //                         {units.map((u) => (
// //                           <option key={u.id} value={u.id}>{u.name}</option>
// //                         ))}
// //                       </select>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">ملاحظات عامة (Notes)</label>
// //                   <input
// //                     value={notes}
// //                     onChange={(e) => setNotes(e.target.value)}
// //                     placeholder="ملاحظات إضافية..."
// //                     className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
// //                   />
// //                 </div>
// //               </form>
// //             </div>

// //             <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
// //               <button onClick={onClose} type="button" className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted">
// //                 إلغاء
// //               </button>
// //               <button
// //                 form="donation-form"
// //                 type="submit"
// //                 disabled={isPending}
// //                 className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary-medium disabled:opacity-70 dark:bg-gold dark:text-gold-foreground"
// //               >
// //                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <HeartHandshake className="h-4 w-4" />}
// //                 إرسال التبرع
// //               </button>
// //             </div>
// //           </motion.div>
// //         </div>
// //       )}
// //     </AnimatePresence>
// //   );
// // }


// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Package, Loader2, HeartHandshake, AlertCircle } from "lucide-react";
// import { useCreateDonation } from "@/hooks/useDonationsApi";
// import { useQuery } from "@tanstack/react-query";
// import { lookupService } from "@/lib/api/lookupService";

// interface CreateDonationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   branchId: number | string;
// }

// export function CreateDonationModal({ isOpen, onClose, branchId }: CreateDonationModalProps) {
//   const { mutate: createDonation, isPending } = useCreateDonation();

//   const { data: unitsData } = useQuery({ queryKey: ['units'], queryFn: lookupService.getUnits });
//   const { data: typesData } = useQuery({ queryKey: ['donation-types'], queryFn: lookupService.getDonationTypes });

//   let units: any[] = Array.isArray(unitsData?.data?.items) ? unitsData.data.items : Array.isArray(unitsData?.data) ? unitsData.data : unitsData || [];
//   let donationTypes: any[] = Array.isArray(typesData?.data?.items) ? typesData.data.items : Array.isArray(typesData?.data) ? typesData.data : typesData || [];

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
  
//   const [itemName, setItemName] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [unitId, setUnitId] = useState("");
//   const [donationTypeId, setDonationTypeId] = useState("");
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg(null);

//     let userId = "1";
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       try {
//         const parsed = JSON.parse(userStr);
//         userId = String(parsed.id || parsed.profile?.id || parsed.user?.id || "1");
//       } catch (e) {
//         console.error(e);
//       }
//     }

//     createDonation(
//       {
//         sender_branch_id: branchId,
//         sender_user_id: userId,
//         title,
//         description,
//         status: 0,
//         notes,
//         items: [
//           {
//             unit_id: unitId || (units[0]?.id ?? 1),
//             donation_type_id: donationTypeId || (donationTypes[0]?.id ?? 1),
//             name: itemName,
//             quantity: quantity,
//           }
//         ]
//       },
//       {
//         onSuccess: () => {
//           onClose();
//           setTitle("");
//           setDescription("");
//           setItemName("");
//           setQuantity(1);
//           setNotes("");
//         },
//         onError: (err: any) => {
//           setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء تقديم التبرع");
//         }
//       }
//     );
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
//           <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            
//             <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
//                   <HeartHandshake className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-extrabold">تقديم تبرع جديد</h2>
//                   <p className="text-xs text-muted-foreground">تقديم عرض تبرع من الفرع رقم {branchId}</p>
//                 </div>
//               </div>
//               <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
//               {errorMsg && (
//                 <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-600 dark:text-red-400">
//                   <AlertCircle className="h-4 w-4 shrink-0" />
//                   <span>{errorMsg}</span>
//                 </div>
//               )}

//               <form id="donation-form" onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">عنوان التبرع (Title)</label>
//                   <input
//                     required
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="مثال: حملة مواد غذائية"
//                     className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">وصف التبرع (Description)</label>
//                   <textarea
//                     rows={2}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="وصف تفصيلي..."
//                     className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm font-semibold outline-none focus:border-gold"
//                   />
//                 </div>

//                 <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
//                   <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
//                     <Package className="h-4 w-4 text-gold" />
//                     <span>تفاصيل المادة المتبرع بها (Item)</span>
//                   </div>

//                   <div>
//                     <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">اسم المادة (Name)</label>
//                     <input
//                       required
//                       value={itemName}
//                       onChange={(e) => setItemName(e.target.value)}
//                       placeholder="مثال: أرز مصري"
//                       className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                     <div>
//                       <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">الكمية (Quantity)</label>
//                       <input
//                         type="number"
//                         min={1}
//                         required
//                         value={quantity}
//                         onChange={(e) => setQuantity(Number(e.target.value))}
//                         className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">نوع التبرع</label>
//                       <select
//                         value={donationTypeId}
//                         onChange={(e) => setDonationTypeId(e.target.value)}
//                         className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                       >
//                         <option value="">-- اختر النوع --</option>
//                         {donationTypes.map((t: any) => (
//                           <option key={t.id} value={t.id}>{t.name}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">وحدة القياس</label>
//                       <select
//                         value={unitId}
//                         onChange={(e) => setUnitId(e.target.value)}
//                         className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                       >
//                         <option value="">-- اختر الوحدة --</option>
//                         {units.map((u: any) => (
//                           <option key={u.id} value={u.id}>{u.name}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">ملاحظات عامة (Notes)</label>
//                   <input
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     placeholder="ملاحظات..."
//                     className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                   />
//                 </div>
//               </form>
//             </div>

//             <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
//               <button onClick={onClose} type="button" className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted">
//                 إلغاء
//               </button>
//               <button
//                 form="donation-form"
//                 type="submit"
//                 disabled={isPending}
//                 className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary-medium disabled:opacity-70 dark:bg-gold dark:text-gold-foreground"
//               >
//                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <HeartHandshake className="h-4 w-4" />}
//                 إرسال التبرع
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Loader2, HeartHandshake, AlertCircle } from "lucide-react";
import { useCreateDonation } from "@/hooks/useDonationsApi";
import { useQuery } from "@tanstack/react-query";
import { lookupService } from "@/lib/api/lookupService";

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number | string;
}

export function CreateDonationModal({ isOpen, onClose, branchId }: CreateDonationModalProps) {
  const { mutate: createDonation, isPending } = useCreateDonation();

  // جلب وحدات القياس وأنواع التبرعات ديناميكياً من الباك إند
  const { data: unitsData } = useQuery({ queryKey: ['units'], queryFn: lookupService.getUnits });
  const { data: typesData } = useQuery({ queryKey: ['donation-types'], queryFn: lookupService.getDonationTypes });

  // معالجة آمنة وشاملة لاستخراج المصفوفات بأي شكل يرجعه الباك إند
  const extractArray = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.items)) return res.data.items;
    if (Array.isArray(res.items)) return res.items;
    return [];
  };

  const units = extractArray(unitsData);
  const donationTypes = extractArray(typesData);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  
  // تفاصيل عنصر التبرع (Items[0])
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitId, setUnitId] = useState("");
  const [donationTypeId, setDonationTypeId] = useState("");
  const [itemNotes, setItemNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // استخراج الـ user_id الحالي من الـ localStorage بأمان
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
        status: 0, // 0 => Pending (قيد الانتظار)
        notes,
        items: [
          {
            unit_id: unitId || (units[0]?.id ?? 1),
            donation_type_id: donationTypeId || (donationTypes[0]?.id ?? 1),
            name: itemName,
            quantity: quantity,
            notes: itemNotes,
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
          setItemNotes("");
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء تقديم التبرع");
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">تقديم تبرع جديد</h2>
                  <p className="text-xs text-muted-foreground">عرض مواد وكميات للتبرع من الفرع رقم {branchId}</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
              {errorMsg && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form id="donation-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">عنوان التبرع (Title)</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: حملة مواد غذائية عاجلة"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">وصف التبرع (Description)</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="تفاصيل إضافية عن حالة المواد..."
                    className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm font-semibold outline-none focus:border-gold"
                  />
                </div>

                {/* صندوق بيانات العنصر الأول Items[0] */}
                <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Package className="h-4 w-4 text-gold" />
                    <span>محتوى المادة المتبرع بها (Item)</span>
                  </div>

                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">اسم المادة</label>
                    <input
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="مثال: أرز ممتاز"
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">الكمية</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">نوع التبرع</label>
                      <select
                        value={donationTypeId}
                        onChange={(e) => setDonationTypeId(e.target.value)}
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                      >
                        <option value="">-- اختر النوع --</option>
                        {donationTypes.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">وحدة القياس</label>
                      <select
                        value={unitId}
                        onChange={(e) => setUnitId(e.target.value)}
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                      >
                        <option value="">-- اختر الوحدة --</option>
                        {units.map((u: any) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">ملاحظات عامة (Notes)</label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ملاحظات إضافية..."
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
              <button onClick={onClose} type="button" className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted">
                إلغاء
              </button>
              <button
                form="donation-form"
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary-medium disabled:opacity-70 dark:bg-gold dark:text-gold-foreground"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <HeartHandshake className="h-4 w-4" />}
                إرسال التبرع
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}