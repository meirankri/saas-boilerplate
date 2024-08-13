// hooks/useAuth.ts
import { useEffect, useState } from "react";

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
        console.error("error during the verification:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return { user, subscription, loading };
}
