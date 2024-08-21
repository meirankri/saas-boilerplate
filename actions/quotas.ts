import prisma from "@/prisma/prismaClient";

export class QuotaService {
  async getQuotaInfo(userId: string, productName: string) {
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
  }

  async decrementQuota(
    userId: string,
    productName: string,
    amount: number = 1
  ) {
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
  }
}

export const quotaService = new QuotaService();
