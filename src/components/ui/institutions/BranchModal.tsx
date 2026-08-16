// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Building2, X, Loader2, AlertCircle } from "lucide-react";
// import { useCreateBranch, useUpdateBranch } from "@/hooks/useBranch";

// interface BranchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   institutionId: number;
//   branchToEdit?: any | null;
// }

// export function BranchModal({ isOpen, onClose, institutionId, branchToEdit }: BranchModalProps) {
//   const isEditing = !!branchToEdit;
//   const { mutate: createBranch, isPending: isCreating } = useCreateBranch();
//   const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch();

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     phone: "",
//     email: "",
//     is_main_branch: false,
//     city: "دمشق",
//     street: "",
//     details: "",
//     latitude: "33.5138",
//     longitude: "36.2765",
//   });

//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   useEffect(() => {
//     if (branchToEdit) {
//       setFormData({
//         name: branchToEdit.name || "",
//         description: branchToEdit.description || "",
//         phone: branchToEdit.phone || "",
//         email: branchToEdit.email || "",
//         is_main_branch: branchToEdit.is_main_branch === true || branchToEdit.is_main_branch === 1,
//         city: branchToEdit.address?.city || "دمشق",
//         street: branchToEdit.address?.street || "",
//         details: branchToEdit.address?.details || "",
//         latitude: String(branchToEdit.address?.latitude || "33.5138"),
//         longitude: String(branchToEdit.address?.longitude || "36.2765"),
//       });
//     } else {
//       setFormData({
//         name: "",
//         description: "",
//         phone: "",
//         email: "",
//         is_main_branch: false,
//         city: "دمشق",
//         street: "",
//         details: "",
//         latitude: "33.5138",
//         longitude: "36.2765",
//       });
//     }
//     setErrorMsg(null);
//   }, [branchToEdit, isOpen]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg(null);

//     const payload = {
//       institution_id: institutionId,
//       name: formData.name,
//       description: formData.description,
//       phone: formData.phone,
//       email: formData.email,
//       is_main_branch: formData.is_main_branch,
//       address: {
//         id: branchToEdit?.address?.id,
//         state_id: 1, // استخدام id=1 كافتراضي للمحافظة
//         city: formData.city,
//         street: formData.street,
//         details: formData.details,
//         latitude: formData.latitude,
//         longitude: formData.longitude,
//       }
//     };

//     if (isEditing) {
//       updateBranch(
//         { id: branchToEdit.id, data: payload },
//         {
//           onSuccess: () => onClose(),
//           onError: (err: any) => {
//             const val = err.response?.data?.errors;
//             if (val) setErrorMsg(val[Object.keys(val)[0]][0]);
//             else setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء التعديل");
//           }
//         }
//       );
//     } else {
//       createBranch(payload, {
//         onSuccess: () => onClose(),
//         onError: (err: any) => {
//           const val = err.response?.data?.errors;
//           if (val) setErrorMsg(val[Object.keys(val)[0]][0]);
//           else setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء الإضافة");
//         }
//       });
//     }
//   };

//   const isPending = isCreating || isUpdating;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="absolute inset-0 bg-background/80 backdrop-blur-sm"
//           />

//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
//           >
//             <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
//                   <Building2 className="h-5 w-5" />
//                 </div>
//                 <h2 className="text-lg font-extrabold">{isEditing ? "تعديل بيانات الفرع" : "إضافة فرع جديد للمؤسسة"}</h2>
//               </div>
//               <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
//               {errorMsg && (
//                 <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-600 dark:text-red-400">
//                   <AlertCircle className="h-4 w-4 shrink-0" />
//                   <span>{errorMsg}</span>
//                 </div>
//               )}

