"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  Dispatch,
} from "react";
import { QuotaInfo, UseQuotaResult } from "@/types";

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
  resetQuota: () => Promise<void>;
  setUserIdAndProductName: (
    userId: string | null,
    productName: string | null
  ) => void;
};

const QuotaContext = createContext<QuotaContextType | undefined>(undefined);

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
        dispatch({
          type: "FETCH_ERROR",
          error:
            err instanceof Error ? err.message : "An unknown error occurred",
        });
      }
    },
    [state.userId, state.productName, state.remaining]
  );

  const resetQuota = useCallback(async () => {
    if (!state.userId || !state.productName) return;
    dispatch({ type: "FETCH_START" });

    try {
      const data = await fetchFromAPI("reset", "POST", {
        userId: state.userId,
        productName: state.productName,
      });
      dispatch({ type: "FETCH_SUCCESS", data });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }, [state.userId, state.productName]);

  useEffect(() => {
    if (state.userId && state.productName) {
      fetchQuotaInfo();
    }
  }, [state.userId, state.productName, fetchQuotaInfo]);

  const value: QuotaContextType = {
    ...state,
    fetchQuotaInfo,
    decrementQuota,
    resetQuota,
    setUserIdAndProductName,
  };

  return (
    <QuotaContext.Provider value={value}>{children}</QuotaContext.Provider>
  );
}

export function useQuota(
  initialUserId: string | null,
  initialProductName: string | null
): UseQuotaResult {
  const context = useContext(QuotaContext);
  if (context === undefined) {
    throw new Error("useQuota must be used within a QuotaProvider");
  }

  const { setUserIdAndProductName, ...restContext } = context;

  useEffect(() => {
    setUserIdAndProductName(initialUserId, initialProductName);
  }, [initialUserId, initialProductName, setUserIdAndProductName]);

  return restContext;
}
