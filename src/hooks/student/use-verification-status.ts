"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMyVerificationStatus,
  getVerificationHistory,
} from "@/actions/student/verification.actions";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export function useVerificationStatus() {
  const [status, setStatus] = useState<VerificationStatus>("unverified");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const statusResult = await getMyVerificationStatus();
      if (statusResult.success && statusResult.data) {
        // @ts-ignore
        const currentStatus = statusResult.data.status as VerificationStatus;
        setStatus(currentStatus || "unverified");
      }

      const historyResult = await getVerificationHistory();
      if (historyResult.success && historyResult.data) {
        setHistory(historyResult.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch verification status");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    history,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
