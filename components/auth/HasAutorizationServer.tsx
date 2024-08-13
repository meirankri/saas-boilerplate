import { getAuthStatus } from "@/lib/lucia/auth";
import { ReactNode } from "react";

interface HasAuthorizationServerProps {
  plans: string[];
  children: ReactNode;
}

export default async function HasAuthorizationServer({
  plans,
  children,
}: HasAuthorizationServerProps) {
  const { user, subscription } = await getAuthStatus();

  if (!user) {
    return;
  }

  if (!plans.includes(subscription?.planTitle)) {
    return;
  }

  return <>{children}</>;
}
