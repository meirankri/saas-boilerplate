import { PricingPlan } from "@/types";

export const pricingList: {
  monthlyPricings: PricingPlan[];
  yearlyPricings: PricingPlan[];
} = {
  monthlyPricings: [
    {
      planTitle: "basic",
      price: 9,
      currency: "$",
      timeline: "timeline_month",
      stripeTimeline: "month",
      link: "https://buy.stripe.com/test_aEUcNmdzl1lJeSQfZ2",
      priceId: "price_1PlUvpHj6mzb8FzyJyuvv1hx",
      description: "description_basic",
      features: [
        { isActive: true, label: "feature_build_links" },
        { isActive: true, label: "feature_complex_over_66" },
        { isActive: false, label: "feature_contact_support_24_7" },
        { isActive: false, label: "feature_build_tools_easily" },
        { isActive: false, label: "feature_storage_6tb" },
      ],
      products: [
        { name: "product_link_builder", quota: 100 },
        { name: "product_complex_analysis", quota: 50 },
      ],
    },
    {
      planTitle: "basic_plus",
      price: 12,
      currency: "$",
      timeline: "timeline_month",
      stripeTimeline: "month",
      link: "https://buy.stripe.com/test_4gw5nY7xe1lg8kE004",
      priceId: "price_1PfPZAKjuTfFeHcvA2T1RUHy",
      description: "description_basic_plus",
      features: [
        { isActive: true, label: "feature_build_links" },
        { isActive: true, label: "feature_complex_over_66" },
        { isActive: true, label: "feature_contact_support_24_7" },
        { isActive: false, label: "feature_build_tools_easily" },
        { isActive: false, label: "feature_storage_6tb" },
      ],
      products: [
        { name: "product_link_builder_plus", quota: 200 },
        { name: "product_complex_analysis_plus", quota: 100 },
        { name: "product_support_24_7", quota: 1 },
      ],
    },
    {
      planTitle: "premium",
      price: 17,
      currency: "$",
      timeline: "timeline_month",
      stripeTimeline: "month",
      link: "https://buy.stripe.com/test_00g8AaaJqaVQcAUdQW",
      priceId: "price_1PfPf8KjuTfFeHcva8sxXemj",
      description: "description_premium",
      features: [
        { isActive: true, label: "feature_build_links" },
        { isActive: true, label: "feature_complex_over_66" },
        { isActive: true, label: "feature_contact_support_24_7" },
        { isActive: true, label: "feature_build_tools_easily" },
        { isActive: true, label: "feature_storage_6tb" },
      ],
      products: [
        { name: "product_link_builder_premium", quota: 500 },
        { name: "product_complex_analysis_premium", quota: 200 },
        { name: "product_support_premium_24_7", quota: 1 },
        { name: "product_tool_builder", quota: 50 },
        { name: "product_storage", quota: 6000 },
      ],
    },
  ],
  yearlyPricings: [
    {
      planTitle: "basic",
      price: 90,
      currency: "$",
      timeline: "timeline_month",
      stripeTimeline: "year",
      link: "https://buy.stripe.com/test_aEUcNmdzl1lJeSQfZ2",
      priceId: "price_1PlUvpHj6mzb8FzyJyuvv1hx",
      description: "description_basic",
      features: [
        { isActive: true, label: "feature_build_links" },
        { isActive: true, label: "feature_complex_over_66" },
        { isActive: false, label: "feature_contact_support_24_7" },
        { isActive: false, label: "feature_build_tools_easily" },
        { isActive: false, label: "feature_storage_6tb" },
      ],
      products: [
        { name: "product_link_builder", quota: 100 },
        { name: "product_complex_analysis", quota: 50 },
      ],
    },
    {
      planTitle: "basic_plus",
      price: 120,
      currency: "$",
      timeline: "timeline_month",
      stripeTimeline: "year",
      link: "https://buy.stripe.com/test_4gw5nY7xe1lg8kE004",
      priceId: "price_1PfPZAKjuTfFeHcvA2T1RUHy",
      description: "description_basic_plus",
      features: [
        { isActive: true, label: "feature_build_links" },
        { isActive: true, label: "feature_complex_over_66" },
        { isActive: true, label: "feature_contact_support_24_7" },
        { isActive: false, label: "feature_build_tools_easily" },
        { isActive: false, label: "feature_storage_6tb" },
      ],
      products: [
        { name: "product_link_builder_plus", quota: 200 },
        { name: "product_complex_analysis_plus", quota: 100 },
        { name: "product_support_24_7", quota: 1 },
      ],
    },
    {
      planTitle: "premium",
      price: 170,
      currency: "$",
      timeline: "timeline_month",
      stripeTimeline: "year",
      link: "https://buy.stripe.com/test_00g8AaaJqaVQcAUdQW",
      priceId: "price_1PfPf8KjuTfFeHcva8sxXemj",
      description: "description_premium",
      features: [
        { isActive: true, label: "feature_build_links" },
        { isActive: true, label: "feature_complex_over_66" },
        { isActive: true, label: "feature_contact_support_24_7" },
        { isActive: true, label: "feature_build_tools_easily" },
        { isActive: true, label: "feature_storage_6tb" },
      ],
      products: [
        { name: "product_link_builder_premium", quota: 500 },
        { name: "product_complex_analysis_premium", quota: 200 },
        { name: "product_support_premium_24_7", quota: 1 },
        { name: "product_tool_builder", quota: 50 },
        { name: "product_storage", quota: 6000 },
      ],
    },
  ],
};

export const pricingPlanByPriceId = (priceId: string): PricingPlan => {
  const monthlyPricings = pricingList.monthlyPricings.find(
    (price) => price.priceId === priceId
  );
  const yearlyPricings = pricingList.yearlyPricings.find(
    (price) => price.priceId === priceId
  );

  if (monthlyPricings) {
    return monthlyPricings;
  }
  if (yearlyPricings) {
    return yearlyPricings;
  }
};
