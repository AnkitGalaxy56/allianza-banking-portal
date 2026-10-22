import { useCallback, useEffect, useState, type DependencyList } from 'react';
import { getErrorMessage } from '@/services/api/apiError';

/**
 * Tiny data-loading hook for pages: runs `loader` whenever `deps` change and exposes
 * { data, loading, error, reload }. Replace with RTK Query / React Query later if you prefer.
 */
export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    loader()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e: unknown) => {
        if (active) setError(getErrorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  return { data, loading, error, reload };
}
