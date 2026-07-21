'use client';

import { useState, useTransition, useCallback } from 'react';
import { toast } from 'sonner';

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; validationErrors?: Record<string, string[]> };

export interface UseServerActionOptions<TInput, TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string, validationErrors?: Record<string, string[]>) => void;
  successMessage?: string | ((data: TOutput) => string);
}

export function useServerAction<TInput, TOutput>(
  actionFn: (input: TInput) => Promise<ActionResult<TOutput>>,
  options?: UseServerActionOptions<TInput, TOutput>
) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<TOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>(undefined);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const execute = useCallback((input: TInput) => {
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setValidationErrors(undefined);
    setData(null);

    startTransition(async () => {
      try {
        const result = await actionFn(input);
        
        if (result.success) {
          setData(result.data);
          setIsSuccess(true);
          
          if (options?.successMessage) {
            const message = typeof options.successMessage === 'function' 
              ? options.successMessage(result.data) 
              : options.successMessage;
            toast.success(message);
          }
          
          options?.onSuccess?.(result.data);
        } else {
          setError(result.error);
          setValidationErrors(result.validationErrors);
          setIsError(true);
          toast.error(result.error);
          options?.onError?.(result.error, result.validationErrors);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setIsError(true);
        toast.error(errorMessage);
        options?.onError?.(errorMessage);
      }
    });
  }, [actionFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setValidationErrors(undefined);
    setIsSuccess(false);
    setIsError(false);
  }, []);

  return {
    execute,
    data,
    error,
    validationErrors,
    isPending,
    isSuccess,
    isError,
    reset
  };
}
