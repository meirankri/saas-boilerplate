import { db } from "@/lib/database/db";
import { lucia } from "@/lib/lucia";
import { facebook } from "@/lib/lucia/oauth";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");

    if (!code) {
      return Response.json(
        { error: "Invalid request" },
        {
          status: 400,
        }
      );
    }

    const { accessToken, accessTokenExpiresAt } =
      await facebook.validateAuthorizationCode(code);

    const facebookRes = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`,
      {
        method: "GET",
      }
    );

    const facebookData = (await facebookRes.json()) as {
      name: string;
      id: string;
      email: string;
      picture: {
        height: number;
        is_silhouette: boolean;
        url: string;
        width: number;
      };
    };

    const transactionRes = await db.transaction(async (trx) => {
      try {
        const existingUser = await trx.user.findFirst({
          where: { email: facebookData.email },
        });

        if (!existingUser) {
          const userId = generateId(15);
          await trx.user.create({
            data: {
              email: facebookData.email,
              id: facebookData.id,
              name: facebookData.name,
              profilePictureUrl: facebookData.picture.url,
              isEmailVerified: true,
            },
            select: { id: true },
          });

          await trx.oauthAccount.create({
            data: {
              accessToken,
              id: generateId(15), // Assuming you have this function
              provider: "facebook",
              providerUserId: facebookData.id,
              userId,
              expiresAt: accessTokenExpiresAt,
            },
          });

          return {
            success: true,
            message: "User logged in successfully",
            data: {
              id: userId,
            },
          };
        } else {
          const updatedOAuthAccount = await trx.oauthAccount.update({
            where: { id: facebookData.id, provider: "facebook" },
            data: { accessToken, expiresAt: accessTokenExpiresAt },
          });

          if (!updatedOAuthAccount) {
            throw new Error("Failed to update OAuthAccount");
          }
        }

        return {
          success: true,
          message: "User logged in successfully",
          data: {
            id: existingUser?.id,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    });

    if (!transactionRes.success || !transactionRes.data)
      throw new Error(transactionRes.message);

    const session = await lucia.createSession(transactionRes?.data?.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
      {
        status: 302,
      }
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
};
