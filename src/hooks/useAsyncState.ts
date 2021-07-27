import { useEffect, useState } from "react";

export function useAsyncState<T>(
  initialState: T,
  asyncGetter: () => Promise<T> | undefined
): [T, () => void, boolean, Error | undefined] {
  const [state, setState] = useState<T>(initialState);
  const [dirty, setDirty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  useEffect(() => {
    setLoading(true);
    asyncGetter()
      ?.then((v) => {
        setState(v);
        setError(undefined);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
        setDirty(false);
      });
  }, [asyncGetter, dirty]);

  const refetch = () => {
    setDirty(true);
  };

  return [state, refetch, loading, error];
}
