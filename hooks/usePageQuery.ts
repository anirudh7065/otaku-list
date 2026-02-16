"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function usePageQuery(defaultPage = 1) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(1, Number(searchParams.get("page")) || defaultPage);

  const setPage = useCallback(
    (newPage: number) => {
      const next = Math.max(1, newPage);

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(next));

      requestAnimationFrame(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [router, pathname, searchParams],
  );

  return { page, setPage };
}