//               <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1 block text-xs font-bold text-muted-foreground text-start">اسم الفرع</label>
//                     <input
//                       required
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       placeholder="مثال: الفرع الرئيسي - المزة"
//                       className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-bold text-muted-foreground text-start">المدينة / المنطقة</label>
//                     <input
//                       required
//                       value={formData.city}
//                       onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                       placeholder="دمشق"
//                       className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1 block text-xs font-bold text-muted-foreground text-start">البريد الإلكتروني للفرع</label>
//                     <input
//                       required
//                       type="email"
//                       dir="ltr"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-bold text-muted-foreground text-start">رقم هاتف الفرع</label>
//                     <input
//                       required
//                       type="tel"
//                       dir="ltr"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                       placeholder="+963909090909"
//                       className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-xs font-bold text-muted-foreground text-start">الشارع / العنوان</label>
//                   <input
//                     required
//                     value={formData.street}
//                     onChange={(e) => setFormData({ ...formData, street: e.target.value })}
//                     placeholder="مثال: أوتوستراد المزة"
//                     className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-xs font-bold text-muted-foreground text-start">تفاصيل إضافية للعنوان (اختياري)</label>
//                   <input
//                     value={formData.details}
//                     onChange={(e) => setFormData({ ...formData, details: e.target.value })}
//                     placeholder="بجانب برج الفردوس..."
//                     className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-xs font-bold text-muted-foreground text-start">وصف الفرع</label>
//                   <textarea
//                     rows={2}
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     placeholder="وصف مختصر عن خدمات الفرع..."
//                     className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm font-semibold outline-none focus:border-gold"
//                   />
//                 </div>

//                 <div className="flex items-center gap-2 pt-1">
//                   <input
//                     type="checkbox"
//                     id="is_main_branch"
//                     checked={formData.is_main_branch}
//                     onChange={(e) => setFormData({ ...formData, is_main_branch: e.target.checked })}
//                     className="h-4 w-4 rounded border-border text-primary focus:ring-gold"
//                   />
//                   <label htmlFor="is_main_branch" className="text-xs font-bold select-none cursor-pointer">
//                     تعيين كفرع رئيسي للمؤسسة
//                   </label>
//                 </div>
//               </form>
//             </div>

//             <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
//               <button onClick={onClose} type="button" className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted">
//                 إلغاء
//               </button>
//               <button form="branch-form" type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary-medium disabled:opacity-70 dark:bg-gold dark:text-gold-foreground">
//                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
//                 {isEditing ? "حفظ التعديلات" : "إضافة الفرع"}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }


import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, Loader2, AlertCircle, MapPin, Check } from "lucide-react";
import { useCreateBranch, useUpdateBranch } from "@/hooks/useBranch";
import { useStates } from "@/hooks/useStates";
import { useAddresses } from "@/hooks/useAddress";

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionId: number;
  branchToEdit?: any | null;
}

