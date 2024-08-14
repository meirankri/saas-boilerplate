"use client";
import React from "react";
import { QuotaCheck } from "./quota/CheckQuota";
import { useSession } from "@/providers/SessionProvider";
import { useQuota } from "@/providers/QuotaProvider";
import { ExtendedUser } from "@/types";
import { isEmpty } from "@/utils/checker";

export default function ProductPage({
  params,
}: {
  params: { productName: string };
}) {
  const { productName } = params;
  const session = useSession() as ExtendedUser;
  let userId = null;
  if (!isEmpty(session)) {
    userId = session.id as ExtendedUser["id"];
  }
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
