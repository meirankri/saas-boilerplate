import { pricingList } from "../app/constants/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.deleteMany({});

  const createSubscription = async (plan: any) => {
    const data: any = {
      planTitle: plan.planTitle,
      price: plan.price,
      timeline: plan.stripeTimeline,
      stripeLink: plan.link,
      stripePriceId: plan.priceId,
      description: plan.description,
    };

    if ("features" in plan) {
      const features = plan.features
        .filter((feature: any) => feature.isActive)
        .map((feature: any) => ({
          label: feature.label,
        }));
      data.features = {
        create: features,
      };
    }

    if ("products" in plan) {
      data.products = {
        create: plan.products,
      };
    }

    await prisma.subscription.create({
      data,
    });
  };

  for (const typeOfPlan of [
    pricingList.monthlyPricings,
    pricingList.yearlyPricings,
  ]) {
    for (const plan of typeOfPlan) {
      await createSubscription(plan);
    }
  }

  await createSubscription(pricingList.freeTrial);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
