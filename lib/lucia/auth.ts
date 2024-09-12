import { db } from "@/lib/database/db";
import { getCurrentUser } from ".";
import { GoogleUser } from "@/types";
import { UserWithSubscription } from "@/types/user";
import { logger } from "@/utils/logger";
import { OauthAccount, User } from "@prisma/client";

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
): Promise<string> => {
  try {
    let newUser: User;
    let user: User & {
      oauthAccounts: OauthAccount[];
    };
    await db.$transaction(async (trx) => {
      user = await trx.user.findFirst({
        where: { email: userData.email },
        include: { oauthAccounts: true },
      });
      if (!user) {
        newUser = await trx.user.create({
          data: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            profilePictureUrl: userData.picture,
          },
        });

        await addFreeTrialSubscription(trx, newUser.id);
      }

      if (user.oauthAccounts.length > 0) {
        const [oauthAccount] = user.oauthAccounts;
        await updateOAuthAccount(
          trx,
          oauthAccount.id,
          accessToken,
          accessTokenExpiresAt,
          refreshToken
        );
      } else {
        await createOAuthAccount(
          trx,
          user.id,
          userData.id,
          accessToken,
          accessTokenExpiresAt,
          refreshToken
        );
      }

      await trx.user.update({
        where: { id: user.id },
        data: {
          name: user.name || userData.name,
          profilePictureUrl: userData.picture,
        },
      });
    });
    return newUser?.id || user.id;
  } catch (error) {
    logger({
      message: "Error during OAuth user upsert",
      context: error,
    }).error();
  }
};

async function createOAuthAccount(
  trx: any,
  userId: string,
  providerUserId: string,
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string | undefined
): Promise<void> {
  await trx.oauthAccount.create({
    data: {
      userId,
      provider: "google",
      providerUserId,
      accessToken,
      expiresAt: accessTokenExpiresAt,
      refreshToken,
    },
  });
}

async function updateOAuthAccount(
  trx: any,
  oauthAccountId: string,
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string | undefined
): Promise<void> {
  await trx.oauthAccount.update({
    where: { id: oauthAccountId },
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
