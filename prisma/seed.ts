import { pricingList } from "../app/constants/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.deleteMany({});

  for (const typeOfPlan of Object.values(pricingList)) {
    for (const plan of typeOfPlan) {
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
    }
  }

  console.info("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
