'use client';

import { useEffect, useState } from 'react';
import { baseURL } from './constant';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}

const useFetch = <T>(url: string, options: RequestInit = {}): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      try {
        const response = await fetch(`${baseURL}/${url}`, options);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result: T = await response.json();

        if (isMounted) {
          setData(result);
          setIsSuccess(true);
        }
      } catch (err) {
        if (isMounted) {
          setIsError(true);
          setError((err as Error).message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(options)]);

  return { data, isLoading, isSuccess, isError, error };
};

export default useFetch;
