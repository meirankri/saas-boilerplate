"use client";

import { useState, useEffect } from "react";
import { logger } from "@/utils/logger";
import { useTranslations } from "next-intl";

type QuotaInfo = {
  product: { name: string };
  remaining: number;
};

type Feature = {
  label: string;
};

const formatLabel = (label: string): string => {
  return label
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const UserQuotaFeatures = () => {
  const [quotas, setQuotas] = useState<QuotaInfo[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations("UserQuotaFeatures");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user-data");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setQuotas(data.quotas);
        setFeatures(data.features);
        setLoading(false);
      } catch (error) {
        logger({
          message: "Failed to fetch user quota features",
          context: error,
        }).error();
      }
    };

    fetchData();
  }, []);

  return (
    <div className="shadow-lg rounded-lg p-6">
      <div className="text-sm font-semibold mb-2">{t("quotas")}</div>
      {quotas.map((quota, index) => (
        <div
          key={index}
          className="flex gap-2 text-white justify-between items-center text-xs mb-1"
        >
          <span className="text-white">{formatLabel(quota.product.name)}</span>
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
