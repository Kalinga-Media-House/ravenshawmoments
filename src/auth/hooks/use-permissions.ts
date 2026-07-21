"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export function usePermissions(departmentId: string) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function checkPermissions() {
      // In a real client-side scenario, it's often better to fetch a pre-calculated 
      // permissions object from an API route rather than hammering RPCs individually 
      // from the browser, but for direct validation we can call the RPC here if needed.
      // E.g., const { data } = await supabase.rpc('get_my_permissions', { dept_id: departmentId });
      
      setIsLoading(false);
    }

    if (departmentId) {
      checkPermissions();
    } else {
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [departmentId, supabase]);

  return { permissions, isLoading };
}