export function BranchModal({ isOpen, onClose, institutionId, branchToEdit }: BranchModalProps) {
  const isEditing = !!branchToEdit;
  const { mutate: createBranch, isPending: isCreating } = useCreateBranch();
  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch();

  // 1. جلب المحافظات والعناوين من الـ APIs
  const { data: statesData, isLoading: isLoadingStates } = useStates();
  const { data: addressesData, isLoading: isLoadingAddresses } = useAddresses();

  // استخراج مصفوفة المحافظات
  const states: { id: number; name: string }[] = useMemo(() => {
    if (Array.isArray(statesData?.data?.items)) return statesData.data.items;
    if (Array.isArray(statesData?.data)) return statesData.data;
    if (Array.isArray(statesData)) return statesData;
    return [];
  }, [statesData]);

  // استخراج مصفوفة العناوين
  const allAddresses: any[] = useMemo(() => {
    if (Array.isArray(addressesData?.data?.items)) return addressesData.data.items;
    if (Array.isArray(addressesData?.data)) return addressesData.data;
    if (Array.isArray(addressesData)) return addressesData;
    return [];
  }, [addressesData]);

  // وضع اختيار العنوان: "existing" (عنوان مسجل مسبقاً) أو "custom" (إدخال يدوي جديد)
  const [addressMode, setAddressMode] = useState<"existing" | "custom">("existing");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    is_main_branch: false,
    state_id: "1",
    city: "",
    street: "",
    details: "",
    latitude: "33.5138",
    longitude: "36.2765",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // تصفية العناوين التابعة للمحافظة المختارة حالياً فقط
  const availableAddressesInState = useMemo(() => {
    return allAddresses.filter(
      (addr) => String(addr.state_id || addr.state?.id) === String(formData.state_id)
    );
  }, [allAddresses, formData.state_id]);

  // تهيئة البيانات عند فتح المودال أو التعديل
  useEffect(() => {
    if (branchToEdit) {
      const stateId = String(branchToEdit.address?.state_id || branchToEdit.address?.state?.id || "1");
      setFormData({
        name: branchToEdit.name || "",
        description: branchToEdit.description || "",
        phone: branchToEdit.phone || "",
        email: branchToEdit.email || "",
        is_main_branch: branchToEdit.is_main_branch === true || branchToEdit.is_main_branch === 1,
        state_id: stateId,
        city: branchToEdit.address?.city || "",
        street: branchToEdit.address?.street || "",
        details: branchToEdit.address?.details || "",
        latitude: String(branchToEdit.address?.latitude || "33.5138"),
        longitude: String(branchToEdit.address?.longitude || "36.2765"),
      });
      setAddressMode("custom"); // في وضع التعديل نتيح التعديل المباشر
    } else {
      const defaultStateId = states[0]?.id ? String(states[0].id) : "1";
      setFormData({
        name: "",
        description: "",
        phone: "",
        email: "",
        is_main_branch: false,
        state_id: defaultStateId,
        city: "",
        street: "",
        details: "",
        latitude: "33.5138",
        longitude: "36.2765",
      });
      setAddressMode("existing");
      setSelectedAddressId("");
    }
    setErrorMsg(null);
  }, [branchToEdit, isOpen, states]);

  // عند اختيار عنوان مسجل من القائمة المنسدلة -> يتم تعبئة الحقول فوراً
  const handleSelectExistingAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (!addrId) return;

    const chosen = availableAddressesInState.find((a) => String(a.id) === addrId);
    if (chosen) {
      setFormData((prev) => ({
        ...prev,
        city: chosen.city || "",
        street: chosen.street || "",
        details: chosen.details || "",
        latitude: String(chosen.latitude || "33.5138"),
        longitude: String(chosen.longitude || "36.2765"),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // التحقق من إدخال العنوان في حال عدم اختيار عنوان جاهز
    if (!formData.city || !formData.street) {
      setErrorMsg("يرجى اختيار عنوان مسجل أو تعبئة بيانات المدينة والشارع");
      return;
    }

    const addressId = isEditing
      ? (branchToEdit?.address?.id || branchToEdit?.address_id)
      : (addressMode === "existing" && selectedAddressId ? Number(selectedAddressId) : undefined);

    const payload = {
      institution_id: institutionId,
      name: formData.name,
      description: formData.description,
      phone: formData.phone,
      email: formData.email,
      is_main_branch: formData.is_main_branch,
      address: {
        id: addressId,
        state_id: Number(formData.state_id),
        city: formData.city,
        street: formData.street,
        details: formData.details,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
    };

    if (isEditing) {
      updateBranch(
        { id: branchToEdit.id, data: payload },
        {
          onSuccess: () => onClose(),
          onError: (err: any) => {
            const val = err.response?.data?.errors;
            if (val) setErrorMsg(val[Object.keys(val)[0]][0]);
            else setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء التعديل");
          },
        }
      );
    } else {
      createBranch(payload, {
        onSuccess: () => onClose(),
        onError: (err: any) => {
          const val = err.response?.data?.errors;
          if (val) setErrorMsg(val[Object.keys(val)[0]][0]);
          else setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء إضافة الفرع");
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

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
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            {/* الهيدر */}
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">{isEditing ? "تعديل بيانات الفرع" : "إضافة فرع جديد للمؤسسة"}</h2>
                  <p className="text-xs text-muted-foreground">اختر المحافظة والعنوان المرتبط بها بدقة</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
              {errorMsg && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
                {/* 1. اسم الفرع */}
                <div>
                  <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">اسم الفرع</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: الفرع الرئيسي - المزة"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                  />
                </div>

                {/* 2. الاتصال */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">البريد الإلكتروني للفرع</label>
                    <input
                      required
                      type="email"
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">رقم هاتف الفرع</label>
                    <input
                      required
                      type="tel"
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+963909090909"
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* 3. صندوق تحديد الموقع الجغرافي الذكي */}
                <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span>تحديد العنوان والموقع</span>
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setAddressMode("existing")}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            addressMode === "existing" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                          }`}
                        >
                          عناوين مسجلة
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddressMode("custom");
                            setSelectedAddressId("");
                          }}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            addressMode === "custom" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                          }`}
                        >
                          إدخال مخصص
                        </button>
                      </div>
                    )}
                  </div>

                  {/* اختيار المحافظة */}
                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">المحافظة</label>
                    <select
                      required
                      value={formData.state_id}
                      onChange={(e) => {
                        setFormData({ ...formData, state_id: e.target.value });
                        setSelectedAddressId(""); // تصفير العنوان عند تغيير المحافظة
                      }}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                      disabled={isLoadingStates}
                    >
                      {isLoadingStates ? (
                        <option value="">جاري تحميل المحافظات...</option>
                      ) : (
                        states.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* في حال اختيار وضع العناوين المسجلة مسبقاً */}
                  {addressMode === "existing" && !isEditing && (
                    <div>
                      <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">
                        العنوان المسجل بالمحافظة
                      </label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleSelectExistingAddress(e.target.value)}
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold"
                        disabled={isLoadingAddresses}
                      >
                        <option value="">-- اختر عنواناً مسجلاً من القائمة --</option>
                        {availableAddressesInState.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.city} - {addr.street} {addr.details ? `(${addr.details})` : ""}
                          </option>
                        ))}
                      </select>
                      {availableAddressesInState.length === 0 && !isLoadingAddresses && (
                        <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                          لا توجد عناوين مسجلة مسبقاً في هذه المحافظة. اختر "إدخال مخصص" لكتابة العنوان.
                        </p>
                      )}
                    </div>
                  )}

                  {/* حقول تفاصيل العنوان */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">المدينة / المنطقة</label>
                      <input
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="مثال: المزة"
                        disabled={addressMode === "existing" && !!selectedAddressId}
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold disabled:opacity-75 disabled:bg-muted/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">الشارع</label>
                      <input
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="أوتوستراد المزة"
                        disabled={addressMode === "existing" && !!selectedAddressId}
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold disabled:opacity-75 disabled:bg-muted/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">تفاصيل إضافية للعنوان (اختياري)</label>
                    <input
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="بجانب برج الفردوس..."
                      disabled={addressMode === "existing" && !!selectedAddressId}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-gold disabled:opacity-75 disabled:bg-muted/40"
                    />
                  </div>
                </div>

                {/* 4. وصف الفرع */}
                <div>
                  <label className="mb-1 block text-start text-xs font-bold text-muted-foreground">وصف الفرع</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف مختصر عن خدمات الفرع..."
                    className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm font-semibold outline-none focus:border-gold"
                  />
                </div>

                {/* 5. تعيين رئيسي */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_main_branch"
                    checked={formData.is_main_branch}
                    onChange={(e) => setFormData({ ...formData, is_main_branch: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-gold"
                  />
                  <label htmlFor="is_main_branch" className="cursor-pointer select-none text-xs font-bold">
                    تعيين كفرع رئيسي للمؤسسة
                  </label>
                </div>
              </form>
            </div>

            {/* الفوتر */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
              <button onClick={onClose} type="button" className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted">
                إلغاء
              </button>
              <button
                form="branch-form"
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary-medium disabled:opacity-70 dark:bg-gold dark:text-gold-foreground"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {isEditing ? "حفظ التعديلات" : "إضافة الفرع"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}