import db from "@/lib/database";
import { oauthAccountTable, userTable } from "@/lib/database/schema";
import { lucia } from "@/lib/lucia";
import { facebook } from "@/lib/lucia/oauth";
import { and, eq } from "drizzle-orm";
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
        const existingUser = await trx.query.userTable.findFirst({
          where: (table) => eq(table.email, facebookData.email),
        });

        if (!existingUser) {
          const userId = generateId(15);
          await trx.insert(userTable).values({
            id: userId,
            email: facebookData.email,
            name: facebookData.name,
            profilePictureUrl: facebookData.picture.url,
            isEmailVerified: true,
          });

          await trx.insert(oauthAccountTable).values({
            accessToken,
            expiresAt: accessTokenExpiresAt,
            provider: "facebook",
            providerUserId: facebookData.id,
            userId,
            id: generateId(15),
          });

          return {
            success: true,
            message: "User logged in successfully",
            data: {
              id: userId,
            },
          };
        } else {
          await trx
            .update(oauthAccountTable)
            .set({
              accessToken,
              expiresAt: accessTokenExpiresAt,
            })
            .where(
              and(
                eq(oauthAccountTable.providerUserId, facebookData.id),
                eq(oauthAccountTable.provider, "facebook")
              )
            );
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
