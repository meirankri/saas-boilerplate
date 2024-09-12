"use client";

import { useState, useEffect } from "react";
import { logger } from "@/utils/logger";

type QuotaInfo = {
  product: { name: string };
  remaining: number;
};

type Feature = {
  label: string;
};

const UserQuotaFeatures = () => {
  const [quotas, setQuotas] = useState<QuotaInfo[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Quotas et fonctionnalités
      </h2>
      {!loading && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Quotas</h3>
            {quotas.map((quota, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span className="text-gray-600">{quota.product.name}</span>
                <span className="font-medium text-blue-600">
                  {quota.remaining}
                </span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
              Fonctionnalités
            </h3>
            <ul className="list-disc list-inside">
              {features.map((feature, index) => (
                <li key={index} className="text-gray-600">
                  {feature.label}
                </li>
              ))}
            </ul>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default UserQuotaFeatures;
