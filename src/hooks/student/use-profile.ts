"use client";

import { useState, useEffect, useCallback } from "react";
import { getMyProfile } from "@/actions/student/profile.actions";

export function useProfile() {
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMyProfile();
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error || "Failed to fetch profile");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}
