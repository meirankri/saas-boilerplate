import { getAuthStatus } from "@/lib/lucia/auth";
import { ReactNode } from "react";

interface IsForbidenServerProps {
  plans: string[];
  children: ReactNode;
}

export default async function IsForbidenServer({
  plans,
  children,
}: IsForbidenServerProps) {
  const { subscription } = await getAuthStatus();

  if (plans.includes(subscription?.subscriptionPlan)) {
    return;
  }

  return <>{children}</>;
}
