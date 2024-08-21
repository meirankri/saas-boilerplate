import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";

export default function useAuthAndSubscription() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/user-status");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setSubscription(data.subscription);
        }
      } catch (error) {
        logger({
          message: "Failed to check user status",
          context: error,
        });
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return { user, subscription, loading };
}
