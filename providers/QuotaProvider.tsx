"use client";
import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { QuotaInfo } from "@/types";
import { logger } from "@/utils/logger";

interface QuotaState {
  userId: string | null;
  productName: string | null;
  quotaInfo: QuotaInfo | null;
  isLoading: boolean;
  error: string | null;
  canUseProduct: boolean;
  remaining: number;
}

type QuotaAction =
  | {
      type: "SET_USER_AND_PRODUCT";
      userId: string | null;
      productName: string | null;
    }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; data: QuotaInfo }
  | { type: "FETCH_ERROR"; error: string };

type QuotaContextType = QuotaState & {
  fetchQuotaInfo: () => Promise<void>;
  decrementQuota: (amount?: number) => Promise<void>;
  setUserIdAndProductName: (
    userId: string | null,
    productName: string | null
  ) => void;
};

export const QuotaContext = createContext<QuotaContextType | undefined>(
  undefined
);

async function fetchFromAPI(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<QuotaInfo> {
  const response = await fetch(`/api/quotas/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return await response.json();
}

function quotaReducer(state: QuotaState, action: QuotaAction): QuotaState {
  switch (action.type) {
    case "SET_USER_AND_PRODUCT":
      return {
        ...state,
        userId: action.userId,
        productName: action.productName,
      };
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

export function QuotaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quotaReducer, {
    userId: null,
    productName: null,
    quotaInfo: null,
    isLoading: false,
    error: null,
    canUseProduct: false,
    remaining: 0,
  });

  const setUserIdAndProductName = useCallback(
    (userId: string | null, productName: string | null) => {
      dispatch({ type: "SET_USER_AND_PRODUCT", userId, productName });
    },
    []
  );

  const fetchQuotaInfo = useCallback(async () => {
    if (!state.userId || !state.productName) return;
    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetchFromAPI(
        `info?userId=${state.userId}&productName=${encodeURIComponent(
          state.productName
        )}`
      );
      dispatch({ type: "FETCH_SUCCESS", data });
    } catch (err) {
      logger({
        message: "Failed to fetch quota info",
        context: err,
      });
      dispatch({
        type: "FETCH_ERROR",
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }, [state.userId, state.productName]);

  const decrementQuota = useCallback(
    async (amount = 1) => {
      if (!state.userId || !state.productName || state.remaining <= 0) return;
      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchFromAPI("decrement", "POST", {
          userId: state.userId,
          productName: state.productName,
          amount,
        });
        dispatch({ type: "FETCH_SUCCESS", data });
      } catch (err) {
        logger({
          message: "Failed to decrement quota",
          context: err,
        });
        dispatch({
          type: "FETCH_ERROR",
          error:
            err instanceof Error ? err.message : "An unknown error occurred",
        });
      }
    },
    [state.userId, state.productName, state.remaining]
  );

  useEffect(() => {
    if (state.userId && state.productName) {
      fetchQuotaInfo();
    }
  }, [state.userId, state.productName, fetchQuotaInfo]);

  const value: QuotaContextType = {
    ...state,
    fetchQuotaInfo,
    decrementQuota,
    setUserIdAndProductName,
  };

  return (
    <QuotaContext.Provider value={value}>{children}</QuotaContext.Provider>
  );
}
