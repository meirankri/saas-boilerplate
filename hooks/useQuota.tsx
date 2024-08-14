import { UseQuotaResult } from "@/types";
import { useCallback, useEffect, useReducer } from "react";

async function fetchFromAPI(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  const response = await fetch(`/api/quotas/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API request failed");
  }

  return response.json();
}

function quotaReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        quotaInfo: action.data,
        remaining: action.data.remaining,
        canUseProduct: action.data.remaining > 0,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

export function useQuota(
  userId: string | null,
  productName: string | null
): UseQuotaResult {
  const [state, dispatch] = useReducer(quotaReducer, {
    quotaInfo: null,
    isLoading: false,
    error: null,
    canUseProduct: false,
    remaining: 0,
  });

  const fetchQuotaInfo = useCallback(async () => {
    if (!userId || !productName) return;
    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetchFromAPI(
        `info?userId=${userId}&productName=${encodeURIComponent(productName)}`
      );
      dispatch({ type: "FETCH_SUCCESS", data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }, [userId, productName]);

  const decrementQuota = useCallback(
    async (amount = 1) => {
      if (!userId || !productName || state.remaining <= 0) return;
      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchFromAPI("decrement", "POST", {
          userId,
          productName,
          amount,
        });
        dispatch({ type: "FETCH_SUCCESS", data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", error: err.message });
      }
    },
    [userId, productName, state.remaining]
  );

  const resetQuota = useCallback(async () => {
    if (!userId || !productName) return;
    dispatch({ type: "FETCH_START" });

    try {
      const data = await fetchFromAPI("reset", "POST", {
        userId,
        productName,
      });
      dispatch({ type: "FETCH_SUCCESS", data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }, [userId, productName]);

  useEffect(() => {
    fetchQuotaInfo();
  }, [fetchQuotaInfo]);

  return { ...state, fetchQuotaInfo, decrementQuota, resetQuota };
}
