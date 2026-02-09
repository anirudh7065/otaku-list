import useSWR from "swr";
import type { newPost } from "@/types/newPost";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Fetch failed");
    return res.json();
  });

const useGetData = ({
  url,
  page,
  id,
  season,
  year,
}: {
  url: string;
  page: number;
  id?: string | null;
  season?: string;
  year?: number;
}) => {
  const params = new URLSearchParams({
    page: String(page),
    ...(id && { id }),
    ...(season && { season }),
    ...(year && { year: String(year) }),
  });

  const key = `${url}?${params}`;

  const { data, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  return {
    anime: (data?.data ?? []) as newPost[],
    maxPages: data?.maxPage ?? 1,
    loading: isLoading,
    error,
  };
};

export default useGetData;
