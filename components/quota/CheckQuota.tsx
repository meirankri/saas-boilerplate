"use client";

import React, { useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
import { useQuota } from "@/providers/QuotaProvider";

interface QuotaCheckProps {
  productName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function QuotaCheck({
  productName,
  children,
  fallback,
}: QuotaCheckProps) {
  const session = useSession();
  const userId = session?.id ?? null;

  const { quotaInfo, isLoading, error, canUseProduct } = useQuota(
    userId,
    productName
  );

  if (!userId) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div>Veuillez vous connecter pour vérifier les quotas.</div>
    );
  }

  if (isLoading) {
    return <div>Vérification des quotas...</div>;
  }

  if (error) {
    return <div>Erreur lors de la vérification des quotas: {error}</div>;
  }

  if (!quotaInfo) {
    return <div>Aucune information de quota disponible pour {productName}</div>;
  }

  if (!canUseProduct) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div>
        <p>Quota épuisé pour {productName}.</p>
      </div>
    );
  }

  return <>{children}</>;
}
