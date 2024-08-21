"use client";
import { ExtendedUser } from "@/types";
import { createContext } from "react";

type SessionProviderProps = ExtendedUser | {};

export const SessionContext = createContext<SessionProviderProps>(
  {} as SessionProviderProps
);

export const SessionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionProviderProps;
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
