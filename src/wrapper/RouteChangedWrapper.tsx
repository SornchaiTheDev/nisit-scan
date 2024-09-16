"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";
import { loadingAtom } from "~/atoms/loading";

function RouteChangedWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const setLoading = useSetAtom(loadingAtom);
  const [isFirstMounted, setIsFirstMounted] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      if (isFirstMounted) {
        setIsFirstMounted(false);
        return;
      }
      setLoading(true);
    };
  }, [pathname, setLoading, isFirstMounted]);

  return children;
}

export default RouteChangedWrapper;
