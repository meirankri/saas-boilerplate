"use client";

import React, { useEffect } from "react";
import { QuotaCheck } from "./quota/CheckQuota";
import { useSession } from "@/providers/SessionProvider";
import { useQuota } from "@/providers/QuotaProvider";

export default function ProductPage({
  params,
}: {
  params: { productName: string };
}) {
  const { productName } = params;
  const session = useSession();
  const userId = session?.id ?? null;
  const { decrementQuota } = useQuota(userId, productName);

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    decrementQuota();
  };

  return (
    <div>
      <QuotaCheck productName={productName}>
        <button onClick={handleButtonClick}>Utiliser le produit</button>
      </QuotaCheck>
    </div>
  );
}
