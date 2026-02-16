import { useEffect, useState } from "react";
import useSWR from "swr";
import type { newPost } from "@/types/newPost";


const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    
    const body = await res.json().catch(() => null);
    
    throw new Error(body?.message || "Failed to fetch data");
  }

  return res.json();
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

const useGetData = ({
  url,
  page,
  id,
  season,
  year,
  
}: {
  url: string;
  page?: number;
  id?: number;
  season?: string;
  year?: number;
}) => {
  const params = new URLSearchParams({
    ...(page && { page: String(page) }),
    ...(id && { id : String(id) }),
    ...(season && { season }),
    ...(year && { year: String(year) }),
  });
  
  const key = `${url}?${params}`;

  const debouncedKey = useDebouncedValue(key, 300);

  const { data, error, isLoading } = useSWR(debouncedKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });
  console.log(error);





  if (url === "/api/fetchSchedule") return { anime: data, error:error, loading: isLoading };

    return {
      anime: (data?.data ?? []) as newPost[],
      maxPages: data?.maxPage ?? 1,
      loading: isLoading,
      error:error,
    };
};

export default useGetData;
