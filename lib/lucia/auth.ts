import { db } from "@/lib/database/db";
import { getCurrentUser } from ".";
import { GoogleUser } from "@/types";

export async function getAuthStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, subscription: null };
  }
  const subscriptionData = await db.subscriptions.findUnique({
    where: { userId: user.id },
  });
  console.log("subscriptionData", subscriptionData);

  return {
    user: user,
    subscription: subscriptionData,
  };
}

export const oauthUpsertUser = async (
  userData: GoogleUser,
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string | undefined
) => {
  await db.transaction(async (trx) => {
    const existingUser = await trx.user.findFirst({
      where: { id: userData.id },
    });

    if (!existingUser) {
      await trx.user.create({
        data: {
          email: userData.email,
          id: userData.id,
          name: userData.name,
          profilePictureUrl: userData.picture,
        },
      });

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
    } else {
      await trx.oauthAccount.update({
        where: { id: userData.id },
        data: {
          accessToken,
          expiresAt: accessTokenExpiresAt,
          refreshToken,
        },
      });
    }
  });
};
