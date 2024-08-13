import { PricingPlan } from "@/types";

export const pricingList = {
  monthlyPricings: [
    {
      planTitle: "Basic quotidien",
      price: 2,
      timeline: "daily",
      link: "https://buy.stripe.com/test_14k00AeDpc0n5ig6or",
      priceId: "price_1PlUw4Hj6mzb8Fzy4GvnhB0k",
      description:
        "It's easier to reach your savings goals when you have the right savings account.",
      isActive: true,
      features: [{ isActive: true, label: "qutotidien" }],
      products: [{ name: "generate image", quota: 10 }],
    },
    {
      planTitle: "Basic",
      price: 9,
      timeline: "month",
      link: "https://buy.stripe.com/test_aEUcNmdzl1lJeSQfZ2",
      priceId: "price_1PlUvpHj6mzb8FzyJyuvv1hx",
      description:
        "It's easier to reach your savings goals when you have the right savings account.",
      isActive: false,
      features: [
        { isActive: true, label: "Build Links" },
        { isActive: true, label: "Over 66 complex" },
        { isActive: false, label: "24/7 Contact support" },
        { isActive: false, label: "Build Tools easily" },
        { isActive: false, label: "6TB storage" },
      ],
      products: [
        { name: "Link Builder", quota: 100 },
        { name: "Complex Analysis", quota: 50 },
      ],
    },
    // {
    //   planTitle: "Basic plus",
    //   price: 12,
    //   timeline: "month",
    //   link: "https://buy.stripe.com/test_4gw5nY7xe1lg8kE004",
    //   priceId: "price_1PfPZAKjuTfFeHcvA2T1RUHy",
    //   description:
    //     "It's easier to reach your savings goals when you have the right savings account.",
    //   isActive: true,
    //   features: [
    //     { isActive: true, label: "Build Links" },
    //     { isActive: true, label: "Over 66 complex" },
    //     { isActive: true, label: "24/7 Contact support" },
    //     { isActive: false, label: "Build Tools easily" },
    //     { isActive: false, label: "6TB storage" },
    //   ],
    //   products: [
    //     { name: "Link Builder Plus", quota: 200 },
    //     { name: "Complex Analysis Plus", quota: 100 },
    //     { name: "24/7 Support", quota: 1 },
    //   ],
    // },
    // {
    //   planTitle: "Premium",
    //   price: 17,
    //   timeline: "month",
    //   link: "https://buy.stripe.com/test_00g8AaaJqaVQcAUdQW",
    //   priceId: "price_1PfPf8KjuTfFeHcva8sxXemj",
    //   description:
    //     "More off this less hello salamander lied porpoise much over tightly circa horse taped.",
    //   isActive: false,
    //   features: [
    //     { isActive: true, label: "Build Links" },
    //     { isActive: true, label: "Over 66 complex" },
    //     { isActive: true, label: "24/7 Contact support" },
    //     { isActive: true, label: "Build Tools easily" },
    //     { isActive: true, label: "6TB storage" },
    //   ],
    //   products: [
    //     { name: "Link Builder Premium", quota: 500 },
    //     { name: "Complex Analysis Premium", quota: 200 },
    //     { name: "24/7 Premium Support", quota: 1 },
    //     { name: "Tool Builder", quota: 50 },
    //     { name: "Storage", quota: 6000 },
    //   ],
    // },
  ],
  yearlyPricings: [
    // {
    //   planTitle: "Basic",
    //   price: 99,
    //   timeline: "year",
    //   link: "https://buy.stripe.com/test_bIY03E18QggafN6002",
    //   priceId: "price_1PeDlUKjuTfFeHcvSXVHL0Da",
    //   description:
    //     "More off this less hello salamander lied porpoise much over tightly circa horse taped.",
    //   features: [
    //     { isActive: true, label: "Build Links" },
    //     { isActive: true, label: "Over 66 complex" },
    //     { isActive: false, label: "24/7 Contact support" },
    //     { isActive: false, label: "Build Tools easily" },
    //     { isActive: false, label: "6TB storage" },
    //   ],
    //   products: [
    //     { name: "Link Builder", quota: 100 },
    //     { name: "Complex Analysis", quota: 50 },
    //   ],
    //   isActive: false,
    // },
    // {
    //   planTitle: "Basic plus",
    //   price: 120,
    //   timeline: "year",
    //   link: "https://buy.stripe.com/test_7sIdUu4l23to44o7sx",
    //   priceId: "price_1PfPaFKjuTfFeHcvtZ3mKMFT",
    //   description:
    //     "More off this less hello salamander lied porpoise much over tightly circa horse taped.",
    //   features: [
    //     { isActive: true, label: "Build Links" },
    //     { isActive: true, label: "Over 66 complex" },
    //     { isActive: false, label: "24/7 Contact support" },
    //     { isActive: false, label: "Build Tools easily" },
    //     { isActive: false, label: "6TB storage" },
    //   ],
    //   products: [
    //     { name: "Link Builder Plus", quota: 200 },
    //     { name: "Complex Analysis Plus", quota: 100 },
    //     { name: "24/7 Support", quota: 1 },
    //   ],
    //   isActive: false,
    // },
    // {
    //   planTitle: "Premium",
    //   price: 170,
    //   timeline: "year",
    //   link: "https://buy.stripe.com/test_28o4jU8Bi8NIbwQfZ5",
    //   priceId: "price_1PfPfRKjuTfFeHcvHsbkGfv4",
    //   description:
    //     "It’s easier to reach your savings goals when you have the right savings account.",
    //   features: [
    //     { isActive: true, label: "Build Links" },
    //     { isActive: true, label: "Over 66 complex" },
    //     { isActive: true, label: "24/7 Contact support" },
    //     { isActive: true, label: "Build Tools easily" },
    //     { isActive: true, label: "6TB storage" },
    //   ],
    //   products: [
    //     { name: "Link Builder Premium", quota: 500 },
    //     { name: "Complex Analysis Premium", quota: 200 },
    //     { name: "24/7 Premium Support", quota: 1 },
    //     { name: "Tool Builder", quota: 50 },
    //     { name: "Storage", quota: 6000 },
    //   ],
    //   isActive: true,
    // },
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
