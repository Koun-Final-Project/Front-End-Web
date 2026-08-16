// import { motion } from "framer-motion";
// import { Building2, MapPin, Phone, Mail, Map as MapIcon, Star, Edit, Trash2 } from "lucide-react";
// import { useDeleteBranch } from "@/hooks/useBranch";

// interface BranchCardProps {
//   branch: any;
//   index: number;
//   onEdit: (branch: any) => void;
// }

// export function BranchCard({ branch, index, onEdit }: BranchCardProps) {
//   const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch();

//   const handleDelete = () => {
//     if (window.confirm(`هل أنت متأكد من حذف فرع "${branch.name}"؟`)) {
//       deleteBranch(branch.id);
//     }
//   };

//   const isMain = branch.is_main_branch === true || branch.is_main_branch === 1;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.05 }}
//       className="group relative overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md"
//     >
//       <div className="flex items-start justify-between gap-2">
//         <div className="flex items-center gap-2.5">
//           <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
//             <Building2 className="h-4 w-4" />
//           </span>
//           <div>
//             <h5 className="flex items-center gap-1.5 text-sm font-bold leading-tight">
//               {branch.name}
//               {isMain && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold text-[#8a6a10] dark:text-gold">
//                   <Star className="h-2.5 w-2.5 fill-current" />
//                   الفرع الرئيسي
//                 </span>
//               )}
//             </h5>
//             <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
//               {branch.address?.city || "دمشق"} {branch.address?.street ? `· ${branch.address.street}` : ''}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-1">
//           <button
//             onClick={() => onEdit(branch)}
//             className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
//             title="تعديل الفرع"
//           >
//             <Edit className="h-3.5 w-3.5" />
//           </button>
//           <button
//             onClick={handleDelete}
//             disabled={isDeleting}
//             className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
//             title="حذف الفرع"
//           >
//             <Trash2 className="h-3.5 w-3.5" />
//           </button>
//         </div>
//       </div>

//       {branch.description && (
//         <p className="mt-2.5 line-clamp-2 text-xs text-muted-foreground">{branch.description}</p>
//       )}

//       <div className="mt-3 space-y-1.5 border-t border-border/50 pt-2.5 text-xs">
//         {branch.address?.details && (
//           <p className="flex items-start gap-1.5 text-muted-foreground">
//             <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
//             <span>{branch.address.details}</span>
//           </p>
//         )}
//         <p className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
//           <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
//           <span className="font-semibold">{branch.phone}</span>
//         </p>
//         <p className="flex items-center gap-1.5 text-muted-foreground">
//           <Mail className="h-3.5 w-3.5 shrink-0 text-gold" />
//           <span>{branch.email}</span>
//         </p>
//         {branch.address?.latitude && (
//           <p className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
//             <MapIcon className="h-3.5 w-3.5 shrink-0 text-gold" />
//             <span className="font-mono text-[10px]">
//               {Number(branch.address.latitude).toFixed(4)}, {Number(branch.address.longitude).toFixed(4)}
//             </span>
//           </p>
//         )}
//       </div>
//     </motion.div>
//   );
// }


import { motion } from "framer-motion";
import { Building2, MapPin, Phone, Mail, Map as MapIcon, Star, Edit, Trash2, HeartHandshake, HandPlatter } from "lucide-react";
import { useDeleteBranch } from "@/hooks/useBranch";

interface BranchCardProps {
  branch: any;
  index: number;
  institutionType: number; // 1 = متبرع، 2 = جمعية، 3 = كلاهما
  onEdit: (branch: any) => void;
  onOfferDonation?: (branchId: number) => void; // دالة لفتح نافذة تقديم تبرع
  onRequestDonation?: (branchId: number) => void; // دالة لفتح نافذة طلب تبرع
}

export function BranchCard({ branch, index, institutionType, onEdit, onOfferDonation, onRequestDonation }: BranchCardProps) {
  const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch();

  const handleDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف فرع "${branch.name}"؟`)) {
      deleteBranch(branch.id);
    }
  };

  const isMain = branch.is_main_branch === true || branch.is_main_branch === 1;
  const typeNum = Number(institutionType);
  const canOffer = typeNum === 1 || typeNum === 3;
  const canRequest = typeNum === 2 || typeNum === 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <h5 className="flex items-center gap-1.5 text-sm font-bold leading-tight">
                {branch.name}
                {isMain && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold text-[#8a6a10] dark:text-gold">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    الفرع الرئيسي
                  </span>
                )}
              </h5>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {branch.address?.state?.name ? `${branch.address.state.name} · ` : ""}
                {branch.address?.city || ""} 
                {branch.address?.street ? ` · ${branch.address.street}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(branch)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary" title="تعديل الفرع">
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button onClick={handleDelete} disabled={isDeleting} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500" title="حذف الفرع">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {branch.description && (
          <p className="mt-2.5 line-clamp-2 text-xs text-muted-foreground">{branch.description}</p>
        )}

        <div className="mt-3 space-y-1.5 border-t border-border/50 pt-2.5 text-xs">
          {branch.address?.details && (
            <p className="flex items-start gap-1.5 text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>{branch.address.details}</span>
            </p>
          )}
          <p className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
            <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span className="font-semibold">{branch.phone}</span>
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span>{branch.email}</span>
          </p>
        </div>
      </div>

      {/* أزرار الإجراءات الخاصة بالتبرعات */}
    {/* أزرار الإجراءات الخاصة بالتبرعات - إظهار إجباري للاختبار */}
    <div className="mt-4 flex w-full flex-wrap items-center gap-2 border-t border-border/50 pt-3">
        <button 
          onClick={() => onOfferDonation && onOfferDonation(branch.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300"
        >
          <HeartHandshake className="h-4 w-4" />
          تقديم تبرع
        </button>

        <button 
          onClick={() => onRequestDonation && onRequestDonation(branch.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300"
        >
          <HandPlatter className="h-4 w-4" />
          طلب تبرع
        </button>
      </div>
    </motion.div>
  );
}