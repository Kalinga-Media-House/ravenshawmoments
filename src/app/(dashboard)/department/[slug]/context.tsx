"use client";

import { createContext, useContext, type ReactNode } from "react";

interface DepartmentAdminContextValue {
  departmentId: string;
  slug: string;
  name: string;
  permissions: string[];
}

const DepartmentAdminContext = createContext<DepartmentAdminContextValue | null>(null);

export function DepartmentAdminProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: DepartmentAdminContextValue;
}) {
  return (
    <DepartmentAdminContext.Provider value={value}>
      {children}
    </DepartmentAdminContext.Provider>
  );
}

export function useDepartmentAdmin() {
  const ctx = useContext(DepartmentAdminContext);
  if (!ctx) throw new Error("useDepartmentAdmin must be used within DepartmentAdminProvider");
  return ctx;
}
