import { useContext, useEffect } from "react";

import { QuotaContext } from "@/providers/QuotaProvider";
import { UseQuotaResult } from "@/types";

export function useQuota(
  initialUserId?: string | null,
  initialProductName?: string | null
): UseQuotaResult {
  const context = useContext(QuotaContext);
  if (context === undefined) {
    throw new Error("useQuota must be used within a QuotaProvider");
  }

  const { setUserIdAndProductName, ...restContext } = context;

  useEffect(() => {
    if (initialUserId && initialProductName) {
      setUserIdAndProductName(initialUserId, initialProductName);
    }
  }, [initialUserId, initialProductName, setUserIdAndProductName]);

  return restContext;
}
