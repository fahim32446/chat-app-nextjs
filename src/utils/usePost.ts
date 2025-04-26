import { useState } from 'react';
import { baseURL } from './constant';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const useApiMutation = <T>(
  url: string,
  method: HttpMethod = 'POST'
): [(body?: any) => void, FetchState<T>] => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async (body?: any) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      const response = await fetch(`${baseURL}/${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result: T = await response.json();
      setData(result);
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return [sendRequest, { data, isLoading, isSuccess, isError, error }];
};

export default useApiMutation;
