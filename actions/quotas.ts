import { db } from "@/lib/database/db";
import prisma from "@/prisma/prismaClient";
import { Product, Subscription, User } from "@prisma/client";
import { addMonths, isBefore } from "@/utils/date";
import { logger } from "@/utils/logger";

export class QuotaService {
  async getQuotaInfo(userId: string, productName: string) {
    const log = logger({
      message: "Fetching quota info",
      context: { userId, productName },
    });
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: {
            include: {
              products: {
                where: { name: productName },
              },
            },
          },
          ProductUsage: {
            where: {
              product: {
                name: productName,
              },
            },
            include: {
              product: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const [productUsage] = user.ProductUsage;

      if (productUsage) {
        return productUsage;
      }

      if (user.subscription && user.subscription.products.length > 0) {
        const product = user.subscription.products[0];
        return prisma.productUsage.create({
          data: {
            userId,
            productId: product.id,
            remaining: product.quota,
          },
          include: {
            product: true,
          },
        });
      }

      return null;
    } catch (error) {
      log.error();
      throw error;
    }
  }

  async decrementQuota(
    userId: string,
    productName: string,
    amount: number = 1
  ) {
    const log = logger({
      message: "Decrementing quota",
      context: { userId, productName, amount },
    });
    try {
      const productUsage = await this.getQuotaInfo(userId, productName);

      if (!productUsage) {
        throw new Error("User does not have access to this product");
      }

      if (productUsage.remaining < amount) {
        throw new Error("Insufficient quota");
      }

      return prisma.productUsage.update({
        where: {
          userId_productId: {
            userId,
            productId: productUsage.productId,
          },
        },
        data: {
          remaining: {
            decrement: amount,
          },
        },
        include: {
          product: true,
        },
      });
    } catch (error) {
      log.error();
      throw error;
    }
  }
}

export const quotaService = new QuotaService();

function calculateNextQuotaRenewalDate(user: User): boolean {
  const log = logger({
    message: "Calculating next quota renewal date",
    context: { user },
  });
  try {
    const lastRenewalDate = new Date(user.nextQuotaRenewalDate);
    if (!lastRenewalDate) {
      return false;
    }

    const now = new Date();
    const nextRenewalDate = addMonths(lastRenewalDate, 1);

    return isBefore(nextRenewalDate, now);
  } catch (error) {
    log.error();
    return false;
  }
}

export async function checkAndRenewQuotas(userId: string): Promise<void> {
  const log = logger({
    message: "Checking and renewing quotas",
    context: { userId },
  });
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!user || !user.subscription || !user.subscriptionDate) {
      return;
    }

    const toBeRenew = calculateNextQuotaRenewalDate(user);
    const nextMonth = addMonths(new Date(), 1);

    if (toBeRenew) {
      await renewUserQuotas(user);
      await db.user.update({
        where: { id: user.id },
        data: { nextQuotaRenewalDate: nextMonth },
      });
    }
  } catch (error) {
    log.error();
  }
}

async function renewUserQuotas(
  user: User & { subscription: Subscription & { products: Product[] } }
): Promise<void> {
  const log = logger({ message: "Renewing user quotas", context: { user } });
  try {
    for (const product of user.subscription.products) {
      await db.productUsage.upsert({
        where: {
          userId_productId: {
            userId: user.id,
            productId: product.id,
          },
        },
        update: {
          remaining: product.quota,
        },
        create: {
          userId: user.id,
          productId: product.id,
          remaining: product.quota,
        },
      });
    }
  } catch (error) {
    log.error();
  }
}
