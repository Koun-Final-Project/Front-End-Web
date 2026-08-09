import type { ReactNode } from "react";
import { useRole, type InstitutionType } from "@/hooks/use-role";

interface RoleGateProps {
  /** Roles allowed to see the children. */
  allow: InstitutionType[];
  children: ReactNode;
  fallback?: ReactNode;
}

/** Conditionally render UI based on the current institution role. */
export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role } = useRole();
  if (!allow.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
