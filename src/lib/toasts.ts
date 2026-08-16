
import { toast } from "sonner";

// --- 1. رسائل التبرعات (Donations) ---
export const donationToast = {
  createSuccess: () => toast.success("تم تقديم التبرع بنجاح! بانتظار مراجعة الإدارة.", {
    description: "تمت إضافة المواد إلى قائمة التبرعات المتاحة.",
  }),
  createError: (msg?: string) => toast.error("تعذر تقديم التبرع", {
    description: msg || "يرجى التحقق من المدخلات والمحاولة مجدداً.",
  }),
  deleteSuccess: () => toast.success("تم حذف التبرع بنجاح."),
  deleteError: () => toast.error("فشل حذف التبرع، يرجى المحاولة لاحقاً."),
};

// --- 2. رسائل طلبات التبرع (Donation Requests) ---
export const requestToast = {
  createSuccess: () => toast.success("تم إرسال طلب التبرع بنجاح!", {
    description: "تم إشعار الجهة المتبرعة بالطلب.",
  }),
  createError: (msg?: string) => toast.error("تعذر إرسال الطلب", {
    description: msg || "تأكد من أن الفرع يتبع لجمعية خيرية أو كلاهما.",
  }),
  approveSuccess: () => toast.success("تمت الموافقة على الطلب بنجاح."),
  rejectSuccess: () => toast.success("تم رفض الطلب."),
};

// --- 3. رسائل المؤسسات والفروع (Institutions & Branches) ---
export const institutionToast = {
  createSuccess: () => toast.success("تم إرسال طلب تسجيل المؤسسة بنجاح!", {
    description: "بانتظار موافقة الإدارة لتفعيل المؤسسة.",
  }),
  branchSuccess: () => toast.success("تم حفظ بيانات الفرع بنجاح."),
  error: (msg?: string) => toast.error("حدث خطأ ما", {
    description: msg || "يرجى التحقق من اتصال الإنترنت أو صحة البيانات.",
  }),
};