'use client';

import { useDepartmentContext } from './use-department-context';

export function usePermission(permission: string) {
  const { permissions } = useDepartmentContext();
  const hasPermission = permissions.includes(permission);
  
  return { hasPermission };
}
