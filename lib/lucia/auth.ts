import { db } from "@/lib/database/db";
import { getCurrentUser } from ".";
import { GoogleUser } from "@/types";
import { UserWithSubscription } from "@/types/user";
import { logger } from "@/utils/logger";

export async function getAuthStatus(): Promise<{
  user: UserWithSubscription | null;
  subscription: any | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { user: null, subscription: null };
    }
    const response = await db.user.findUnique({
      where: { id: user.id },
      include: {
        subscription: {
          include: {
            products: true,
            features: true,
          },
        },
      },
    });

    return {
      user: response as UserWithSubscription,
      subscription: response?.subscription,
    };
  } catch (error) {
    logger({
      message: "Error while retrieving authentication status",
      context: error,
    }).error();

    return { user: null, subscription: null };
  }
}

export const oauthUpsertUser = async (
  userData: GoogleUser,
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string | undefined
): Promise<void> => {
  try {
    await db.$transaction(async (trx) => {
      const existingUser = await trx.user.findFirst({
        where: { id: userData.id },
      });

      if (!existingUser) {
        await createNewUser(trx, userData);
        await createOAuthAccount(
          trx,
          userData,
          accessToken,
          accessTokenExpiresAt,
          refreshToken
        );
        const free = await addFreeTrialSubscription(trx, userData.id);
        console.log("free", free);
      } else {
        await updateOAuthAccount(
          trx,
          userData.id,
          accessToken,
          accessTokenExpiresAt,
          refreshToken
        );
      }
    });
  } catch (error) {
    logger({
      message: "Error during OAuth user upsert",
      context: error,
    }).error();
  }
};

async function createNewUser(trx: any, userData: GoogleUser): Promise<void> {
  await trx.user.create({
    data: {
      email: userData.email,
      id: userData.id,
      name: userData.name,
      profilePictureUrl: userData.picture,
    },
  });
}

async function createOAuthAccount(
  trx: any,
  userData: GoogleUser,
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string | undefined
): Promise<void> {
  await trx.oauthAccount.create({
    data: {
      accessToken,
      expiresAt: accessTokenExpiresAt,
      id: userData.id,
      provider: "google",
      providerUserId: userData.id,
      userId: userData.id,
      refreshToken,
    },
  });
}

async function updateOAuthAccount(
  trx: any,
  userId: string,
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string | undefined
): Promise<void> {
  await trx.oauthAccount.update({
    where: { id: userId },
    data: {
      accessToken,
      expiresAt: accessTokenExpiresAt,
      refreshToken,
    },
  });
}

export async function addFreeTrialSubscription(
  trx: any,
  userId: string
): Promise<void> {
  const freeTrialSubscription = await trx.subscription.findFirst({
    where: { planTitle: "free_trial", timeline: "ONETIME" },
    include: { products: true, features: true },
  });

  if (freeTrialSubscription) {
    await trx.user.update({
      where: { id: userId },
      data: {
        subscriptionId: freeTrialSubscription.id,
        ProductUsage: {
          create: freeTrialSubscription.products.map((product: any) => ({
            productId: product.id,
            remaining: product.quota,
          })),
        },
      },
    });
  } else {
    logger({ message: "Free trial subscription not found" }).warn();
  }
}
