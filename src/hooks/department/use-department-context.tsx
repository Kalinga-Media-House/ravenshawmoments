'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface DepartmentContextValue {
  departmentId: string;
  slug: string;
  name: string;
  permissions: string[];
}

const DepartmentContext = createContext<DepartmentContextValue | undefined>(undefined);

export interface DepartmentProviderProps {
  children: ReactNode;
  value: DepartmentContextValue;
}

export function DepartmentProvider({ children, value }: DepartmentProviderProps) {
  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartmentContext() {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartmentContext must be used within a DepartmentProvider');
  }
  return context;
}
