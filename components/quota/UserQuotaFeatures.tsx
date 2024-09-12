"use client";

import { useTranslations } from "next-intl";
import { useQuota } from "@/hooks/useQuota";

const formatLabel = (label: string): string => {
  return label
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const UserQuotaFeatures = () => {
  const t = useTranslations("UserQuotaFeatures");
  const { quotas, features, isLoading, error } = useQuota();

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="text-sm  font-semibold mb-2">{t("quotas")}</div>
      {quotas.map((quota, index) => (
        <div
          key={index}
          className="flex justify-between items-center text-xs mb-1"
        >
          <span className="">{formatLabel(quota.product.name)}</span>
          <span className="font-medium text-blue-600">{quota.remaining}</span>
        </div>
      ))}

      <div className="text-sm font-semibold mt-3 mb-2">{t("features")}</div>
      <ul className="text-xs">
        {features.map((feature, index) => (
          <li key={index} className="mb-1">
            {formatLabel(feature.label)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserQuotaFeatures;
