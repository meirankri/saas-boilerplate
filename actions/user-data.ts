import { db } from "@/lib/database/db";

export async function fetchUserQuotas(userId: string) {
  const productUsage = await db.productUsage.findMany({
    where: { userId },
    include: { product: true },
  });

  return productUsage.map((usage) => ({
    product: { name: usage.product.name },
    remaining: usage.remaining,
  }));
}

export async function fetchUserFeatures(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscription: {
        include: {
          features: true,
        },
      },
    },
  });

  return user?.subscription?.features || [];
}
