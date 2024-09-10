"use client";

import { useEffect } from "react";

export default function SessionUpdater() {
  useEffect(() => {
    const updateSession = async () => {
      await fetch("/api/auth/update-session");
    };
    updateSession();
  }, []);

  return null;
}
