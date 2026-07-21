'use client';

import React from 'react';

export interface PermissionGateProps {
  permission?: string;
  hasPermission: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({
  hasPermission,
  fallback = null,
  children,
}: PermissionGateProps) {
  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
