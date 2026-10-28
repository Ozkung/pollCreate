"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-fetches the server-rendered results periodically so new votes show up. */
export function AutoRefresh({ intervalMs }: { intervalMs: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);

  return null;
}
