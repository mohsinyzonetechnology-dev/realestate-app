import { isBoostActive } from "@/utils/boost";
import { useMemo } from "react";

export const useBoostedListings = (listings: any[]) => {
  return useMemo(() => {
    const active = listings.filter(isBoostActive);
    const normal = listings.filter((i) => !isBoostActive(i));

    return [...active, ...normal];
  }, [listings]);
};
