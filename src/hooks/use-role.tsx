import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type InstitutionType = 1 | 2 | 3; // 1=Donor, 2=Charity, 3=Both

interface RoleCapabilities {
  canPostDonation: boolean;
  canMakeRequest: boolean;
  canViewMyDonations: boolean;
  canViewReceivedRequests: boolean;
  canViewAvailableDonations: boolean;
  canViewMyRequests: boolean;
}

interface RoleContextValue {
  role: InstitutionType;
  setRole: (r: InstitutionType) => void;
  caps: RoleCapabilities;
}

const RoleContext = createContext<RoleContextValue | null>(null);
const STORAGE_KEY = "kawn.role";

function computeCaps(role: InstitutionType): RoleCapabilities {
  const isDonor = role === 1 || role === 3;
  const isCharity = role === 2 || role === 3;
  return {
    canPostDonation: isDonor,
    canMakeRequest: isCharity,
    canViewMyDonations: isDonor,
    canViewReceivedRequests: isDonor,
    canViewAvailableDonations: isCharity,
    canViewMyRequests: isCharity,
  };
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<InstitutionType>(3);

  // Hydrate from localStorage on client to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? Number(raw) : NaN;
      if (parsed === 1 || parsed === 2 || parsed === 3) setRoleState(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  const setRole = (r: InstitutionType) => {
    setRoleState(r);
    try {
      localStorage.setItem(STORAGE_KEY, String(r));
    } catch {
      /* ignore */
    }
  };

  const value = useMemo<RoleContextValue>(
    () => ({ role, setRole, caps: computeCaps(role) }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
