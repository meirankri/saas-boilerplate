import db from "@/lib/database";
import { oauthAccountTable, userTable } from "@/lib/database/schema";
import { lucia } from "@/lib/lucia";
import { google } from "@/lib/lucia/oauth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

async function validateRequest(
  req: NextRequest
): Promise<{ code: string; state: string } | null> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return null;
  }

  const codeVerifier = cookies().get("codeVerifier")?.value;
  const savedState = cookies().get("state")?.value;

  if (!codeVerifier || !savedState || savedState !== state) {
    return null;
  }

  return { code, state };
}

async function getGoogleUserData(accessToken: string): Promise<GoogleUser> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google user data");
  }

  return response.json();
}

async function upsertUser(
  trx: any,
  userData: GoogleUser,
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string | undefined
) {
  const existingUser = await trx.query.userTable.findFirst({
    where: eq(userTable.id, userData.id),
  });

  if (!existingUser) {
    await trx.insert(userTable).values({
      email: userData.email,
      id: userData.id,
      name: userData.name,
      profilePictureUrl: userData.picture,
    });

    await trx.insert(oauthAccountTable).values({
      accessToken,
      expiresAt: accessTokenExpiresAt,
      id: userData.id,
      provider: "google",
      providerUserId: userData.id,
      userId: userData.id,
      refreshToken,
    });
  } else {
    await trx
      .update(oauthAccountTable)
      .set({
        accessToken,
        expiresAt: accessTokenExpiresAt,
        refreshToken,
      })
      .where(eq(oauthAccountTable.id, userData.id));
  }
}

async function createSessionAndSetCookies(userId: string) {
  const session = await lucia.createSession(userId, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  cookies().set("state", "", { expires: new Date(0) });
  cookies().set("codeVerifier", "", { expires: new Date(0) });
}

export const GET = async (req: NextRequest) => {
  try {
    const validatedRequest = await validateRequest(req);
    if (!validatedRequest) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const { code, state } = validatedRequest;
    const codeVerifier = cookies().get("codeVerifier")?.value;

    const { accessToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(code, codeVerifier!);

    const googleData = await getGoogleUserData(accessToken);

    await db.transaction(async (trx) => {
      await upsertUser(
        trx,
        googleData,
        accessToken,
        accessTokenExpiresAt,
        refreshToken
      );
    });

    await createSessionAndSetCookies(googleData.id);

    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL),
      { status: 302 }
    );
  } catch (error: any) {
    console.error("Error in Google OAuth callback:", error);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
