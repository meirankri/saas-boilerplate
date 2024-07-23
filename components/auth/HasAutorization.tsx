"use client";

import useAuthAndSubscription from "@/app/hooks/useAuthAndSubscription";
import React, { ReactNode } from "react";

interface HasAuthorizationProps {
  plans: string[];
  children: ReactNode;
}

export default function HasAuthorization({
  plans,
  children,
}: HasAuthorizationProps) {
  const { user, subscription, loading } = useAuthAndSubscription();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return;
  }

  if (!plans.includes(subscription?.subscriptionPlan)) {
    return;
  }

  return <>{children}</>;
}
