export const pricingList = {
  monthlyPricings: [
    {
      planTitle: "Basic",
      price: "$9",
      timeline: "/month",
      link: "https://buy.stripe.com/test_3cs5nY3gY1lg58scMM",
      priceId: "price_1PduSMKjuTfFeHcvIPczQMaT",
      description:
        "It’s easier to reach your savings goals when you have the right savings account.",
      features: [
        { isActive: true, label: "Build Links" },
        { isActive: true, label: "Over 66 complex" },
        { isActive: false, label: "24/7 Contact support" },
        { isActive: false, label: "Build Tools easily" },
        { isActive: false, label: "6TB storage" },
      ],
      isActive: false,
    },
    {
      planTitle: "Basic plus",
      price: "$12",
      timeline: "/month",
      link: "https://buy.stripe.com/test_4gw5nY7xe1lg8kE004",
      priceId: "price_1PfPZAKjuTfFeHcvA2T1RUHy",
      description:
        "It’s easier to reach your savings goals when you have the right savings account.",
      features: [
        { isActive: true, label: "Build Links" },
        { isActive: true, label: "Over 66 complex" },
        { isActive: true, label: "24/7 Contact support" },
        { isActive: false, label: "Build Tools easily" },
        { isActive: false, label: "6TB storage" },
      ],
      isActive: true,
    },
    {
      planTitle: "Premium",
      price: "$17",
      timeline: "/month",
      link: "https://buy.stripe.com/test_00g8AaaJqaVQcAUdQW",
      priceId: "price_1PfPf8KjuTfFeHcva8sxXemj",
      description:
        "More off this less hello salamander lied porpoise much over tightly circa horse taped.",
      features: [
        { isActive: true, label: "Build Links" },
        { isActive: true, label: "Over 66 complex" },
        { isActive: true, label: "24/7 Contact support" },
        { isActive: true, label: "Build Tools easily" },
        { isActive: true, label: "6TB storage" },
      ],
      isActive: false,
    },
  ],
  yearlyPricings: [
    {
      planTitle: "Basic",
      price: "$99",
      timeline: "/year",
      link: "https://buy.stripe.com/test_bIY03E18QggafN6002",
      priceId: "price_1PeDlUKjuTfFeHcvSXVHL0Da",
      description:
        "More off this less hello salamander lied porpoise much over tightly circa horse taped.",
      features: [
        { isActive: true, label: "Build Links" },
        { isActive: true, label: "Over 66 complex" },
        { isActive: false, label: "24/7 Contact support" },
        { isActive: false, label: "Build Tools easily" },
        { isActive: false, label: "6TB storage" },
      ],
      isActive: false,
    },
    {
      planTitle: "Basic plus",
      price: "$120",
      timeline: "/year",
      link: "https://buy.stripe.com/test_7sIdUu4l23to44o7sx",
      priceId: "price_1PfPaFKjuTfFeHcvtZ3mKMFT",
      description:
        "More off this less hello salamander lied porpoise much over tightly circa horse taped.",
      features: [
        { isActive: true, label: "Build Links" },
        { isActive: true, label: "Over 66 complex" },
        { isActive: false, label: "24/7 Contact support" },
        { isActive: false, label: "Build Tools easily" },
        { isActive: false, label: "6TB storage" },
      ],
      isActive: false,
    },
    {
      planTitle: "Premium",
      price: "$170",
      timeline: "/year",
      link: "https://buy.stripe.com/test_28o4jU8Bi8NIbwQfZ5",
      priceId: "price_1PfPfRKjuTfFeHcvHsbkGfv4",
      description:
        "It’s easier to reach your savings goals when you have the right savings account.",
      features: [
        { isActive: true, label: "Build Links" },
        { isActive: true, label: "Over 66 complex" },
        { isActive: true, label: "24/7 Contact support" },
        { isActive: true, label: "Build Tools easily" },
        { isActive: true, label: "6TB storage" },
      ],
      isActive: true,
    },
  ],
};

export const pricingPlanByPriceId = (priceId: string): string => {
  const monthlyPricings = pricingList.monthlyPricings.find(
    (price) => price.priceId === priceId
  );
  const yearlyPricings = pricingList.yearlyPricings.find(
    (price) => price.priceId === priceId
  );

  if (monthlyPricings) {
    return monthlyPricings.planTitle;
  }
  if (yearlyPricings) {
    return yearlyPricings.planTitle;
  }
};
