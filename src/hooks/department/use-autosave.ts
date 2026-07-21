'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useAutosave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 2000
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const savedDataRef = useRef<T>(data);
  // @ts-ignore
  const timeoutRef = useRef<NodeJS.Timeout>();

  const save = useCallback(async (dataToSave: T) => {
    if (JSON.stringify(dataToSave) === JSON.stringify(savedDataRef.current)) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await saveFn(dataToSave);
      savedDataRef.current = dataToSave;
      setLastSavedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save'));
    } finally {
      setIsSaving(false);
    }
  }, [saveFn]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save]);

  return { isSaving, lastSavedAt, error };
}
